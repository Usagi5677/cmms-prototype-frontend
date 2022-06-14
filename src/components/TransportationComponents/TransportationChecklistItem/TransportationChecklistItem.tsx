import { useMutation } from "@apollo/client";
import { Checkbox, Spin } from "antd";
import {
  DELETE_TRANSPORTATION_CHECKLIST_ITEM,
  TOGGLE_TRANSPORTATION_CHECKLIST_ITEM,
} from "../../../api/mutations";
import { errorMessage } from "../../../helpers/gql";
import ChecklistItemModel from "../../../models/ChecklistItem";
import { CloseCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { DATETIME_FORMATS } from "../../../helpers/constants";
import classes from "./TransportationChecklistItem.module.css";
import { useContext } from "react";
import UserContext from "../../../contexts/UserContext";

const TransportationChecklistItem = ({
  item,
}: {
  item: ChecklistItemModel;
}) => {
  const { user: self } = useContext(UserContext);
  
  return (
    <div></div>
  );
};

export default TransportationChecklistItem;
