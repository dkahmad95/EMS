"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import Image from "next/image";

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
    title: "لوحة تحليلات",
    desc: "تقارير وتحليلات شاملة لدعم القرار",
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
    defaultValues: { username: "", password: "" },
  });

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: (data: LoginFormData) => authApi.Login(data),
    onSuccess: (data) => {
      if (data) {
        router.push("/ems");
        message.open({
          content: "تم تسجيل الدخول بنجاح",
          type: "success",
          style: { fontSize: "15px", fontFamily: "Cairo, sans-serif" },
        });
      }
    },
    onError: (error: any) => {
      message.open({
        content:
          error?.response?.data?.message ||
          "حدث خطأ ما، يرجى المحاولة مرة أخرى",
        type: "error",
        style: { fontSize: "15px", fontFamily: "Cairo, sans-serif" },
      });
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <div className="min-h-screen flex" dir="rtl">

      {/* ── Right: Login form ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-white p-6 md:p-12">
        <div className="w-full max-w-sm">

          {/* Mobile-only logo */}
          <div className="flex items-center gap-3 mb-8 md:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">م</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">جمعية المبرات</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">مرحباً بك</h1>
            <p className="text-sm text-gray-500">
              الرجاء إدخال بيانات الدخول للمتابعة
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
                      message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
                    },
                  })}
                  error={errors.password?.message}
                  className="pl-20"
                />
                <KeyIcon className="pointer-events-none absolute left-10 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                  aria-label="Toggle password visibility"
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
              className="w-full mt-2"
            >
              {isPending ? (
                <Loader borderColor="white" />
              ) : null}
              تسجيل الدخول
            </Button>
          </form>
        </div>
      </div>

      {/* ── Left: Branding panel (hidden on mobile) ───── */}
      <div className="hidden md:flex w-2/5 bg-gradient-to-br from-gray-900 via-primary-950 to-secondary-950 flex-col items-center justify-center p-12 relative overflow-hidden">

        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full bg-primary-600/20 blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full bg-secondary-600/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary-800/10 blur-3xl" />

        <div className="relative z-10 text-center mb-10">
          {/* Logo mark */}
          <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Image
              src="/almabbaratLogo.webp"
              alt="شعار جمعية المبرات"
              className="w-9 h-9 md:w-10 md:h-10 rounded-lg object-contain flex-shrink-0"
              width={40}
              height={40}
              priority
            />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">جمعية المبرات</h2>
          <p className="text-white/60 text-sm">نظام إدارة الموظفين والإيرادات</p>
        </div>

        {/* Feature highlights */}
        <div className="relative z-10 w-full max-w-xs space-y-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="flex items-start gap-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl p-4"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary-500/30 border border-primary-400/30 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary-300" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{f.title}</p>
                  <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
