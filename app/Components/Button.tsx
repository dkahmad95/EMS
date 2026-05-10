import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...rest
}: ButtonProps) {
  const base =
    'btn-base font-semibold focus-visible:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants: Record<string, string> = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 shadow-sm focus-visible:ring-primary-500',
    secondary:
      'bg-secondary-600 text-white hover:bg-secondary-700 shadow-sm focus-visible:ring-secondary-500',
    accent:
      'bg-accent-500 text-white hover:bg-accent-600 shadow-sm focus-visible:ring-accent-500',
    success:
      'bg-success-600 text-white hover:bg-success-700 shadow-sm focus-visible:ring-success-500',
    danger:
      'bg-danger-600 text-white hover:bg-danger-700 shadow-sm focus-visible:ring-danger-500',
    outline:
      'bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50 hover:border-primary-700 focus-visible:ring-primary-500',
    ghost:
      'bg-transparent text-primary-700 hover:bg-primary-50 hover:text-primary-800 focus-visible:ring-primary-500',
  };

  const sizes: Record<string, string> = {
    sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
    md: 'h-10 px-4 text-sm rounded-lg gap-2',
    lg: 'h-11 px-5 text-base rounded-xl gap-2',
  };

  return (
    <button
      {...rest}
      className={clsx(base, variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  );
}
