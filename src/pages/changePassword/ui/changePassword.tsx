import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Label } from "@/shared/ui/label/label";
import { Input } from "@/shared/ui/input/input";
import { Button } from "@/shared/ui/button/button";
import backgroundLogin from "@/shared/assets/img/background_login.jpg";
import { useChangePassword } from "@/features/auth/changePassword/model/useChangePassword";
import { useState, useEffect } from "react";

export function ChangePassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { changePassword, isLoading } = useChangePassword();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    useEffect(() => {
        // Nếu không có token thì redirect về trang forgot password
        if (!token) {
            navigate('/forgot-password');
        }
    }, [token, navigate]);

    console.log("token from URL:", token);
    
    const handleChangePassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!token) {
            alert("Token không hợp lệ");
            return;
        }
        
        try {
            const response = await changePassword(token, newPassword, confirmPassword);
            if (!response) 
                throw new Error("Failed to change password");
            alert("Đổi mật khẩu thành công!");
            navigate("/");
            return response;
        } catch (err) {
            console.error("Error changing password:", err);
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
                            Enter your new password and confirm it
                        </p>
                    </div>

                    {/* New Password input */}
                    <div className="mb-6 space-y-2">
                        <Label htmlFor="newPassword" className="text-white">
                            New Password
                        </Label>
                        <Input
                            id="newPassword"
                            type="password"
                            placeholder="New password"
                            className="bg-[#1E1E1E] text-white border-gray-600"
                            required
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-6 space-y-2">
                        <Label htmlFor="confirmPassword" className="text-white">
                            Confirm New Password
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            className="bg-[#1E1E1E] text-white border-gray-600"
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {/* Submit button */}
                    <Button type="submit" className="bg-white text-black w-full hover:bg-white/90 mb-4 cursor-pointer" onClick={handleChangePassword}>
                        {isLoading ? 'Changing...' : 'Change Password'}
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