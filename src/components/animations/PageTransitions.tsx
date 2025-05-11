import React, { useState, useEffect } from 'react';
import '/transitions.css';

interface PageTransitionProps {
  children: React.ReactNode;
  onTransitionComplete: () => void;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, onTransitionComplete }) => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [throwBone, setThrowBone] = useState(false);
  const [chaseBone, setChaseBone] = useState(false);

  useEffect(() => {
    const timeline = async () => {
      // Start bone throw animation
      setThrowBone(true);
      
      // Start dog chase animation after a small delay
      await new Promise(resolve => setTimeout(resolve, 200));
      setChaseBone(true);
      
      // Wait for animations to complete
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowOverlay(false);
      
      // Notify parent component
      onTransitionComplete();
    };

    timeline();
  }, [onTransitionComplete]);

  if (!showOverlay) return <>{children}</>;

  return (
    <>
      <div className="transition-overlay">
        <div className={`bone ${throwBone ? 'throw-bone' : ''}`} />
        <div className={`dog ${chaseBone ? 'chase-bone' : ''}`} />
      </div>
      {children}
    </>
  );
}

export default PageTransition;
