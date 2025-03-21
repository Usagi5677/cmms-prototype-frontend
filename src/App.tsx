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
import { IncompleteTasks } from "./pages/IncompleteTasks/IncompleteTasks";
import { DeveloperOptions } from "./pages/DeveloperOptions";
import ViewAllDisposed from "./pages/ViewAllDisposed/ViewAllDisposed";
import { Issues } from "./pages/Issues";
import ViewAssignments from "./pages/ViewAssignments/ViewAssignments";
import ViewAllPeriodicMaintenances from "./pages/ViewAllPeriodicMaintenances/ViewAllPeriodicMaintenances";
import ViewAllUtilization from "./pages/ViewAllUtilization/ViewAllUtilization";
import PeriodicMaintenancesCalendarView from "./pages/PeriodicMaintenancesCalendarView/PeriodicMaintenancesCalendarView";
import NotFound from "./components/common/NotFound/NotFound";

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

  // New login function for local auth
  const handleLogin = (token: any) => {
    localStorage.setItem("cmms_token", token);
    me();
  };

  // Simplified logout
  const logout = () => {
    localStorage.removeItem("cmms_token");
    setUser(null);
    setLoggedOut(true);
  };

  const setPrevRoute = () => {
    const currentPath = window.location.pathname;
    const token = localStorage.getItem("cmms_token");
    if (currentPath !== "/" && !token)
      localStorage.setItem("prevRoute", currentPath);
  };

  
  useEffect(() => {
    setPrevRoute()
    if (user === null) {
      const token = localStorage.getItem("cmms_token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded) {
            me();
          } else {
            setLoggedOut(true);
            setAppLoading(false);
          }
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("cmms_token");
          setLoggedOut(true);
          setAppLoading(false);
        }
      } else {
        setLoggedOut(true);
        setAppLoading(false);
      }
    } else {
      setAppLoading(false);
    }
  }, [user, me]);

  

  if (appLoading) {
    return (
      <div style={{ padding: "40px" }}>
        <h3>Loading...</h3>
      </div>
    );
  }

  if (appLoading) {
    return (
      <div style={{ padding: "40px" }}>
        <h3>Loading...</h3>
      </div>
    );
  }
  if (!appLoading && loggedOut) {
    return <Login login={handleLogin} />;
  }
  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/incomplete-tasks" element={<IncompleteTasks />} />
            <Route path="/issues" element={<Issues />} />
            <Route
              path="/maintenances"
              element={<ViewAllPeriodicMaintenances />}
            />
            <Route
              path="/maintenances/calendar"
              element={<PeriodicMaintenancesCalendarView />}
            />
            <Route path="/utilizations" element={<ViewAllUtilization />} />
            <Route path="/machinery" element={<ViewAllMachine />} />
            <Route path="/entity/:id" element={<ViewEntity />} />
            <Route path="/vessels" element={<ViewAllVessel />} />
            <Route path="/vehicles" element={<ViewAllVehicle />} />
            <Route path="/dispose" element={<ViewAllDisposed />} />
            <Route path="/assignments" element={<ViewAssignments />} />
            <Route path="/users" element={<Users />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/developer" element={<DeveloperOptions />} />
            <Route path="/config" element={<Config />} />
            <Route path="/role/:id/permission" element={<Permissions />} />
            <Route path ='*' element={<NotFound />} />
          </Routes>
        </Layout>
      </ApolloProvider>
    </UserContext.Provider>
  );
}

export default App;
