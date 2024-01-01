import React, { memo } from "react";
import { Rate } from "antd";
import style from "./VoteBar.module.scss";

const Ratting: React.FC = ({ total, persent }) => {
  return (
    <div className={style.mainRating}>
      <div className={style.ratingNumber}>{persent}/5</div>
      <Rate className={style.start} disabled allowHalf value={persent} />
      <div className={style.totalUser}>
        Đã có {total} người đánh giá sản phẩm
      </div>
    </div>
  );
};

export default memo(Ratting);
