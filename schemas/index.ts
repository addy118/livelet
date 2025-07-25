import * as z from "zod";

export const roomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  defaultAccess: z.enum(["VIEW", "EDIT"]),

  users: z
    .array(
      z.object({
        id: z.string().min(1, "Room ID should be of length 10"),
        access: z.enum(["VIEW", "EDIT"]),
      })
    )
    .optional(),

  groups: z
    .array(
      z.object({
        id: z.string().min(1, "Group ID should be of length 10"),
        access: z.enum(["VIEW", "EDIT"]),
      })
    )
    .optional(),
});

export type RoomSchema = z.infer<typeof roomSchema>;

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegiSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(8, {
    message: "Minimum 8 characters are required",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPassSchema = z.object({
  password: z.string().min(8, {
    message: "Minimum 8 characters are required",
  }),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    password: z.optional(z.string().min(8)),
    newPassword: z.optional(z.string().min(8)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    }
  );
