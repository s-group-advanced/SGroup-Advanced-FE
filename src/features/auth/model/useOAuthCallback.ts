import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

export function useOAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra nếu đã đăng nhập rồi thì redirect
    const existingToken = Cookies.get("accessToken");
    if (existingToken) {
      navigate("/home", { replace: true });
      return;
    }

    // Xử lý OAuth callback
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "true") {
      // Delay nhỏ để đảm bảo cookie đã được set
      setTimeout(() => {
        const token = Cookies.get("accessToken");
        if (token) {
          alert("Đăng nhập với Google thành công!");
          navigate("/home", { replace: true });
        } else {
          alert("Không thể lấy token. Vui lòng thử lại!");
          navigate("/", { replace: true });
        }
      }, 500);
    }

    if (error === "auth_failed") {
      alert("Đăng nhập với Google thất bại. Vui lòng thử lại!");
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);
}
