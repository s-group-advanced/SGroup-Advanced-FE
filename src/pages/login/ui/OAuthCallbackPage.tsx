import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/login/model/useAuth";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkMe } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      setTimeout(async () => {
        try {
          await checkMe();
          navigate("/home", { replace: true });
        } catch (error) {
          console.error("Auth verification failed:", error);
          alert("Cannot verify authentication. Please try again!");
          navigate("/", { replace: true });
        } finally {
          setIsChecking(false);
        }
      }, 500);
    } else {
      alert("Login with Google failed. Please try again!");
      navigate("/", { replace: true });
      setIsChecking(false);
    }
  }, [searchParams, navigate, checkMe]);

  if (!isChecking) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-white text-xl">Login Processing...</h2>
      </div>
    </div>
  );
}