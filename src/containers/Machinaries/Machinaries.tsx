import {
  FaGlobe,
  FaRegEnvelope,
  FaEllipsisV,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import classes from "./Machinery.module.css";
import { Input, Select, Button, Menu, Dropdown } from 'antd';
import 'antd/dist/antd.css';

//Search
const { Search } = Input;
const onSearch = (value: any) => console.log(value);

//Filter
const { Option } = Select;
function handleChange(value : any) {
  console.log(`selected ${value}`);
}
const children = [] as any;
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}
//Edit & Delete
const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="https://www.antgroup.com">Edit</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="https://www.aliyun.com">Delete</a>
    </Menu.Item>
  </Menu>
);

const Machinaries = () => {
  return (
    <div className={classes["machinaries-container"]}>
      <div className={classes["machinaries-options-wrapper"]}>
        {/* Search & Filters */}
        <Search placeholder="Search" onSearch={onSearch} style={{ width: 200 }} />

        <Select mode="tags" style={{ width: '15%' }} placeholder="Filter Model" onChange={handleChange}>
        {children}
        </Select> 
        <Select mode="tags" style={{ width: '15%' }} placeholder="Filter Type" onChange={handleChange}>
        {children}
        </Select>
          <Select defaultValue="Filter Status" style={{ width: 120 }} onChange={handleChange}>
          <Option default value="Working">Working</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Breakdown">Breakdown</Option>
        </Select>
        <Select mode="tags" style={{ width: '15%' }} placeholder="Filter Location" onChange={handleChange}>
        {children}
        </Select>
        <span style={{float: 'right'}} className="createMachinaries">  <Button>Create Machinaries</Button></span>
      
      </div>
      <a href="machinaries/:1">
      <div className={classes["machinaries-wrapper"]}>
        <div className={classes["machinaries-wrapper__user-details-container"]}>
          <div className={classes["machinaries-wrapper__user-details-wrapper"]}>
            <div
              className={
                classes["machinaries-wrapper__machinaries-details__info-wrapper"]
              }
            >
              <div
                className={
                  classes[
                    "machinaries-wrapper__machinaries-details__priority-wrapper"
                  ]
                }
              >
                <div
                  className={
                    classes[
                      "machinaries-wrapper__machinaries-details__priority-title"
                    ]
                  }
                >
                  {" "}
                  1{" "}
                </div>
                <div
                  className={
                    classes[
                      "machinaries-wrapper__machinaries-details__category-title"
                    ]
                  }
                >
                  Ex-31
                </div>
                <div
                  className={
                    classes[
                      "machinaries-wrapper__machinaries-details__category-title"
                    ]
                  }
                >
                  North - Centara
                </div>
                <div
                  className={
                    classes[
                      "machinaries-wrapper__machinaries-details__category-title"
                    ]
                  }
                >
                  <FaGlobe /> Registered at <span>9/3/2022</span>
                </div>
              </div>
            </div>
          </div>
          <div className={classes["machinaries-wrapper__divider"]}></div>
          <div
            className={classes["machinaries-wrapper__machinaries-details-wrapper"]}
          >
            <div
              className={classes["machinaries-wrapper__machinaries-details__title"]}
            ></div>
            <div
              className={
                classes["machinaries-wrapper__machinaries-details__info-container"]
              }
            >
              <div
                className={
                  classes["machinaries-wrapper__machinaries-details__info-wrapper"]
                }
              >
                <div
                  className={
                    classes[
                      "machinaries-wrapper__machinaries-details__category-wrapper"
                    ]
                  }
                >
                  <div
                    className={
                      classes[
                        "machinaries-wrapper__machinaries-details__category-title"
                      ]
                    }
                  >
                    Model:{" "}
                    <span
                      className={
                        classes[
                          "machinaries-wrapper__machinaries-details__group-name"
                        ]
                      }
                    >
                      KOBELCO
                    </span>
                  </div>
                  <div
                    className={
                      classes[
                        "machinaries-wrapper__machinaries-details__category-title"
                      ]
                    }
                  >
                    Type:{" "}
                    <span
                      className={
                        classes[
                          "machinaries-wrapper__machinaries-details__group-name"
                        ]
                      }
                    >
                      Excavator
                    </span>
                  </div>
                </div>
                <div
                  className={
                    classes[
                      "machinaries-wrapper__machinaries-details__priority-wrapper"
                    ]
                  }
                >
                  <div
                    className={
                      classes[
                        "machinaries-wrapper__machinaries-details__priority-title"
                      ]
                    }
                  >
                    Current running (hr):{" "}
                    <span
                      className={
                        classes[
                          "machinaries-wrapper__machinaries-details__group-name"
                        ]
                      }
                    >
                      3146
                    </span>
                  </div>
                  <div
                    className={
                      classes[
                        "machinaries-wrapper__machinaries-details__category-title"
                      ]
                    }
                  >
                    Last service (hr):{" "}
                    <span
                      className={
                        classes[
                          "machinaries-wrapper__machinaries-details__group-name"
                        ]
                      }
                    >
                      3133
                    </span>
                  </div>
                  <div
                    className={
                      classes[
                        "machinaries-wrapper__machinaries-details__category-title"
                      ]
                    }
                  >
                    Inter service (hr):{" "}
                    <span
                      className={
                        classes[
                          "machinaries-wrapper__machinaries-details__group-name"
                        ]
                      }
                    >
                      13
                    </span>
                  </div>
                </div>
              </div>
              <div
                className={
                  classes["machinaries-wrapper__machinaries-details__info-wrapper"]
                }
              >
                <div
                  className={
                    classes[
                      "machinaries-wrapper__machinaries-details__agent-wrapper"
                    ]
                  }
                >
                  <div
                    className={
                      classes[
                        "machinaries-wrapper__machinaries-details__agent-title"
                      ]
                    }
                  >
                    Spare pr date:{" "}
                    <span
                      className={
                        classes[
                          "machinaries-wrapper__machinaries-details__group-name"
                        ]
                      }
                    >
                      12/2/2022
                    </span>
                  </div>
                  <div
                    className={
                      classes[
                        "machinaries-wrapper__machinaries-details__agent-title"
                      ]
                    }
                  >
                    Spare pr status:{" "}
                    <span
                      className={
                        classes[
                          "machinaries-wrapper__machinaries-details__group-name"
                        ]
                      }
                    >
                      Status
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={classes["machinaries-wrapper__machinaries-activity-wrapper"]}
          >
            <div
              className={
                classes["machinaries-wrapper__machinaries-activity__started-wrapper"]
              }
            >
              <div
                className={
                  classes["machinaries-wrapper__machinaries-activity__started"]
                }
              >
                Estimated Completion:
                <span
                  className={
                    classes[
                      "machinaries-wrapper__machinaries-activity__started-date"
                    ]
                  }
                >
                  11/11/2021
                </span>
              </div>
              <div
                className={
                  classes["machinaries-wrapper__machinaries-activity__status"]
                }
              >
                Working
              </div>
            </div>
          </div>
        </div>
        <div className={classes["machinaries-wrapper__icon-wrapper"]}>
          <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
            <FaEllipsisV />
            </a>
          </Dropdown>,
        </div>
      </div>
      </a>
    </div>

  );
};

export default Machinaries;
