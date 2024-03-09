import React from 'react';

const ErrorComponent = ({ errorMessage }) => {
  return (
    <div className="error">
      {errorMessage || 'An error occurred. Please try again.'}
    </div>
  );
};

export default ErrorComponent;
