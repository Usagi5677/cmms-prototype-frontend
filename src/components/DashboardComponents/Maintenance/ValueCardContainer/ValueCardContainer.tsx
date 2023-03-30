import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import {
  FaArrowsAlt,
  FaCogs,
  FaMapMarked,
  FaMapMarkerAlt,
  FaShip,
  FaTrademark,
} from "react-icons/fa";
import { GET_CONFIG_COUNT } from "../../../../api/queries";
import { errorMessage } from "../../../../helpers/gql";
import ValueCard from "../../../common/ValueCard/ValueCard";
import classes from "./ValueCardContainer.module.css";
const ValueCardContainer = () => {
  const [getConfigCount, { data, loading }] = useLazyQuery(GET_CONFIG_COUNT, {
    onError: (err) => {
      errorMessage(err, "Error loading user count.");
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });
  useEffect(() => {
    getConfigCount();
  }, [getConfigCount]);
  let location = 0;
  let zone = 0;
  let division = 0;
  let hullType = 0;
  let brand = 0;
  let engine = 0;
  const configCount = data?.getConfigCount;
  if (configCount) {
    location = configCount?.location;
    zone = configCount?.zone;
    division = configCount?.division;
    hullType = configCount?.hullType;
    brand = configCount?.brand;
    engine = configCount?.engine;
  }
  return (
    <div className={classes["container"]}>
      <ValueCard name={"Location"} amount={location} icon={FaMapMarkerAlt} />
      <ValueCard name={"Zone"} amount={zone} icon={FaMapMarked} />
      <ValueCard name={"Division"} amount={division} icon={FaArrowsAlt} />
      <ValueCard name={"Hull Type"} amount={hullType} icon={FaShip} />
      <ValueCard name={"Brand"} amount={brand} icon={FaTrademark} />
      <ValueCard name={"Engine"} amount={engine} icon={FaCogs} />
    </div>
  );
};

export default ValueCardContainer;
