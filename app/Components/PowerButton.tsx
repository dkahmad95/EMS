"use client";

import { PowerIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { message } from "antd";
import { useState } from "react";

import * as authApi from "../../server/services/api/auth/auth";
import { clearUserStorage } from "../utils/storageKeys";
import DeleteModal from "./DeleteModal";

const PowerButton = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { mutateAsync: Logout } = useMutation({
    mutationFn: () => authApi.Logout(),
    onSuccess: () => {
      queryClient.clear();
      localStorage.removeItem("currentOfficeId");
      clearUserStorage();
      router.replace("/");
      router.refresh();
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
        type="button"
        onClick={() => setOpen(true)}
        aria-label="خروج"
        className="
          nav-link w-full justify-center md:justify-start
          text-gray-500 hover:text-danger-600 hover:bg-danger-50
          transition-[background-color,color,transform] duration-fast ease-out
          active:scale-[0.97]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        "
      >
        <PowerIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
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
