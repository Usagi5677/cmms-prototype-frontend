import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { GET_ALL_ENTITY_STATUS_COUNT } from "../../../api/queries";
import { useLazyQuery } from "@apollo/client";
import { errorMessage } from "../../../helpers/gql";
import { useEffect } from "react";
import classes from "./EntityStatusPie.module.css";
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/offline-exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);
require("highcharts/modules/drilldown")(Highcharts);

const EntityStatusPie = () => {
  const [getAllEntityStatusCount, { data: statusData }] = useLazyQuery(
    GET_ALL_ENTITY_STATUS_COUNT,
    {
      onError: (err) => {
        errorMessage(
          err,
          "Error loading status count of entities."
        );
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
    }
  );
  useEffect(() => {
    getAllEntityStatusCount();
  }, [getAllEntityStatusCount]);

  let critical = 0;
  let working = 0;
  let breakdown = 0;
  let dispose = 0;
  let machineWorking = 0;
  let machineCritical = 0;
  let machineBreakdown = 0;
  let machineDispose = 0;
  let vehicleWorking = 0;
  let vehicleCritical = 0;
  let vehicleBreakdown = 0;
  let vehicleDispose = 0;
  let vesselWorking = 0;
  let vesselCritical = 0;
  let vesselBreakdown = 0;
  let vesselDispose = 0;
  let options;
  const statusCountData = statusData?.allEntityStatusCount;
  if (statusCountData) {
    critical = statusCountData?.critical;
    working = statusCountData?.working;
    breakdown = statusCountData?.breakdown;
    dispose = statusCountData?.dispose;
    machineWorking = statusCountData?.machineWorking;
    machineCritical = statusCountData?.machineCritical;
    machineBreakdown = statusCountData?.breakdown;
    machineDispose = statusCountData?.machineDispose;
    vehicleWorking = statusCountData?.vehicleWorking;
    vehicleCritical = statusCountData?.vehicleCritical;
    vehicleBreakdown = statusCountData?.vehicleBreakdown;
    vehicleDispose = statusCountData?.vehicleDispose;
    vesselWorking = statusCountData?.vesselWorking;
    vesselCritical = statusCountData?.vesselCritical;
    vesselBreakdown = statusCountData?.vesselBreakdown;
    vesselDispose = statusCountData?.vesselDispose;

    options = {
      chart: {
        type: "pie",
      },
      title: {
        text: "Entities",
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
          colors: ["#0b989d", "#eb4034", "#fcbf15", "#ab0909"],
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
          name: "Entities",
          colorByPoint: true,
          data: [
            {
              name: "Working",
              y: working,
              drilldown: "Working",
            },
            {
              name: "Breakdown",
              y: breakdown,
              drilldown: "Breakdown",
            },
            {
              name: "Critical",
              y: critical,
              drilldown: "Critical",
            },
            {
              name: "Dispose",
              y: dispose,
              drilldown: "Dispose",
            },
          ],
        },
      ],
      drilldown: {
        series: [
          {
            name: "Working",
            id: "Working",
            data: [
              ["Machine", machineWorking, "red"],
              ["Vehicle", vehicleWorking],
              ["Vessel", vesselWorking],
            ],
            colors: ["#086a6d", "#0b989d", "#10dde4",],
          },
          {
            name: "Breakdown",
            id: "Breakdown",
            data: [
              ["Machine", machineBreakdown],
              ["Vehicle", vehicleBreakdown],
              ["Vessel", vesselBreakdown],
            ],
            colors: ["#d72215", "#eb4034", "#f2827a",],
          },
          {
            name: "Critical",
            id: "Critical",
            data: [
              ["Machine", machineCritical],
              ["Vehicle", vehicleCritical],
              ["Vessel", vesselCritical],
            ],
            colors: ["#dba203", "#fcbf15", "#fdd461",],
          },
          {
            name: "Dispose",
            id: "Dispose",
            data: [
              ["Machine", machineDispose],
              ["Vehicle", vehicleDispose],
              ["Vessel", vesselDispose],
            ],
            colors: ["#930808", "#ab0909", "#f20e0e",],
          },
        ],
      },
    };
  }

  return (
    <div className={classes["container"]}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default EntityStatusPie;
