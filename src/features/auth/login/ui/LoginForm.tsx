import { cn } from "@/shared/lib/utils";
import type React from "react";
import type { JSX } from "react";
import { FaGoogle } from "react-icons/fa";

import { Button } from "@/shared/ui/button/button";
import { Label } from "@/shared/ui/label/label";
import { Input } from "@/shared/ui/input/input";

import { useState } from "react";
import { useAuth } from "@/features/auth/login/model/useAuth";
import type { ApiError } from "@/features/auth/login/api/type";
import { Link, useNavigate } from "react-router-dom";
function LoginForm({
  className,
  ...props
}: {
  className?: string;
} & React.ComponentProps<"form">): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, login } = useAuth();
  const navigate = useNavigate();
  async function submit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    try {
      const response = await login({ email, password });
      if (response) {
        navigate("/home");
        // alert('Login successfully !!')
      }
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.message);
    }
  }

  const handleGoogleLogin = async () => {
    const backendURL = import.meta.env.VITE_API_BASE_URL
    window.location.href = `${backendURL}/auth/google`
  }

  return (
    <form className={cn(className)} {...props}>
      {/* Tiêu đề và giới thiệu */}
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-bold text-white">Login to your account</h1>
        <p className="text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      {/* Nhập email */}
      <div className="mb-4 space-y-2">
        <Label htmlFor="email" className="text-white">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your@gmail.com"
          className="bg-[#1E1E1E] text-white border-gray-600"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Nhập mật khẩu và Forgot Password */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="password" className="text-white ">
            Password
          </Label>
          <Link to="/forgot-password" className="text-white hover:underline text-sm">
            Forgot your password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          className="bg-[#1E1E1E] text-white border-gray-600"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Nút Đăng nhập */}
      <Button className="bg-white text-black w-full hover:bg-white/90 mb-4" onClick={submit}>
        {isLoading ? 'Loading...' : 'Login'}
      </Button>

      {/* Or continue with Google*/}
      <div className="flex items-center gap-2 justify-center">
        <div className="flex-1 h-px bg-gray-600"></div>
        <span className="text-muted-foreground">Or continue with</span>
        <div className="flex-1 h-px bg-gray-600"></div>
      </div>

      {/* login with github */}
      <Button type="button" className="bg-[#1E1E1E] text-white w-full border border-gray-600 hover:bg-[#2A2A2A] flex items-center justify-center gap-2 mt-4 cursor-pointer" onClick={handleGoogleLogin}>
        <FaGoogle />
        Login with Google
      </Button>

      {/* Chưa có tài khoản? Đăng ký */}
      <div className="text-center text-white mt-4">
        <span className="text-white text-sm">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </p>
        </span>
      </div>
    </form>
  );
}

export { LoginForm };
