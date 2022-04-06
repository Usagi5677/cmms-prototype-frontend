import {
  FaGlobe,
  FaRegEnvelope,
  FaEllipsisV,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import classes from "./Service.module.css";
import { Input, Select, Button } from 'antd';
import 'antd/dist/antd.css';

//Search
const { Search } = Input;
const onSearch = value => console.log(value);

//Filter
const { Option } = Select;
function handleChange(value) {
  console.log(`selected ${value}`);
}
const children = [] as any;
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const Service = () => {
  return (
    <div className={classes["service-container"]}>
      <div className={classes["service-options-wrapper"]}>
        {/* Search & Filters */}
        <Search placeholder="Search" onSearch={onSearch} style={{ width: 200 }} />
          <Select defaultValue="Filter Status" style={{ width: 120 }} onChange={handleChange}>
          <Option default value="Working">Working</Option>
          <Option value="Pending">Pending</Option>
          <Option value="service">service</Option>
        </Select>
        <Select mode="tags" style={{ width: '15%' }} placeholder="Filter Location" onChange={handleChange}>
        {children}
        </Select>
        <span style={{float: 'right'}} className="createservice">  <Button>Add Repair</Button></span>
      
      </div>
      <div className={classes["service-wrapper"]}>
        <div className={classes["service-wrapper__user-details-container"]}>
          <div className={classes["service-wrapper__user-details-wrapper"]}>
            <div
              className={
                classes["service-wrapper__service-details__info-wrapper"]
              }
            >
              <div
                className={
                  classes[
                    "service-wrapper__service-details__priority-wrapper"
                  ]
                }
              >
                <div
                  className={
                    classes[
                      "service-wrapper__service-details__priority-title"
                    ]
                  }
                >
                  {" "}
                  1{" "}
                </div>
                <div
                  className={
                    classes[
                      "service-wrapper__service-details__category-title"
                    ]
                  }
                >
                  Ex-31
                </div>
                <div
                  className={
                    classes[
                      "service-wrapper__service-details__category-title"
                    ]
                  }
                >
                  North - Centara
                </div>
                <div
                  className={
                    classes[
                      "service-wrapper__service-details__category-title"
                    ]
                  }
                >
                  <FaGlobe /> Registered at <span>9/3/2022</span>
                </div>
              </div>
            </div>
          </div>
          <div className={classes["service-wrapper__divider"]}></div>
          <div
            className={classes["service-wrapper__service-details-wrapper"]}
          >
            <div
              className={classes["service-wrapper__service-details__title"]}
            ></div>
            <div
              className={
                classes["service-wrapper__service-details__info-container"]
              }
            >
              <div
                className={
                  classes["service-wrapper__service-details__info-wrapper"]
                }
              >
                <div
                  className={
                    classes[
                      "service-wrapper__service-details__category-wrapper"
                    ]
                  }
                >
                  <div
                    className={
                      classes[
                        "service-wrapper__service-details__category-title"
                      ]
                    }
                  >
                    Gear Box{" "}
                    <span
                      className={
                        classes[
                          "service-wrapper__service-details__group-name"
                        ]
                      }
                    >
                    </span>
                  </div>
                  <div
                    className={
                      classes[
                        "service-wrapper__service-details__category-title"
                      ]
                    }
                  >
                    Gear Box filters replaced{" "}
                    <span
                      className={
                        classes[
                          "service-wrapper__service-details__group-name"
                        ]
                      }
                    >
                    </span>
                  </div>
                </div>
                <div
                  className={
                    classes[
                      "service-wrapper__service-details__priority-wrapper"
                    ]
                  }
                >
                </div>
              </div>
              <div
                className={
                  classes["service-wrapper__service-details__info-wrapper"]
                }
              >
                <div
                  className={
                    classes[
                      "service-wrapper__service-details__agent-wrapper"
                    ]
                  }
                >
                  <div
                className={
                  classes["service-wrapper__service-activity__status"]
                }
              >
                Done
              </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={classes["service-wrapper__service-activity-wrapper"]}
          >
            <div
              className={
                classes["service-wrapper__service-activity__started-wrapper"]
              }
            >
              <div
                className={
                  classes["service-wrapper__service-activity__started"]
                }
              >
                <Button>Edit</Button>
                <span
                  className={
                    classes[
                      "service-wrapper__service-activity__started-date"
                    ]
                  }
                >
                </span>
              </div>
     
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
