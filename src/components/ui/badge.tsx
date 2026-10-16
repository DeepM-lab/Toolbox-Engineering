import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wider transition-colors border',
  {
    variants: {
      variant: {
        default:
          'bg-[#1f1b13] text-brand-gold border-[#3d3422]',
        gold:
          'bg-brand-gold text-brand-bg border-brand-gold font-extrabold',
        secondary:
          'bg-[#171512] text-slate-300 border-brand-border',
        success:
          'bg-emerald-950/70 text-emerald-400 border-emerald-500/40',
        warning:
          'bg-amber-950/60 text-amber-400 border-amber-600/40',
        destructive:
          'bg-red-950/70 text-red-400 border-red-700/50',
        outline:
          'text-slate-300 border-brand-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
