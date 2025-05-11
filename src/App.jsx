
    import React, { useState, useEffect } from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    
    import Dashboard from '@/pages/Dashboard';
    import RegisterActionPage from '@/pages/RegisterActionPage';
    import MapView from '@/pages/MapView';
    import RankingPage from '@/pages/RankingPage';
    import Rewards from '@/pages/Rewards';
    import GamificationPage from '@/pages/GamificationPage';
    import LoginPage from '@/pages/LoginPage';
    import SignUpPage from '@/pages/SignUpPage';
    import AdminPage from '@/pages/AdminPage';
    import SplashScreen from '@/components/SplashScreen';
    import Sidebar from '@/components/layout/Sidebar';
    import MobileHeader from '@/components/layout/MobileHeader';
    
    import { Toaster } from '@/components/ui/toaster';
    import { AuthProvider, useAuth } from '@/contexts/AuthContext';
    import { ThemeProvider } from '@/contexts/ThemeContext';

    function AppCore() {
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
      const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
      const { isAuthenticated, user } = useAuth();
      const [showSplash, setShowSplash] = useState(true);
      const routerLocation = useLocation(); 

      useEffect(() => {
        const splashTimer = setTimeout(() => setShowSplash(false), 4800); 
        return () => clearTimeout(splashTimer);
      }, []);

      useEffect(() => {
        const handleResize = () => {
          const mobile = window.innerWidth < 768;
          setIsMobile(mobile);
          if (!mobile) {
            setIsMobileMenuOpen(false); 
          }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);

      const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
      
      if (showSplash && !isAuthenticated) {
        return <SplashScreen onFinished={() => setShowSplash(false)} />;
      }

      return (
          <div className="flex flex-col md:flex-row min-h-screen bg-background">
            {isMobile && <MobileHeader onToggleMenu={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />}
            
            <Sidebar 
              isMobile={isMobile} 
              isMobileMenuOpen={isMobileMenuOpen} 
              toggleMobileMenu={toggleMobileMenu} 
            />

            <main className="flex-1 p-4 md:p-8 overflow-auto mt-16 md:mt-0">
             <AnimatePresence mode="wait">
                <motion.div
                  key={routerLocation.pathname} 
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                >
                <Routes>
                  <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
                  <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />} />
                  
                  <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                  <Route path="/register" element={isAuthenticated ? <RegisterActionPage /> : <Navigate to="/login" />} />
                  <Route path="/map" element={isAuthenticated ? <MapView /> : <Navigate to="/login" />} />
                  <Route path="/ranking" element={isAuthenticated ? <RankingPage /> : <Navigate to="/login" />} />
                  <Route path="/rewards" element={isAuthenticated ? <Rewards /> : <Navigate to="/login" />} />
                  <Route path="/gamification" element={isAuthenticated ? <GamificationPage /> : <Navigate to="/login" />} />
                  <Route path="/settings" element={isAuthenticated ? <div className="text-2xl font-semibold">Configuración (Próximamente)</div> : <Navigate to="/login" />} />
                  <Route path="/admin" element={isAuthenticated && user?.email === 'admin@gmail.com' ? <AdminPage /> : <Navigate to="/" />} />
                  <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
                </Routes>
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
      );
    }

    function App() {
        return (
            <Router>
                <ThemeProvider>
                    <AuthProvider>
                        <AppCore />
                        <Toaster />
                    </AuthProvider>
                </ThemeProvider>
            </Router>
        )
    }

    export default App;
  