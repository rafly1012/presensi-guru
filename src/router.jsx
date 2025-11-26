import { useEffect, useState } from "react";
import { createBrowserRouter, useNavigate } from "react-router-dom";

import api from "./lib/api";

import App from "./App";
import Login from "./pages/auth/login";
import Dashboard from "./pages/Dashboard";
import Guru from "./pages/Guru";
import Jabatan from "./pages/Jabatan";

const Auth = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get("/auth/admin/session");
        if (response.data.success) {
          setIsLoggedIn(true);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.log("Tidak ada sesi aktif", error.response?.data?.message);
        navigate("/login");
      }
    };

    checkSession();
  }, [navigate]);

  return <main>{isLoggedIn ? children : null}</main>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <Auth>
        <Dashboard />
      </Auth>
    ),
  },
  {
    path: "/guru",
    element: (
      <Auth>
        <Guru />
      </Auth>
    ),
  },
  {
    path: "/guru/detail/:id",
    element: (
      <Auth>
        <Guru />
      </Auth>
    ),
  },
  {
    path: "/jabatan",
    element: (
      <Auth>
        <Jabatan />
      </Auth>
    ),
  },
  {
    path: "/jabatan/detail/:id",
    element: (
      <Auth>
        <Jabatan />
      </Auth>
    ),
  },
]);
