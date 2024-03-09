import React from 'react';

const LoadingComponent = ({ message }) => {
  return (
    <div className="loading">
      {message || 'Loading...'}
    </div>
  );
};

export default LoadingComponent;
