import React from "react";
import style from "./VoteBar.module.scss";
import { AiFillStar } from "react-icons/ai";
import { Progress } from "antd";

const conicColors = { "0%": "#87d068", "50%": "#ffe58f", "100%": "#ffccc7" };
export default function VoteBar({ number, ratingCount, ratingTotal }) {
  return (
    <div className={style.maiView}>
      <div className={style.formStart}>
        <span>{number}</span>
        <AiFillStar color="orange" />
      </div>
      <div className={style.votePercent}>
        <Progress
          percent={`${
            ratingTotal !== 0
              ? ((ratingCount / ratingTotal) * 100).toFixed(2)
              : "0"
          }`}
          strokeColor={conicColors}
        />
      </div>
      <div className={style.formPerson}>
        {ratingCount ? ratingCount + " Person" : "0 Person"}
      </div>
    </div>
  );
}
