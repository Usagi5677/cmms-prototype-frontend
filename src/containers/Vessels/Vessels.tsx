import {
  FaGlobe,
  FaRegEnvelope,
  FaEllipsisV,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import classes from "./Vessels.module.css";

const Vessels = () => {
  return (
    <div className={classes["vessels-container"]}>
      <div className={classes["vessels-options-wrapper"]}>
        <div className={classes["vessels-options-wrapper__search-wrapper"]}>
          <div
            className={
              classes["vessels-options-wrapper__search-wrapper_icon"]
            }
          >
            <FaSearch />
          </div>
          <input type="text" name="" id="" placeholder="Search" />
        </div>

        <button className={classes["vessels-options-wrapper__filter"]}>
          <FaPlus />
          <span>Filter</span>
        </button>
      </div>
      <div className={classes["vessels-wrapper"]}>
        <div className={classes["vessels-wrapper__user-details-container"]}>
          <div className={classes["vessels-wrapper__user-details-wrapper"]}>
            <div
              className={
                classes["vessels-wrapper__ticket-details__info-wrapper"]
              }
            >
              <div
                className={
                  classes[
                    "vessels-wrapper__ticket-details__priority-wrapper"
                  ]
                }
              >
                <div
                  className={
                    classes[
                      "vessels-wrapper__ticket-details__priority-title"
                    ]
                  }
                >
                  {" "}
                  1{" "}
                </div>
                <div
                  className={
                    classes[
                      "vessels-wrapper__ticket-details__category-title"
                    ]
                  }
                >
                  Ex-31
                </div>
                <div
                  className={
                    classes[
                      "vessels-wrapper__ticket-details__category-title"
                    ]
                  }
                >
                  North - Centara
                </div>
                <div
                  className={
                    classes[
                      "vessels-wrapper__ticket-details__category-title"
                    ]
                  }
                >
                  <FaGlobe /> Registered at <span>9/3/2022</span>
                </div>
              </div>
            </div>
          </div>
          <div className={classes["vessels-wrapper__divider"]}></div>
          <div
            className={classes["vessels-wrapper__ticket-details-wrapper"]}
          >
            <div
              className={classes["vessels-wrapper__ticket-details__title"]}
            ></div>
            <div
              className={
                classes["vessels-wrapper__ticket-details__info-container"]
              }
            >
              <div
                className={
                  classes["vessels-wrapper__ticket-details__info-wrapper"]
                }
              >
                <div
                  className={
                    classes[
                      "vessels-wrapper__ticket-details__category-wrapper"
                    ]
                  }
                >
                  <div
                    className={
                      classes[
                        "vessels-wrapper__ticket-details__category-title"
                      ]
                    }
                  >
                    Division:{" "}
                    <span
                      className={
                        classes[
                          "vessels-wrapper__ticket-details__group-name"
                        ]
                      }
                    >
                      MTD
                    </span>
                  </div>
                  <div
                    className={
                      classes[
                        "vessels-wrapper__ticket-details__category-title"
                      ]
                    }
                  >
                    <div
                    className={
                      classes[
                        "vessels-wrapper__ticket-details__category-title"
                      ]
                    }
                  >
                    Engine:{" "}
                    <span
                      className={
                        classes[
                          "vessels-wrapper__ticket-details__group-name"
                        ]
                      }
                    >
                      V8
                    </span>
                  </div>
                  <div
                    className={
                      classes[
                        "vessels-wrapper__ticket-details__category-title"
                      ]
                    }
                  ></div>
                  </div>
                  <div
                    className={
                      classes[
                        "vessels-wrapper__ticket-details__category-title"
                      ]
                    }
                  >
                    Model:{" "}
                    <span
                      className={
                        classes[
                          "vessels-wrapper__ticket-details__group-name"
                        ]
                      }
                    >
                      Ferrari Ferry
                    </span>
                  </div>
                  <div
                    className={
                      classes[
                        "vessels-wrapper__ticket-details__category-title"
                      ]
                    }
                  >
                    Type:{" "}
                    <span
                      className={
                        classes[
                          "vessels-wrapper__ticket-details__group-name"
                        ]
                      }
                    >
                      Boat
                    </span>
                  </div>
                </div>
                <div
                  className={
                    classes[
                      "vessels-wrapper__ticket-details__priority-wrapper"
                    ]
                  }
                >
                  <div
                    className={
                      classes[
                        "vessels-wrapper__ticket-details__priority-title"
                      ]
                    }
                  >
                    Current running (hr):{" "}
                    <span
                      className={
                        classes[
                          "vessels-wrapper__ticket-details__group-name"
                        ]
                      }
                    >
                      3146
                    </span>
                  </div>
                  <div
                    className={
                      classes[
                        "vessels-wrapper__ticket-details__category-title"
                      ]
                    }
                  >
                    Last service (hr):{" "}
                    <span
                      className={
                        classes[
                          "vessels-wrapper__ticket-details__group-name"
                        ]
                      }
                    >
                      3133
                    </span>
                  </div>
                  <div
                    className={
                      classes[
                        "vessels-wrapper__ticket-details__category-title"
                      ]
                    }
                  >
                    Inter service (hr):{" "}
                    <span
                      className={
                        classes[
                          "vessels-wrapper__ticket-details__group-name"
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
                  classes["vessels-wrapper__ticket-details__info-wrapper"]
                }
              >
                <div
                  className={
                    classes[
                      "vessels-wrapper__ticket-details__agent-wrapper"
                    ]
                  }
                >
                  <div
                    className={
                      classes[
                        "vessels-wrapper__ticket-details__agent-title"
                      ]
                    }
                  >
                    Spare pr date:{" "}
                    <span
                      className={
                        classes[
                          "vessels-wrapper__ticket-details__group-name"
                        ]
                      }
                    >
                      12/2/2022
                    </span>
                  </div>
                  <div
                    className={
                      classes[
                        "vessels-wrapper__ticket-details__agent-title"
                      ]
                    }
                  >
                    Spare pr status:{" "}
                    <span
                      className={
                        classes[
                          "vessels-wrapper__ticket-details__group-name"
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
            className={classes["vessels-wrapper__ticket-activity-wrapper"]}
          >
            <div
              className={
                classes["vessels-wrapper__ticket-activity__started-wrapper"]
              }
            >
              <div
                className={
                  classes["vessels-wrapper__ticket-activity__started"]
                }
              >
                Estimated Completion:
                <span
                  className={
                    classes[
                      "vessels-wrapper__ticket-activity__started-date"
                    ]
                  }
                >
                  11/11/2021
                </span>
              </div>
              <div
                className={
                  classes["vessels-wrapper__ticket-activity__status"]
                }
              >
                Working
              </div>
            </div>
          </div>
        </div>
        <div className={classes["vessels-wrapper__icon-wrapper"]}>
          <FaEllipsisV />
        </div>
      </div>
    </div>
  );
};

export default Vessels;
