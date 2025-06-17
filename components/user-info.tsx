import { ExtendedUser } from "@/next-auth";
import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

export const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4 ">
        <div className="flex flex-row items-center justify-between rounded-sm border p-3 shadow-sm gap-16">
          <p className="text-sm font-medium">ID</p>
          <p className="truncate text-gray-800 text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-sm px-3">
            {user?.id}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-sm border p-3 shadow-sm gap-16">
          <p className="text-sm font-medium">Name</p>
          <p className="truncate text-gray-800 text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-sm px-3">
            {user?.name}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-sm border p-3 shadow-sm gap-16">
          <p className="text-sm font-medium">Email</p>
          <p className="truncate text-gray-800 text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-sm px-3">
            {user?.email}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-sm border p-3 shadow-sm gap-16">
          <p className="text-sm font-medium">Role</p>
          <p className="truncate text-gray-800 text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-sm px-3">
            {user?.role}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-sm border p-3 shadow-sm gap-16">
          <p className="text-sm font-medium">Two Factor Enabled</p>
          <p
            className={`truncate text-xs max-w-[180px] font-mono p-1 rounded-sm px-3 text-white ${user?.isTwoFactorEnabled ? "bg-green-500" : "bg-red-500"}`}
          >
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
