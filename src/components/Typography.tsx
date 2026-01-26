interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'bilingual';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export default function Typography({ 
  children, 
  variant = 'body', 
  className = '',
  as 
}: TypographyProps) {
  const variantClasses = {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold leading-tight',
    h2: 'text-3xl md:text-4xl lg:text-5xl font-bold leading-tight',
    h3: 'text-2xl md:text-3xl font-bold leading-tight',
    h4: 'text-xl md:text-2xl font-semibold leading-tight',
    body: 'text-base md:text-lg leading-relaxed',
    caption: 'text-sm md:text-base text-gray-600 dark:text-gray-400',
    bilingual: 'text-lg md:text-xl font-medium' // Larger for Hindi text readability
  };

  const Component = as || (variant.startsWith('h') ? variant : 'p') as keyof JSX.IntrinsicElements;

  return (
    <Component className={`${variantClasses[variant]} ${className}`}>
      {children}
    </Component>
  );
}