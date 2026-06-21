import { createContext, useState } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import UserDashboard from './pages/user/dashboard';
import NewTicket from './pages/user/newTicket';
import TktDetails from './pages/common/ticketDetails';
import AdminDashboard from './pages/admin/dashboard';
import { Toaster } from "react-hot-toast";
import NotFound from './pages/common/notFound';
import UnderProcess from './pages/common/underDevelope';
import Auth from './pages/common/auth';

export const MyContext = createContext(null);


function App() {

  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem("profile");

    if (savedProfile) {
      try {
        return JSON.parse(savedProfile);
      } catch (e) {
        console.error("Error parsing profile from localStorage", e);
      }
    }

    const defaultValue = "user";
    localStorage.setItem("profile", JSON.stringify(defaultValue));
    return defaultValue;
  });

  const route = createBrowserRouter([
    {
      path: '/',
      element: (<Navigate to={`/${profile}/dashboard`} />)
    },
    {
      path: '/auth',
      element: (<Auth />)
    },
    {
      path: '/user',
      element: (<Navigate to={'/user/dashboard'} />)
    },
    {
      path: '/user/dashboard',
      element: <UserDashboard />
    },
    {
      path: '/tickets/new',
      element: <NewTicket />
    },
    {
      path: '/tickets/:id',
      element: <TktDetails />
    },
    {
      path: '/admin',
      element: (<Navigate to={'/admin/dashboard'} />)
    },
    {
      path: '/admin/dashboard',
      element: <AdminDashboard />
    },
    {
      path: `/${profile}/analytics`,
      element: <UnderProcess />
    },
    {
      path: `/${profile}/settings`,
      element: <UnderProcess />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])

  return (
    <>
      <MyContext.Provider value={[profile, setProfile]} >
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
      </MyContext.Provider>
    </>
  )
}

export default App
