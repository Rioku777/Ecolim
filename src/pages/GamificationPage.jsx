
    import React, { useState, useEffect } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import NeumorphicCard from '@/components/NeumorphicCard';
    import NeumorphicButton from '@/components/NeumorphicButton';
    import { Puzzle, BrainCircuit, Zap, Leaf, CheckCircle, XCircle, MousePointerClick, Award, Gamepad2, BarChart3, ListOrdered } from 'lucide-react';
    import { useToast } from "@/components/ui/use-toast";
    import { useAuth } from '@/contexts/AuthContext';
    import useLocalStorage from '@/hooks/useLocalStorage';

    const triviaQuestions = [
        { question: "¿Cuál es el principal gas de efecto invernadero?", options: ["Oxígeno", "Nitrógeno", "Dióxido de Carbono", "Hidrógeno"], answer: "Dióxido de Carbono", points: 10 },
        { question: "¿Qué significa reciclar?", options: ["Quemar basura", "Enterrar basura", "Convertir desechos en nuevos productos", "Tirar menos basura"], answer: "Convertir desechos en nuevos productos", points: 10 },
        { question: "Un ejemplo de energía renovable es:", options: ["Carbón", "Petróleo", "Energía Solar", "Gas Natural"], answer: "Energía Solar", points: 15 },
        { question: "¿Qué color de contenedor se usa generalmente para el papel?", options: ["Verde", "Amarillo", "Azul", "Rojo"], answer: "Azul", points: 5 },
    ];

    const TriviaGame = ({ onGameEnd }) => {
        const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
        const [score, setScore] = useState(0);
        const [selectedOption, setSelectedOption] = useState(null);
        const [showFeedback, setShowFeedback] = useState(false);
        const { toast } = useToast();

        const currentQuestion = triviaQuestions[currentQuestionIndex];

        const handleOptionClick = (option) => {
            if (showFeedback) return;
            setSelectedOption(option);
            setShowFeedback(true);
            let questionScore = 0;
            if (option === currentQuestion.answer) {
                questionScore = currentQuestion.points;
                setScore(prev => prev + questionScore);
                toast({ title: "¡Correcto!", description: `+${questionScore} puntos.`, className: "bg-green-500 dark:bg-green-700 text-white" });
            } else {
                toast({ title: "Incorrecto", description: `La respuesta era: ${currentQuestion.answer}`, variant: "destructive" });
            }

            setTimeout(() => {
                setShowFeedback(false);
                setSelectedOption(null);
                if (currentQuestionIndex < triviaQuestions.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                } else {
                    onGameEnd(score + questionScore); 
                }
            }, 2000);
        };

        return (
            <NeumorphicCard className="p-6 md:p-8 w-full max-w-lg mx-auto">
                <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} key={currentQuestionIndex}>
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4 text-center">Pregunta {currentQuestionIndex + 1}/{triviaQuestions.length}</h3>
                    <p className="text-md md:text-lg text-muted-foreground mb-6 text-center min-h-[60px]">{currentQuestion.question}</p>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                            <NeumorphicButton
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                className={`w-full text-left justify-start py-3 px-4 text-sm md:text-base 
                                    ${showFeedback && option === selectedOption && option === currentQuestion.answer ? 'ring-2 ring-green-500 shadow-neumorphic-concave bg-green-500/20' : ''}
                                    ${showFeedback && option === selectedOption && option !== currentQuestion.answer ? 'ring-2 ring-red-500 shadow-neumorphic-concave bg-red-500/20' : ''}
                                    ${showFeedback && option !== selectedOption && option === currentQuestion.answer ? 'ring-2 ring-green-500' : ''}
                                `}
                                disabled={showFeedback}
                            >
                                {showFeedback && option === selectedOption && option === currentQuestion.answer && <CheckCircle className="mr-2 h-5 w-5 text-green-500"/>}
                                {showFeedback && option === selectedOption && option !== currentQuestion.answer && <XCircle className="mr-2 h-5 w-5 text-red-500"/>}
                                {option}
                            </NeumorphicButton>
                        ))}
                    </div>
                    <p className="text-sm text-primary font-semibold mt-6 text-center">Puntuación: {score}</p>
                </motion.div>
            </NeumorphicCard>
        );
    };

    const EcoClickerGame = ({ onGameEnd, user }) => {
        const [clicks, setClicks] = useState(0);
        const [timeLeft, setTimeLeft] = useState(15); 
        const [gameStarted, setGameStarted] = useState(false);
        const [highScores, setHighScores] = useLocalStorage('ecoClickerHighScores', []);
        const { toast } = useToast();

        useEffect(() => {
            if (!gameStarted || timeLeft === 0) return;
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }, [timeLeft, gameStarted]);

        useEffect(() => {
            if (timeLeft === 0 && gameStarted) {
                onGameEnd(clicks); 
                toast({title: "¡Tiempo!", description: `Hiciste ${clicks} clicks. Ganaste ${clicks} puntos.`, className: "bg-primary text-primary-foreground"});
                
                const newScoreEntry = { name: user?.name || 'Anónimo', score: clicks, date: new Date().toISOString() };
                const updatedHighScores = [...highScores, newScoreEntry]
                    .sort((a,b) => b.score - a.score)
                    .slice(0,10); // Keep top 10
                setHighScores(updatedHighScores);
            }
        }, [timeLeft, gameStarted, clicks, onGameEnd, toast, user, highScores, setHighScores]);

        const handleClick = () => {
            if (!gameStarted || timeLeft === 0) return;
            setClicks(prev => prev + 1);
        };

        if (!gameStarted) {
            return (
                 <NeumorphicCard className="p-6 md:p-8 w-full max-w-md mx-auto text-center">
                    <Leaf className="h-20 w-20 text-primary mx-auto mb-4 animate-pulse-soft" />
                    <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">EcoClicker Challenge</h3>
                    <p className="text-muted-foreground mb-6">¡Haz click en la hoja lo más rápido que puedas durante 15 segundos!</p>
                    <NeumorphicButton variant="primary" onClick={() => setGameStarted(true)}>Comenzar Juego</NeumorphicButton>
                 </NeumorphicCard>
            )
        }
        
        const leafSize = 60 + Math.min(clicks * 2, 100);

        return (
             <NeumorphicCard className="p-6 md:p-8 w-full max-w-md mx-auto text-center">
                <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">EcoClicker</h3>
                <p className="text-lg text-primary mb-1">Tiempo: {timeLeft}s</p>
                <p className="text-lg text-secondary mb-6">Clicks: {clicks}</p>
                <motion.div 
                    className="my-6 flex justify-center items-center min-h-[180px]"
                    onClick={handleClick}
                    whileTap={{ scale: 0.9 }}
                >
                    <Leaf 
                        className="text-green-500 cursor-pointer drop-shadow-lg" 
                        style={{ width: leafSize, height: leafSize }}
                        />
                </motion.div>
                {timeLeft === 0 && <p className="text-lg font-semibold text-green-600">¡Juego Terminado! Ganaste {clicks} puntos.</p>}
             </NeumorphicCard>
        )
    };
    
    const EcoClickerHighScores = () => {
        const [highScores] = useLocalStorage('ecoClickerHighScores', []);
        if (!highScores || highScores.length === 0) {
            return <p className="text-muted-foreground text-center mt-4">Aún no hay récords. ¡Sé el primero!</p>;
        }
        return (
            <NeumorphicCard className="p-4 md:p-6 mt-6">
                <h3 className="text-lg font-semibold text-primary mb-3 flex items-center"><ListOrdered className="mr-2 h-5 w-5"/>Mejores Puntuaciones - EcoClicker</h3>
                <ul className="space-y-2">
                    {highScores.map((entry, index) => (
                        <li key={index} className="flex justify-between items-center text-sm p-2 rounded-neumorphic-sm hover:bg-accent/50">
                            <span className="font-medium text-foreground">{index + 1}. {entry.name}</span>
                            <span className="text-primary font-semibold">{entry.score} clicks</span>
                        </li>
                    ))}
                </ul>
            </NeumorphicCard>
        );
    };

    const gameComponents = {
        'Trivia Ambiental': TriviaGame,
        'EcoClicker': EcoClickerGame,
    };
    
    const initialGameData = [
        { id: 1, title: 'Trivia Ambiental', icon: <BrainCircuit className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />, description: 'Pon a prueba tus conocimientos.', status: 'Disponible', pointsAwarded: 0 },
        { id: 2, title: 'EcoClicker', icon: <MousePointerClick className="h-8 w-8 md:h-10 md:w-10 text-teal-500" />, description: '¡Haz click rápido para ganar puntos!', status: 'Disponible', pointsAwarded: 0, showHighScores: true },
        { id: 3, title: 'Puzzle del Bosque', icon: <Puzzle className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />, description: 'Completa imágenes de paisajes.', status: 'Próximamente', pointsAwarded: 0 },
        { id: 4, title: 'Reto de Siembra', icon: <Zap className="h-8 w-8 md:h-10 md:w-10 text-yellow-500" />, description: 'Planta árboles virtuales rápido.', status: 'Próximamente', pointsAwarded: 0 },
    ];


    const GamificationPage = () => {
        const [activeGame, setActiveGame] = useState(null);
        const [gameData, setGameData] = useState(initialGameData);
        const { user } = useAuth();
        const { toast } = useToast();

        const handleGameEnd = (pointsEarned) => {
            toast({
                title: "¡Juego Completado!",
                description: `Has ganado ${pointsEarned} puntos.`,
                action: <Award className="text-yellow-400" />,
            });
            
            setGameData(prevData => prevData.map(game => 
                game.title === activeGame ? { ...game, pointsAwarded: game.pointsAwarded + pointsEarned } : game
            ));
            
            if (user) {
                const currentTotalPoints = parseInt(localStorage.getItem(`totalPoints_${user.id}`) || '0', 10);
                const newTotalPoints = currentTotalPoints + pointsEarned;
                localStorage.setItem(`totalPoints_${user.id}`, newTotalPoints.toString());
            }
            setActiveGame(null);
        };
        
        const GameComponent = activeGame ? gameComponents[activeGame] : null;

        const cardVariants = {
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.1 } }
        };
        const itemVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 130 }}
        };

        if (activeGame && GameComponent) {
            return (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                    <NeumorphicButton onClick={() => setActiveGame(null)} className="mb-6">
                        &larr; Volver a Juegos
                    </NeumorphicButton>
                    <GameComponent onGameEnd={handleGameEnd} user={user} />
                    {activeGame === 'EcoClicker' && <EcoClickerHighScores />}
                </motion.div>
            );
        }

        return (
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="max-w-4xl mx-auto"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-4 md:mb-8">
                    <Gamepad2 className="inline-block mr-3 h-8 w-8" />
                    Zona de Juegos Eco
                </h1>
                <p className="text-md md:text-lg text-center text-muted-foreground mb-6 md:mb-10">¡Diviértete, aprende y gana puntos extra!</p>

                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8"
                    variants={cardVariants}
                >
                    {gameData.map((game) => (
                        <motion.div key={game.id} variants={itemVariants}>
                            <NeumorphicCard className="flex flex-col items-center text-center h-full p-5 md:p-7 hover:shadow-neumorphic-convex-hover transition-all duration-300">
                                <motion.div 
                                    className="mb-4 md:mb-5 p-3 md:p-4 rounded-full bg-background shadow-neumorphic-convex inline-block"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    {game.icon}
                                </motion.div>
                                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">{game.title}</h2>
                                <p className="text-sm md:text-base text-muted-foreground mb-4 flex-grow">{game.description}</p>
                                {game.pointsAwarded > 0 && <p className="text-xs text-green-600 mb-2">Ya ganaste: {game.pointsAwarded} pts</p>}
                                <NeumorphicButton 
                                    variant={game.status === 'Disponible' ? 'primary' : 'secondary'} 
                                    className="w-full mt-auto text-base py-2.5 md:py-3"
                                    disabled={game.status !== 'Disponible'}
                                    onClick={() => game.status === 'Disponible' && setActiveGame(game.title)}
                                >
                                    {game.status === 'Disponible' ? 'Jugar Ahora' : 'Próximamente'}
                                </NeumorphicButton>
                                {game.showHighScores && game.status === 'Disponible' && (
                                    <NeumorphicButton 
                                        variant="ghost" 
                                        className="w-full mt-2 text-xs py-1.5"
                                        onClick={() => setActiveGame(game.title)} // Will show high scores below game
                                    >
                                        <BarChart3 className="mr-1 h-3 w-3"/> Ver Récords
                                    </NeumorphicButton>
                                )}
                            </NeumorphicCard>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        );
    };

    export default GamificationPage;
  