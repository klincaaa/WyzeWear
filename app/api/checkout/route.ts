import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { withConnection } from "@/lib/db";

type BodyItem = {
  productId: number;
  quantity: number;
  size?: string;
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      addressId: number;
      paymentMethod: string;
      items: BodyItem[];
    };

    if (!body.addressId || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const uniqueItems = body.items.filter((it) => it.quantity > 0);
    const productIds = [...new Set(uniqueItems.map((it) => it.productId))];
    if (productIds.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    const orderId = await withConnection(async (db) => {
      const [rows] = await db.query(
        `SELECT id, price_cents, stock, currency FROM products WHERE id IN (${productIds
          .map(() => "?")
          .join(",")})`,
        productIds,
      );
      const products = rows as {
        id: number;
        price_cents: number;
        stock: number;
        currency: string;
      }[];

      if (products.length !== productIds.length) {
        throw new Error("Some products not found");
      }

      let currency = products[0].currency || "EUR";
      let totalCents = 0;

      for (const item of uniqueItems) {
        const p = products.find((x) => x.id === item.productId)!;
        if (p.currency !== currency) throw new Error("Mixed currencies not supported");
        if (p.stock < item.quantity) throw new Error("Not enough stock for some items");
        totalCents += p.price_cents * item.quantity;
      }

      const [orderResult] = await db.query(
        `INSERT INTO orders (user_id, address_id, status, total_cents, currency, created_at, updated_at)
         VALUES (?, ?, 'paid', ?, ?, NOW(), NOW())`,
        [userId, body.addressId, totalCents, currency],
      );
      const orderResultHeader = orderResult as { insertId: number };
      const id = orderResultHeader.insertId;

      const itemsValues: unknown[] = [];
      for (const item of uniqueItems) {
        const p = products.find((x) => x.id === item.productId)!;
        itemsValues.push(id, item.productId, item.quantity, p.price_cents, currency);
      }

      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents, currency)
         VALUES ${uniqueItems.map(() => "(?, ?, ?, ?, ?)").join(",")}`,
        itemsValues,
      );

      for (const item of uniqueItems) {
        await db.query(
          "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
          [item.quantity, item.productId, item.quantity],
        );
      }
      return id;
    });

    return NextResponse.json({ success: true, orderId });
  } catch (e) {
    console.error("Checkout error:", e);
    const msg = e instanceof Error ? e.message : "";
    if (
      msg === "Some products not found" ||
      msg === "Mixed currencies not supported" ||
      msg === "Not enough stock for some items"
    ) {
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Something went wrong while creating order" },
      { status: 500 },
    );
  }
}

