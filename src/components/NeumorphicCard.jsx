
      import React from 'react';
      import { motion } from 'framer-motion';
      import { cn } from '@/lib/utils';

      const NeumorphicCard = ({ children, className, concave = false, animate = true, ...props }) => {
        const shadowClass = concave ? 'shadow-neumorphic-concave' : 'shadow-neumorphic-convex';
        
        const cardVariants = {
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 },
        };

        return (
          <motion.div
            variants={animate ? cardVariants : undefined}
            initial={animate ? "hidden" : undefined}
            animate={animate ? "visible" : undefined}
            transition={animate ? { duration: 0.3, ease: "easeOut" } : undefined}
            className={cn(
              'p-4 md:p-6 rounded-neumorphic bg-background', 
              shadowClass,
              'transition-shadow duration-300 ease-in-out',
              className
            )}
            {...props}
          >
            {children}
          </motion.div>
        );
      };

      export default NeumorphicCard;
  