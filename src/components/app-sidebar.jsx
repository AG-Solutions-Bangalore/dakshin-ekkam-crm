import {
  AudioWaveform,
  ChartColumnDecreasing,
  Command,
  Factory,
  GalleryVerticalEnd,
  House,
  NotebookText,
  Package,
  Scissors,
  Settings2,
  Shirt,
  ShoppingCart,
  Zap,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";

export function AppSidebar({ ...props }) {
  const nameL = useSelector((state) => state.auth.name);
  const emailL = useSelector((state) => state.auth.email);
  const userType = useSelector((state) => state.auth.user_type);

  const initialData = {
    user: {
      name: `${nameL}`,
      email: `${emailL}`,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Dakshin Ekkam",
        logo: Factory,
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Dashboard",
        url: "/home",
        icon: House,
        isActive: false,
      },
      {
        title: "Member",
        url: "/member",
        icon: House,
        isActive: false,
      },

      {
        title: "Event",
        url: "#",
        isActive: false,
        icon: Settings2,
        items: [
          // ...(userType === 3
          //   ? [
          {
            title: "Event",
            url: "/event",
          },
          //   ]
          // : []),
          {
            title: "Event Register",
            url: "/event-register",
          },
          {
            title: "Event Track",
            url: "/event-track",
          },
        ],
      },

      {
        title: "Report",
        url: "#",
        isActive: false,
        icon: ChartColumnDecreasing,

        items: [
          {
            title: "Event",
            url: "/report-event",
          },
          {
            title: "Event Details",
            url: "/report-event-details",
          },
          {
            title: "Registered Not Scanned",
            url: "/report-register-notscanned",
          },
          {
            title: "Not Registered Not Scanned",
            url: "/report-notregister-notscanned",
          },
        ],
      },

    ],
  };

  const data = {
    ...initialData,
    navMain: initialData.navMain,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="sidebar-content">
        {/* <NavProjects projects={data.projects} /> */}
        <NavMain items={data.navMain} />
        {/* <NavMainUser projects={data.userManagement} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
