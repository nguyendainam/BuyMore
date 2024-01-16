import React, { useState, useEffect, Dispatch } from "react";
import style from "./Header.module.scss";
import Language from "../../../components/language";
import { Logo } from "../../../assets/image";
import { Search } from "../../../components/search";
import _throttle from "lodash/throttle";
import { BiUser, BiSolidCartAlt } from "react-icons/bi";
import { AiOutlineMenu } from "react-icons/ai";
import { Dropdown, Menu, Space, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import dataTest from "../../../components/datatest/listItem.json";
// import category from '../../../components/datatest/category.json'
import type { MenuProps } from "antd";
import HeaderReponsive from "./HeaderReponsive";
import { ListItemCategoryHome } from "../../../components/GetdataCategory";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MdAdminPanelSettings } from "react-icons/md";
import { getCurrent, logout } from "../../../redux/action/asyncAction";
import unidecode from "unidecode";
// import { extraReducers } from "../../../redux/Slice/userSlice";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import _ from "lodash";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export default function Header() {
  const { t } = useTranslation();

  const [isScrolled, setIsScrolled] = useState(false);

  const [categoryData, setCategoryData] = useState([]);

  const handleGetDataCat = async () => {
    const dataCat = await ListItemCategoryHome();
    setCategoryData(dataCat);
  };

  useEffect(() => {
    handleGetDataCat();
  }, []);

  useEffect(() => {
    const handleScroll = _throttle(() => {
      const scrollThreshold = 100;
      const scrollPosition = Math.round(window.scrollY);
      requestAnimationFrame(() => {
        setIsScrolled(scrollPosition > scrollThreshold);
      });
    }, 100);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const handleGetData = (key: string) => {
    if (dataTest[key]) {
      const menuItems = dataTest[key].map((item) => (
        <Menu.Item key={item.key} className={style.itemMenu}>
          <div className={style.formDropdownItem}> {item.label}</div>
        </Menu.Item>
      ));

      return <Menu className={style.formDropdownMenu}>{menuItems}</Menu>;
    } else {
      return <></>;
    }
  };

  const { language } = useSelector((state) => state.system)
  const OptionCategory = () => {
    const dataCategory = categoryData.map((item) => ({
      label: language === 'vi' ? item.title : item.titleEN,
      key: item.key,
      children:
        item.list.length > 0
          ? item.list?.map((i) => ({
            label: language === 'vi' ? i.name : i.nameEN,
            key: i.key,
            children:
              i.listItem.length > 0
                ? i.listItem.map((i1) => ({
                  label: language === 'vi' ? i1.name : i1.nameEN,
                  key: i1.keyItem,
                }))
                : undefined,
          }))
          : undefined,
    }));

    const selectAllProductByTag = (tag: string, key: string) => {
      const nametag = unidecode(tag);

      const finalSlug = _.replace(nametag, /\s+/g, "-");
      navigate(`/t/${finalSlug}?key=${key}`);
    };




    const categoryMenuItems = (
      <Menu className={style.Menu} mode="vertical">
        {dataCategory.map((item) => (
          <>
            <Menu.SubMenu
              key={item.key}
              title={item.label}
              icon={BiSolidCartAlt}
            >
              <div className={style.formListItem}>
                {item.children &&
                  item.children.map((child) => (
                    <div className={style.formCategory}>
                      <div className={style.titleCat} key={child.key}>
                        {child.label}
                      </div>
                      {child.children &&
                        child.children.map((itemchild) => (
                          <div
                            className={style.itemCat}
                            key={itemchild.key}
                            onClick={() =>
                              selectAllProductByTag(
                                itemchild.label,
                                itemchild.key
                              )
                            }
                          >
                            {itemchild.label}
                          </div>
                        ))}
                    </div>
                  ))}

                {!item.children && (
                  <div className={style.dataEmpty}>
                    <div>DataEmpty</div>
                  </div>
                )}
              </div>
            </Menu.SubMenu>
          </>
        ))}
      </Menu>
    );

    return (
      <Dropdown
        trigger={["click"]}
        className={style.dropdownCategory}
        overlay={categoryMenuItems}
      >
        <div className={style.leftMenuHeader}>
          <div className={style.formLineIcons}>
            <AiOutlineMenu />
          </div>
          <div className={style.formTitleListCategory}>
            {t('brower')}
          </div>
        </div>
      </Dropdown>
    );
  };

  const navigate = useNavigate();
  const returnHome = () => {
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const handleProfile = () => {
    navigate("/us/profile");
  };
  const dispatch = useDispatch();
  const { isLogin, current, msg } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      if (isLogin === true) {
        await dispatch(getCurrent());
      }
    };
    fetchData();
  }, [dispatch, isLogin]);

  useEffect(() => {
    if (msg) message.error(msg);
  }, [msg]);

  const handleSignout = async () => {
    await dispatch(logout());
  };

  const information = () => {
    return (
      <div className={style.OptionAdmin}>
        <div className={style.listOption}>
          <div className={style.item} onClick={handleProfile}>
            {t('profile')}
            <UserOutlined className={style.icon} style={{ color: "#265073" }} />
          </div>
          <div className={style.item} onClick={handleSignout}>
            {t('signout')}
            <LogoutOutlined className={style.icon} style={{ color: "red" }} />
          </div>

          {current.RoleId === "Admin" && (
            <div className={style.item} onClick={() => navigate("/system")}>
              Admin
              <MdAdminPanelSettings
                className={style.icon}
                style={{ color: "red" }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleOnpenCart = () => {
    navigate("/us/cart");
  };

  return (
    <div className={`${style.mainHeader} ${isScrolled ? style.scrolled : ""}`}>
      <div className={style.topHeader}>
        <div>{t('welcome')}</div>
        <div>
          <Language />
        </div>
      </div>

      <div className={style.topHeaderTablet}>
        <HeaderReponsive />
      </div>

      <div className={style.centerHeader}>
        <div className={style.formLogo} onClick={returnHome} style={{ cursor: 'pointer' }}>
          <img src={Logo} className={style.imgLogo} />
        </div>

        <div className={style.formSearch}>
          <Search />
        </div>

        <div className={style.aboutUser}>
          <div className={style.loginUser} style={{ cursor: 'pointer' }}>
            <div className={style.iconLogin}>
              <BiUser />
            </div>

            {isLogin && current ? (
              <>
                <Dropdown
                  overlay={information}
                  placement="bottomRight"
                  arrow={{ pointAtCenter: true }}

                >
                  <Space>
                    <div className={style.textUser}>
                      {"Wellcome:" + current.UserName}
                    </div>
                  </Space>
                </Dropdown>
              </>
            ) : (
              <div className={style.centerForm} onClick={handleLogin} style={{ cursor: 'pointer' }}>
                <div className={style.fsmin}>{t('login')}</div>
                <div className="m-2">{t('account')}</div>
              </div>
            )}
          </div>

          <div className={style.iconCart} onClick={handleOnpenCart} style={{ cursor: 'pointer' }}>
            <BiSolidCartAlt />
          </div>
        </div>
      </div>
      <div className={`${style.MenuHeader} ${isScrolled ? style.active : ""}`}>
        <OptionCategory />
        <div className={style.centerMenuHeader}>
          {/* <div className={style.centerDropdown}>{menuComponents}</div> */}
        </div>
      </div>
    </div>
  );
}
