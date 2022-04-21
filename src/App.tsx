import Layout from "./hoc/Layout/Layout";
import "./index.css";
import ViewAllMachine from "./pages/Machine/ViewAllMachine/ViewAllMachine";
import ViewMachine from "./pages/Machine/ViewMachine";
import Vessels from "./pages/Vessels/Vessels";
import Vehicles from "./pages/Vehicles/Vehicles";
import Division from "./pages/Division/Division";
import Breakdown from "./pages/Breakdown/Breakdown";
import Service from "./pages/Service/Service";
import Reports from "./pages/Reports/Reports";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import qs from "qs";
import UserContext from "./contexts/UserContext";
import { ApolloProvider, useLazyQuery } from "@apollo/client";
import { apolloClient } from "./api/client";
import { ME_QUERY } from "./api/queries";
import { message } from "antd";
import jwtDecode from "jwt-decode";

function App() {
  {
    const token = localStorage.getItem("cmms_token");
    if (token) {
      const prevRoute = localStorage.getItem("prevRoute");
      if (prevRoute) {
        localStorage.removeItem("prevRoute");
        window.location.pathname = prevRoute;
      }
    }
  }

  const [appLoading, setAppLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loggedOut, setLoggedOut] = useState(false);

  const [me] = useLazyQuery(ME_QUERY, {
    client: apolloClient,
    onCompleted: (data) => {
      setUser({
        ...data.me,
      });
      setAppLoading(false);
      setLoggedOut(false);
    },
    onError: (error) => {
      localStorage.removeItem("cmms_token");
      setLoggedOut(true);
      setAppLoading(false);

      if (error.message === "Unauthorized") {
        message.error("Not authorized to access this app.");
      } else {
        message.error("An error occurred while logging in.");
      }
    },
  });

  const redirect = () => {
    window.location.href = `https://id.mtcc.com.mv/?returnUrl=${process.env.REACT_APP_RETURN_URL}&type=employee&appId=${process.env.REACT_APP_APP_ID}`;
  };

  const logoutRedirect = () => {
    setPrevRoute();
    window.location.href = `https://id.mtcc.com.mv/logout/?returnUrl=${process.env.REACT_APP_RETURN_URL}&type=employee&appId=${process.env.REACT_APP_APP_ID}`;
  };

  const setPrevRoute = () => {
    const currentPath = window.location.pathname;
    const token = localStorage.getItem("cmms_token");
    if (currentPath !== "/" && !token)
      localStorage.setItem("prevRoute", currentPath);
  };

  interface SSOToken {
    id: number;
    type: string;
    iat: number;
    exp: number;
  }

  useEffect(() => {
    const setLogOutStates = () => {
      setPrevRoute();
      setLoggedOut(true);
      setAppLoading(false);
    };
    if (user === null) {
      const token = localStorage.getItem("cmms_token");
      if (token) {
        const decoded = jwtDecode<SSOToken>(token);
        if (decoded.id) {
          me();
        } else {
          setLogOutStates();
        }
      } else {
        if (window.location) {
          const tkn = qs.parse(window.location.search, {
            ignoreQueryPrefix: true,
          }).token as string;
          if (tkn) {
            localStorage.setItem("cmms_token", `${tkn}`);
            const decoded = jwtDecode<SSOToken>(tkn);
            if (decoded.id) {
              me();
            } else {
              setLogOutStates();
            }
          } else {
            setLogOutStates();
          }
        } else {
          setLogOutStates();
        }
      }
    } else {
      setAppLoading(false);
    }
  }, [user, me]);

  const logout = () => {
    localStorage.removeItem("cmms_token");
    logoutRedirect();
  };

  if (appLoading) {
    return (
      <div style={{ padding: "40px" }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  if (!appLoading && loggedOut) {
    return <Login login={redirect} />;
  }
  
  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/machinery" element={<ViewAllMachine />} />
            <Route path="/machine/:id" element={<ViewMachine />} />
            <Route path="/vessels" element={<Vessels />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/division" element={<Division />} />
            <Route path="/breakdown" element={<Breakdown />} />
            <Route path="/service" element={<Service />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Layout>
      </ApolloProvider>
    </UserContext.Provider>
  );
}

export default App;
