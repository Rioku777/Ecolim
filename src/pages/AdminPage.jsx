
    import React from 'react';
    import { motion } from 'framer-motion';
    import NeumorphicCard from '@/components/NeumorphicCard';
    import { ShieldAlert } from 'lucide-react';
    import { useAuth } from '@/contexts/AuthContext';

    // Placeholder data - in a real app, this would come from your backend (Firebase/Supabase)
    const sampleUsersData = [
        { id: 'user1', name: 'EcoGuardián Supremo', email: 'guardian@example.com', points: 5500, trees: 500, country: 'Nicaragua', lastActivity: '2025-05-05' },
        { id: 'user2', name: 'Siembra Reina', email: 'reina@example.com', points: 4800, trees: 450, country: 'Costa Rica', lastActivity: '2025-05-04' },
        { id: 'user001', name: 'Usuario Ecolim', email: 'user@ecolim.com', points: 50, trees: 5, country: 'Nicaragua', lastActivity: '2025-05-06' },
    ];


    const AdminPage = () => {
        const { user } = useAuth();

        // Basic check, though routing should also protect this page
        if (!user || user.email !== 'admin@gmail.com') {
            return (
                <div className="text-center p-10">
                    <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-destructive">Acceso Denegado</h1>
                    <p className="text-muted-foreground">No tienes permiso para ver esta página.</p>
                </div>
            );
        }
        
        const cardVariants = {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
        };
        const itemVariants = {
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
        };


        return (
            <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="space-y-6"
            >
                <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-center text-primary">
                    Panel de Administración Ecolim
                </motion.h1>

                <motion.div variants={itemVariants}>
                    <NeumorphicCard>
                        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">Gestión de Usuarios</h2>
                        <p className="text-muted-foreground mb-4">
                            Aquí podrás ver y gestionar los datos de los usuarios. (Funcionalidad completa con backend)
                        </p>
                        <div className="overflow-x-auto rounded-neumorphic shadow-neumorphic-concave p-1">
                            <table className="min-w-full divide-y divide-border bg-background rounded-neumorphic">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Correo</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Puntos</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Árboles</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">País</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {sampleUsersData.map((u) => (
                                        <tr key={u.id} className="hover:bg-accent/30 transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">{u.name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{u.email}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{u.points}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{u.trees}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{u.country}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                                <button className="text-primary hover:text-primary/80 mr-2">Editar</button>
                                                <button className="text-destructive hover:text-destructive/80">Borrar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </NeumorphicCard>
                </motion.div>
                
                <motion.p variants={itemVariants} className="text-center text-sm text-muted-foreground">
                    Más funcionalidades de administración (moderación de contenido, estadísticas globales, etc.) se añadirán aquí.
                </motion.p>

            </motion.div>
        );
    };

    export default AdminPage;
  