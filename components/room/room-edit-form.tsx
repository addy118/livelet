"use client";
import { useState, useTransition, useCallback, useMemo } from "react";
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
  FormDescription,
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
import {
  Trash2,
  Plus,
  Users,
  UserPlus,
  Shield,
  Eye,
  Edit3,
  Crown,
  AlertTriangle,
  Loader2,
  Settings,
  Save
} from "lucide-react";
import { RoomDB } from "@/types";
import { RoomAccess } from "@prisma/client";
import { toast } from "sonner";
import { ComingSoonDialog } from "../coming-soon";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RoomEditFormProps {
  roomData: RoomDB;
}

const ACCESS_CONFIG = {
  VIEW: {
    label: "View Only",
    description: "Can view and read content",
    icon: Eye,
    color: "text-blue-500"
  },
  EDIT: {
    label: "Full Access",
    description: "Can view, edit, and modify content",
    icon: Edit3,
    color: "text-green-500"
  }
} as const;

export const RoomEditForm = ({ roomData }: RoomEditFormProps) => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const form = useForm<RoomSchema>({
    resolver: zodResolver(roomSchema),
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
    mode: "onChange"
  });

  const { control, watch, formState: { isDirty, isValid } } = form;
  const watchedUsers = watch("users") || [];
  const watchedName = watch("name");
  const watchedDefaultAccess = watch("defaultAccess");

  const { fields: userFields, append: appendUser, remove: removeUser } = useFieldArray({
    control,
    name: "users",
  });

  const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({
    control,
    name: "groups",
  });

  // Memoized values for better performance
  const ownerUserIndex = useMemo(() =>
    watchedUsers.findIndex(user => user.id === roomData.ownerId),
    [watchedUsers, roomData.ownerId]
  );

  const isOwnerInList = ownerUserIndex !== -1;
  const totalMembers = userFields.length + groupFields.length;

  // Handle form changes
  const handleFormChange = useCallback(() => {
    if (isDirty && !hasUnsavedChanges) {
      setHasUnsavedChanges(true);
    }
  }, [isDirty, hasUnsavedChanges]);

  // Enhanced submit handler with better error handling
  const onSubmit = useCallback(async (values: RoomSchema) => {
    setError("");
    setSuccess("");

    // Validate that owner is included in users list
    if (!values.users || !values.users.some(user => user.id === roomData.ownerId)) {
      setError("Room owner must remain in the users list");
      return;
    }

    startTransition(async () => {
      try {
        const data = await updateRoom(values, roomData.id);

        if (!data) {
          setError("No response received from server");
          return;
        }

        if (data.error) {
          setError(data.error);
          toast.error(data.error);
          return;
        }

        if (data.success) {
          setSuccess(data.success);
          setHasUnsavedChanges(false);
          toast.success("Room updated successfully!");

          // Navigate after a short delay to show success message
          setTimeout(() => {
            router.push(`/room/${roomData.id}`);
          }, 1500);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Something went wrong";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  }, [roomData.id, roomData.ownerId, router]);

  const handleAddUser = useCallback(() => {
    appendUser({ id: "", access: watchedDefaultAccess || "VIEW" });
  }, [appendUser, watchedDefaultAccess]);

  const handleAddGroup = useCallback(() => {
    setComingSoonOpen(true);
  }, []);

  const handleRemoveUser = useCallback((index: number) => {
    const user = watchedUsers[index];
    if (user?.id === roomData.ownerId) {
      toast.error("Cannot remove room owner");
      return;
    }
    removeUser(index);
    toast.success("User removed");
  }, [watchedUsers, roomData.ownerId, removeUser]);

  const renderAccessIcon = (access: RoomAccess) => {
    const config = ACCESS_CONFIG[access];
    const Icon = config.icon;
    return <Icon className={`w-4 h-4 ${config.color}`} />;
  };

  return (
    <TooltipProvider>
      <CardWrapper
        headerLablel={`Edit "${roomData.name}"`}
        backButtonLabel="← Back to room"
        backButtonHref={`/room/${roomData.id}`}
        showSocial={false}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            onChange={handleFormChange}
          >
            {/* Room Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-white" />
                <h3 className="text-lg font-semibold text-white">Room Settings</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                {/* Room Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm font-medium flex items-center gap-2">
                        Room Name
                        {watchedName !== roomData.name && (
                          <Badge variant="secondary" className="text-xs">Modified</Badge>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter room name"
                          className="bg-[#1a1a1a] border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Default Access */}
                <FormField
                  control={form.control}
                  name="defaultAccess"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm font-medium">
                        Default Access Level
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="in-w-[140px] bg-[#1a1a1a] border-gray-600 text-white focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Select default access" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1a1a1a] border-gray-600 text-white">
                          {Object.entries(ACCESS_CONFIG).map(([key, config]) => (
                            <SelectItem key={key} value={key} className="hover:bg-gray-700">
                              <div className="flex items-center gap-2">
                                {renderAccessIcon(key as RoomAccess)}
                                <span>{config.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>


            <Separator className="bg-gray-600 mx-auto max-w-20 md:max-w-xl" />

            <div className="flex flex-col md:flex-row md:gap-6">
              <div className="flex-1">
                {/* Users Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-semibold text-white">Users</h3>
                      <Badge variant="outline" className="text-xs">
                        {userFields.length}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddUser}
                      className="hover:bg-gray-700 border-gray-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>

                  {!isOwnerInList && (
                    <Alert className="border-amber-500 bg-amber-950/20">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <AlertDescription className="text-amber-200">
                        Warning: Room owner is not in the users list. The owner will be automatically added.
                      </AlertDescription>
                    </Alert>
                  )}

                  {userFields.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No users added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userFields.map((field, index) => {
                        const isOwner = watchedUsers[index]?.id === roomData.ownerId;
                        return (
                          <div
                            key={field.id}
                            className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${isOwner
                              ? 'bg-amber-950/20 border-amber-500/30 hover:bg-amber-950/30'
                              : 'bg-[#1a1a1a] border-gray-700 hover:bg-[#2a2a2a]'
                              }`}
                          >
                            <FormField
                              control={control}
                              name={`users.${index}.id`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <div className="relative">
                                      <Input
                                        placeholder="Enter user ID"
                                        {...field}
                                        className="bg-transparent border-gray-600 text-white focus:ring-2 focus:ring-green-500 pl-8"
                                      />
                                      {isOwner && (
                                        <Crown className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                                      )}
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={control}
                              name={`users.${index}.access`}
                              render={({ field }) => (
                                <FormItem className="w-36">
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-transparent border-gray-600 text-white focus:ring-2 focus:ring-green-500">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-[#1a1a1a] border-gray-600 text-white">
                                      {Object.entries(ACCESS_CONFIG).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                          <div className="flex items-center gap-2">
                                            {renderAccessIcon(key as RoomAccess)}
                                            <span>{config.label}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    disabled={isOwner}
                                    onClick={() => handleRemoveUser(index)}
                                    className={`${isOwner
                                      ? 'text-gray-500 cursor-not-allowed'
                                      : 'text-red-400 hover:text-red-300 hover:bg-red-950'
                                      }`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {isOwner ? "Cannot remove room owner" : "Remove user"}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* Separator */}
              <Separator
                orientation="horizontal"
                className="my-6 max-w-20 mx-auto flex md:hidden bg-gray-600"
              />


              {/* Groups Section */}
              <div className="flex-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      <h3 className="text-lg font-semibold text-white">Groups</h3>
                      <Badge variant="outline" className="text-xs">
                        {groupFields.length}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddGroup}
                      className="hover:bg-gray-700 border-gray-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Group
                    </Button>
                  </div>

                  {groupFields.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No groups added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {groupFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-center gap-4 bg-[#1a1a1a] border border-gray-700 p-4 rounded-lg hover:bg-[#2a2a2a] transition-colors"
                        >
                          <FormField
                            control={control}
                            name={`groups.${index}.id`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    placeholder="Enter group ID"
                                    {...field}
                                    className="bg-transparent border-gray-600 text-white focus:ring-2 focus:ring-purple-500"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={control}
                            name={`groups.${index}.access`}
                            render={({ field }) => (
                              <FormItem className="w-36">
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-transparent border-gray-600 text-white focus:ring-2 focus:ring-purple-500">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-[#1a1a1a] border-gray-600 text-white">
                                    {Object.entries(ACCESS_CONFIG).map(([key, config]) => (
                                      <SelectItem key={key} value={key}>
                                        <div className="flex items-center gap-2">
                                          {renderAccessIcon(key as RoomAccess)}
                                          <span>{config.label}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeGroup(index)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-950"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove group</TooltipContent>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>


            {/* Form Actions */}
            <div className="space-y-4 pt-6">
              <FormError message={error} />
              <FormSuccess message={success} />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  disabled={isPending || !isDirty || !isValid}
                  className="flex-1 bg-blue-600  hover:bg-blue-700 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      Update Room
                    </>
                  )}
                </Button>
              </div>

              {hasUnsavedChanges && (
                <p className="text-xs text-amber-400 text-center">
                  You have unsaved changes
                </p>
              )}
            </div>
          </form>
        </Form>

        <ComingSoonDialog
          open={comingSoonOpen}
          onOpenChange={setComingSoonOpen}
          title="Add Groups to Room"
          description="Group management functionality is coming soon! You'll be able to add entire groups with specific access levels."
        />
      </CardWrapper>
    </TooltipProvider>
  );
};