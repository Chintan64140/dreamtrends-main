import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AdminOrdersDashboard from "@/components/admin/AdminOrdersDashboard";
import { getServerAuthUser } from "@/lib/authServer";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const authUser = await getServerAuthUser(token);

  if (!authUser) {
    redirect("/login?redirect=/admin");
  }

  if (authUser.role !== "admin") {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      <AdminOrdersDashboard />
    </>
  );
}
