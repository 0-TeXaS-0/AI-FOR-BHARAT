interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Card({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md'
}: CardProps) {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-100 dark:border-gray-700',
    outlined: 'bg-transparent rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-[#FF851B] transition-colors duration-200',
    interactive: 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer border border-gray-100 dark:border-gray-700'
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  return (
    <div className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}