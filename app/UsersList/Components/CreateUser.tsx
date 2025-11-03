"use client";

import { useForm } from "react-hook-form";
import {
  PhoneIcon,
  UserCircleIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/Components/Button";
import { Input } from "@/app/Components/Input";
import { Select } from "@/app/Components/Select";
import { useRouter } from "next/navigation";

type UserFormInputs = {
  name: string;
  phoneNumber: string;
  email?: string;
  city: string;
  role: string;
  permissions: string[];
  password: string;
  confirmPassword: string;
};

export default function CreateUserForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormInputs>();

  const onSubmit = async (data: UserFormInputs) => {
    try {
      // remove confirmPassword before sending/storing
      const { confirmPassword, ...payload } = data;
      console.log("✅ بيانات المستخدم:", payload);
      alert(JSON.stringify(payload, null, 2));
      reset();
      router.push("/UsersList");
    } catch (error) {
      console.error("❌ خطأ:", error);
      alert("حدث خطأ أثناء إنشاء المستخدم. حاول مرة أخرى.");
    }
  };

  const cities = [
    { value: "beirut", label: "بيروت" },
    { value: "tripoli", label: "طرابلس" },
    { value: "saida", label: "صيدا" },
    { value: "tyre", label: "صور" },
    { value: "baalbek", label: "بعلبك" },
  ];

  const roles = [
    { value: "admin", label: "مدير النظام" },
    { value: "editor", label: "محرر" },
    { value: "viewer", label: "مشاهد" },
  ];

  const permissionsList = [
    { value: "view", label: "عرض البيانات" },
    { value: "create", label: "إنشاء" },
    { value: "edit", label: "تعديل" },
    { value: "delete", label: "حذف" },
    { value: "export", label: "تصدير البيانات" },
  ];

  // watch password for confirm validation
  const watchedPassword = watch("password", "");

  return (
    <div dir="rtl" className="font-[Tajawal] text-right">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-md bg-white shadow p-6"
      >
        {/* الاسم */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
            اسم المستخدم
          </label>
          <div className="relative">
            <Input
              id="name"
              placeholder="أدخل اسم المستخدم"
              {...register("name", { required: "الاسم مطلوب" })}
              className="peer block w-full rounded-md border border-gray-300 py-2 pr-10 text-sm placeholder:text-gray-400"
            />
            <UserCircleIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* رقم الهاتف */}
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium text-gray-700">
            رقم الهاتف
          </label>
          <div className="relative">
            <Input
              id="phoneNumber"
              placeholder="أدخل رقم الهاتف"
              {...register("phoneNumber", {
                required: "رقم الهاتف مطلوب",
                pattern: {
                  value: /^[0-9]{8,15}$/,
                  message: "أدخل رقم هاتف صالح",
                },
              })}
              className="peer block w-full rounded-md border border-gray-300 py-2 pr-10 text-sm placeholder:text-gray-400"
            />
            <PhoneIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* البريد الإلكتروني (اختياري) */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
            البريد الإلكتروني (اختياري)
          </label>
          <div className="relative">
            <Input
              id="email"
              placeholder="example@email.com"
              {...register("email", {
                // email is optional; pattern will only run if a value is provided
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "أدخل بريد إلكتروني صالح",
                },
              })}
              className="peer block w-full rounded-md border border-gray-300 py-2 pr-10 text-sm placeholder:text-gray-400"
            />
            <EnvelopeIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* المدينة */}
        <div className="mb-4">
          <label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-700">
            المدينة
          </label>
          <div className="relative">
            <Select
              id="city"
              label=""
              {...register("city", { required: "يرجى اختيار المدينة" })}
              options={cities}
              className="peer block w-full rounded-md border border-gray-300 py-2 pr-10 text-sm text-gray-700 bg-white"
            />
            <BuildingOfficeIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>

        {/* الدور */}
        <div className="mb-4">
          <label htmlFor="role" className="mb-2 block text-sm font-medium text-gray-700">
            الدور / الصلاحية العامة
          </label>
          <div className="relative">
            <Select
              id="role"
              label=""
              {...register("role", { required: "يرجى اختيار الدور" })}
              options={roles}
              className="peer block w-full rounded-md border border-gray-300 py-2 pr-10 text-sm text-gray-700 bg-white"
            />
            <ShieldCheckIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
          )}
        </div>

        {/* كلمة المرور */}
        <div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
            كلمة المرور
          </label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              placeholder="أدخل كلمة المرور"
              autoComplete="new-password"
              {...register("password", {
                required: "كلمة المرور مطلوبة",
                minLength: { value: 8, message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" },
              })}
              className="peer block w-full rounded-md border border-gray-300 py-2 pr-10 text-sm placeholder:text-gray-400"
            />
            <KeyIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* تأكيد كلمة المرور */}
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
            تأكيد كلمة المرور
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type="password"
              placeholder="أعد إدخال كلمة المرور"
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "يرجى تأكيد كلمة المرور",
                validate: (value) =>
                  value === watchedPassword || "كلمتا المرور غير متطابقتين",
              })}
              className="peer block w-full rounded-md border border-gray-300 py-2 pr-10 text-sm placeholder:text-gray-400"
            />
            <KeyIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* الصلاحيات الإضافية */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الصلاحيات الإضافية
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {permissionsList.map((perm) => (
              <label key={perm.value} className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  value={perm.value}
                  {...register("permissions")}
                  className="h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-600"
                />
                <span className="text-sm text-gray-700">{perm.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* الأزرار */}
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/UsersList"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            إلغاء
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`text-white bg-green-800 hover:bg-green-600 ${
              isSubmitting && "opacity-60 cursor-not-allowed"
            }`}
          >
            إنشاء المستخدم
          </Button>
        </div>
      </form>
    </div>
  );
}