import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { GET_USER_TYPE_COUNT } from "../../../api/queries";
import { useLazyQuery } from "@apollo/client";
import { errorMessage } from "../../../helpers/gql";
import { memo, useEffect } from "react";
import classes from "./UserTypePie.module.css";
import { motion } from "framer-motion";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/offline-exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);
require("highcharts/modules/drilldown")(Highcharts);

const UserTypePie = () => {
  const [getUserTypeCount, { data: userData }] = useLazyQuery(
    GET_USER_TYPE_COUNT,
    {
      onError: (err) => {
        errorMessage(err, "Error loading user count.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );
  useEffect(() => {
    getUserTypeCount();
  }, [getUserTypeCount]);

  let admin = 0;
  let engineer = 0;
  let technician = 0;
  let user = 0;
  let total = 0;
  let options;
  const userCountData = userData?.getUserTypeCount;
  if (userCountData) {
    admin = userCountData?.admin;
    engineer = userCountData?.engineer;
    technician = userCountData?.technician;
    user = userCountData?.user;
    total = userCountData?.total;

    options = {
      chart: {
        type: "pie",
      },
      title: {
        text: "Users",
        align: "left",
      },
      accessibility: {
        announceNewData: {
          enabled: true,
        },
      },
      exporting: {
        buttons: {
          contextButton: {
            menuItems: [
              "viewFullscreen",
              "separator",
              "downloadSVG",
              "separator",
              "downloadCSV",
              "downloadXLS",
            ],
          },
        },
      },
      plotOptions: {
        pie: {
          colors: [
            "var(--ant-primary-2)",
            "var(--ant-primary-4)",
            "var(--ant-primary-5)",
            "var(--ant-primary-7)",
            "var(--ant-primary-8)",
          ],
        },
        series: {
          dataLabels: {
            enabled: true,
            format:
              '<span style="color: {point.color}; stroke:{point.color}; stroke-width: 0;">{point.name}</span>',
          },
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
          '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}',
      },

      series: [
        {
          name: "Users",
          colorByPoint: true,
          data: [
            {
              name: "Admin",
              y: admin,
            },
            {
              name: "Engineer",
              y: engineer,
            },
            {
              name: "Technician",
              y: technician,
            },
            {
              name: "User",
              y: user,
            },
            {
              name: "Total",
              y: total,
            },
          ],
        },
      ],
    };
  }

  return (
    <motion.div
      className={classes["container"]}
      initial={{ x: 60, opacity: 0 }}
      whileInView={{
        x: 0,
        opacity: 1,
        transition: {
          ease: "easeOut",
          duration: 0.3,
          delay: 0.3,
        },
      }}
      viewport={{ once: true }}
    >
      <HighchartsReact highcharts={Highcharts} options={options} />
    </motion.div>
  );
};

export default memo(UserTypePie);
