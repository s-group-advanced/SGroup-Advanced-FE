
import { useOAuthCallback } from "@/features/auth/model/useOAuthCallback";

export default function OAuthCallbackPage() {
  useOAuthCallback();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-white text-xl">Đang xử lý đăng nhập...</h2>
      </div>
    </div>
  );
}