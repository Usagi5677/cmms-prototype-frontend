import { Tooltip } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { IconType } from "react-icons";
import classes from "./StatusCard.module.css";

const StatusCard = ({
  name,
  icon,
  subIconOne,
  subIconTwo,
  amountOne,
  amountTwo,
  iconColor,
  iconBackgroundColor,
}: {
  name?: string;
  icon?: object;
  subIconOne?: object;
  subIconTwo?: object;
  amountOne?: number;
  amountTwo?: number;
  iconColor?: string;
  iconBackgroundColor?: string;
}) => {
  const [showAmountOne, setShowAmountOne] = useState(
    amountOne! >= 0 ? true : false
  );
  const [showAmountTwo, setShowAmountTwo] = useState(
    amountTwo! >= 0 ? true : false
  );

  const btnOne = () => {
    setShowAmountOne(!showAmountOne);
  };
  const btnTwo = () => {
    setShowAmountTwo(!showAmountTwo);
  };

  let amount = 0;

  if (showAmountOne && showAmountTwo) {
    amount = amountOne! + amountTwo!;
  } else if (showAmountOne) {
    amount = amountOne!;
  } else if (showAmountTwo) {
    amount = amountTwo!;
  }

  return (
    <div
      className={classes["container"]}
      style={{ border: `1px ${iconColor} solid` }}
    >
      <motion.div
        className={classes["icon"]}
        style={{ backgroundColor: iconBackgroundColor, color: iconColor }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          ease: "easeOut",
          duration: 0.3,
          delay: 0.8,
        }}
      >
        {icon}
      </motion.div>
      <div className={classes["content"]}>
        {subIconOne || subIconTwo ? (
          <div className={classes["sub-icon-wrapper"]}>
            <Tooltip title={"Machinery"}>
              <div
                className={classes["sub-icon"]}
                onClick={btnOne}
                style={{
                  color: showAmountOne
                    ? "rgb(136,135,135)"
                    : "rgba(136,135,135,0.5)",
                }}
              >
                {subIconOne}
              </div>
            </Tooltip>
            <Tooltip title={"Transports"}>
              <div
                className={classes["sub-icon"]}
                onClick={btnTwo}
                style={{
                  color: showAmountTwo
                    ? "rgb(136,135,135)"
                    : "rgb(136,135,135,0.5)",
                }}
              >
                {subIconTwo}
              </div>
            </Tooltip>
          </div>
        ) : null}

        <motion.div
          className={classes["title"]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: "easeOut",
            duration: 0.3,
            delay: 0.7,
          }}
          
        >
          {name}
        </motion.div>
        <div className={classes["amount"]}>
          <CountUp end={amount} duration={1} />
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
