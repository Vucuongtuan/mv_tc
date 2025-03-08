"use client";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import React, { useCallback, useState } from "react";
import { createAccount, Login, LoginFacebook, sendOtp } from "@/api/auth.api";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
export default function FormSignup() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const watchEmail = watch("email");
  const handleSendOtp = useCallback(async () => {
    try {
      setLoading(true);
      const res = await sendOtp(watchEmail);
      if (res.status === "success") {
        localStorage.setItem(
          "profileUser",
          JSON.stringify({
            email: res.email,
            name: res.name,
          })
        );
        Cookies.set("token", res.token);
        toast({
          title: "OTP đã gửi đến mail thành công",
          description: `${watchEmail}`,
        });
      }
    } catch (err) {
      setLoading(false);
      alert("Lỗi");
    } finally {
      setLoading(false);
    }
  }, [watchEmail]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await createAccount(data);
      if (res.status === "success") {
        toast({
          title: data.name,
          description: JSON.stringify(res),
        });
      }
    } catch (err) {
      toast({
        title: "Không thể đăng ký",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p>
          <label htmlFor="name">Name</label>
          <input
            {...register("name")}
            className="py-2 px-2 my-2 w-full outline-none rounded-lg"
          />
        </p>
        <label htmlFor="email">Email</label>
        <input
          {...register("email")}
          className="py-2 px-2 my-2 w-full outline-none rounded-lg"
        />
        <p>
          <label htmlFor="password">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              className="py-2 px-2 my-2 w-full outline-none rounded-lg"
              type={!showPassword ? "password" : "text"}
            />

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              onClick={() => setShowPassword(!showPassword)}
              className="w-6 h-6 absolute top-4 right-3 cursor-pointer"
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
          </div>
        </p>{" "}
        <p className="flex">
          <div className="w-2/3">
            <label htmlFor="otp">OTP</label>
            <input
              {...register("otp")}
              className="py-2 px-2 my-2 w-full outline-none rounded-lg"
            />
          </div>
          <button type="button" onClick={handleSendOtp} className={"px-4"}>
            Get OTP
          </button>
        </p>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-black rounded-lg"
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
    </>
  );
}
