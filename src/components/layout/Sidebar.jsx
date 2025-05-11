
    import React from 'react';
    import { Link, NavLink } from 'react-router-dom';
    import { Home, MapPin, Sprout, Trophy, Users, Settings, LogOut, Gamepad2, Shield, Sun, Moon, UserPlus, LogIn } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { cn } from '@/lib/utils';
    import { buttonVariants } from '@/components/ui/button';
    import { useAuth } from '@/contexts/AuthContext';
    import { useTheme } from '@/contexts/ThemeContext';
    import NeumorphicButton from '@/components/NeumorphicButton';

    const navItemVariants = {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 12 } },
    };

    const NavItem = ({ to, icon: Icon, label, onClick, requiresAuth = true, adminOnly = false, user, isAuthenticated, isMobile, toggleMobileMenu }) => {
      if (requiresAuth && !isAuthenticated) return null;
      if (adminOnly && (!user || user.email !== 'admin@gmail.com')) return null;

      return (
        <motion.li variants={navItemVariants}>
          <NavLink
            to={to}
            onClick={() => {
              if (isMobile) toggleMobileMenu();
              if (onClick) onClick();
            }}
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: 'ghost' }),
                'w-full justify-start items-center text-lg neumorphic-button-flat transition-all duration-300 ease-in-out transform hover:scale-105',
                isActive
                  ? 'bg-accent text-accent-foreground shadow-neumorphic-concave'
                  : 'hover:bg-accent/50 hover:shadow-neumorphic-convex text-foreground/80',
                'rounded-neumorphic px-4 py-3 my-1'
              )
            }
          >
            <Icon className="mr-3 h-5 w-5" />
            {label}
          </NavLink>
        </motion.li>
      );
    };

    const SidebarContent = ({ isMobile, toggleMobileMenu }) => {
      const { isAuthenticated, user, logout } = useAuth();
      const { theme, toggleTheme } = useTheme();

      const handleLogout = () => {
        logout();
        if (isMobile) toggleMobileMenu();
      };
      
      const commonNavProps = { user, isAuthenticated, isMobile, toggleMobileMenu };

      return (
        <>
          <div className="flex-grow overflow-y-auto pr-2">
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "circOut" }}
              className="mb-6 md:mb-10 text-center"
            >
              <Link to="/" className="flex items-center justify-center text-2xl md:text-3xl font-bold text-primary transition-transform hover:scale-105" onClick={isMobile ? toggleMobileMenu : undefined}>
                <motion.div initial={{ rotate: -15 }} animate={{ rotate: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 10, delay: 0.5 }}>
                  <Sprout className="h-8 w-8 md:h-10 md:w-10 mr-2 text-brand-green" />
                </motion.div>
                Ecolim
              </Link>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Ecología Sin Límites</p>
            </motion.div>

            <motion.ul
              className="space-y-1 md:space-y-2"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } } }}
            >
              {isAuthenticated ? (
                <>
                  <NavItem to="/" icon={Home} label="Panel" {...commonNavProps} />
                  <NavItem to="/register" icon={MapPin} label="Registrar Acción" {...commonNavProps} />
                  <NavItem to="/map" icon={Sprout} label="Mapa Verde" {...commonNavProps} />
                  <NavItem to="/ranking" icon={Trophy} label="Clasificación" {...commonNavProps} />
                  <NavItem to="/gamification" icon={Gamepad2} label="Minijuegos" {...commonNavProps} />
                  <NavItem to="/rewards" icon={Users} label="Recompensas" {...commonNavProps} />
                  <NavItem to="/admin" icon={Shield} label="Admin" adminOnly={true} {...commonNavProps} />
                </>
              ) : (
                <>
                  <NavItem to="/login" icon={LogIn} label="Iniciar Sesión" requiresAuth={false} {...commonNavProps} />
                  <NavItem to="/signup" icon={UserPlus} label="Registrarse" requiresAuth={false} {...commonNavProps} />
                </>
              )}
            </motion.ul>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: isAuthenticated ? 1.2 : 0.8 } } }}
            className="mt-auto pt-4 border-t border-border/50"
          >
            {isAuthenticated && <NavItem to="/settings" icon={Settings} label="Configuración" {...commonNavProps} />}
            <motion.div variants={navItemVariants}>
              <NeumorphicButton
                onClick={toggleTheme}
                variant="ghost"
                className="w-full justify-start items-center text-lg neumorphic-button-flat transition-all duration-300 ease-in-out transform hover:scale-105 text-foreground/80 hover:bg-accent/50 hover:shadow-neumorphic-convex rounded-neumorphic px-4 py-3 my-1"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="mr-3 h-5 w-5" /> : <Moon className="mr-3 h-5 w-5" />}
                {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              </NeumorphicButton>
            </motion.div>
            {isAuthenticated && (
              <motion.button
                variants={navItemVariants}
                onClick={handleLogout}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'w-full justify-start items-center text-lg neumorphic-button-flat transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-destructive/10 hover:shadow-neumorphic-convex text-destructive/80 rounded-neumorphic px-4 py-3 my-1'
                )}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Cerrar Sesión
              </motion.button>
            )}
          </motion.div>
        </>
      );
    };
    
    const Sidebar = ({ isMobile, isMobileMenuOpen, toggleMobileMenu }) => {
      return (
        <>
          <AnimatePresence>
            {isMobileMenuOpen && isMobile && (
              <motion.div
                key="mobile-menu-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                onClick={toggleMobileMenu}
              />
            )}
          </AnimatePresence>

          <motion.nav
            key="sidebar"
            initial={isMobile ? { x: "-100%" } : { width: 0, opacity: 0, scaleY: 0.9 }}
            animate={
              isMobile
                ? (isMobileMenuOpen ? { x: 0 } : { x: "-100%" })
                : { width: 280, opacity: 1, scaleY: 1 }
            }
            exit={isMobile ? { x: "-100%" } : { width: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className={cn(
              "p-4 md:p-6 shadow-neumorphic-convex flex flex-col justify-between fixed md:sticky top-0 h-full z-50 bg-background",
              isMobile ? "w-3/4 max-w-xs" : "w-72"
            )}
          >
            <SidebarContent isMobile={isMobile} toggleMobileMenu={toggleMobileMenu} />
          </motion.nav>
        </>
      );
    };

    export default Sidebar;
  