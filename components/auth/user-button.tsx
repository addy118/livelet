"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FaUser } from "react-icons/fa";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { LogoutButton } from "./logout-button";
import { IdCard, LogOut, Settings, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ExtendedUser } from "@/next-auth";
import { copy } from "@/lib/utils";

export const UserButton = ({ user }: { user: ExtendedUser | undefined }) => {
  const router = useRouter();
  const pathname = usePathname();

  if (!user || !user.id) return <p>No user found</p>;

  const menuItems = [
    { id: 1, label: "Settings", icon: Settings, path: "/settings" },
  ];

  if (!!user) {
    menuItems.push({ id: 2, label: "Groups", icon: Users, path: "/groups" });
    menuItems.push({ id: 3, label: "Copy User ID", icon: IdCard, path: "" });
  }

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

        {menuItems.map(({ id, label, icon: Icon, path }) => (
          <span
            key={path}
            className="cursor-pointer"
            onClick={() => (id !== 3 ? router.push(path) : copy(user.id))}
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
