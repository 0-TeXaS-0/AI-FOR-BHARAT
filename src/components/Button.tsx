interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-[#FF851B] hover:bg-orange-600 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-[#001f3f] hover:bg-blue-800 text-white shadow-md hover:shadow-lg',
    accent: 'bg-[#2ECC40] hover:bg-green-600 text-white shadow-md hover:shadow-lg',
    outline: 'border-2 border-[#FF851B] text-[#FF851B] hover:bg-[#FF851B] hover:text-white',
    ghost: 'text-[#FF851B] hover:bg-[#FF851B]/10'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none' 
    : 'hover:scale-105 active:scale-95';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        font-semibold rounded-xl transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[#FF851B] focus:ring-offset-2
        ${className}
      `}
    >
      {children}
    </button>
  );
}