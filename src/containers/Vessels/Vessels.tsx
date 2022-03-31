import { FaChevronDown } from "react-icons/fa";
import classes from "./Vessels.module.css";

const Vessels = () => {
  return (
    <div className={classes['vessels-container']}>
      <div className={classes['vessels-wrapper']}>
        <div className={classes['vessels-wrapper__title']}>Create Ticket</div>
        <div className={classes['vessels-wrapper__info']}>
          <div className={classes['vessels-wrapper__input-field']}>
            <input type="text" name="" id="" placeholder="Name" />
          </div>
          <div className={classes['vessels-wrapper__input-field']}>
            <input
              type="text"
              name=""
              id=""
              placeholder="Email"
              value={"Naishu@gmail.com"}
            />
          </div>
          <div className={classes['vessels-wrapper__input-field']}>
            <input
              type="text"
              name=""
              id=""
              placeholder="Contact Number"
              value={"7654321"}
            />
          </div>
          <div className={classes['vessels-wrapper__select-field']}>
            <select name="" id="" placeholder="Category">
              <option value="0">Category</option>
              <option value="1">Problem</option>
            </select>
            <div className={classes['vessels-wrapper__select-field__icon']}>
              <FaChevronDown />
            </div>
          </div>
        </div>
        <div className={classes['vessels-wrapper__ticket-info']}>
          <div className={`${classes['vessels-wrapper__input-field']} ${classes['--ticket-title']}`}>
            <input type="text" name="" id="" placeholder="Title" />
          </div>
          <div className={classes['vessels-wrapper__file-input']}>
            <input type="file" id="myfile" name="myfile"></input>
          </div>
        </div>

        <textarea
          className={classes['vessels-wrapper__description']}
          name=""
          id=""
          placeholder="Description"
        ></textarea>

        <div className={classes['vessels-wrapper__button_wrapper']}>
          <button className={classes['vessels-wrapper__secondary-button']}>
            Clear
          </button>
          <button className={classes['vessels-wrapper__primary-button']}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vessels;
