'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import Spinner from '@/components/Spinner';
import ErrorMessage from '@/components/ErrorMessage';
import { useAuth } from '@/context/AuthContext';

const AcceptInvitePage = ({ params }: { params: { token: string } }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleAcceptInvite = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/accept-invite', {
        token: params.token,
      });
      login(response.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to accept invite. The token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Accept Invite
        </h1>
        <ErrorMessage message={error} />
        <p className="text-center text-gray-600 dark:text-gray-400">
          You have been invited to join a company. Click the button below to
          accept the invitation.
        </p>
        <div>
          <button
            onClick={handleAcceptInvite}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? <Spinner /> : 'Accept Invite'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitePage;
