import React from "react";
import clsx from "clsx";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

export function Select({ className, label, options, ...rest }: SelectProps) {
  return (
    <div className="gap-2 w-full">
      {label && (
        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900 p-2 ">
          {label}
        </label>
      )}
      <select
        {...rest}
        className={clsx(
          "peer p-2 block w-full rounded-md border ml-4 border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500",
          className
        )}
      >
      
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
