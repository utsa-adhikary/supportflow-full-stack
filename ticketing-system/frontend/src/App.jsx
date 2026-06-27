import { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import Dashboard from './pages/common/dashboard';
import NewTicket from './pages/user/newTicket';
import TktDetails from './pages/common/ticketDetails';
import { Toaster } from "react-hot-toast";
import NotFound from './pages/common/notFound';
import UnderProcess from './pages/common/underDevelope';
import Auth from './pages/common/auth';
import fetchApi from './lib/api';
import { useNavigate } from 'react-router-dom';
import Profile from './pages/common/Profile';

export const ProfileContext = createContext(null);

function ProtectedRoutes({ child }) {
  const { profile } = useContext(ProfileContext);

  if (!profile) {
    return <Navigate to="/auth" replace />;
  } else {
    return child;
  }
}

function PublicRoutes({ child }) {
  const { profile } = useContext(ProfileContext);

  if (profile) {
    return <Navigate to="/dashboard" replace />
  } else {
    return child;
  }
}

function CustomerOnlyRoutes({ child }) {
  const { profile } = useContext(ProfileContext);

  if (!profile) {
    return <Navigate to="/auth" replace />;
  } else {
    if (profile.role !== "customer") {
      return <Navigate to="/*" replace />
    } else {
      return child;
    }
  }
}

const route = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '/auth',
    element: <PublicRoutes child={<Auth />} />
  },
  {
    path: '/dashboard',
    element: <ProtectedRoutes child={<Dashboard />} />
  },
  {
    path: '/profile',
    element: <ProtectedRoutes child={<Profile />} />
  },
  {
    path: '/tickets/new',
    element: <CustomerOnlyRoutes child={<NewTicket />} />
  },
  {
    path: '/tickets/:id',
    element: <ProtectedRoutes child={<TktDetails />} />
  },
  {
    path: "/analytics",
    element: <ProtectedRoutes child={<UnderProcess />} />
  },
  {
    path: "/settings",
    element: <ProtectedRoutes child={<UnderProcess />} />
  },
  {
    path: '*',
    element: <ProtectedRoutes child={<NotFound />} />
  }
])

function App() {

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      try {
        const data = await fetchApi("/api/auth/me");
        setProfile(data.user);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-indigo-600 font-semibold">Loading...</div>
      </div>
    );
  }


  return (
    <>
      <ProfileContext.Provider value={{ profile, setProfile }} >
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              style: {
                background: "#ECFDF5",
                color: "#166534",
                border: "1px solid #86EFAC",
              },
              iconTheme: {
                primary: "#22C55E",
                secondary: "#fff",
              },
            },

            error: {
              style: {
                background: "#FEF2F2",
                color: "#991B1B",
                border: "1px solid #FCA5A5",
              },
              iconTheme: {
                primary: "#EF4444",
                secondary: "#fff",
              },
            },
          }}
        />
        <RouterProvider router={route} />
      </ProfileContext.Provider>
    </>
  )
}

export default App
