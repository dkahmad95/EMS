"use client";
import React from "react";
import clsx from "clsx";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  /** Decorative leading icon (`h-4 w-4`). Never receives pointer events. */
  startIcon?: React.ReactNode;
  /** Trailing slot. May be interactive (pass a button); it keeps pointer events. */
  endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      id,
      placeholder,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...rest
    },
    ref,
  ) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const messageId = `${inputId}-message`;
    const hasMessage = Boolean(error || helperText);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <span
              className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 [&>svg]:h-4 [&>svg]:w-4"
              aria-hidden="true"
            >
              {startIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            placeholder={placeholder}
            aria-label={ariaLabel ?? (label ? undefined : placeholder)}
            aria-invalid={ariaInvalid ?? (error ? true : undefined)}
            aria-describedby={clsx(ariaDescribedBy, hasMessage && messageId) || undefined}
            {...rest}
            className={clsx(
              "h-10 w-full rounded-lg border bg-white px-4 text-sm text-gray-900",
              "placeholder:text-gray-400",
              "transition-[border-color,box-shadow] duration-fast ease-out",
              "focus:outline-none focus:ring-2",
              error
                ? "border-danger-400 hover:border-danger-500 focus:border-danger-500 focus:ring-danger-100"
                : "border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-primary-100",
              "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:border-gray-300",
              startIcon && "ps-10",
              endIcon && "pe-10",
              className,
            )}
          />
          {endIcon && (
            <span className="absolute end-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400 [&>svg]:h-4 [&>svg]:w-4">
              {endIcon}
            </span>
          )}
        </div>
        {error && (
          <p id={messageId} className="mt-1.5 text-xs text-danger-600 flex items-center gap-1" role="alert">
            <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={messageId} className="mt-1.5 text-xs text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
