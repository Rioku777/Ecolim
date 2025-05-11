
     import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import NeumorphicCard from '@/components/NeumorphicCard';
    import { Trophy, Sprout, TreePine, ShieldCheck, Crown } from 'lucide-react';
    import { Avatar, AvatarFallback } from "@/components/ui/avatar";
    import { useAuth } from '@/contexts/AuthContext';

    const ranks = [
        { name: 'Semilla', icon: <Sprout className="h-4 w-4 md:h-5 md:w-5" />, minPoints: 0, color: 'text-yellow-600' },
        { name: 'Brote', icon: <Sprout className="h-4 w-4 md:h-5 md:w-5" />, minPoints: 50, color: 'text-lime-500' },
        { name: 'Árbol', icon: <TreePine className="h-4 w-4 md:h-5 md:w-5" />, minPoints: 200, color: 'text-green-600' },
        { name: 'Bosque', icon: <TreePine className="h-4 w-4 md:h-5 md:w-5" />, minPoints: 500, color: 'text-emerald-700' },
        { name: 'Guardián', icon: <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />, minPoints: 1500, color: 'text-blue-600' },
        { name: 'Héroe Verde', icon: <Crown className="h-4 w-4 md:h-5 md:w-5" />, minPoints: 5000, color: 'text-purple-600' },
    ];

     const getCurrentRankInfo = (points) => {
        let currentRank = ranks[0];
        for (let i = ranks.length - 1; i >= 0; i--) {
            if (points >= ranks[i].minPoints) {
                currentRank = ranks[i];
                break;
            }
        }
        return currentRank;
    };

    // Sample leaderboard data - replace with real data from backend
    // Added 'country' field for future use
    const sampleLeaderboard = [
        { id: 'user1', name: 'EcoGuardián Supremo', points: 5500, avatarInitials: 'ES', country: 'Nicaragua' },
        { id: 'user2', name: 'Siembra Reina', points: 4800, avatarInitials: 'SR', country: 'Costa Rica' },
        { id: 'user3', name: 'Capitán Planeta', points: 3200, avatarInitials: 'CP', country: 'Panamá' },
        { id: 'user4', name: 'Forest Gump Jr.', points: 1650, avatarInitials: 'FG', country: 'Nicaragua' },
        { id: 'admin@gmail.com', name: 'Admin Ecolim', points: 1200, avatarInitials: 'AE', country: 'Mundo' }, // Current user example
        { id: 'user6', name: 'Brote Feliz', points: 850, avatarInitials: 'BF', country: 'Honduras' },
        { id: 'user7', name: 'Arbolito Nuevo', points: 450, avatarInitials: 'AN', country: 'El Salvador' },
    ].sort((a, b) => b.points - a.points); 

    const Ranking = () => {
        const { user } = useAuth();
        // In a real app, leaderboard would be fetched from a backend
        const [leaderboard, setLeaderboard] = useState(sampleLeaderboard);
        const [currentUserData, setCurrentUserData] = useState(null);

         useEffect(() => {
            // Simulate fetching current user's data for ranking
            if (user) {
                const userPoints = parseInt(localStorage.getItem(`totalPoints_${user.id}`) || '0', 10);
                // Check if user is already in sample leaderboard, if not, add/update them
                const existingUserIndex = leaderboard.findIndex(p => p.id === user.id);
                const updatedLeaderboard = [...leaderboard];

                const userDataForRanking = {
                    id: user.id,
                    name: user.name || user.email,
                    points: userPoints,
                    avatarInitials: (user.name || user.email).substring(0,2).toUpperCase(),
                    country: user.country || 'Desconocido'
                };
                
                if (existingUserIndex > -1) {
                    updatedLeaderboard[existingUserIndex] = userDataForRanking;
                } else {
                    updatedLeaderboard.push(userDataForRanking);
                }
                
                updatedLeaderboard.sort((a, b) => b.points - a.points);
                setLeaderboard(updatedLeaderboard);
                setCurrentUserData(userDataForRanking);
            } else {
                 // If no user, just show the sample leaderboard without highlighting
                setLeaderboard(sampleLeaderboard.sort((a, b) => b.points - a.points));
                setCurrentUserData(null);
            }
         }, [user]); // Re-run if user changes

          const listVariants = {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
        };

        const itemVariants = {
            hidden: { opacity: 0, x: -30, scale: 0.95 },
            visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 150, damping: 15 } }
        };

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
                    Ranking Mundial Ecolim
                </h1>

                <motion.ul 
                     className="space-y-2 md:space-y-3"
                     variants={listVariants}
                     initial="hidden"
                     animate="visible"
                 >
                    {leaderboard.map((player, index) => {
                        const rankInfo = getCurrentRankInfo(player.points);
                        const isCurrentUser = currentUserData && player.id === currentUserData.id;
                       
                        return (
                           <motion.li key={player.id} variants={itemVariants}>
                               <NeumorphicCard 
                                    concave={isCurrentUser} 
                                    className={`flex items-center justify-between p-3 md:p-4 ${isCurrentUser ? 'ring-2 ring-primary shadow-neumorphic-concave' : 'shadow-neumorphic-convex'}`}
                                    animate={false} // Animation handled by list item
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
                                            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs md:text-sm">{player.avatarInitials || '??'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm md:text-base text-foreground">{player.name}</p>
                                            <div className={`flex items-center text-xs md:text-sm ${rankInfo.color}`}>
                                                {React.cloneElement(rankInfo.icon, { className: `mr-1 h-3 w-3 md:h-4 md:w-4 ${rankInfo.color}` })}
                                                {rankInfo.name}
                                            </div>
                                            <p className="text-xs text-muted-foreground">{player.country || 'Mundo'}</p>
                                        </div>
                                    </div>
                                    <motion.span 
                                        className="text-md md:text-lg font-semibold text-primary"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.15 * index }}
                                    >
                                        {player.points} Pts
                                    </motion.span>
                                </NeumorphicCard>
                            </motion.li>
                        );
                    })}
                </motion.ul>
            </NeumorphicCard>
        </motion.div>
      );
    };

    export default Ranking;
  