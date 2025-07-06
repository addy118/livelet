"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteRoom } from "@/actions/room";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export const DeleteRoomButton = ({ roomId }: { roomId: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      toast.success("Deleting room...");
      const result = await deleteRoom(roomId);

      if (result?.error) {
        toast.error(result?.error);
      } else {
        toast.dismiss();
        toast.success(result?.success || "Room deleted successfully!");
        router.push("/");
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <span className="text-red-500">
            <Trash className="h-4 w-4" />
          </span>

          <p>Delete</p>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-[#1a1a1a]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <p>
            This action cannot be undone. This will permanently delete the room.
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            className="bg-red-500 cursor-pointer hover:bg-red-400"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Confirm Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
