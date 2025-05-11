
    import React, { useEffect, useState } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Sprout, Sun, Cloud, Leaf, TreePine, Wind } from 'lucide-react';

    const SplashScreen = ({ onFinished }) => {
      const [animationStage, setAnimationStage] = useState(0);

      useEffect(() => {
        const timers = [
          setTimeout(() => setAnimationStage(1), 200),  // Initial delay
          setTimeout(() => setAnimationStage(2), 1200), // Sun and Cloud appear
          setTimeout(() => setAnimationStage(3), 2200), // Tree grows, leaves appear
          setTimeout(() => setAnimationStage(4), 3500), // Text appears
          setTimeout(() => {
            if (onFinished) {
              onFinished();
            }
          }, 4600), // Total duration before exit
        ];
        return () => timers.forEach(clearTimeout);
      }, [onFinished]);

      const containerVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.7, ease: "anticipate" } },
      };

      const iconProps = {
        strokeWidth: 1.5,
        className: "absolute drop-shadow-lg",
      };

      const MovingElement = ({ children, initial, animate, exit, transition, className = "" }) => (
        <motion.div
          initial={{ ...initial, opacity: 0 }}
          animate={{ ...animate, opacity: 1 }}
          exit={{ ...exit, opacity: 0, scale: 0.5 }}
          transition={{ ...transition, opacity: { duration: 0.5 } }}
          className={`absolute ${className}`}
        >
          {children}
        </motion.div>
      );
      
      const treePathVariants = {
        hidden: { pathLength: 0, pathOffset: 1, opacity: 0 },
        visible: (delay = 0) => ({ 
            pathLength: 1, 
            pathOffset: 0, 
            opacity: 1,
            transition: { duration: 1, ease: "easeInOut", delay } 
        }),
      };

      return (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-sky-200 via-green-100 to-yellow-100 dark:from-slate-900 dark:via-green-900 dark:to-yellow-900 overflow-hidden"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <AnimatePresence>
              {animationStage >= 1 && (
                <MovingElement
                  key="sun"
                  initial={{ top: "70%", left: "10%", scale: 0.3 }}
                  animate={{ top: "10%", left: "15%", scale: 1, rotate: [0, 180, 360] }}
                  transition={{ duration: 2, ease: "circOut" }}
                >
                  <Sun {...iconProps} size={60} className="text-yellow-500 dark:text-yellow-400" />
                </MovingElement>
              )}

              {animationStage >= 1 && (
                <MovingElement
                  key="cloud"
                  initial={{ top: "60%", right: "5%", scale: 0.4 }}
                  animate={{ top: "20%", right: "10%", scale: 1, x: [0, -15, 5, -10, 0] }}
                  transition={{ duration: 2.5, ease: "easeInOut", x: { repeat: Infinity, duration: 8, ease: "linear" } }}
                >
                  <Cloud {...iconProps} size={70} className="text-sky-500 dark:text-sky-400 opacity-80" />
                </MovingElement>
              )}
              
              {animationStage >= 2 && (
                 <motion.div
                    key="tree-container"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-40 md:w-40 md:h-48"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 1, ease: "backOut", delay: 0.2 } }}
                    exit={{ opacity: 0, scale: 0.7 }}
                >
                    <Sprout 
                        key="sprout-icon"
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600 dark:text-green-400"
                        size={animationStage < 3 ? 80 : 0} 
                        initial={{opacity:1, scale:1}}
                        animate={{opacity: animationStage < 3 ? 1:0, scale: animationStage < 3 ? 1:0.5, transition: {duration:0.3}}}
                    />
                    {animationStage >= 3 && (
                        <motion.svg 
                            key="tree-svg"
                            viewBox="0 0 60 80" 
                            className="w-full h-full text-green-700 dark:text-green-500 drop-shadow-lg"
                            initial={{ opacity:0 }}
                            animate={{ opacity:1, transition: {delay: 0.1}}}
                        >
                            <motion.path d="M30 78 V40" strokeLinecap="round" strokeWidth="5" variants={treePathVariants} initial="hidden" animate="visible" custom={0.1} />
                            <motion.path d="M30 50 Q10 45 15 25" strokeLinecap="round" strokeWidth="4" fill="none" variants={treePathVariants} initial="hidden" animate="visible" custom={0.4} />
                            <motion.path d="M30 45 Q50 40 45 20" strokeLinecap="round" strokeWidth="4" fill="none" variants={treePathVariants} initial="hidden" animate="visible" custom={0.6} />
                            <motion.path d="M30 35 Q20 30 25 10" strokeLinecap="round" strokeWidth="3" fill="none" variants={treePathVariants} initial="hidden" animate="visible" custom={0.8} />
                            <motion.path d="M30 30 Q40 25 35 5" strokeLinecap="round" strokeWidth="3" fill="none" variants={treePathVariants} initial="hidden" animate="visible" custom={1.0} />
                        </motion.svg>
                    )}
                </motion.div>
              )}
              
               {animationStage >= 3 && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <MovingElement
                        key={`leaf-${i}`}
                        className="opacity-70"
                        initial={{ 
                            top: `${40 + Math.random()*10}%`, 
                            left: `${45 + Math.random()*10}%`, 
                            rotate: Math.random() * 360, 
                            scale: 0.1 
                        }}
                        animate={{ 
                            top: `${30 + Math.random()*40}%`, 
                            left: `${10 + Math.random()*80}%`,
                            rotate: 720 + Math.random() * 360,
                            scale: [0.3, 0.8, 0.6, 0.9, 0.7],
                            x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40],
                            y: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20],
                        }}
                        transition={{ 
                            duration: 2 + Math.random()*2, 
                            ease: "circOut", 
                            delay: 0.5 + i * 0.15,
                            scale: { repeat: Infinity, duration: 1.5, yoyo: Infinity, ease: "easeInOut"},
                            x: { repeat: Infinity, duration: 3 + Math.random()*2, yoyo: Infinity, ease: "easeInOut"},
                            y: { repeat: Infinity, duration: 2.5 + Math.random()*2, yoyo: Infinity, ease: "easeInOut"},
                        }}
                      >
                        <Leaf {...iconProps} size={15 + Math.random()*10} className="text-lime-600 dark:text-lime-400" />
                      </MovingElement>
                    ))}
                  </>
              )}
            </AnimatePresence>
          </div>

          {animationStage >= 4 && (
            <motion.div
              className="text-center mt-4 md:mt-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.8, ease: "easeOut" } }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-primary mb-1 md:mb-2 tracking-tight drop-shadow-md">
                Ecolim
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground drop-shadow-sm">
                Ecología Sin Límites
              </p>
            </motion.div>
          )}
        </motion.div>
      );
    };

    export default SplashScreen;
  