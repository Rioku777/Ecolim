
    import React, { createContext, useContext, useEffect } from 'react';
    import { useToast } from "@/components/ui/use-toast";
    import useLocalStorage from '@/hooks/useLocalStorage';

    const AuthContext = createContext(null);

    export const AuthProvider = ({ children }) => {
        const [user, setUser] = useLocalStorage('ecolimUser', null);
        const [isAuthenticated, setIsAuthenticated] = useLocalStorage('ecolimIsAuthenticated', false);
        const { toast } = useToast();

        useEffect(() => {
          if (user) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }, [user, setIsAuthenticated]);


        const login = (email, password) => {
            if (email === 'admin@gmail.com' && password === '12345678') {
                const adminUser = { id: 'admin001', email: 'admin@gmail.com', name: 'Admin Ecolim', country: 'Mundo' };
                setUser(adminUser);
                setIsAuthenticated(true);
                localStorage.setItem(`totalPoints_${adminUser.id}`, localStorage.getItem(`totalPoints_${adminUser.id}`) || '1200');
                toast({ title: "Inicio de Sesión Exitoso", description: "Bienvenido, Admin!" });
                return true;
            } else if (email === 'user@ecolim.com' && password === 'password') {
                 const genericUser = { id: 'user001', email: 'user@ecolim.com', name: 'Usuario Ecolim', country: 'Nicaragua' };
                 setUser(genericUser);
                 setIsAuthenticated(true);
                 localStorage.setItem(`totalPoints_${genericUser.id}`, localStorage.getItem(`totalPoints_${genericUser.id}`) || '50');
                 toast({ title: "Inicio de Sesión Exitoso", description: `Bienvenido, ${genericUser.name}!` });
                 return true;
            }
            
            const allUsers = JSON.parse(localStorage.getItem('ecolimRegisteredUsers') || '[]');
            const foundUser = allUsers.find(u => u.email === email && u.password === password); // Insecure: only for demo
            
            if (foundUser) {
                setUser({id: foundUser.id, name: foundUser.name, email: foundUser.email, country: foundUser.country});
                setIsAuthenticated(true);
                toast({ title: "Inicio de Sesión Exitoso", description: `Bienvenido, ${foundUser.name}!` });
                return true;
            }

            toast({ title: "Error de Inicio de Sesión", description: "Credenciales incorrectas.", variant: "destructive" });
            return false;
        };

        const signup = (name, email, password, country) => {
            const allUsers = JSON.parse(localStorage.getItem('ecolimRegisteredUsers') || '[]');
            if (allUsers.some(u => u.email === email)) {
                toast({ title: "Error de Registro", description: "Este correo ya está registrado.", variant: "destructive"});
                return false;
            }

            const newUser = { id: `user_${Date.now()}`, name, email, password, country }; // Storing password for demo, VERY INSECURE
            allUsers.push(newUser);
            localStorage.setItem('ecolimRegisteredUsers', JSON.stringify(allUsers));
            
            setUser({id: newUser.id, name: newUser.name, email: newUser.email, country: newUser.country});
            setIsAuthenticated(true);
            
            localStorage.setItem(`totalPoints_${newUser.id}`, '0');
            localStorage.setItem(`treesPlantedThisMonth_${newUser.id}`, '0');
            localStorage.setItem(`monthlyGoal_${newUser.id}`, '10');

            toast({ title: "Registro Exitoso", description: `Bienvenido a Ecolim, ${name}!` });
            return true; 
        };

        const logout = () => {
            setUser(null);
            setIsAuthenticated(false);
            toast({ title: "Sesión Cerrada", description: "Has cerrado sesión exitosamente." });
        };

        return (
            <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
                {children}
            </AuthContext.Provider>
        );
    };

    export const useAuth = () => {
        const context = useContext(AuthContext);
        if (context === undefined) {
            throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
    };
  