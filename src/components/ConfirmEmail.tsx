import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

const ConfirmEmail: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const hasConfirmed = useRef(false);

  useEffect(() => {
    if (hasConfirmed.current) return;
    hasConfirmed.current = true;

    const confirmEmail = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/users/confirm/${token}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Confirmation failed');
        }

        setStatus('success');
        setMessage('Your email has been confirmed. Try to login.');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'An error occurred. Please try again.');
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div className="min-h-screen grid place-items-center bg-white">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-md text-center">
        {status === 'loading' && <p className="text-gray-600">Confirming your email...</p>}
        {status === 'success' && (
          <>
            <h1 className="text-2xl font-bold text-green-500 mb-4">Success!</h1>
            <p className="text-gray-700 mb-6">{message}</p>
            <Link to="/login" className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600">
              Go to Login
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-gray-700 mb-6">{message}</p>
            <Link to="/signup" className="bg-gray-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-600">
              Back to Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;