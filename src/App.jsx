import React, { useEffect } from "react";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "./stors/useAuthStore.js";
import SignIn from "./pages/AuthPages/Signin";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Card from "./components/ui/card.jsx";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import Workshop from "./pages/Workshop";
import Services from "./pages/Services";
import Blogs from "./pages/Blogs";
import Form from "./pages/Form";

// 👇 NEW: Reviews page bundle (index toggles list/form internally)
import Reviews from "./pages/reviews";

// GuestOnlyRoute: only guests (not logged-in)
const GuestOnlyRoute = ({ children }) => {
  const { access_token } = useAuthStore();
  return !access_token ? children : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },

      // Workshops
      { path: "/workshop", element: <Workshop /> },
      { path: "/workshop/form", element: <Workshop /> },

      // Services
      { path: "/services", element: <Services /> },
      { path: "/services/form", element: <Services /> },

      // Blogs
      { path: "/blogs", element: <Blogs /> },
      { path: "/blogs/form", element: <Blogs /> },

      // Contact form
      { path: "/form", element: <Form /> },

      // Demo card page
      { path: "/card", element: <Card /> },

      // 👇 NEW: Reviews (list + form handled by ./pages/reviews/index.jsx)
      { path: "/reviews", element: <Reviews /> },
      { path: "/reviews/form", element: <Reviews /> },
    ],
  },
  {
    path: "signin",
    element: (
      <GuestOnlyRoute>
        <SignIn />
      </GuestOnlyRoute>
    ),
  },
  {
    path: "signup",
    element: (
      <GuestOnlyRoute>
        <SignUp />
      </GuestOnlyRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  const { checkSession, loadUserFromStorage, isInitialized } = useAuthStore();

  useEffect(() => {
    loadUserFromStorage();
    checkSession();
    const interval = setInterval(() => {
      checkSession();
    }, 24 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkSession, loadUserFromStorage]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }
  return <RouterProvider router={router} />;
}
