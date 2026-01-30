"use client";

import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {UserCircleIcon, EyeIcon, KeyIcon} from "@heroicons/react/24/outline";
import {ArrowRightIcon} from "@heroicons/react/20/solid";
import {useRouter} from "next/navigation";
import {Button} from "@/app/Components/Button";
import Loader from "@/app/Components/Loader";
import {Input} from "@/app/Components/Input";
import Link from "next/link";

type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Simulate API delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert(`مرحباً ${data.username}! تم تسجيل الدخول بنجاح ✅`);
      router.push("/ems/Dashboard");
    } catch (error) {
      console.error("Error:", error);
      alert(`فشل تسجيل الدخول: ${error}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center h-screen items-center rounded-lg px-6 space-y-3 pb-4 pt-8">
      <div className="w-full md:w-1/4">
        <h1 className="mb-3 text-2xl font-semibold text-gray-900 text-center">الرجاء تسجيل الدخول للمتابعة</h1>

        {/* Username */}
        <div>
          <label htmlFor="username" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
            اسم المستخدم
          </label>
          <div className="relative">
            <Input
              id="username"
              type="text"
              placeholder="أدخل اسم المستخدم"
              autoComplete="username"
              {...register("username", {
                required: "اسم المستخدم مطلوب",
              })}
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
        </div>

        {/* Password */}
        <div className="mt-4">
          <label htmlFor="password" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
            كلمة المرور
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="أدخل كلمة المرور"
              autoComplete="current-password"
              {...register("password", {
                required: "كلمة المرور مطلوبة",
                minLength: {
                  value: 6,
                  message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
                },
              })}
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            <EyeIcon
              className={`cursor-pointer absolute left-10 top-1/2 h-[18px] w-[18px] -translate-y-1/2 ${
                showPassword ? "text-green-800" : "text-gray-500"
              }`}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className={`mt-4 w-full text-white ${isSubmitting ? "cursor-not-allowed" : ""}`}>
          <div className="flex items-center justify-center gap-4">
            {isSubmitting ? (
              <Loader borderColor="white" />
            ) : (
              <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
            )}
            تسجيل الدخول
          </div>
        </Button>
      </div>
    </form>
  );
}
