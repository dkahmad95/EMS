"use client";

import React, { useState } from "react";
import {
  UserCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  ChartBarIcon,
  UserGroupIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Button } from "@/app/Components/Button";
import Loader from "@/app/Components/Loader";
import { Input } from "@/app/Components/Input";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import * as authApi from "../server/services/api/auth/auth";
import Logo from "./Components/Logo";
import { useForm } from "react-hook-form";

const features = [
  {
    icon: UserGroupIcon,
    title: "إدارة الموظفين",
    desc: "تتبع بيانات الموظفين والمسميات الوظيفية بكفاءة عالية",
  },
  {
    icon: BanknotesIcon,
    title: "تتبع الإيرادات",
    desc: "رصد الإيرادات والمدفوعات في الوقت الفعلي",
  },
  {
    icon: ChartBarIcon,
    title: "لوحة التحليلات",
    desc: "تقارير وتحليلات شاملة لدعم اتخاذ القرار",
  },
];

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: (data: LoginFormData) => authApi.Login(data),

    onSuccess: () => {
      router.push("/ems");

      message.success({
        content: "تم تسجيل الدخول بنجاح",
        style: {
          fontFamily: "Cairo, sans-serif",
        },
      });
    },

    onError: (error: any) => {
      message.error({
        content:
          error?.response?.data?.message ||
          "حدث خطأ ما، يرجى المحاولة مرة أخرى",
        style: {
          fontFamily: "Cairo, sans-serif",
        },
      });
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <div
      dir="rtl"
      className="
        min-h-screen
        flex flex-col lg:flex-row
        bg-gray-50
      "
    >
      {/* Mobile Header */}
      <div
        className="
          lg:hidden
          bg-gradient-to-l from-primary-700 via-primary-600 to-secondary-600
          px-6 py-5
          flex justify-center
          shadow-sm
        "
      >
        <Logo
          logoSize={42}
          nameWidth={140}
          textSize="11px"
        />
      </div>

      {/* Login Section */}
      <div
        className="
          flex-1
          flex items-center justify-center
          px-5 py-8
          sm:px-8
          lg:px-16
          bg-white
        "
      >
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8 text-center lg:text-right">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              مرحباً بك
            </h1>

            <p className="text-sm text-gray-500 leading-relaxed">
              الرجاء إدخال بيانات الدخول للمتابعة
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
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
                  error={errors.username?.message}
                  className="pl-10"
                />

                <UserCircleIcon
                  className="
                    pointer-events-none
                    absolute left-3 top-1/2
                    h-4 w-4
                    -translate-y-1/2
                    text-gray-400
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
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
                      message:
                        "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
                    },
                  })}
                  error={errors.password?.message}
                  className="pl-20"
                />

                <KeyIcon
                  className="
                    pointer-events-none
                    absolute left-10 top-1/2
                    h-4 w-4
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="
                    absolute left-3 top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-gray-600
                    transition-colors
                    cursor-pointer
                  "
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              size="lg"
              className="
                w-full
                bg-primary-600
                hover:bg-primary-700
                text-white
                shadow-sm
              "
            >
              {isPending && (
                <Loader borderColor="white" />
              )}

              تسجيل الدخول
            </Button>
          </form>
        </div>
      </div>

      {/* Branding Section */}
      <div
        className="
          hidden lg:flex
          w-[42%]
          relative
          overflow-hidden
          bg-gradient-to-br
          from-primary-700
          via-primary-600
          to-secondary-600
          items-center justify-center
          px-10 py-14
        "
      >
        {/* Background Effects */}
        <div className="absolute top-[-100px] right-[-100px] w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-80px] w-72 h-72 rounded-full bg-secondary-400/10 blur-3xl" />

        <div className="relative z-10 max-w-md w-full">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <Logo
              logoSize={90}
              nameWidth={260}
              textSize="16px"
            />
          </div>

          {/* Subtitle */}
          <div className="text-center mb-10">
            <p className="text-white/75 text-sm leading-relaxed">
              نظام إدارة الموظفين والإيرادات
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="
                    flex items-start gap-4
                    rounded-2xl
                    border border-white/10
                    bg-white/10
                    backdrop-blur-md
                    p-4
                  "
                >
                  <div
                    className="
                      flex items-center justify-center
                      w-10 h-10
                      rounded-xl
                      bg-white/10
                      border border-white/10
                      flex-shrink-0
                    "
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1">
                      {feature.title}
                    </h3>

                    <p className="text-white/65 text-xs leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}