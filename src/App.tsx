import Layout from "./hoc/Layout/Layout";
import "./index.css";
import Machinaries from "./containers/Machinaries/Machinaries";
import Vessels from "./containers/Vessels/Vessels";
import Vehicles from "./containers/Vehicles/Vehicles";
import Location from "./containers/Location/Location";
import Division from "./containers/Division/Division";
import Breakdown from "./containers/Breakdown/Breakdown";
import Service from "./containers/Service/Service";
import Reports from "./containers/Reports/Reports";
import Login from "./containers/Login/Login";
import Dashboard from "./containers/Dashboard/Dashboard";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import qs from "qs";
import UserContext from "./contexts/UserContext";
import LoggedOut from "./components/common/LoggedOut";
import "antd/dist/antd.css";

function App() {
  return (
    <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/machinaries" element={<Machinaries />} />
            <Route path="/vessels" element={<Vessels />} />
            <Route path="/vehicles" element={<Vehicles />} />

            <Route path="/location" element={<Location />} />
            <Route path="/division" element={<Division />} />
            <Route path="/breakdown" element={<Breakdown />} />
            <Route path="/service" element={<Service />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Layout>
    </div>
  );
}

export default App;
