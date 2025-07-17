import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Oops! Something went wrong
        </h1>
        <div className="mb-4">
          <p className="text-gray-600">
            {error?.message || 'An unexpected error occurred.'}
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;