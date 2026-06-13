// Button Ripple Effect Component
// Shows a clear blur circle when button is pressed
import { motion } from "motion/react";

export function ButtonRippleEffect() {
  return (
    <motion.div
      className="absolute inset-0 rounded-full pointer-events-none"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 2.5, opacity: [0, 0.3, 0] }}
      transition={{
        duration: 0.4,
        ease: "easeOut"
      }}
      style={{
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)',
        filter: 'blur(8px)',
      }}
    />
  );
}


