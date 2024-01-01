import React, { useState, useEffect } from 'react'
import type { DrawerProps } from 'antd'
import { Drawer } from 'antd'
import style from './headerSideBar.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import getDataMenu from '../../../components/datatest/menuHeader'

// import { Icon } from 'antd'
interface IHeaderSideBarProps {
  OpenSideBar: boolean
  onClose: () => void
}

interface IMenuItem {
  key: number | string
  value: string
  icon?: IconProp
}

const HeaderSideBar: React.FC<IHeaderSideBarProps> = ({
  OpenSideBar,
  onClose
}) => {
  const [open, setOpen] = useState(OpenSideBar)
  const [placement] = useState<DrawerProps['placement']>('left')
  const [dataMenu, setDataMenu] = useState<IMenuItem[]>(getDataMenu)

  const onCloseDrawer = () => {
    onClose()
  }

  useEffect(() => {
    setOpen(OpenSideBar)
    setDataMenu(getDataMenu)
  }, [OpenSideBar])

  return (
    <>
      <Drawer
        title='Menu Title'
        placement={placement}
        closable={false}
        onClose={onCloseDrawer}
        open={open}
        key={placement}
        className={style.mainDrawer}
      >
        {dataMenu?.map(item => {
          return (
            <div className={style.formList} key={item.key}>
              <div className={style.icons}>
                <FontAwesomeIcon icon={item.icon} />
              </div>
              {item.value}
            </div>
          )
        })}
      </Drawer>
    </>
  )
}

export default HeaderSideBar
