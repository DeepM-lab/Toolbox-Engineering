import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full bg-brand-bg border border-brand-border px-3.5 py-2 text-sm font-mono text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-brand-gold focus-visible:ring-1 focus-visible:ring-brand-gold/60 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
