import { useEffect } from 'react';
import './loading.css';

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="loading-container">
      <div className="loading-animation">
        <div className="paw-print-1">
          <div className="pad large"></div>
          <div className="pad small-1"></div>
          <div className="pad small-2"></div>
          <div className="pad small-3"></div>
          <div className="pad small-4"></div>
        </div>
        <div className="paw-print-2">
          <div className="pad large"></div>
          <div className="pad small-1"></div>
          <div className="pad small-2"></div>
          <div className="pad small-3"></div>
          <div className="pad small-4"></div>
        </div>
        <div className="paw-print-3">
          <div className="pad large"></div>
          <div className="pad small-1"></div>
          <div className="pad small-2"></div>
          <div className="pad small-3"></div>
          <div className="pad small-4"></div>
        </div>
        <div className="paw-print-4">
          <div className="pad large"></div>
          <div className="pad small-1"></div>
          <div className="pad small-2"></div>
          <div className="pad small-3"></div>
          <div className="pad small-4"></div>
        </div>
      </div>
    </div>
  );
};