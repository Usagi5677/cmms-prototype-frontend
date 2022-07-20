import { Tooltip } from "antd";
import { useEffect, useState } from "react";
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
  const [showAmountOne, setShowAmountOne] = useState(amountOne! >= 0 ? true : false);
  const [showAmountTwo, setShowAmountTwo] = useState(amountTwo! >= 0 ? true : false);

 
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
    <div className={classes["container"]} style={{border: `1px ${iconColor} solid`}}>
      <div
        className={classes["icon"]}
        style={{ backgroundColor: iconBackgroundColor, color: iconColor }}
      >
        {icon}
      </div>
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

        <div className={classes["title"]}>{name}</div>
        <div className={classes["amount"]}>{amount}</div>
      </div>
    </div>
  );
};

export default StatusCard;
