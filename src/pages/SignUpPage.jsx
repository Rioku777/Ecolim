
    import React, { useState } from 'react';
    import { useNavigate, Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import NeumorphicButton from '@/components/NeumorphicButton';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { UserPlus, User, Mail, KeyRound, Globe, Sprout, Eye, EyeOff } from 'lucide-react';
    import { useAuth } from '@/contexts/AuthContext';
    import { useToast } from "@/components/ui/use-toast";
    import { cn } from '@/lib/utils';

    const SignUpPage = () => {
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [showPassword, setShowPassword] = useState(false);
        const [country, setCountry] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const navigate = useNavigate();
        const { signup } = useAuth();
        const { toast } = useToast();

        const handleSubmit = async (e) => {
            e.preventDefault();
            setIsLoading(true);

            if (password.length < 6) {
                toast({
                    title: "Contraseña Corta",
                    description: "La contraseña debe tener al menos 6 caracteres.",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000)); 

            const success = signup(name, email, password, country);

            if (success) {
                navigate('/'); 
            }
            setIsLoading(false);
        };
        
        const containerVariants = {
            hidden: { opacity: 0, scale: 0.9 },
            visible: { 
                opacity: 1, 
                scale: 1,
                transition: { 
                    duration: 0.6, 
                    ease: [0.16, 1, 0.3, 1],
                    staggerChildren: 0.08 
                } 
            }
        };
        
        const itemVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
        };
        
        const logoVariants = {
            initial: { y: -50, opacity: 0, scale: 0.5, rotate: 10 },
            animate: { 
                y: 0, 
                opacity: 1, 
                scale: 1, 
                rotate: 0, 
                transition: { type: "spring", stiffness: 100, damping: 10, delay: 0.2 } 
            }
        };

        return (
             <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted to-background dark:from-background dark:via-slate-800 dark:to-background">
                <motion.div 
                    className="w-full max-w-lg p-8 md:p-10 rounded-neumorphic shadow-neumorphic-convex bg-background overflow-hidden relative"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div 
                        variants={logoVariants}
                        initial="initial"
                        animate="animate"
                        className="text-center mb-8"
                    >
                        <UserPlus className="h-20 w-20 text-primary mx-auto drop-shadow-lg" />
                        <h1 className="text-4xl font-bold text-primary mt-3">Únete a Ecolim</h1>
                        <p className="text-muted-foreground">Crea tu cuenta y empieza a sumar.</p>
                    </motion.div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Nombre Completo</Label>
                                <div className="relative">
                                     <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="name" type="text" placeholder="Tu Nombre" value={name}
                                        onChange={(e) => setName(e.target.value)} required className="pl-10 text-base py-3"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="country" className="block text-sm font-medium text-foreground mb-1.5">País</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="country" type="text" placeholder="Ej: Nicaragua" value={country}
                                        onChange={(e) => setCountry(e.target.value)} required className="pl-10 text-base py-3"
                                    />
                                </div>
                            </div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Correo Electrónico</Label>
                             <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email" type="email" placeholder="tu@correo.com" value={email}
                                    onChange={(e) => setEmail(e.target.value)} required className="pl-10 text-base py-3"
                                />
                            </div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">Contraseña</Label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="password" type={showPassword ? "text" : "password"} placeholder="Mínimo 6 caracteres" value={password}
                                    onChange={(e) => setPassword(e.target.value)} required className="pl-10 pr-10 text-base py-3"
                                />
                                 <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} 
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                                </button>
                            </div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <NeumorphicButton
                                type="submit" disabled={isLoading}
                                className={cn(
                                    "w-full text-md py-3 font-semibold tracking-wide transform hover:scale-105 active:scale-95 transition-transform",
                                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                                )}
                                variant="primary"
                            >
                                {isLoading ? 'Creando Cuenta...' : 'Registrarse'}
                            </NeumorphicButton>
                        </motion.div>
                    </form>
                    <motion.p variants={itemVariants} className="text-center text-sm text-muted-foreground mt-8">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
                            Inicia sesión aquí
                        </Link>
                    </motion.p>
                     <motion.div 
                        className="absolute -bottom-16 -right-16 w-40 h-40 bg-primary/10 rounded-full -z-10 opacity-50 dark:opacity-20"
                        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.6, 0.5] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                        className="absolute -top-20 -left-20 w-48 h-48 bg-secondary/10 rounded-full -z-10 opacity-50 dark:opacity-20"
                        animate={{ rotate: -360, scale: [1, 0.95, 1] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                </motion.div>
            </div>
        );
    };

    export default SignUpPage;
  