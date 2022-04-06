
import {
  FaGlobe,
  FaRegEnvelope,
  FaEllipsisV,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import classes from "./Division.module.css";
import { Input, Select, Button } from 'antd';
import 'antd/dist/antd.css';

//Search
const { Search } = Input;
const onSearch = value => console.log(value);

const Division = () => {
  return (
    <div className={classes['division-container']}>
      <div className={classes['division-options-wrapper']}>
        {/* Search & Filters */}
        <Search placeholder="Search" onSearch={onSearch} style={{ width: 200 }} />
        <span style={{float: 'right'}} className="">  <Button>Add Division</Button></span>
      </div>
      <div className={classes['division-wrapper']}>
        <div className={classes['division-wrapper__user-details-container']}>
          <div className={classes['division-wrapper__user-details-wrapper']}>
            <img
              className={classes['division-wrapper__user-details__icon']}
              src="./avatar.jpg"
              alt=""
            />
            <div className={classes['division-wrapper__user-details__user-info-wrapper']}>
              <div className={classes['division-wrapper__user-details__email-wrapper']}>
                <div className={classes['division-wrapper__user-details__email__text']}>
                  <h1>Repair & Maintenance Division</h1>
                </div>
              </div>
            </div>
          </div>

          <div className={classes['division-wrapper__divison-activity-wrapper']}>
            <div className={classes['division-wrapper__divison-activity__started-wrapper']}>
              <div className={classes['division-wrapper__divison-activity__started']}>
              <Button>Edit</Button>
              </div>
        
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Division;
