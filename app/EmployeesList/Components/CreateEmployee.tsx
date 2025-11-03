"use client";

import { useForm } from "react-hook-form";
import {
  PhoneIcon,
  UserCircleIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

import Link from "next/link";
import { Button } from "@/app/Components/Button";
import { useRouter } from "next/navigation";
import { Input } from "@/app/Components/Input";
import { Select } from "@/app/Components/Select";

type EmployeeFormInputs = {
  name: string;
  phoneNumber: string;
  email: string;
  jobTitle: string;
  salary: number;
  officeLocation: string;
};

export default function CreateEmployeeForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmployeeFormInputs>();

  const onSubmit = async (data: EmployeeFormInputs) => {
    try {
      console.log("✅ بيانات الموظف:", data);
      alert("تم إنشاء الموظف بنجاح!");
      reset();
      router.push("/EmployeesList");
    } catch (error) {
      console.error("❌ خطأ:", error);
      alert("حدث خطأ أثناء إنشاء الموظف. حاول مرة أخرى.");
    }
  };

  const officeLocations = [
    { value: "beirut", label: "بيروت" },
    { value: "tripoli", label: "طرابلس" },
    { value: "saida", label: "صيدا" },
    { value: "tyre", label: "صور" },
    { value: "baalbek", label: "بعلبك" },
  ];

  return (
    <div dir="rtl" className="font-[Tajawal] text-right">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-md bg-white shadow p-6"
      >
        {/* اسم الموظف */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
            اسم الموظف
          </label>
          <div className="relative">
            <Input
              id="name"
              placeholder="أدخل اسم الموظف"
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

        {/* البريد الإلكتروني */}
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <Input
              id="email"
              placeholder="example@email.com"
              {...register("email", {
                required: "البريد الإلكتروني مطلوب",
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

        {/* المسمى الوظيفي */}
        <div className="mb-4">
          <label htmlFor="jobTitle" className="mb-2 block text-sm font-medium text-gray-700">
            المسمى الوظيفي
          </label>
          <div className="relative">
            <Input
              id="jobTitle"
              placeholder="مثال: محاسب، مدير، مبرمج"
              {...register("jobTitle", { required: "المسمى الوظيفي مطلوب" })}
              className="peer block w-full rounded-md border border-gray-300 py-2 pr-10 text-sm placeholder:text-gray-400"
            />
            <BriefcaseIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {errors.jobTitle && (
            <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>
          )}
        </div>

        {/* موقع المكتب */}
        <div className="mb-4">
          <label htmlFor="officeLocation" className="mb-2 block text-sm font-medium text-gray-700">
            موقع المكتب
          </label>
          <div className="relative">
            <Select
      id="officeLocation"
      label=""
      {...register("officeLocation", { required: "يرجى اختيار موقع المكتب" })}
      options={officeLocations}
      className="peer block w-full rounded-md border border-gray-300 py-2 pr-10 text-sm text-gray-700 bg-white"
    />
            <BuildingOfficeIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {errors.officeLocation && (
            <p className="text-red-500 text-xs mt-1">{errors.officeLocation.message}</p>
          )}
        </div>

        {/* الراتب */}
        <div className="mb-4">
          <label htmlFor="salary" className="mb-2 block text-sm font-medium text-gray-700">
            الراتب الشهري
          </label>
          <div className="relative">
            <Input
              id="salary"
              type="number"
              placeholder="أدخل الراتب"
              {...register("salary", {
                required: "الراتب مطلوب",
                min: { value: 0, message: "يجب أن يكون الراتب موجبًا" },
              })}
              className="peer block w-full rounded-md border border-gray-300 py-2 pr-10 text-sm placeholder:text-gray-400"
            />
            <CurrencyDollarIcon className="pointer-events-none absolute right-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {errors.salary && (
            <p className="text-red-500 text-xs mt-1">{errors.salary.message}</p>
          )}
        </div>

        {/* الأزرار */}
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/employeesList"
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
            إنشاء الموظف
          </Button>
        </div>
      </form>
    </div>
  );
}
