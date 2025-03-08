/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { useSession, signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { Login, LoginFacebook } from "@/api/auth.api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux";
import { useRouter } from "next/navigation";
import { auth_login } from "@/lib/redux/auth";
import Cookies from "js-cookie";
export default function FormLogin() {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleSubmit = useCallback(async (e: any) => {
    setLoading(true);
    e.preventDefault();
    try {
      const values = e.target;
      const res = await Login(values.tk.value, values.mk.value);
      if (res.status === "success") {
        toast({
          title: "Đăng nhập thành công",
          description: `Xin chào ${res?.name} `,
        });

        Cookies.set("token", res.token, { expires: 7 });
        localStorage.setItem(
          "profileUser",
          JSON.stringify({
            id: res.id,
            name: res.name,
            email: res.email,
          })
        );
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: `${res.message}`,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Không thể đăng nhập, kiểm tra lại tk và mk",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const { data: session, status } = useSession();
  useEffect(() => {
    dispatch(
      auth_login({ name: session?.user?.name, email: session?.user?.email })
    );
  }, []);
  const handleFacebookLogin = useCallback(async () => {
    await signIn("facebook");

    toast({
      title: "Đăng nhập thành công",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <form action="" className="mt-4 text-lg" onSubmit={handleSubmit}>
        <label htmlFor="Tên đăng nhập">Tên đăng nhập</label>
        <p>
          <input
            type="text"
            name="tk"
            className="py-2 px-2 my-2 w-full outline-none rounded-lg"
          />
        </p>
        <label htmlFor="Tên đăng nhập">Mật khẩu</label>
        <p className=" relative">
          <input
            name="mk"
            type={!showPassword ? "password" : "text"}
            className="py-2 px-2 my-2 w-full outline-none rounded-lg"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            onClick={() => setShowPassword(!showPassword)}
            className="w-6 h-6 absolute top-5 right-3 cursor-pointer"
          >
            {showPassword ? (
              <>
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </>
            ) : (
              <>
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </>
            )}
          </svg>
        </p>

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-1 border-2 rounded-lg w-full font-bold my-2 dark:bg-black bg-white ${
            loading ? " cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : "Đăng nhập"}
        </button>
      </form>
      <Link href="/signup " className="text-[#a0a0a0]">
        {" "}
        Đăng ký tài khoản
      </Link>
      <div className="border-t-2 mt-6 w-full pt-4 flex relative after:content-['OR'] after:-top-4 after:left-1/3 after:text-center after:right-1/3 after:absolute">
        <Button
          onClick={handleFacebookLogin}
          className="w-1/2 bg-transparent border-2 mr-2 rounded-lg py-1 hover:bg-[#176fff]  flex justify-center items-center font-semibold"
        >
          <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="w-6 h-6 mr-2"
          >
            <path
              fill="#1877F2"
              d="M15 8a7 7 0 00-7-7 7 7 0 00-1.094 13.915v-4.892H5.13V8h1.777V6.458c0-1.754 1.045-2.724 2.644-2.724.766 0 1.567.137 1.567.137v1.723h-.883c-.87 0-1.14.54-1.14 1.093V8h1.941l-.31 2.023H9.094v4.892A7.001 7.001 0 0015 8z"
            />
            <path
              fill="#ffffff"
              d="M10.725 10.023L11.035 8H9.094V6.687c0-.553.27-1.093 1.14-1.093h.883V3.87s-.801-.137-1.567-.137c-1.6 0-2.644.97-2.644 2.724V8H5.13v2.023h1.777v4.892a7.037 7.037 0 002.188 0v-4.892h1.63z"
            />
          </svg>
          <label htmlFor="Facebook">Facebook</label>
        </Button>

        <button className="w-1/2 border-2 ml-2  rounded-lg py-1">aa</button>
      </div>
    </>
  );
}
