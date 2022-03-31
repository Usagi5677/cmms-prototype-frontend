import {
  FaBoxOpen,
  FaSpinner,
  FaCheck,
  FaBan,
  FaUserAltSlash,
  FaCarCrash,
  FaCar
} from "react-icons/fa";
import StatusCard from "../../components/UI/StatusCard/StatusCard";
import classes from "./Dashboard.module.css";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import Timeline from "../../components/Timeline/Timeline";
Chart.register(...registerables);

const data = {
  labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  datasets: [
    {
      label: "Working",
      backgroundColor: "rgba(0, 183, 255, 0.2)",
      borderColor: "rgb(0, 183, 255)",
      borderWidth: 1,
      data: [3, 3, 3, 3, 3, 3, 3],
    },
    {
      label: "Idle",
      backgroundColor: "rgba(247, 173, 3, 0.2)",
      borderColor: "rgb(247, 173, 3)",
      borderWidth: 1,
      data: [6, 6, 6, 6, 6, 6, 6],
    },
    {
      label: "Breakdown",
      backgroundColor: "rgba(255, 0, 0, 0.2)",
      borderColor: "rgb(255, 0, 0)",
      borderWidth: 1,
      data: [1, 1, 1, 1, 1, 1],
    },
  ],
};

const pieData = {
  labels: ["Urgent", "High", "Medium", "Low"],
  datasets: [
    {
      backgroundColor: [
        "rgba(71, 102, 255, 0.2)",
        "rgba(0, 255, 239, 0.2)",
        "rgba(0, 102, 164, 0.2)",
        "rgba(0, 183, 235, 0.2)",
      ],
      borderColor: [
        "rgba(71, 102, 255, 1)",
        "rgba(0, 255, 239, 1)",
        "rgba(0, 102, 164, 1)",
        "rgba(0, 183, 235, 1)",
      ],
      borderWidth: 1,
      data: [1, 2, 3, 4],
    },
  ],
};

const options = {
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const Dashboard = () => {
  return (
    <div className={classes["ticket-dashboard-container"]}>
      <div
        className={classes["ticket-dashboard-container__status-card-wrapper"]}
      >
        <StatusCard
          icon={<FaCar />}
          title={"Working"}
          amount={10}
          iconBackgroundColor={"rgba(0, 183, 255, 0.2)"}
          iconColor={"rgb(0, 183, 255)"}
        />
        <StatusCard
          icon={<FaSpinner />}
          title={"Idle"}
          amount={10}
          iconBackgroundColor={"rgba(247, 173, 3, 0.2)"}
          iconColor={"rgb(247, 173, 3)"}
        />
        <StatusCard
          icon={<FaCarCrash />}
          title={"Breakdown"}
          amount={10}
          iconBackgroundColor={"rgba(255, 0, 0, 0.2)"}
          iconColor={"rgb(255, 0, 0)"}
        />
      </div>
      <div className={classes['ticket-dashboard-container__barchart_wrapper']}>
        <Bar data={data} height={400} width={600} options={options} />
      </div>    
    </div>
  );
};

export default Dashboard;
