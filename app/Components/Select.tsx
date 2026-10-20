"use client";
import React from "react";
import clsx from "clsx";
import { ChevronDownIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  /** Optional shorthand; `children` (`<option>`s) work as well. */
  options?: { label: string; value: string }[];
}

/** The one native `<select>`. Same height, radius, border and focus ring as `Input`. */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      id,
      children,
      "aria-label": ariaLabel,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...rest
    },
    ref,
  ) => {
    const autoId = React.useId();
    const selectId = id ?? autoId;
    const messageId = `${selectId}-message`;
    const hasMessage = Boolean(error || helperText);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-label={ariaLabel ?? (label ? undefined : rest.title)}
            aria-invalid={ariaInvalid ?? (error ? true : undefined)}
            aria-describedby={clsx(ariaDescribedBy, hasMessage && messageId) || undefined}
            {...rest}
            className={clsx(
              "h-10 w-full appearance-none rounded-lg border bg-white ps-4 pe-10 text-sm text-gray-900 cursor-pointer",
              "transition-[border-color,box-shadow] duration-fast ease-out",
              "focus:outline-none focus:ring-2",
              error
                ? "border-danger-400 hover:border-danger-500 focus:border-danger-500 focus:ring-danger-100"
                : "border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-primary-100",
              "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:border-gray-300",
              className,
            )}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDownIcon
            className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
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

Select.displayName = "Select";

export { Select };
export default Select;
