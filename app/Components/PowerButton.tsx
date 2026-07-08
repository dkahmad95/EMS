"use client";

import { PowerIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { useState } from "react";

import * as authApi from "../../server/services/api/auth/auth";
import DeleteModal from "./DeleteModal";

const PowerButton = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { mutateAsync: Logout } = useMutation({
    mutationFn: () => authApi.Logout(),
    onSuccess: () => {
      localStorage.removeItem("currentOfficeId");
      router.push("/");
      message.open({
        content: "تم تسجيل الخروج بنجاح",
        type: "success",
        style: { fontSize: "15px", fontFamily: "Cairo, sans-serif" },
      });
    },
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="nav-link text-gray-500 hover:text-rose-600 hover:bg-rose-50 w-full cursor-pointer"
      >
        <PowerIcon className="w-5 h-5 flex-shrink-0" />
        <span className="hidden md:block">خروج</span>
      </button>

      <DeleteModal
        open={open}
        setOpen={setOpen}
        Title="تأكيد تسجيل الخروج"
        Body="هل أنت متأكد أنك تريد تسجيل الخروج من النظام؟"
        handleClick={async () => { await Logout(); }}
      />
    </>
  );
};

export default PowerButton;
