"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FaUser } from "react-icons/fa";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "./logout-button";
import {
  Globe,
  LogOut,
  Server,
  Settings,
  ShieldIcon as ShieldUser,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export const UserButton = () => {
  const user = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { label: "Admin", icon: ShieldUser, path: "/admin" },
    { label: "Settings", icon: Settings, path: "/settings" },
    { label: "Server", icon: Server, path: "/server" },
    { label: "Client", icon: Globe, path: "/client" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="w-10 h-10 border-2 border-[#333333] hover:border-[#555555] transition-smooth">
          <AvatarImage src={user?.image || ""} className="object-cover" />
          <AvatarFallback className="bg-[#222222] ">
            <FaUser className="text-[#ffffff] w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-48 bg-[#101010] border border-[#333333]/50 rounded-sm p-2"
        align="end"
        sideOffset={8}
      >
        <div className="px-3 py-2 border-b border-[#333333]/50 mb-2">
          <p className="text-[#ffffff] font-medium text-sm truncate">
            {user?.name || "User"}
          </p>
          <p className="text-[#888888] text-xs truncate">{user?.email}</p>
        </div>

        {menuItems.map(({ label, icon: Icon, path }) => (
          <span
            key={path}
            className="cursor-pointer"
            onClick={() => router.push(path)}
          >
            <DropdownMenuItem
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth cursor-pointer focus:outline-none ${
                pathname === path
                  ? "bg-[#333333] text-[#ffffff]"
                  : "text-[#cccccc] hover:bg-[#222222] hover:text-[#ffffff]"
              }`}
            >
              <Icon size={16} />
              <span className="text-xs font-medium">{label}</span>
            </DropdownMenuItem>
          </span>
        ))}

        <div className="border-t border-[#333333]/50 mt-2 pt-2">
          <LogoutButton>
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#cccccc] hover:bg-[#222222] hover:text-[#ffffff] transition-smooth cursor-pointer focus:outline-none">
              <LogOut size={16} />
              <span className="text-xs font-medium">Sign Out</span>
            </DropdownMenuItem>
          </LogoutButton>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
