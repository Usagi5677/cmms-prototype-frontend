
import {
  FaGlobe,
  FaRegEnvelope,
  FaEllipsisV,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import classes from "./Location.module.css";

const Location = () => {
  return (
    <div className={classes['location-container']}>
      <div className={classes['location-options-wrapper']}>
        <div className={classes['location-options-wrapper__ticket-amount']}>
          1 ticket
        </div>
        <div className={classes['location-options-wrapper__search-wrapper']}>
          <div className={classes['location-options-wrapper__search-wrapper_icon']}>
            <FaSearch />
          </div>
          <input type="text" name="" id="" placeholder="Search" />
        </div>

        <button className={classes['location-options-wrapper__filter']}>
          <FaPlus />
          <span>Filter</span>
        </button>
      </div>
      <div className={classes['location-wrapper']}>
        <div className={classes['location-wrapper__user-details-container']}>
          <div className={classes['location-wrapper__user-details-wrapper']}>
            <img
              className={classes['location-wrapper__user-details__icon']}
              src="./avatar.jpg"
              alt=""
            />
            <div className={classes['location-wrapper__user-details__user-info-wrapper']}>
              <div className={classes['location-wrapper__user-details__fullname']}>
                Ibrahimu Naishu
              </div>
              <div className={classes['location-wrapper__user-details__email-wrapper']}>
                <div className={classes['location-wrapper__user-details__email__icon']}>
                  <FaRegEnvelope />
                </div>
                <div className={classes['location-wrapper__user-details__email__text']}>
                  Naishu@gmail.com
                </div>
              </div>
              <div className={classes['location-wrapper__user-details__created-date-wrapper']}>
                <div className={classes['location-wrapper__user-details__created-date__icon']}>
                  <FaGlobe />
                </div>
                <div className={classes['location-wrapper__user-details__created-date__date']}>
                  Created at 01/01/2022
                </div>
              </div>
            </div>
          </div>
          <div className={classes['location-wrapper__divider']}></div>
          <div className={classes['location-wrapper__ticket-details-wrapper']}>
            <div className={classes['location-wrapper__ticket-details__title']}>
              T01 - change password
            </div>
            <div className={classes['location-wrapper__ticket-details__info-container']}>
              <div className={classes['location-wrapper__ticket-details__info-wrapper']}>
                <div className={classes['location-wrapper__ticket-details__category-wrapper']}>
                  <div className={classes['location-wrapper__ticket-details__category-title']}>
                    Category
                  </div>
                  <div className={classes['location-wrapper__ticket-details__category-type']}>
                    problem
                  </div>
                </div>
                <div className={classes['location-wrapper__ticket-details__priority-wrapper']}>
                  <div className={classes['location-wrapper__ticket-details__priority-title']}>
                    Priority
                  </div>
                  <div className={classes['location-wrapper__ticket-details__priority-type']}>
                    Medium
                  </div>
                </div>
              </div>
              <div className={classes['location-wrapper__ticket-details__info-wrapper']}>
                <div className={classes['location-wrapper__ticket-details__group-wrapper']}>
                  <div className={classes['location-wrapper__ticket-details__group-title']}>
                    Group
                  </div>
                  <div className={classes['location-wrapper__ticket-details__group-name']}>
                    Software
                  </div>
                </div>
                <div className={classes['location-wrapper__ticket-details__agent-wrapper']}>
                  <div className={classes['location-wrapper__ticket-details__agent-title']}>
                    Agent
                  </div>
                  <div className={classes['location-wrapper__ticket-details__agent-name']}>
                    Unassigned
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classes['location-wrapper__ticket-activity-wrapper']}>
            <div className={classes['location-wrapper__ticket-activity__started-wrapper']}>
              <div className={classes['location-wrapper__ticket-activity__started']}>
                Started:
                <span className={classes['location-wrapper__ticket-activity__started-date']}>
                  11/11/2021
                </span>
              </div>
              <div className={classes['location-wrapper__ticket-activity__status']}>
                open
              </div>
            </div>
          </div>
        </div>
        <div className={classes['location-wrapper__icon-wrapper']}>
          <FaEllipsisV />
        </div>
      </div>
    </div>
  );
};

export default Location;
