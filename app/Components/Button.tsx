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
  const baseStyles = 'btn-base inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none';
  
  const variants = {
    primary: 'bg-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-soft hover:shadow-soft-md active:scale-95',
    secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-700 text-white hover:from-secondary-700 hover:to-secondary-800 focus:ring-secondary-500 shadow-soft hover:shadow-soft-md active:scale-95',
    accent: 'bg-gradient-to-r from-accent-600 to-accent-700 text-white hover:from-accent-700 hover:to-accent-800 focus:ring-accent-500 shadow-soft hover:shadow-soft-md active:scale-95',
    success: 'bg-gradient-to-r from-success-600 to-success-700 text-white hover:from-success-700 hover:to-success-800 focus:ring-success-500 shadow-soft hover:shadow-soft-md active:scale-95',
    danger: 'bg-gradient-to-r from-danger-600 to-danger-700 text-white hover:from-danger-700 hover:to-danger-800 focus:ring-danger-500 shadow-soft hover:shadow-soft-md active:scale-95',
    outline: 'bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50 hover:border-primary-700 focus:ring-primary-500 active:scale-95',
    ghost: 'bg-transparent text-primary-700 hover:bg-primary-50 hover:text-primary-800 focus:ring-primary-500 active:scale-95',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-md',
    md: 'h-10 px-4 text-sm rounded-lg',
    lg: 'h-12 px-6 text-base rounded-lg',
  };
  
  return (
    <button
      {...rest}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </button>
  );
}
