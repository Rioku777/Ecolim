
    import React, { useState, useEffect } from 'react';
    import NeumorphicCard from '@/components/NeumorphicCard';
    import { Progress } from "@/components/ui/progress";
    import { Sprout, Target, Award, TrendingUp, TreePine, ShieldCheck, Crown, Trophy, PackageOpen, DollarSign } from 'lucide-react';
    import { motion } from 'framer-motion';
    import NeumorphicButton from '@/components/NeumorphicButton';
    import { Link } from 'react-router-dom';
    import { useAuth } from '@/contexts/AuthContext';

    const ranks = [
        { name: 'Semilla', icon: <Sprout className="h-5 w-5 text-yellow-600" />, minPoints: 0 },
        { name: 'Brote', icon: <Sprout className="h-5 w-5 text-lime-500" />, minPoints: 50 },
        { name: 'Árbol', icon: <TreePine className="h-5 w-5 text-green-600" />, minPoints: 200 },
        { name: 'Bosque', icon: <TreePine className="h-5 w-5 text-emerald-700" />, minPoints: 500 },
        { name: 'Guardián', icon: <ShieldCheck className="h-5 w-5 text-blue-600" />, minPoints: 1500 },
        { name: 'Héroe Verde', icon: <Crown className="h-5 w-5 text-purple-600" />, minPoints: 5000 },
    ];

    const getCurrentRank = (points) => {
        let currentRank = ranks[0];
        for (let i = ranks.length - 1; i >= 0; i--) {
            if (points >= ranks[i].minPoints) {
                currentRank = ranks[i];
                break;
            }
        }
        return currentRank;
    };

    const Dashboard = () => {
        const { user } = useAuth();
        const [monthlyGoal, setMonthlyGoal] = useState(10); 
        const [treesPlantedThisMonth, setTreesPlantedThisMonth] = useState(0);
        const [bottlesCollected, setBottlesCollected] = useState(0);
        const [totalIncome, setTotalIncome] = useState(0);
        const [totalPoints, setTotalPoints] = useState(0);
        const [currentRank, setCurrentRank] = useState(ranks[0]);

        useEffect(() => {
            if (!user) return;

            const loadUserData = () => {
                const savedGoal = localStorage.getItem(`monthlyGoal_${user.id}`);
                const savedPlanted = localStorage.getItem(`treesPlantedThisMonth_${user.id}`);
                const savedBottles = localStorage.getItem(`bottlesCollected_${user.id}`);
                const savedIncome = localStorage.getItem(`totalIncome_${user.id}`);
                const savedPoints = localStorage.getItem(`totalPoints_${user.id}`);

                setMonthlyGoal(savedGoal ? parseInt(savedGoal, 10) : 10);
                setTreesPlantedThisMonth(savedPlanted ? parseInt(savedPlanted, 10) : 0);
                setBottlesCollected(savedBottles ? parseInt(savedBottles, 10) : 0);
                setTotalIncome(savedIncome ? parseFloat(savedIncome) : 0);
                
                const points = savedPoints ? parseInt(savedPoints, 10) : 0;
                setTotalPoints(points);
                setCurrentRank(getCurrentRank(points));

                if (!savedGoal) localStorage.setItem(`monthlyGoal_${user.id}`, '10');
                if (!savedPlanted) localStorage.setItem(`treesPlantedThisMonth_${user.id}`, '0');
                if (!savedBottles) localStorage.setItem(`bottlesCollected_${user.id}`, '0');
                if (!savedIncome) localStorage.setItem(`totalIncome_${user.id}`, '0');
                if (!savedPoints) localStorage.setItem(`totalPoints_${user.id}`, '0');
            };
            
            loadUserData();

            const handleStorageChange = (event) => {
                 if (event.key?.startsWith(`monthlyGoal_${user.id}`) || 
                     event.key?.startsWith(`treesPlantedThisMonth_${user.id}`) ||
                     event.key?.startsWith(`bottlesCollected_${user.id}`) ||
                     event.key?.startsWith(`totalIncome_${user.id}`) ||
                     event.key?.startsWith(`totalPoints_${user.id}`)) {
                    loadUserData();
                 }
            };
            window.addEventListener('storage', handleStorageChange);
            return () => window.removeEventListener('storage', handleStorageChange);

        }, [user]);


        const progressPercentage = monthlyGoal > 0 ? Math.min((treesPlantedThisMonth / monthlyGoal) * 100, 100) : 0;
        const nextRankIndex = ranks.findIndex(r => r.name === currentRank.name) + 1;
        const nextRank = nextRankIndex < ranks.length ? ranks[nextRankIndex] : null;
        const pointsToNextRank = nextRank ? nextRank.minPoints - totalPoints : 0;
        const rankProgressPercentage = nextRank && (nextRank.minPoints - currentRank.minPoints > 0) ? Math.max(0, Math.min(((totalPoints - currentRank.minPoints) / (nextRank.minPoints - currentRank.minPoints)) * 100, 100)) : (nextRank ? 0 : 100);


        const cardVariants = {
             hidden: { opacity: 0, y: 20 },
             visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
        };


        return (
            <motion.div 
              className="space-y-6 md:space-y-8"
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
                <motion.h1 variants={cardVariants} className="text-3xl md:text-4xl font-bold text-center text-brand-green mb-6 md:mb-8">
                    Bienvenido a Ecolim{user ? `, ${user.name || user.email}!` : '!'}
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <motion.div variants={cardVariants}>
                      <NeumorphicCard className="h-full flex flex-col justify-between p-4 md:p-6">
                        <div className="flex items-center mb-3 md:mb-4">
                          <Target className="h-7 w-7 md:h-8 md:w-8 mr-2 md:mr-3 text-primary" />
                          <h2 className="text-xl md:text-2xl font-semibold text-foreground">Meta Mensual (Árboles)</h2>
                        </div>
                        <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">Tu objetivo: <strong className="text-primary">{monthlyGoal}</strong> árboles.</p>
                        <div className="mb-2">
                          <div className="flex justify-between text-xs md:text-sm text-muted-foreground mb-1">
                            <span>Progreso</span>
                            <span>{treesPlantedThisMonth} / {monthlyGoal}</span>
                          </div>
                           <Progress value={progressPercentage} aria-label={`${progressPercentage}% de la meta mensual`} />
                        </div>
                        {treesPlantedThisMonth >= monthlyGoal && (
                          <p className="text-xs md:text-sm text-green-600 font-medium mt-2 md:mt-3">¡Meta de árboles alcanzada!</p>
                        )}
                         <Link to="/register" className="mt-3 md:mt-4">
                           <NeumorphicButton variant="primary" className="w-full text-sm md:text-base py-2 md:py-2.5">
                             <Sprout className="mr-2 h-4 w-4" /> Registrar Acción
                           </NeumorphicButton>
                         </Link>
                      </NeumorphicCard>
                    </motion.div>

                     <motion.div variants={cardVariants}>
                        <NeumorphicCard className="h-full flex flex-col justify-between p-4 md:p-6">
                            <div className="flex items-center mb-3 md:mb-4">
                                <Award className="h-7 w-7 md:h-8 md:w-8 mr-2 md:mr-3 text-secondary" />
                                <h2 className="text-xl md:text-2xl font-semibold text-foreground">Tu Rango</h2>
                            </div>
                            <div className="text-center my-3 md:my-4">
                                <div className="inline-flex items-center justify-center p-3 md:p-4 rounded-full bg-background shadow-neumorphic-convex mb-1 md:mb-2">
                                     {React.cloneElement(currentRank.icon, { className: "h-10 w-10 md:h-12 md:w-12" })}
                                </div>
                                <p className="text-lg md:text-xl font-medium text-foreground">{currentRank.name}</p>
                                <p className="text-xs md:text-sm text-muted-foreground">{totalPoints} Pts</p>
                            </div>
                            {nextRank && (
                                <div className="mt-auto">
                                    <div className="flex justify-between text-xs md:text-sm text-muted-foreground mb-1">
                                        <span>Próximo: {nextRank.name}</span>
                                        <span>{pointsToNextRank > 0 ? `${pointsToNextRank} Pts.` : '¡Casi!'}</span>
                                    </div>
                                    <Progress value={rankProgressPercentage} aria-label={`${rankProgressPercentage}% para el siguiente rango`} />
                                </div>
                            )}
                            {!nextRank && (
                                 <p className="text-xs md:text-sm text-purple-600 font-medium text-center mt-2 md:mt-3">¡Máximo Rango!</p>
                            )}
                        </NeumorphicCard>
                     </motion.div>

                    <motion.div variants={cardVariants}>
                      <NeumorphicCard className="h-full p-4 md:p-6">
                        <div className="flex items-center mb-3 md:mb-4">
                          <TrendingUp className="h-7 w-7 md:h-8 md:w-8 mr-2 md:mr-3 text-brand-brown" />
                          <h2 className="text-xl md:text-2xl font-semibold text-foreground">Estadísticas</h2>
                        </div>
                        <div className="space-y-2 md:space-y-3 text-sm md:text-lg">
                            <p className="flex items-center justify-between">
                                <span className="flex items-center"><Sprout className="mr-1.5 h-4 w-4 text-green-500"/>Árboles (Mes):</span> 
                                <strong className="text-primary">{treesPlantedThisMonth}</strong>
                            </p>
                             <p className="flex items-center justify-between">
                                <span className="flex items-center"><PackageOpen className="mr-1.5 h-4 w-4 text-blue-500"/>Botellas Recogidas:</span> 
                                <strong className="text-blue-500">{bottlesCollected}</strong>
                            </p>
                            <p className="flex items-center justify-between">
                                <span className="flex items-center"><Trophy className="mr-1.5 h-4 w-4 text-yellow-500"/>Puntos Totales:</span> 
                                <strong className="text-secondary">{totalPoints}</strong>
                            </p>
                             <p className="flex items-center justify-between">
                                <span className="flex items-center"><DollarSign className="mr-1.5 h-4 w-4 text-emerald-500"/>Ingresos Simbólicos:</span> 
                                <strong className="text-emerald-500">${totalIncome.toFixed(2)}</strong>
                            </p>
                        </div>
                         <Link to="/ranking" className="mt-4 md:mt-6 block">
                           <NeumorphicButton variant="secondary" className="w-full text-sm md:text-base py-2 md:py-2.5">
                             <Trophy className="mr-2 h-4 w-4" /> Clasificación Completa
                           </NeumorphicButton>
                         </Link>
                      </NeumorphicCard>
                    </motion.div>
                </div>

                 <motion.div variants={cardVariants}>
                    <NeumorphicCard className="p-4 md:p-6">
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3 md:mb-4">Actividades Rápidas</h2>
                        <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">¡Participa y gana más puntos!</p>
                         <Link to="/gamification">
                             <NeumorphicButton className="w-full text-sm md:text-base py-2 md:py-2.5">
                                Ir a Minijuegos
                             </NeumorphicButton>
                         </Link>
                    </NeumorphicCard>
                 </motion.div>

            </motion.div>
        );
    };

    export default Dashboard;
  