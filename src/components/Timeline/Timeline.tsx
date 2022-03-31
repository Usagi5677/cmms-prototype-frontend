import classes from "./Timeline.module.css";

const Timeline = (props: any) => {
  return (
    <div className={classes["timeline-container"]}>
      <div className={classes["timeline-container__title"]}>
        My Recent Activities
      </div>
      <ul className={classes["timeline-container__timeline-wrapper"]}>
        <li>
          <div className={classes["timeline-wrapper__time"]}>
            1st January 2021 <span>&#9679;</span> 22:00
          </div>
          <p>You replied to your ticket.</p>
        </li>
        <li>
          <div className={classes["timeline-wrapper__time"]}>
            1st January 2021 <span>&#9679;</span> 22:00
          </div>
          <p>You replied to your ticket.</p>
        </li>
        <li>
          <div className={classes["timeline-wrapper__time"]}>
            1st January 2021 <span>&#9679;</span> 22:00
          </div>
          <p>You replied to your ticket.</p>
        </li>
        
      </ul>
    </div>
  );
};

export default Timeline;
