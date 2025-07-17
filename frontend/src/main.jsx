import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './utils/errorHandler'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 1000,
    },
  },
});

// Add error handling
const root = ReactDOM.createRoot(document.getElementById('root'));

// Add loading state
root.render(
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

try {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Toaster richColors />
          <App />
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </QueryClientProvider>
      </Provider>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  root.render(
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
        <p className="mt-2 text-gray-600">Please refresh the page</p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-4 text-left text-sm text-red-500">{error.message}</pre>
        )}
      </div>
    </div>
  );
}
