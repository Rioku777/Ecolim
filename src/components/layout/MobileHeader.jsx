
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Sprout, Menu, X } from 'lucide-react';
    import { motion } from 'framer-motion';
    import NeumorphicButton from '@/components/NeumorphicButton';

    const MobileHeader = ({ onToggleMenu, isMenuOpen }) => {
      return (
        <motion.header
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 15 }}
          className="md:hidden p-4 shadow-neumorphic-convex flex justify-between items-center sticky top-0 z-50 bg-background"
        >
          <Link to="/" className="flex items-center text-xl font-bold text-primary">
            <Sprout className="h-7 w-7 mr-2 text-brand-green" />
            Ecolim
          </Link>
          <NeumorphicButton onClick={onToggleMenu} variant="ghost" size="icon" className="p-2">
            {isMenuOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
          </NeumorphicButton>
        </motion.header>
      );
    };

    export default MobileHeader;
  