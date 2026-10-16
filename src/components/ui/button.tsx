import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-xs font-mono uppercase tracking-wider font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-brand-gold text-brand-bg hover:bg-brand-gold-hover shadow-sm',
        destructive:
          'bg-red-950/80 text-red-300 border border-red-800/60 hover:bg-red-900',
        outline:
          'border border-brand-border bg-brand-card hover:bg-[#1f1b13] hover:border-brand-gold text-slate-200 hover:text-brand-gold',
        secondary:
          'bg-[#1a1815] text-slate-300 hover:bg-[#25221d] hover:text-white border border-[#2a261e]',
        ghost:
          'hover:bg-[#1a1815] hover:text-brand-gold text-slate-300',
        goldGlow:
          'bg-brand-gold text-brand-bg hover:bg-brand-gold-hover shadow-[0_0_15px_rgba(201,169,97,0.35)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-[11px]',
        lg: 'h-12 px-6 text-sm',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
