import React from 'react'
import style from './ChangeProfile.module.scss'
import { useSelector } from 'react-redux'
import { Button, Input, Radio } from 'antd'

export default function ChangeProfile() {
    const { current } = useSelector((state) => state.user)
    const gender = [
        { label: 'Male', value: 'M' },
        { label: 'FeMale', value: 'F' },
        { label: 'Other', value: 'O' },
    ];
    return (
        <div className={style.mainChangeProfile}>

            <div className={style.formTitlePro}>
                <div className={style.f14gray}>Hồ sơ của tôi</div>
                <div className={style.smallfont}>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
            </div>

            <div className={style.information}>
                <div className={style.itemInfor}>
                    <div className={style.des}>Tên Đăng Nhập</div>
                    <span>{current.Email}</span>
                </div>
                <div className={style.itemInfor}>
                    <div className={style.des}>Name</div>
                    <Input className={style.formInputcustomMin} />
                </div>
                <div className={style.itemInfor}>
                    <div className={style.des}>Email</div>
                    <span>{current.Email}</span>
                </div>

                <div className={style.itemInfor}>
                    <div className={style.des}>Số điện thoại</div>
                    {/* <span>{current.Email}</span> */}
                </div>


                <div className={style.itemInfor}>
                    <div className={style.des}>Gender</div>
                    <Radio.Group options={gender} value={current.Gender} />
                </div>

                <Button className={style.btnBlue} >Lưu</Button>
            </div>

        </div>
    )
}
