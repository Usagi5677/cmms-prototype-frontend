import classes from "./EntityStatusProgressBar.module.css";
const EntityStatusProgressBar = ({ name }: { name: string }) => {
  return (
    <div className={classes["container"]}>
      <div className={classes["title"]}>{name}</div>
      <div className={classes["progress-container"]}>
        <div className={classes["bar-wrapper"]}>
          <span>Working</span>
          <div className={classes["bar"]}></div>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default EntityStatusProgressBar;
