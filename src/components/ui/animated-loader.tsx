import { motion } from 'framer-motion';

export default function AnimatedLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center">
        <motion.div
          className="relative mb-8"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin" />
        </motion.div>
        
        <motion.h2
          className="text-2xl font-bold neon-text mb-4"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Myne7x Store
        </motion.h2>
        
        <motion.div
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading your premium experience...
        </motion.div>
      </div>
    </div>
  );
}