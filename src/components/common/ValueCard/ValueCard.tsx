import { motion } from "framer-motion";
import { memo } from "react";
import CountUp from "react-countup";
import { IconType } from "react-icons";
import { FaAd } from "react-icons/fa";
import classes from "./ValueCard.module.css";
const ValueCard = ({
  name,
  amount,
  icon,
}: {
  name: string;
  amount: number;
  icon: IconType;
}) => {
  const IconElement: IconType = icon;
  return (
    <motion.div
      className={classes["container"]}
      initial={{ x: -60, opacity: 0 }}
      whileInView={{
        x: 0,
        opacity: 1,
        transition: {
          duration: 0.3,
          type: "spring",
        },
      }}
      viewport={{ once: true }}
    >
      <div className={classes["info-wrapper"]}>
        <span className={classes["name"]}>{name}</span>
        <CountUp className={classes["amount"]} end={amount} duration={1} />
      </div>
      <div className={classes["circle"]}>
        <IconElement className={classes["icon"]} />
      </div>
    </motion.div>
  );
};

export default memo(ValueCard);
