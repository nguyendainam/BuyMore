import React from "react";
import style from "./activeUser.module.scss";
export const ActiveUser: React.FC = () => {
  return (
    <div className={style.mainVỉew}>
      <div className={style.topView}>Active User</div>
      <div className={style.content}>20</div>
    </div>
  );
};
