import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobDescription from './components/jobdescription'
import Companies from './components/Companies'
import Profile from './components/sub-pages/profile'
import ProtectedRoute from './components/recruiter/ProtectedRoute'
import CompanyCreate from './components/recruiter/CompanyCreate'
import CompanySetup from './components/recruiter/CompanySetup'
import RecruiterJobs from './components/recruiter/AdminJobs'
import PostJob from './components/recruiter/PostJob'
import Applicants from './components/recruiter/Applicants'
import CompaniesTable from './components/recruiter/CompaniesTable'
import Resources from './components/Resources'
import Applyedjobs from './components/sub-pages/applyedjobs'

// Admin imports
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import LoadingSpinner from './components/minicomponents/LoadingSpinner';
import EditUser from './components/admin/EditUser';
import Industries from './components/admin/Industries';

// Lazy load admin components
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./components/admin/Dashboard'));
const AdminUsers = lazy(() => import('./components/admin/Users'));
const AdminReports = lazy(() => import('./components/admin/Reports'));
const AdminSettings = lazy(() => import('./components/admin/Settings'));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const CreateAdmin = lazy(() => import('./components/admin/CreateAdmin'));
const AdminJobsManagement = lazy(() => import('./components/admin/Jobs'));
const AdminCompaniesManagement = lazy(() => import('./components/admin/Companies'));
const AdminIndustries = lazy(() => import('./components/admin/Industries'));

import AboutUs from './components/pages/AboutUs';
import Contact from './components/pages/Contact';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import CompanyProfile from './components/company/CompanyProfile';

const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/signup',
    element: <Signup />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/jobs",
    element: <Jobs />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/jobdescription/:_id",
    element: <JobDescription />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/Companies",
    element: <Companies />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/Resources",
    element: <Resources />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/Applyedjobs",
    element: <Applyedjobs />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <ErrorBoundary />
  },
  // Recruiter Routes
  {
    path: '/recruiter',
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '',
        element: <Navigate to="jobs" replace />
      },
      {
        path: 'companies',
        element: <CompaniesTable />
      },
      {
        path: 'companies/create',
        element: <CompanyCreate />
      },
      {
        path: 'companies/:id',
        element: <CompanySetup />
      },
      {
        path: 'jobs',
        element: <RecruiterJobs />
      },
      {
        path: 'jobs/create/:id',
        element: <PostJob />
      },
      {
        path: 'jobs/create',
        element: <PostJob />
      },
      {
        path: 'jobs/:id/applicants',
        element: <Applicants />
      },
   
    ]
  },
  // Admin Routes
  {
    path: '/admin/login',
    element: <AdminLogin />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/admin',
    element: (
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" replace />
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminDashboard />
          </Suspense>
        )
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <AdminUsers />
              </Suspense>
            )
          },
          {
            path: ':id/edit',
            element: <EditUser />
          }
        ]
      },
      {
        path: 'jobs',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminJobsManagement />
          </Suspense>
        )
      },
      {
        path: 'companies',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminCompaniesManagement />
          </Suspense>
        )
      },
      {
        path: 'reports',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminReports />
          </Suspense>
        )
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminSettings />
          </Suspense>
        )
      },
      {
        path: 'create-admin',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CreateAdmin />
          </Suspense>
        )
      },
      {
        path: 'industries',
        element: <Industries />
      }
    ]
  },
  // Add these new routes
  {
    path: '/about',
    element: <AboutUs />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/contact',
    element: <Contact />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
    errorElement: <ErrorBoundary />
  },
  // Catch-all route for 404
  {
    path: '*',
    element: <ErrorBoundary />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/company/:id',
    element: <CompanyProfile />,
    errorElement: <ErrorBoundary />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
