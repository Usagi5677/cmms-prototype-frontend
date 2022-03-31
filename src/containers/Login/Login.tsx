import { FaUnlockAlt } from "react-icons/fa";

import classes from "./Login.module.css";

function getDate(): number {
  return new Date().getFullYear();
}

const Login = () => {
  /*

  
  const redirect = () => {
    
    router.push(
      `https://id.mtcc.com.mv/?returnUrl=${process.env.returnUrl}&type=employee&appId=${process.env.appId}`
    );
    
  };
  */
  return (
    <div className={classes['login-container']}>
      <div className={classes['login-container__login-wrapper']}>
        <div className={classes['login-wrapper__logo']}>
          <img src="./MTCC-logo.png" alt="" />
        </div>

        <button
          onClick={() =>
            window.open(
              `https://id.mtcc.com.mv/?returnUrl=${process.env.returnUrl}&type=employee&appId=${process.env.appId}`
            )
          }
          className={classes['login-wrapper__button']}
        >
          <FaUnlockAlt /> <span>Login</span>
        </button>
        <div className={classes['login-wrapper__divider']}></div>
        <div className={classes['login-wrapper__copyright']}>
          © {getDate()} MTCC Plc. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
