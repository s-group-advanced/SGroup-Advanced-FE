import { Button } from "@/shared/ui/button/button";
import { Input } from "@/shared/ui/input/input";
import { Label } from "@/shared/ui/label/label";
import backgroundLogin from "@/shared/assets/img/background_login.jpg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useChangePassword } from "@/features/auth/changePassword/model/useChangePassword";

export function InputEmail() {
    const [email, setEmail] = useState("");
    const { forgotPassword, isLoading } = useChangePassword();
    async function submit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        try {
            const response = await forgotPassword(email);
            if (!response) throw new Error("Failed to send reset link");
            alert("Please check your email for the reset link");
            return response;
        } catch (err) {
            throw err;
        }
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-[#0A0A0A]">
            {/* Form section */}
            <div className="flex flex-col justify-center items-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    {/* Title and description */}
                    <div className="mb-6 space-y-2 text-center">
                        <p className="text-white">
                            Enter your email and we'll send you a link to reset your password
                        </p>
                    </div>

                    {/* Email input */}
                    <div className="mb-6 space-y-2">
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

                    {/* Submit button */}
                    <Button type="submit" className="bg-white text-black w-full hover:bg-white/90 mb-4 cursor-pointer" onClick={submit}>
                        {isLoading ? 'Sending...' : 'Send'}
                    </Button>

                    {/* Back to login */}
                    <div className="text-center text-white mt-4">
                        <span className="text-white text-sm">
                            <p>
                                Remember your password?{" "}
                                <Link to="/" className="underline">
                                    Back to login
                                </Link>
                            </p>
                        </span>
                    </div>
                </div>
            </div>

            {/* Background image */}
            <div className="hidden md:block relative overflow-hidden">
                <img 
                    className="w-full h-screen object-cover" 
                    src={backgroundLogin} 
                    alt="image" 
                />
            </div>
        </div>
    );
}