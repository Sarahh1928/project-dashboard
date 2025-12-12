"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/zod-schemas";
import { loginRequest } from "@/services/authService";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const result = await loginRequest(values.email, values.password);

      dispatch(
        loginSuccess({
          token: result.token,
          role: result.role,
        })
      );

      router.push("/dashboard");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          Project Dashboard Login
        </h1>

        <div>
          <Input
            placeholder="Email"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
