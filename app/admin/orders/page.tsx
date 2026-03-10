import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminOrdersClient } from "./AdminOrdersClient";

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/admin/orders");
  }
  return <AdminOrdersClient />;
}
