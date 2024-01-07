import React, { useEffect, useState } from 'react';
import style from './Comment.module.scss';
import { Rate } from 'antd';
import moment from 'moment';

export default function Comment({ data }) {


    const renderCommentContent = () => {
        if (data.length > 0) {
            return data.map((item, index) => {
                const getRandomColor = () => {
                    const pastelColors = ['#FFD1DC', '#FFECB3', '#C5E1A5', '#B2DFDB', '#FFCC80'];
                    const randomIndex = Math.floor(Math.random() * pastelColors.length);
                    return pastelColors[randomIndex];
                };
                const userBackgroundColor = getRandomColor();
                const dateObj = moment(item.Date)
                const distance = dateObj.fromNow()


                return (



                    <div className={style.fromCommentUser} key={index}>
                        <div className={style.AboutUser}>
                            <div className={style.formLeft}>
                                <div className={style.avatar} style={{ background: `${userBackgroundColor}` }}>{item.UserName.split(' ')
                                    .map(word => word.charAt(0).toUpperCase())
                                    .join('')}</div>
                                <div className={style.userName}>{item.UserName}</div>
                                <Rate disabled value={item.Start} />
                            </div>
                            <div className={style.formRight}>
                                {distance}
                            </div>
                        </div>

                        <div className={style.content}>
                            {item.Comment}
                        </div>
                    </div>


                )

            }
            );
        } else {
            return <div>Không có Bình luận nào</div>;
        }
    };

    return renderCommentContent();
}
