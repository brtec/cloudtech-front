import React from 'react';
import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <p className="text-xl text-gray-600">Page Not Found</p>
        <p className="text-gray-500">
          The page you are looking for does not exist.
        </p>
        <Link href="/dashboard" className="inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
