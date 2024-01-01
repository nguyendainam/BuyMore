import React from 'react'
import style from './HeaderReponsive.module.scss'
import { AiOutlineMenuUnfold, AiOutlineShoppingCart } from 'react-icons/ai'
import { Logo } from '../../../assets/image'
import HeaderSideBar from '../SideBar/headerSideBar'
export default function HeaderReponsive() {
  const [openMenu, setOpenMenu] = React.useState<boolean>(false)

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu)
  }

  return (
    <>
      <div className={style.mainHeaderReponsive}>
        <div className={style.formItems} onClick={handleOpenMenu}>
          <AiOutlineMenuUnfold />
        </div>

        <div className={style.formLogo}>
          <img src={Logo} className={style.imgLogo}

          />
        </div>

        <div className={style.formItems}>
          <AiOutlineShoppingCart />
        </div>

        <HeaderSideBar OpenSideBar={openMenu} onClose={handleOpenMenu} />
      </div>
    </>
  )
}
