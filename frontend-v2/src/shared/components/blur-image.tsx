import clsx from 'clsx';
import { useState } from 'react';

type BlurImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  containerClassName?: string;
};

export function BlurImage({ className, containerClassName, ...props }: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={clsx('overflow-hidden', containerClassName)}>
      <img
        {...props}
        onLoad={() => setLoaded(true)}
        className={clsx(
          'h-full w-full object-cover transition-all duration-500 will-change-transform',
          loaded ? 'blur-0 scale-100 opacity-100' : 'scale-105 opacity-70 blur-xl',
          className,
        )}
      />
    </div>
  );
}
