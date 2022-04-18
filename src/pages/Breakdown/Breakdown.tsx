import {
  FaGlobe,
  FaRegEnvelope,
  FaEllipsisV,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import classes from "./Breakdown.module.css";
import { Input, Select, Button } from 'antd';
import 'antd/dist/antd.css';

//Search
const { Search } = Input;
const onSearch = (value: any) => console.log(value);

//Filter
const { Option } = Select;
function handleChange(value: any) {
  console.log(`selected ${value}`);
}
const children = [] as any;
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const breakdown = () => {
  return (
    <div className={classes["breakdown-container"]}>
      <div className={classes["breakdown-options-wrapper"]}>
        {/* Search & Filters */}
        <Search placeholder="Search" onSearch={onSearch} style={{ width: 200 }} />
          <Select defaultValue="Filter Status" style={{ width: 120 }} onChange={handleChange}>
          <Option default value="Working">Working</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Breakdown">Breakdown</Option>
        </Select>
        <Select mode="tags" style={{ width: '15%' }} placeholder="Filter Location" onChange={handleChange}>
        {children}
        </Select>
        <span style={{float: 'right'}} className="createbreakdown">  <Button>Add breakdown</Button></span>
      
      </div>
      <div className={classes["breakdown-wrapper"]}>
        <div className={classes["breakdown-wrapper__user-details-container"]}>
          <div className={classes["breakdown-wrapper__user-details-wrapper"]}>
            <div
              className={
                classes["breakdown-wrapper__breakdown-details__info-wrapper"]
              }
            >
              <div
                className={
                  classes[
                    "breakdown-wrapper__breakdown-details__priority-wrapper"
                  ]
                }
              >
                <div
                  className={
                    classes[
                      "breakdown-wrapper__breakdown-details__priority-title"
                    ]
                  }
                >
                  {" "}
                  1{" "}
                </div>
                <div
                  className={
                    classes[
                      "breakdown-wrapper__breakdown-details__category-title"
                    ]
                  }
                >
                  Ex-31
                </div>
                <div
                  className={
                    classes[
                      "breakdown-wrapper__breakdown-details__category-title"
                    ]
                  }
                >
                  North - Centara
                </div>
                <div
                  className={
                    classes[
                      "breakdown-wrapper__breakdown-details__category-title"
                    ]
                  }
                >
                  <FaGlobe /> Registered at <span>9/3/2022</span>
                </div>
              </div>
            </div>
          </div>
          <div className={classes["breakdown-wrapper__divider"]}></div>
          <div
            className={classes["breakdown-wrapper__breakdown-details-wrapper"]}
          >
            <div
              className={classes["breakdown-wrapper__breakdown-details__title"]}
            ></div>
            <div
              className={
                classes["breakdown-wrapper__breakdown-details__info-container"]
              }
            >
              <div
                className={
                  classes["breakdown-wrapper__breakdown-details__info-wrapper"]
                }
              >
                <div
                  className={
                    classes[
                      "breakdown-wrapper__breakdown-details__category-wrapper"
                    ]
                  }
                >
                  <div
                    className={
                      classes[
                        "breakdown-wrapper__breakdown-details__category-title"
                      ]
                    }
                  >
                    Gear Box{" "}
                    <span
                      className={
                        classes[
                          "breakdown-wrapper__breakdown-details__group-name"
                        ]
                      }
                    >
                    </span>
                  </div>
                  <div
                    className={
                      classes[
                        "breakdown-wrapper__breakdown-details__category-title"
                      ]
                    }
                  >
                    Gear Box filters damaged{" "}
                    <span
                      className={
                        classes[
                          "breakdown-wrapper__breakdown-details__group-name"
                        ]
                      }
                    >
                    </span>
                  </div>
                </div>
                <div
                  className={
                    classes[
                      "breakdown-wrapper__breakdown-details__priority-wrapper"
                    ]
                  }
                >
                </div>
              </div>
              <div
                className={
                  classes["breakdown-wrapper__breakdown-details__info-wrapper"]
                }
              >
                <div
                  className={
                    classes[
                      "breakdown-wrapper__breakdown-details__agent-wrapper"
                    ]
                  }
                >
                  <div
                className={
                  classes["breakdown-wrapper__breakdown-activity__status"]
                }
              >
                Pending
              </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={classes["breakdown-wrapper__breakdown-activity-wrapper"]}
          >
            <div
              className={
                classes["breakdown-wrapper__breakdown-activity__started-wrapper"]
              }
            >
              <div
                className={
                  classes["breakdown-wrapper__breakdown-activity__started"]
                }
              >
                <Button>Edit</Button>
                <span
                  className={
                    classes[
                      "breakdown-wrapper__breakdown-activity__started-date"
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

export default breakdown;
