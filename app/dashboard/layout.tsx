import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  House,
  IdCard,
  LayoutGrid,
  NotebookPen,
  Receipt,
  Settings,
  Users,
} from "lucide-react";
import { PropsWithChildren } from "react";

const items = [
  {
    id: 1,
    title: "Home",
    url: "/dashboard",
    icon: House,
  },
  {
    id: 2,
    title: "Categorys",
    url: "/dashboard/categorys",
    icon: LayoutGrid,
  },
  {
    id: 3,
    title: "Blog",
    url: "/dashboard/blog",
    icon: NotebookPen,
  },
  {
    id: 4,
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    id: 5,
    title: "Payments",
    url: "/dashboard/payments",
    icon: Receipt,
  },
  {
    id: 6,
    title: "KYC",
    url: "/dashboard/kyc",
    icon: IdCard,
  },
  {
    id: 7,
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar items={items} />
      <SidebarInset>
        <div className="p-4 bg-gray-200">
          <SidebarTrigger className="-ml-1" />
        </div>
        <div className="p-4 max-h-screen">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
