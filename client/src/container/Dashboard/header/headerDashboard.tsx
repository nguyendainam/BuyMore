import React from 'react'
import style from './headerDashboard.module.scss'
import {
  BellOutlined,
  MessageOutlined,
  LogoutOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Avatar, Dropdown } from 'antd'
export default function HeaderDashboard () {
  const information = () => {
    return (
      <div className={style.OptionAdmin}>
        <div className={style.welcomeAdmin}>
          <div className={style.minItalic}>Welcome Admin</div>
          <div className={style.normalBold}>Neron</div>
        </div>

        <div className={style.listOption}>
          <div className={style.item}>
            Profile
            <UserOutlined className={style.icon} />
          </div>
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
        <BellOutlined />
        <MessageOutlined />

        <Dropdown overlay={information}>
          <Avatar
            style={{ backgroundColor: 'red', verticalAlign: 'middle' }}
            size='large'
          >
            {'Neron'}
          </Avatar>
        </Dropdown>
      </div>
    </div>
  )
}
