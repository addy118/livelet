"use client";

import { useState, useTransition } from "react";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema, RoomSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { updateRoom } from "@/actions/room";
import { useFieldArray } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { RoomDB } from "@/types";
import { RoomAccess } from "@prisma/client";
import { toast } from "sonner";

export const RoomEditForm = ({ roomData }: { roomData: RoomDB }) => {
  console.log(roomData);
  const router = useRouter();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<RoomSchema>({
    resolver: zodResolver(roomSchema),

    // populate with previous room values
    defaultValues: {
      name: roomData.name,
      defaultAccess: roomData.default,
      users: roomData.users.map(({ userId, access }) => ({
        id: userId,
        access: access as RoomAccess,
      })),
      groups: roomData.groups.map(({ groupId, access }) => ({
        id: groupId,
        access: access as RoomAccess,
      })),
    },
  });

  const watchedUsers = form.watch("users") || [
    { id: "", access: "VIEW" as RoomAccess },
  ];

  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "users",
  });

  const {
    fields: groupFields,
    append: appendGroup,
    remove: removeGroup,
  } = useFieldArray({
    control,
    name: "groups",
  });

  const onSubmit = (values: RoomSchema) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        // call your form action
        const data = await updateRoom(values, roomData.id);
        if (!data) return;

        if (data?.error) {
          form.reset();
          setError(data?.error);
        }

        if (data?.success) {
          form.reset();
          setSuccess(data?.success);
          toast.success("Room updated successfully!");
          router.push(`/room/${roomData.id}`);
        }
      } catch {
        setError("Something went wrong");
      }
    });
  };

  return (
    <CardWrapper
      headerLablel="Create a Collaborative Room!"
      backButtonLabel="Return to room"
      backButtonHref={`/${roomData.id}`}
      showSocial={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-xs font-medium">
                    Room Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter room name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="defaultAccess"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <FormLabel className="text-white text-xs font-medium">
                    Default Access
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-[#1a1a1a] text-xs text-white">
                        <SelectValue placeholder="Select access" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#1a1a1a] text-white">
                      <SelectItem value="VIEW">View</SelectItem>
                      <SelectItem value="EDIT">Edit</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* dynamic groups */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-white">Invite Groups</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendGroup({ id: "", access: "VIEW" })}
                >
                  Add Group
                </Button>
              </div>

              {groupFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-4 bg-[#1a1a1a] p-3 rounded-md"
                >
                  <FormField
                    control={control}
                    name={`groups.${index}.id`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="group-id" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`groups.${index}.access`}
                    render={({ field }) => (
                      <FormItem className="w-32">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-[#1a1a1a] text-xs text-white">
                              <SelectValue placeholder="Access" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#1a1a1a] text-white">
                            <SelectItem value="VIEW">View</SelectItem>
                            <SelectItem value="EDIT">Edit</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeGroup(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* dynamic users */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-white">Invite Users</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ id: "", access: "VIEW" })}
                >
                  Add User
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-4 bg-[#1a1a1a] p-3 rounded-md"
                >
                  <FormField
                    control={control}
                    name={`users.${index}.id`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="room-id" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`users.${index}.access`}
                    render={({ field }) => (
                      <FormItem className="w-32">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-[#1a1a1a] text-white">
                              <SelectValue placeholder="Access" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#1a1a1a] text-white">
                            <SelectItem value="VIEW">View</SelectItem>
                            <SelectItem value="EDIT">Edit</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    disabled={watchedUsers[index]?.id === roomData.ownerId}
                    size="icon"
                    onClick={() =>
                      watchedUsers[index]?.id !== roomData.ownerId &&
                      remove(index)
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <FormError message={error} />
            <FormSuccess message={success} />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#ffffff] hover:bg-[#cccccc] text-[#000000] font-semibold transition-smooth disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? "Updating..." : "Update Room"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
