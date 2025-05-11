
    import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import NeumorphicCard from '@/components/NeumorphicCard';
    import { Trophy, Sprout, TreePine, ShieldCheck, Crown, UserCircle, BarChart3 } from 'lucide-react';
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
    import { useAuth } from '@/contexts/AuthContext';
    import useLocalStorage from '@/hooks/useLocalStorage';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

    const generalRanks = [
        { name: 'Semilla', icon: <Sprout className="h-4 w-4 md:h-5 md:w-5" />, minPoints: 0, color: 'text-yellow-600' },
        { name: 'Brote', icon: <Sprout className="h-4 w-4 md:h-5 md:w-5" />, minPoints: 50, color: 'text-lime-500' },
        { name: 'Árbol', icon: <TreePine className="h-4 w-4 md:h-5 md:w-5" />, minPoints: 200, color: 'text-green-600' },
        { name: 'Bosque', icon: <TreePine className="h-4 w-4 md:h-5 md:w-5" />, minPoints: 500, color: 'text-emerald-700' },
        { name: 'Guardián', icon: <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />, minPoints: 1500, color: 'text-blue-600' },
        { name: 'Héroe Verde', icon: <Crown className="h-4 w-4 md:h-5 md:w-5" />, minPoints: 5000, color: 'text-purple-600' },
    ];

     const getCurrentRankInfo = (points) => {
        let currentRank = generalRanks[0];
        for (let i = generalRanks.length - 1; i >= 0; i--) {
            if (points >= generalRanks[i].minPoints) {
                currentRank = generalRanks[i];
                break;
            }
        }
        return currentRank;
    };
    
    const sampleLeaderboard = [
        { id: 'user1', name: 'EcoGuardián Supremo', points: 5500, avatarInitials: 'ES', country: 'Nicaragua' },
        { id: 'user2', name: 'Siembra Reina', points: 4800, avatarInitials: 'SR', country: 'Costa Rica' },
        { id: 'user3', name: 'Capitán Planeta', points: 3200, avatarInitials: 'CP', country: 'Panamá' },
        { id: 'user4', name: 'Forest Gump Jr.', points: 1650, avatarInitials: 'FG', country: 'Nicaragua' },
        { id: 'admin001', name: 'Admin Ecolim', points: 1200, avatarInitials: 'AE', country: 'Mundo' }, 
        { id: 'user6', name: 'Brote Feliz', points: 850, avatarInitials: 'BF', country: 'Honduras' },
        { id: 'user7', name: 'Arbolito Nuevo', points: 450, avatarInitials: 'AN', country: 'El Salvador' },
    ];

    const LeaderboardList = ({ players, currentUserData }) => {
        const listVariants = {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
        };

        const itemVariants = {
            hidden: { opacity: 0, x: -30, scale: 0.95 },
            visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 150, damping: 15 } }
        };

        if (!players || players.length === 0) {
            return <p className="text-muted-foreground text-center mt-6">No hay datos de clasificación disponibles.</p>;
        }

        return (
            <motion.ul 
                className="space-y-2 md:space-y-3 mt-4"
                variants={listVariants}
                initial="hidden"
                animate="visible"
            >
                {players.map((player, index) => {
                    const rankInfo = getCurrentRankInfo(player.points || player.score); // score for EcoClicker
                    const isCurrentUser = currentUserData && player.id === currentUserData.id;
                   
                    return (
                       <motion.li key={player.id || index} variants={itemVariants}>
                           <NeumorphicCard 
                                concave={isCurrentUser} 
                                className={`flex items-center justify-between p-3 md:p-4 ${isCurrentUser ? 'ring-2 ring-primary shadow-neumorphic-concave' : 'shadow-neumorphic-convex'}`}
                                animate={false} 
                            >
                                <div className="flex items-center space-x-2 md:space-x-3">
                                    <motion.span 
                                        className={`text-md md:text-lg font-semibold w-6 md:w-8 text-center ${index < 3 ? 'text-yellow-500' : 'text-muted-foreground'}`}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.1 * index, type: "spring", stiffness: 200 }}
                                    >
                                        {index + 1}
                                    </motion.span>
                                    <Avatar className="h-8 w-8 md:h-10 md:w-10 shadow-neumorphic-flat">
                                        {player.avatarUrl ? <AvatarImage src={player.avatarUrl} alt={player.name} /> : null}
                                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs md:text-sm">{player.avatarInitials || player.name?.substring(0,2).toUpperCase() || '??'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-sm md:text-base text-foreground">{player.name}</p>
                                        {player.points !== undefined && ( // Only show rank for general leaderboard
                                            <div className={`flex items-center text-xs md:text-sm ${rankInfo.color}`}>
                                                {React.cloneElement(rankInfo.icon, { className: `mr-1 h-3 w-3 md:h-4 md:w-4 ${rankInfo.color}` })}
                                                {rankInfo.name}
                                            </div>
                                        )}
                                        {player.country && <p className="text-xs text-muted-foreground">{player.country}</p>}
                                    </div>
                                </div>
                                <motion.span 
                                    className="text-md md:text-lg font-semibold text-primary"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.15 * index }}
                                >
                                    {player.points !== undefined ? `${player.points} Pts` : `${player.score} Clicks`}
                                </motion.span>
                            </NeumorphicCard>
                        </motion.li>
                    );
                })}
            </motion.ul>
        );
    };


    const RankingPage = () => {
        const { user } = useAuth();
        const [generalLeaderboard, setGeneralLeaderboard] = useState([]);
        const [ecoClickerHighScores] = useLocalStorage('ecoClickerHighScores', []);
        const [currentUserData, setCurrentUserData] = useState(null);

         useEffect(() => {
            let usersForRanking = [];
            const registeredUsers = JSON.parse(localStorage.getItem('ecolimRegisteredUsers') || '[]');
            
            // Add registered users
            registeredUsers.forEach(regUser => {
                usersForRanking.push({
                    id: regUser.id,
                    name: regUser.name,
                    points: parseInt(localStorage.getItem(`totalPoints_${regUser.id}`) || '0', 10),
                    avatarInitials: regUser.name.substring(0,2).toUpperCase(),
                    country: regUser.country
                });
            });

            // Add sample users if they are not already present (by ID)
            sampleLeaderboard.forEach(sampleUser => {
                if (!usersForRanking.some(u => u.id === sampleUser.id)) {
                    usersForRanking.push(sampleUser);
                }
            });
            
            usersForRanking.sort((a, b) => b.points - a.points);
            setGeneralLeaderboard(usersForRanking);

            if (user) {
                const userPoints = parseInt(localStorage.getItem(`totalPoints_${user.id}`) || '0', 10);
                setCurrentUserData({
                    id: user.id,
                    name: user.name || user.email,
                    points: userPoints,
                    avatarInitials: (user.name || user.email).substring(0,2).toUpperCase(),
                    country: user.country || 'Desconocido'
                });
            } else {
                setCurrentUserData(null);
            }
         }, [user]); 

      return (
         <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.5 }}
             className="max-w-3xl mx-auto"
         >
            <NeumorphicCard className="p-4 md:p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-center text-primary mb-4 md:mb-6">
                    <Trophy className="inline-block mr-2 h-6 w-6 md:h-7 md:w-7" />
                    Clasificaciones Ecolim
                </h1>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="general" className="text-sm md:text-base py-2.5 data-[state=active]:shadow-neumorphic-concave">
                            <UserCircle className="mr-2 h-4 w-4 md:h-5 md:w-5"/> General
                        </TabsTrigger>
                        <TabsTrigger value="ecoclicker" className="text-sm md:text-base py-2.5 data-[state=active]:shadow-neumorphic-concave">
                           <BarChart3 className="mr-2 h-4 w-4 md:h-5 md:w-5"/> EcoClicker
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="general">
                        <LeaderboardList players={generalLeaderboard} currentUserData={currentUserData} />
                    </TabsContent>
                    <TabsContent value="ecoclicker">
                        <LeaderboardList players={ecoClickerHighScores} currentUserData={currentUserData} />
                    </TabsContent>
                </Tabs>
            </NeumorphicCard>
        </motion.div>
      );
    };

    export default RankingPage;
  