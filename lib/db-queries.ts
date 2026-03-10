import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { withConnection } from "./db";
import type {
  DbProduct,
  DbProductDetail,
  DbUser,
  DbAddress,
  DbOrder,
  DbOrderItem,
  AdminStats,
  AdminOrder,
} from "./db";

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency: string;
  stock: number;
  category: string | null;
  category_slug: string | null;
};

export async function getAllProducts(categorySlug?: string): Promise<DbProduct[]> {
  return withConnection(async (db) => {
    const [rows] = categorySlug
      ? await db.query(
        `
      SELECT
        p.id,
        p.slug,
        p.name,
        p.price_cents,
        MAX(CASE WHEN pi.sort_order = 0 THEN pi.image_url END) AS image_url,
        MAX(CASE WHEN pi.sort_order = 1 THEN pi.image_url END) AS hover_image_url,
        c.name AS category
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE p.is_active = 1 AND c.slug = ?
      GROUP BY p.id, p.slug, p.name, p.price_cents, c.name
      ORDER BY p.id DESC
    `,
        [categorySlug],
      )
    : await db.query(
        `
      SELECT
        p.id,
        p.slug,
        p.name,
        p.price_cents,
        MAX(CASE WHEN pi.sort_order = 0 THEN pi.image_url END) AS image_url,
        MAX(CASE WHEN pi.sort_order = 1 THEN pi.image_url END) AS hover_image_url,
        c.name AS category
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE p.is_active = 1
      GROUP BY p.id, p.slug, p.name, p.price_cents, c.name
      ORDER BY p.id DESC
    `,
        );
    return rows as DbProduct[];
  });
}

export async function getProductBySlug(slug: string): Promise<DbProductDetail | null> {
  return withConnection(async (db) => {
    const [rows] = await db.query(
    `
    SELECT
      p.id,
      p.slug,
      p.name,
      p.description,
      p.price_cents,
      p.currency,
      p.stock,
      c.name AS category,
      c.slug AS category_slug
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.slug = ? AND p.is_active = 1
    LIMIT 1
    `,
    [slug],
  );
  const list = rows as ProductRow[];
  if (!list.length) return null;
  const row = list[0];
  const [imgRows] = await db.query(
    `SELECT image_url, alt_text, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order ASC`,
    [row.id],
  );
  const images = imgRows as { image_url: string; alt_text: string | null; sort_order: number }[];
  return { ...row, images };
  });
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  return withConnection(async (db) => {
    const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, email, password_hash, first_name, last_name FROM users WHERE email = ? LIMIT 1",
    [email.toLowerCase().trim()],
  );
    return (rows[0] as DbUser) ?? null;
  });
}

export async function getUserById(id: number): Promise<Omit<DbUser, "password_hash"> | null> {
  return withConnection(async (db) => {
    const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, email, first_name, last_name FROM users WHERE id = ? LIMIT 1",
    [id],
  );
    return (rows[0] as Omit<DbUser, "password_hash">) ?? null;
  });
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
}): Promise<number> {
  return withConnection(async (db) => {
    const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)",
    [
      data.email.toLowerCase().trim(),
      data.passwordHash,
      data.firstName?.trim() ?? null,
      data.lastName?.trim() ?? null,
    ],
  );
    return result.insertId;
  });
}

export async function updateUser(
  userId: number,
  data: { first_name?: string; last_name?: string },
) {
  return withConnection(async (db) => {
    await db.query(
    "UPDATE users SET first_name = ?, last_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
    [data.first_name ?? null, data.last_name ?? null, userId],
  );
  });
}

export async function getAddressesByUserId(userId: number): Promise<DbAddress[]> {
  return withConnection(async (db) => {
    const [rows] = await db.query(
    "SELECT id, user_id, full_name, street, city, postal_code, country, phone, is_default FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id ASC",
    [userId],
  );
    return rows as DbAddress[];
  });
}

export async function createAddress(
  userId: number,
  data: {
    full_name: string;
    street: string;
    city: string;
    postal_code: string;
    country: string;
    phone?: string;
    is_default?: boolean;
  },
): Promise<number> {
  return withConnection(async (db) => {
    if (data.is_default) {
      await db.query("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [userId]);
    }
    const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO addresses (user_id, full_name, street, city, postal_code, country, phone, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      userId,
      data.full_name,
      data.street,
      data.city,
      data.postal_code,
      data.country,
      data.phone ?? null,
      data.is_default ? 1 : 0,
    ],
  );
    return result.insertId;
  });
}

export async function setDefaultAddress(userId: number, addressId: number) {
  return withConnection(async (db) => {
    await db.query("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [userId]);
  await db.query("UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?", [
    addressId,
    userId,
  ]);
  });
}

export async function getOrdersByUserId(userId: number): Promise<
  (DbOrder & { items: DbOrderItem[] })[]
> {
  return withConnection(async (db) => {
    const [orders] = await db.query(
    "SELECT id, user_id, status, total_cents, currency, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
  );
  const list = orders as DbOrder[];
  const result: (DbOrder & { items: DbOrderItem[] })[] = [];
  for (const o of list) {
    const [items] = await db.query(
      `SELECT oi.product_id, oi.quantity, oi.unit_price_cents, p.name AS product_name
       FROM order_items oi
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [o.id],
    );
    result.push({ ...o, items: items as DbOrderItem[] });
  }
    return result;
  });
}

export async function getAdminStats(): Promise<AdminStats> {
  return withConnection(async (db) => {
    const [orderRows] = await db.query(
    `SELECT
       COUNT(*) AS total_orders,
       SUM(CASE WHEN o.created_at >= DATE_FORMAT(NOW(), '%Y-%m-01') THEN 1 ELSE 0 END) AS orders_this_month,
       COALESCE(SUM(o.total_cents), 0) AS total_revenue_cents
     FROM orders o`,
  );
  const [productRows] = await db.query(
    "SELECT COUNT(*) AS cnt FROM products WHERE is_active = 1",
  );
  const [userRows] = await db.query("SELECT COUNT(*) AS cnt FROM users");

  const os = (orderRows as { total_orders: number; orders_this_month: number; total_revenue_cents: number }[])[0];
  const pc = (productRows as { cnt: number }[])[0];
  const uc = (userRows as { cnt: number }[])[0];

  return {
    totalOrders: Number(os?.total_orders ?? 0),
    ordersThisMonth: Number(os?.orders_this_month ?? 0),
    totalRevenueCents: Number(os?.total_revenue_cents ?? 0),
    productsCount: Number(pc?.cnt ?? 0),
    usersCount: Number(uc?.cnt ?? 0),
  };
  });
}

export async function getAllOrdersForAdmin(): Promise<AdminOrder[]> {
  return withConnection(async (db) => {
    const [orders] = await db.query(
    `SELECT o.id, o.user_id, o.address_id, o.status, o.total_cents, o.currency, o.created_at,
            a.full_name, a.street, a.city, a.postal_code, a.country, a.phone,
            u.email AS user_email
     FROM orders o
     LEFT JOIN addresses a ON a.id = o.address_id
     LEFT JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC`,
  );
  const list = orders as (DbOrder & {
    address_id: number;
    full_name: string;
    street: string;
    city: string;
    postal_code: string;
    country: string;
    phone: string | null;
    user_email: string | null;
  })[];
  const result: AdminOrder[] = [];
  for (const o of list) {
    const [items] = await db.query(
      `SELECT oi.product_id, oi.quantity, oi.unit_price_cents, p.name AS product_name
       FROM order_items oi
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [o.id],
    );
    result.push({ ...o, items: items as DbOrderItem[] });
  }
    return result;
  });
}
