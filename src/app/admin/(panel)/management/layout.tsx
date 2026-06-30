import { AdminManagementNav } from "@/components/admin/AdminManagementNav";

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminManagementNav />
      {children}
    </>
  );
}
