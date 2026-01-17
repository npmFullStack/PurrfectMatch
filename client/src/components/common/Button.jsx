import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  as: Component = "button",
  to,
  href,
  className = "",
  leftIcon,
  rightIcon,
  isLoading = false,
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary/90 active:bg-primary/80",
    secondary: "bg-white text-gray-800 border-2 border-gray-200 hover:bg-gray-50 active:bg-gray-100",
    outline: "bg-transparent text-primary border-2 border-primary hover:bg-primary/10 active:bg-primary/20",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
  };

  // Size styles
  const sizeStyles = {
    xs: "px-2 py-1 text-sm",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-5 py-3 text-lg",
    xl: "px-6 py-3.5 text-xl",
  };

  // Base styles
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Animation styles
  const animationStyles = "hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg active:shadow-md";

  // Combine all styles
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${animationStyles} ${className}`;

  // Loading spinner
  const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // Render as Link if 'to' prop is provided
  if (to) {
    return (
      <Link to={to} className={combinedClassName} {...props}>
        {leftIcon && !isLoading && <span className="flex-shrink-0">{leftIcon}</span>}
        {isLoading && <LoadingSpinner />}
        <span>{children}</span>
        {rightIcon && !isLoading && <span className="flex-shrink-0">{rightIcon}</span>}
      </Link>
    );
  }

  // Render as anchor if 'href' prop is provided
  if (href) {
    return (
      <a href={href} className={combinedClassName} {...props}>
        {leftIcon && !isLoading && <span className="flex-shrink-0">{leftIcon}</span>}
        {isLoading && <LoadingSpinner />}
        <span>{children}</span>
        {rightIcon && !isLoading && <span className="flex-shrink-0">{rightIcon}</span>}
      </a>
    );
  }

  // Default render as button
  return (
    <Component className={combinedClassName} disabled={isLoading} {...props}>
      {leftIcon && !isLoading && <span className="flex-shrink-0">{leftIcon}</span>}
      {isLoading && <LoadingSpinner />}
      <span>{children}</span>
      {rightIcon && !isLoading && <span className="flex-shrink-0">{rightIcon}</span>}
    </Component>
  );
};

export default Button;