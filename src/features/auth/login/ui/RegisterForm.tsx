import { cn } from "@/shared/lib/utils";
import type React from "react";
import type { JSX } from "react";
import { FaGoogle } from "react-icons/fa";

import { Button } from "@/shared/ui/button/button";
import { Label } from "@/shared/ui/label/label";
import { Input } from "@/shared/ui/input/input";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/login/model/useAuth";
import { useState } from "react";
import type { ApiError } from "../api/type";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export function RegisterForm({
  className,
  ...props
}: {
  className?: string;
} & React.ComponentProps<"form">): JSX.Element {

  const { isLoading, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  async function handleRegister(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        alert("Password and Confirm Password do not match");
        return;
      }
      await register({ name, email, password });
      navigate("/");
      toast.success("Register successfully. Please check your email to verify your account.");
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
            <h1 className="text-2xl font-bold text-white">Register to your account</h1>
            <p className="text-muted-foreground">
              Enter your email below to register to your account
            </p>
          </div>
        {/* Nhập tên */}
        <div className="mb-4 space-y-2">
        <Label htmlFor="name" className="text-white">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              className="bg-[#1E1E1E] text-white border-gray-600"
              required
              onChange={(e) => setName(e.target.value)}
            />
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
    
          {/* Nhập mật khẩu và Confirm Password */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password" className="text-white ">
                Password
              </Label>
            </div>
            <Input
              id="password"
              type="password"
              className="bg-[#1E1E1E] text-white border-gray-600"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6 space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="confirmPassword" className="text-white ">
                Confirm Password
              </Label>
            </div>
            <Input
              id="confirmPassword"
              type="password"
              className="bg-[#1E1E1E] text-white border-gray-600"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
    
          {/* Nút Đăng nhập */}
          <Button className="bg-white text-black w-full hover:bg-white/90 mb-4 cursor-pointer" onClick={handleRegister}>
            {isLoading ? 'Loading...' : 'Sign up'}
          </Button>
    
          {/* Or continue with Google*/}
          <div className="flex items-center gap-2 justify-center">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-muted-foreground">Or continue with</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>
    
          {/* login with github */}
          <Button className="bg-[#1E1E1E] text-white w-full border border-gray-600 hover:bg-[#2A2A2A] flex items-center justify-center gap-2 mt-4 cursor-pointer" onClick={handleGoogleLogin}>
            <FaGoogle />
            Login with Google
          </Button>
    
          {/* Chưa có tài khoản? Đăng ký */}
          <div className="text-center text-white mt-4">
            <span className="text-white text-sm">
              <p>
                Already have an account?{" "}
                <Link to="/" className="underline">
                  Sign in
                </Link>
              </p>
            </span>
          </div>
        </form>
      );
}