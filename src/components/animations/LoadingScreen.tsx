import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../loading.css';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="container">
      <h1 className="title">Finding your pet...</h1>
      <div className="loader">
        <span className="icon left-paw fa fa-paw"></span>
        <span className="icon right-paw fa fa-paw"></span>
      </div>
    </div>
  );
};

export default LoadingScreen;
