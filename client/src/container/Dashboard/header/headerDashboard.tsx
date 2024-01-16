import React from 'react'
import style from './headerDashboard.module.scss'
import {
  BellOutlined,
  MessageOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Avatar, Dropdown } from 'antd'
import { useSelector } from 'react-redux'
export default function HeaderDashboard() {

  const { current } = useSelector((state) => state.user)

  console.log(current)

  const information = () => {
    return (
      <div className={style.OptionAdmin}>
        <div className={style.welcomeAdmin}>
          <div className={style.minItalic}>Welcome Admin</div>
          <div className={style.normalBold}>{current.Email}</div>
        </div>

        <div className={style.listOption}>
          {/* <div className={style.item}>
            Profile
            <UserOutlined className={style.icon} />
          </div> */}
          <div className={style.item}>
            Sign Out
            <LogoutOutlined className={style.icon} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={style.mainHeader}>
      <div className={style.formInforHeader}>


        <Dropdown overlay={information}>
          <Avatar
            style={{ backgroundColor: 'red', verticalAlign: 'middle' }}
            size='large'
          >
            <div>
              {current.UserName}
            </div>
          </Avatar>

        </Dropdown>
        <div className={style.inforUser}>
          <div>  {current.UserName}</div>
          <div>  {current.Email}</div>
        </div>
      </div>
    </div>
  )
}
