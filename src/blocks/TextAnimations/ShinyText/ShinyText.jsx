/*
	Installed from https://reactbits.dev/tailwind/
*/

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }) => {
  if (!text) return null;
  
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block ${!disabled ? 'animate-shine' : ''} ${className}`}
      style={{
        background: !disabled 
          ? 'linear-gradient(120deg, currentColor 40%, rgba(255, 255, 255, 0.8) 50%, currentColor 60%)'
          : 'currentColor',
        backgroundSize: !disabled ? '200% 100%' : 'auto',
        WebkitBackgroundClip: !disabled ? 'text' : 'unset',
        backgroundClip: !disabled ? 'text' : 'unset',
        WebkitTextFillColor: !disabled ? 'transparent' : 'currentColor',
        animationDuration: animationDuration,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;