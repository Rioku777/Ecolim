
      import React from 'react';
      import { motion } from 'framer-motion';
      import { cn } from '@/lib/utils';
      import { Button as ShadcnButton, buttonVariants } from '@/components/ui/button'; // Import base button and variants

      const NeumorphicButton = React.forwardRef(({ children, className, variant = 'default', size = 'default', concaveOnClick = true, ...props }, ref) => {
        
        const baseClasses = 'rounded-neumorphic transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background';
        const shadowClasses = 'shadow-neumorphic-convex active:shadow-neumorphic-concave disabled:shadow-none disabled:opacity-70';
        const concaveShadowClasses = 'shadow-neumorphic-concave active:shadow-neumorphic-convex disabled:shadow-none disabled:opacity-70';

        const getVariantClasses = () => {
           switch(variant) {
               case 'primary':
                   return 'bg-primary text-primary-foreground hover:bg-primary/90';
               case 'secondary':
                   return 'bg-secondary text-secondary-foreground hover:bg-secondary/90';
                case 'destructive':
                    return 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
               case 'ghost': // Make ghost look flat initially
                   return 'bg-transparent hover:bg-accent/50 text-foreground shadow-neumorphic-flat active:shadow-neumorphic-concave';
               default: // Default uses background color
                   return 'bg-background text-foreground hover:bg-background/90';
           }
        };

        return (
          <motion.button
            ref={ref}
            whileTap={concaveOnClick ? { scale: 0.97 } : { scale: 0.98 }}
            className={cn(
              baseClasses,
              getVariantClasses(),
              variant === 'ghost' || !concaveOnClick ? shadowClasses.replace('active:shadow-neumorphic-concave', 'active:shadow-neumorphic-convex') : shadowClasses, // Adjust active shadow
              buttonVariants({ size, className: 'p-0 border-none' }), // Remove shadcn padding/border, apply size
              'inline-flex items-center justify-center', // Ensure flex alignment
              className // Allow overriding classes
            )}
            {...props}
          >
            {children}
          </motion.button>
        );
      });
      NeumorphicButton.displayName = 'NeumorphicButton';

      export default NeumorphicButton;
  