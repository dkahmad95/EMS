import * as React from 'react';
import clsx from 'clsx';
import Loader from './Loader';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'outline' | 'ghost' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  /** Shows a small spinner before the children, sets aria-busy and disables the button. */
  loading?: boolean;
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500',
  secondary:
    'bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 hover:border-primary-300 focus-visible:ring-primary-500',
  accent:
    'bg-accent-500 text-white hover:bg-accent-600 focus-visible:ring-accent-500',
  success:
    'bg-success-600 text-white hover:bg-success-700 focus-visible:ring-success-500',
  danger:
    'bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-500',
  outline:
    'bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50 hover:border-primary-700 focus-visible:ring-primary-500',
  ghost:
    'bg-transparent text-primary-700 hover:bg-primary-50 hover:text-primary-800 focus-visible:ring-primary-500',
  // Neutral/secondary action (e.g. Cancel in modals)
  muted:
    'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:text-gray-900 hover:border-gray-300 focus-visible:ring-gray-400',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
  md: 'h-10 px-4 text-sm rounded-lg gap-2',
  lg: 'h-11 px-5 text-base rounded-lg gap-2',
};

/** Spinner color that reads on each variant's background. */
const spinnerColor: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'white',
  secondary: 'primary',
  accent: 'white',
  success: 'white',
  danger: 'white',
  outline: 'primary',
  ghost: 'primary',
  muted: 'gray',
};

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={clsx('btn-base font-semibold', variants[variant], sizes[size], className)}
    >
      {loading && <Loader size="sm" borderColor={spinnerColor[variant]} />}
      {children}
    </button>
  );
}
