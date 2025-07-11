import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
const apiUrl = import.meta.env.VITE_API_URL;

const registrationSchema = z.object({
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
    .refine((files) => files?.[0] instanceof File, "Invalid file")
    .optional(),
});

export function RegistrationForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: z.infer<typeof registrationSchema>) => {
    try {
      const formData = new FormData();

      // Append form fields
      formData.append("firstname", data.firstname);
      formData.append("lastname", data.lastname);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);

      // Append file (profile picture)
      if (data.profilePicture?.[0]) {
        formData.append("profile_picture", data.profilePicture[0]); // Correct name
      }
      setLoading(true);

      const response = await axios.post(
        `${apiUrl}/auth/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Success:", response.data);
      toast.success("Registration successful! Redirecting to login...");
      // redirect to the login page
      navigate("/login");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to register. Please try again.";

      toast.error(errorMessage);

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile picture preview
  const profilePicFile = watch("profilePicture");
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

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            {/* First Name */}
            <div className="grid gap-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input id="firstname" {...register("firstname")} />
              {errors.firstname && (
                <p className="text-red-500 text-sm">
                  {errors.firstname.message}
                </p>
              )}
            </div>
            {/* Last Name */}
            <div className="grid gap-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input id="lastname" {...register("lastname")} />
              {errors.lastname && (
                <p className="text-red-500 text-sm">
                  {errors.lastname.message}
                </p>
              )}
            </div>
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Role Selection */}
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role.message}</p>
              )}
            </div>
            {/* Profile Picture Upload */}
            <div className="grid gap-2">
              <Label htmlFor="profilePicture">Profile Picture</Label>
              <Controller
                name="profilePicture"
                control={control}
                render={({ field }) => (
                  <Input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                )}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-16 h-16 rounded-full object-cover"
                />
              )}
              {errors.profilePicture && (
                <p className="text-red-500 text-sm">
                  {String(errors.profilePicture.message)}
                </p>
              )}
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="hover:cursor-pointer"
            >
              {loading ? "Registering..." : "Register"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
