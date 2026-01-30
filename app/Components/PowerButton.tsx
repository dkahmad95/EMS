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
      router.push("/");
      message.open({
        content: "تم تسجيل الخروج بنجاح",
        type: "success",
        style: {
          fontSize: "18px",
          fontFamily: "ar2",
          color: "#052533",
        },
      });
    },
  });

  return (
    <>
      {/* Logout Button */}
      <button
        className="flex h-[48px]   items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-green-800 md:flex-none md:justify-start md:p-2 md:px-3"
        onClick={() => setOpen(true)}
      >
            <PowerIcon className="w-6" />
        <span className="hidden md:block font-semibold">خروج</span>
      </button>

      {/* Confirmation Modal */}
      <DeleteModal
        open={open}
        setOpen={setOpen}
        Title="تأكيد تسجيل الخروج"
        Body="هل أنت متأكد أنك تريد تسجيل الخروج؟"
        handleClick={async () => {
          await Logout();
        }}
      />
    </>
  );
};

export default PowerButton;
