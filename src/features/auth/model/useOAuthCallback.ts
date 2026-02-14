import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

export function useOAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const token = searchParams.get("token");

    // Handle error
    if (error === "auth_failed") {
      navigate("/", { replace: true });
      return;
    }

    // Handle success
    if (success === "true" || token) {
      // Get callback from sessionStorage
      const returnUrl = sessionStorage.getItem("callback");

      if (!returnUrl) {
        console.warn("No callback URL found in sessionStorage!");
      }

      // Clear after use
      if (returnUrl) {
        sessionStorage.removeItem("callback");
      }

      // Wait for cookies to be set
      setTimeout(() => {
        const accessToken = Cookies.get("access_token") || token;

        if (accessToken) {
          if (returnUrl) {
            // Redirect to backend join link
            window.location.href = returnUrl;
          } else {
            // No callback → home
            navigate("/home", { replace: true });
          }
        } else {
          alert("Không thể lấy token. Vui lòng thử lại!");
          navigate("/", { replace: true });
        }
      }, 500); // Increase timeout to 1 second
    } else {
      console.warn("No success or token in search params");
    }
  }, [searchParams, navigate]);
}
