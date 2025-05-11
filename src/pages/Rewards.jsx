
      import React from 'react';
      import { motion } from 'framer-motion';
      import NeumorphicCard from '@/components/NeumorphicCard';
      import NeumorphicButton from '@/components/NeumorphicButton';
      import { Gift, Smartphone, Ticket, Video } from 'lucide-react';

      const rewardsData = [
          { id: 1, title: 'Recarga Móvil $5', points: 500, icon: <Smartphone className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />, description: 'Obtén $5 de saldo para tu móvil.' },
          { id: 2, title: 'Entrada Evento Eco', points: 1000, icon: <Ticket className="h-8 w-8 md:h-10 md:w-10 text-orange-500" />, description: 'Acceso a nuestro próximo evento.' },
          { id: 3, title: 'Video Exclusivo', points: 250, icon: <Video className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />, description: 'Mira un video especial sobre conservación.' },
          { id: 4, title: 'Kit de Semillas', points: 750, icon: <Gift className="h-8 w-8 md:h-10 md:w-10 text-green-600" />, description: 'Recibe un paquete de semillas nativas.' },
      ];

      const Rewards = () => {
           const cardVariants = {
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.1 } }
          };
           const itemVariants = {
             hidden: { opacity: 0, y: 20 },
             visible: { opacity: 1, y: 0 }
         };

          const currentUserPoints = parseInt(localStorage.getItem('totalPoints') || '0', 10);

          return (
              <motion.div 
                 initial="hidden"
                 animate="visible"
                 variants={cardVariants}
                 className="max-w-4xl mx-auto"
             >
                  <h1 className="text-2xl md:text-3xl font-bold text-center text-primary mb-4 md:mb-8">
                     <Gift className="inline-block mr-2 h-6 w-6 md:h-7 md:w-7" />
                     Centro de Recompensas
                  </h1>
                  <p className="text-sm md:text-base text-center text-muted-foreground mb-4 md:mb-6">Canjea tus puntos. Tienes <strong className="text-primary">{currentUserPoints}</strong> puntos.</p>

                  <motion.div 
                     className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                     variants={cardVariants}
                 >
                      {rewardsData.map((reward) => (
                          <motion.div key={reward.id} variants={itemVariants}>
                              <NeumorphicCard className="flex flex-col items-center text-center h-full p-4 md:p-6">
                                  <div className="mb-3 md:mb-4 p-2 md:p-3 rounded-full bg-background shadow-neumorphic-convex inline-block">
                                     {reward.icon}
                                  </div>
                                  <h2 className="text-lg md:text-xl font-semibold text-foreground mb-1 md:mb-2">{reward.title}</h2>
                                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 flex-grow">{reward.description}</p>
                                  <p className="text-md md:text-lg font-bold text-primary mb-3 md:mb-4">{reward.points} Puntos</p>
                                  <NeumorphicButton 
                                     variant={currentUserPoints >= reward.points ? 'primary' : 'secondary'} 
                                     className="w-full mt-auto text-sm md:text-base py-2 md:py-2.5"
                                     disabled={currentUserPoints < reward.points}
                                     >
                                     {currentUserPoints >= reward.points ? 'Canjear' : 'Insuficientes'}
                                  </NeumorphicButton>
                              </NeumorphicCard>
                          </motion.div>
                      ))}
                  </motion.div>
              </motion.div>
          );
      };

      export default Rewards;
  