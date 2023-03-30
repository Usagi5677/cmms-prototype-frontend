import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { GET_ENTITY_TYPE_COUNT } from "../../../api/queries";
import { useLazyQuery } from "@apollo/client";
import { errorMessage } from "../../../helpers/gql";
import { memo, useEffect } from "react";
import classes from "./EntityTypePieChart.module.css";
import { motion } from "framer-motion";
import { Spin } from "antd";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/offline-exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);
require("highcharts/modules/drilldown")(Highcharts);

const EntityTypePieChart = () => {
  const [getEntityTypeCount, { data: entityData, loading }] = useLazyQuery(
    GET_ENTITY_TYPE_COUNT,
    {
      onError: (err) => {
        errorMessage(err, "Error loading user count.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );
  useEffect(() => {
    getEntityTypeCount();
  }, [getEntityTypeCount]);

  let machine = 0;
  let vehicle = 0;
  let vessel = 0;
  let subEntity = 0;
  let options;
  const entityTypeCountData = entityData?.getEntityTypeCount;
  if (entityTypeCountData) {
    machine = entityTypeCountData?.machine;
    vehicle = entityTypeCountData?.vehicle;
    vessel = entityTypeCountData?.vessel;
    subEntity = entityTypeCountData?.subEntity;

    options = {
      chart: {
        type: "pie",
      },
      title: {
        text: "Type",
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
            "#A1D2CE",
            "#78CAD2",
            "#62A8AC",
            "#5497A7",
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
          name: "Entity Type",
          colorByPoint: true,
          data: [
            {
              name: "Machine",
              y: machine,
            },
            {
              name: "Vehicle",
              y: vehicle,
            },
            {
              name: "Vessel",
              y: vessel,
            },
            {
              name: "Sub Entity",
              y: subEntity,
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
          duration: 0.3,
        },
      }}
      viewport={{ once: true }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin style={{ marginTop: 140, marginBottom: 140 }} size={"large"} />
        </div>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </motion.div>
  );
};

export default memo(EntityTypePieChart);
