import style from './sidebarDashboard.module.scss'
import { Logo } from '../../../assets/image'
import Sider from 'antd/es/layout/Sider'
import { Menu } from 'antd'
import menuDashboard from '../../../components/datatest/menuDashboard'
import { useNavigate, useParams } from 'react-router-dom'
import React from 'react'
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb"
// import { useEffect, useState } from 'react'

interface ISidebarDashBoard {
  onClose: () => void
}

export const SidebarDashboard: React.FC<ISidebarDashBoard> = ({ onClose }) => {
  const menu = menuDashboard
  const navigate = useNavigate()
  const items = menu.map(item => {
    return {
      key: item.key,
      icon: item.icon,
      label: item.label,

      children: item.children.map(itemchild => {
        return {
          key: itemchild.key,
          label: itemchild.label
        }
      })
    }
  })
  const { '*': productParam } = useParams()
  const handleChanePath = key => {
    navigate(`/system/${key}`)
  }
  return (
    <div className={style.mainSidebar}>
      <div className={style.openSidebar} onClick={onClose}>
        <TbLayoutSidebarLeftCollapse />
      </div>
      <div className={style.formLogo}>
        <img className={style.logo} src={Logo} alt='Logo' />
      </div>

      <div className={style.listItems}>
        <Sider>
          <Menu
            onClick={({ key }) => handleChanePath(key)}
            mode='inline'
            defaultSelectedKeys={[!productParam ? '/' : productParam]}
            items={items}
            className={style.menuItems}
            theme='light'
          />
        </Sider>
      </div>
    </div>
  )
}
