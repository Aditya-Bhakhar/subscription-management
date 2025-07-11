"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User } from "@/types/userTypes";

const userSchema = z.object({
  firstname: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(10, "Max 10 characters"),
  lastname: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(10, "Max 10 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/\d/, "Must contain at least one number")
    .regex(/[A-Za-z]/, "Must contain at least one letter"),
  role: z.enum(["admin", "finance"], {
    errorMap: () => ({ message: "Invalid role. Choose Admin or Finance" }),
  }),
  profilePicture: z
    .any()
    .refine((files) => files?.[0] instanceof File || !files, "Invalid file")
    .optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

type CreateUserFormProps = {
  onSubmit: (data: z.infer<typeof userSchema>) => void;
  isLoading?: boolean;
  selectedUser?: User;
};

export default function CreateUserForm({
  onSubmit,
  isLoading,
  selectedUser,
}: CreateUserFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      role: "admin",
      profilePicture: null,
    },
  });

  const profilePicFile = form.watch("profilePicture");

  useEffect(() => {
    if (profilePicFile?.[0]) {
      const file = profilePicFile[0];
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [profilePicFile]);

  function handleFormSubmit(data: z.infer<typeof userSchema>) {
    onSubmit(data);
    form.reset();
    setImagePreview(null);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                At least 6 characters, 1 letter and 1 number
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Profile Picture */}
        <FormField
          control={form.control}
          name="profilePicture"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input
                    {...fieldProps}
                    type="file"
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files)}
                  />
                  {imagePreview && (
                    <div className="flex items-center mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <span className="ml-2 text-sm text-gray-500">
                        Profile image preview
                      </span>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating User...
              </span>
            ) : (
              "Create User"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
