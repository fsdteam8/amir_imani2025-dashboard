"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { authService } from "@/lib/api/auth-service";
import { useRouter } from "next/navigation";
import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyOtpInput,
  ChangePasswordInput,
  User,
} from "@/lib/types/auth";

// --------------------
// useCurrentUser Hook
// --------------------
export function useCurrentUser() {
  const { data, error, isLoading, mutate: mutateUser } = useSWR<{ data: User }>(
    "/auth/me",
    () => authService.getMe(),
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  return {
    user: data?.data,
    isLoading,
    isError: !!error,
    error,
    mutateUser,
  };
}

// --------------------
// useAuth Hook
// --------------------
export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (input: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login(input);
      if (res.data?.accessToken) {
        localStorage.setItem("authToken", res.data.accessToken);
        // Mutate the user query to fetch the new user immediately
        await mutate("/auth/me");
        router.push("/dashboard"); // or wherever
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (input: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.register(input);
      if (res.data?.accessToken) {
        localStorage.setItem("authToken", res.data.accessToken);
        await mutate("/auth/me");
        router.push("/dashboard");
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (input: VerifyOtpInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.verifyOtp(input);
      if (res.data?.accessToken) {
        localStorage.setItem("authToken", res.data.accessToken);
        await mutate("/auth/me");
        router.push("/dashboard");
      }
      return res;
    } catch (err: any) {
      setError(err.message || "OTP verification failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (input: ForgotPasswordInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.forgotPassword(input);
      return res;
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, input: ResetPasswordInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.resetPassword(token, input);
      return res;
    } catch (err: any) {
      setError(err.message || "Password reset failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (input: ChangePasswordInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.changePassword(input);
      return res;
    } catch (err: any) {
      setError(err.message || "Password change failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    mutate("/auth/me", null, false); // Clear user data
    router.push("/login");
  };

  return {
    login,
    register,
    verifyOtp,
    forgotPassword,
    resetPassword,
    changePassword,
    logout,
    isLoading,
    error,
  };
};

// --------------------
// useAllUsers Hook
// --------------------
export const useAllUsers = () => {
  const { data, error, isLoading, mutate: mutateUsers } = useSWR<{ data: User[] }>(
    "/users",
    () => authService.getAllUsers()
  );

  return {
    users: data?.data || [],
    isLoading,
    isError: !!error,
    error,
    mutateUsers,
  };
};

// --------------------
// useAllConversation Hook
// --------------------
// export const useAllConversation = (userId: string) => {
//   const { data, error, isLoading, mutate: mutateConversations } = useSWR<{ data: any[] }>(
//     userId ? `/conversations/${userId}` : null,
//     () => authService.getUserConversation(userId)
//   );

//   return {
//     conversations: data?.data || [],
//     isLoading,
//     isError: !!error,
//     error,
//     mutateConversations,
//   };
// };