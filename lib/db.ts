import mysql from "mysql2/promise";

const connectionConfig: mysql.ConnectionOptions = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_WYZE,
};

/** Jedna konekcija po operaciji: otvori → upit → zatvori. Nema držanja konekcija, nema "Too many connections". */
export async function withConnection<T>(
  fn: (conn: mysql.Connection) => Promise<T>,
): Promise<T> {
  const conn = await mysql.createConnection(connectionConfig);
  try {
    return await fn(conn);
  } finally {
    await conn.end();
  }
}

// ——— Tipovi (koriste ih db-queries i ostatak app-a) ———

export type DbProduct = {
  id: number;
  slug: string;
  name: string;
  price_cents: number;
  image_url: string;
  hover_image_url: string | null;
  category: string | null;
};

export type DbProductDetail = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency: string;
  stock: number;
  category: string | null;
  category_slug: string | null;
  images: { image_url: string; alt_text: string | null; sort_order: number }[];
};

export type DbUser = {
  id: number;
  email: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
};

export type DbAddress = {
  id: number;
  user_id: number | null;
  full_name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: number;
};

export type DbOrder = {
  id: number;
  user_id: number | null;
  status: string;
  total_cents: number;
  currency: string;
  created_at: Date;
};

export type DbOrderItem = {
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price_cents: number;
};

export type AdminStats = {
  totalOrders: number;
  ordersThisMonth: number;
  totalRevenueCents: number;
  productsCount: number;
  usersCount: number;
};

export type AdminOrder = DbOrder & {
  address_id: number;
  full_name: string;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string | null;
  user_email: string | null;
  items: DbOrderItem[];
};
