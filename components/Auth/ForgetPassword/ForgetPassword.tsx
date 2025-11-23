"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/useAuth";

// ✅ Validation schema
const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgetPassword() {
  const { forgotPassword, isForgotPasswordLoading } = useAuth();
  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (values: ForgotFormValues) => {
    try {
      const res = await forgotPassword({ email: values.email });

      if (res?.success === false) {
        toast.error(res?.message || "Something went wrong");
        return;
      }

      const token = res?.data?.accessToken;
      if (token) {
        router.push(`/verify-otp?token=${token}&mode=forgot`);
      } else {
        toast.error("Token not received, please try again");
      }
    } catch {
      // Error already handled by the hook
    }
  };

  return (
    <div className="w-full max-w-[756px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.10)] rounded-[12px] p-10">
      <h2 className="text-3xl md:text-[48px] font-bold leading-[150%] font-playfair text-primary mb-2 font-heading">
        Reset Your Password
      </h2>
      <p className="text-gray-500 mb-6">
        Enter your email address and we’ll send you code to reset your password.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[16px] leading-[150%] font-medium text-[#343A40]">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="hello@example.com"
                    className="h-12 w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-10 gradient-primary hover:bg-red-800 cursor-pointer"
            disabled={isForgotPasswordLoading}
          >
            {isForgotPasswordLoading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
