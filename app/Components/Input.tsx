"use client";
import React from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...rest }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          {...rest}
          className={clsx(
            "w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900",
            "placeholder:text-gray-400 transition-all duration-150",
            "focus:outline-none focus:ring-2 focus:ring-offset-1",
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-primary-500/20",
            "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
            className,
          )}
        />
        {error && (
          <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
