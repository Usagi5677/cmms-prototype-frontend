import { ApartmentOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { Link } from "react-router-dom";
import classes from "./OpenParentEntity.module.css";

const OpenParentEntity = ({ id }: { id: number }) => {
  return (
    <Link to={"/entity/" + id}>
      <Tooltip title="Open Parent Entity">
        <ApartmentOutlined className={classes["btn"]} />
      </Tooltip>
    </Link>
  );
};

export default OpenParentEntity;
