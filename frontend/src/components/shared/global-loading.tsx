import { Loader2, PawPrint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Color palette constants for easy theming
const COLORS = {
  primary: 'text-orange-500',
  secondary: 'text-purple-400',
  accent: 'text-yellow-400',
  bgLight: 'bg-orange-50',
  bgAccent: 'bg-orange-200',
};

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <Loader2 className={`h-6 w-6 ${COLORS.primary} animate-spin`} />
  </div>
);

// Floating particle effect that's more spread out
const FloatingParticles = () => (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(12)].map((_, index) => {
      // Distribute particles in a wider circular pattern
      const angle = (index / 12) * 2 * Math.PI;
      const radius = 80 + Math.random() * 60; // Vary the distance from center
      const xPos = Math.cos(angle) * radius;
      const yPos = Math.sin(angle) * radius;
      
      // Alternate between different shapes
      const shapes = ['■', '●', '▲', '★', '♦', '❋'];
      const shape = shapes[index % shapes.length];
      
      // Alternate between different colors
      const colors = ['text-orange-400', 'text-yellow-300', 'text-purple-300', 'text-orange-300'];
      const color = colors[index % colors.length];
      
      return (
        <motion.div
          key={`particle-${index}`}
          className={`absolute ${color} font-bold text-lg`}
          style={{ 
            left: 'calc(50% + 0px)',
            top: 'calc(50% + 0px)',
          }}
          initial={{ 
            x: 0, 
            y: 0,
            opacity: 0,
          }}
          animate={{ 
            x: xPos, 
            y: yPos,
            opacity: [0, 0.7, 0.2, 0.7, 0],
            scale: [0.8, 1.2, 1.0],
            rotate: index % 2 === 0 ? [0, 180] : [180, 0],
          }}
          transition={{ 
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: index * 0.3,
            rotate: { duration: 3 + index * 0.5, repeat: Infinity }
          }}
        >
          {shape}
        </motion.div>
      );
    })}
  </div>
);

// Orbital rings around the center
const OrbitalRings = () => (
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
    {[...Array(3)].map((_, i) => {
      const size = 120 + i * 40; // Increasing sizes for each ring
      return (
        <motion.div
          key={`ring-${i}`}
          className={`absolute rounded-full border border-orange-${300 - i * 100} opacity-${40 - i * 10}`}
          style={{
            width: size,
            height: size,
            left: -size / 2,
            top: -size / 2,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }
          }}
        />
      );
    })}
  </div>
);

// The central paw loader
const PawLoader = () => (
  <div className="relative flex flex-col items-center justify-center">
    <div className='flex items-center gap-x-2'>
      <PawPrint className="w-6 h-6 text-orange-500 drop-shadow-md" />
      <span className='text-xl font-bold'>
      PetCare
      </span>
    </div>
  </div>
);

// Animated dots, spread out horizontally
const DotLoader = () => (
  <div className="flex items-center justify-center space-x-3 mt-4">
    {[0, 1, 2].map((index) => {
      // Alternate colors for visual interest
      const colors = [
        'bg-orange-500', 
        'bg-yellow-400', 
        'bg-orange-400', 
      ];
      
      return (
        <motion.div
          key={`dot-${index}`}
          className={`w-2 h-2 rounded-full ${colors[index]}`}
          animate={{ 
            y: [-6, 2, -6],
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            y: { duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 },
            opacity: { duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 },
            scale: { duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.1 }
          }}
        />
      );
    })}
  </div>
);

// Star background elements
const StarBackground = () => (
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(8)].map((_, index) => {
      // Position stars throughout the container at various distances
      const xPos = (Math.random() - 0.5) * 200;
      const yPos = (Math.random() - 0.5) * 200;
      const size = 6 + Math.random() * 6;
      
      return (
        <motion.div
          key={`star-${index}`}
          className="absolute text-yellow-300"
          style={{
            left: 'calc(50% + 0px)',
            top: 'calc(50% + 0px)',
            fontSize: `${size}px`
          }}
          initial={{ x: xPos, y: yPos, opacity: 0 }}
          animate={{
            x: xPos,
            y: yPos,
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            opacity: { duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: index * 0.4 },
            scale: { duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: index * 0.4 }
          }}
        >
          ✦
        </motion.div>
      );
    })}
  </div>
);

export const GlobalLoading = ({loadingText}: {loadingText?: string}) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background gradient elements */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-yellow-200/30 blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [-10, 10, -10],
            y: [10, -10, 10]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-orange-200/30 blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [10, -10, 10],
            y: [-10, 10, -10]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Main content container - much larger to allow for distributed elements */}
        <div className="relative w-96 h-96 flex items-center justify-center">
          {/* Orbital rings around the center */}
          <OrbitalRings />
          
          {/* Starry background */}
          <StarBackground />
          
          {/* Floating particles distributed around */}
          <FloatingParticles />
          
          {/* Center container with paw */}
          <motion.div
            className="relative flex flex-col items-center justify-center"
            animate={{ 
              y: [-3, 3, -3]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <PawLoader />
            
            <DotLoader />
            
            {loadingText && (
              <motion.p 
                className="mt-6 text-center text-orange-700 font-medium text-sm"
                animate={{ 
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {loadingText}
              </motion.p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};