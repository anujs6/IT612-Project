import React from 'react';

function SignIn({ onSignIn }) {
  return (
    <button onClick={onSignIn} className="button">
      Sign in with Google
    </button>
  );
}

export default SignIn;
