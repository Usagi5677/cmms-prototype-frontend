import Layout from "./hoc/Layout/Layout";
import ViewAllMachine from "./pages/Machine/ViewAllMachine/ViewAllMachine";
import ViewAllVessel from "./pages/Transportation/ViewAllVessel/ViewAllVessel";
import ViewAllVehicle from "./pages/Transportation/ViewAllVehicle/ViewAllVehicle";
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
import Roles from "./pages/Role/Roles";
import Users from "./pages/Users/Users";
import { Templates } from "./pages/Templates";
import Permissions from "./pages/Role/Permissions";
import { Config } from "./pages/Config";
import ViewEntity from "./pages/Entity/ViewEntity/ViewEntity";
import "./components/ThemeChange/antd.dark.min.css";
import { IncompleteTasks } from "./pages/IncompleteTasks";
import { Assignments } from "./pages/Assignments";
import { DeveloperOptions } from "./pages/DeveloperOptions";

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

  if (localStorage.getItem("themeMode")) {
    document.documentElement.setAttribute(
      "data-theme",
      localStorage.getItem("themeMode")?.replace(/['"]+/g, "")!
    );
  }

  const [me] = useLazyQuery(ME_QUERY, {
    client: apolloClient,
    onCompleted: (data) => {
      const roles = data.me.roles;
      let permissions = [];
      // Get all permissions from all roles of user
      for (const role of roles) {
        if (role.role?.permissionRoles) {
          const rolePermissions = role.role.permissionRoles.map(
            (pr: any) => pr.permission
          );
          permissions.push(...rolePermissions);
        }
      }
      // Remove duplicates
      permissions = [...new Set(permissions)];
      const assignments = data.me.entityAssignment;
      const machineAssignments = assignments.filter(
        (a: any) => a.entity.type?.entityType === "Machine"
      );
      const vesselAssignments = assignments.filter(
        (a: any) => a.entity.type?.entityType === "Vessel"
      );
      const vehicleAssignments = assignments.filter(
        (a: any) => a.entity.type?.entityType === "Vehicle"
      );
      setUser({
        ...data.me,
        permissions,
        machineAssignments,
        vesselAssignments,
        vehicleAssignments,
      });
      setAppLoading(false);
      setLoggedOut(false);
    },
    onError: (error) => {
      localStorage.removeItem("cmms_token");
      localStorage.setItem("logOutClicked", "true");
      setLoggedOut(true);
      setAppLoading(false);
      if (error.message === "Unauthorized") {
        message.error("Not authorized to access this app.");
      } else {
        message.error("An error occurred while logging in.");
      }
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });

  const redirect = () => {
    localStorage.setItem("logOutClicked", "false");
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
    localStorage.setItem("logOutClicked", "true");
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
    if (localStorage.getItem("logOutClicked") === "true") {
      return <Login login={redirect} />;
    }
    redirect();
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/incomplete-tasks" element={<IncompleteTasks />} />
            <Route path="/machinery" element={<ViewAllMachine />} />
            <Route path="/entity/:id" element={<ViewEntity />} />
            <Route path="/vessels" element={<ViewAllVessel />} />
            <Route path="/vehicles" element={<ViewAllVehicle />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/users" element={<Users />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/developer" element={<DeveloperOptions />} />
            <Route path="/config" element={<Config />} />
            <Route path="/role/:id/permission" element={<Permissions />} />
          </Routes>
        </Layout>
      </ApolloProvider>
    </UserContext.Provider>
  );
}

export default App;
