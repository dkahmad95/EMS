import React from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ className, label, ...rest }: InputProps) {
  return (
    <div className="gap-2 ">
      {label && (
        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900">
          {label}
        </label>
      )}
      <input
        {...rest}
        className={clsx(
          "peer block w-full rounded-md border ml-8  border-gray-200 py-[9px] px-4 text-sm outline-2 placeholder:text-gray-500",
          className
        )}
      />
    </div>
  );
}