// src/components/LoadingSpinner.jsx
const LoadingSpinner = ({ size = 'md', color = 'primary', className = '', showText = true, text = 'Loading...' }) => {
  const sizeClasses = {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    neutral: 'text-neutral'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <span className={`loading loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`}></span>
      {showText && <p className={`text-${color} font-medium`}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;