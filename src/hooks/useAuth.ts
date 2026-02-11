"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { checkServerAuth } from "@/app/(auth)/connect/validate/actions";

export const useAuth = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // Vì tc_access_token là httpOnly, chúng ta gọi Server Action để kiểm tra
        const isAuth = await checkServerAuth();
        if (isMounted) {
          setIsLoggedIn(isAuth);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setIsLoggedIn(false);
          setLoading(false);
        }
      }
    };

    checkAuth();
    
    // Kiểm tra định kỳ mỗi 5 giây để cập nhật trạng thái nếu cần
    const interval = setInterval(checkAuth, 5000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const login = () => {
    const callbackUrl = encodeURIComponent(window.location.href);
    router.push(`/connect/validate?type=login&callback=${callbackUrl}`);
  };

  const register = () => {
    const callbackUrl = encodeURIComponent(window.location.href);
    router.push(`/connect/validate?type=register&callback=${callbackUrl}`);
  };

  const logout = () => {
    const callbackUrl = encodeURIComponent(window.location.href);
    router.push(`/connect/validate?type=logout&callback=${callbackUrl}`);
  };

  const refresh = () => {
    const callbackUrl = encodeURIComponent(window.location.href);
    router.push(`/connect/validate?type=refresh&callback=${callbackUrl}`);
  };

  return { isLoggedIn, loading, login, register, logout, refresh };
};
