import React, { useState } from 'react'
import style from './Profile.module.scss'
import { Menu, MenuProps } from 'antd'
import { AppstoreOutlined, ProfileOutlined, UserOutlined, NotificationOutlined, PushpinOutlined } from '@ant-design/icons';
import ChangeProfile from './ChangeProfile';
import { useSelector } from 'react-redux';
import ChangeAddress from './ChangeAddress';
import ListOrderByUser from './ListOrderByUser';
export default function Profile() {

    const items: MenuProps['items'] = [
        {
            label: 'Profile',
            key: 'profile',
            icon: <UserOutlined style={{ color: 'blue', fontSize: '20px' }} />,
        },
        {
            label: 'Đơn Mua',
            key: 'list',
            icon: <ProfileOutlined style={{ color: 'orangered', fontSize: '20px' }} />,

        },
        {
            label: 'Địa Chỉ',
            key: 'address',
            icon: <PushpinOutlined style={{ color: 'red', fontSize: '20px' }} />,

        },
        {
            label: 'Thông báo',
            key: 'notification',
            icon: <NotificationOutlined style={{ color: 'yellowgreen', fontSize: '20px' }} />,

        },
        {
            label: 'Voucher',
            key: 'voucher',
            icon: <AppstoreOutlined />,

        },


    ];

    const [selectedOption, setSelectedOption] = useState(items[0].key); // Default: select the first option

    const renderContent = () => {
        switch (selectedOption) {
            case 'profile':
                return <ChangeProfile />;
            case 'list':
                return <ListOrderByUser />;
            case 'address':
                return <ChangeAddress />;
            case 'notification':
                return <div>Thông báo Content</div>;
            case 'voucher':
                return <div>Voucher Content</div>;
            default:
                return <div>Profile Content</div>;
        }
    };

    const handleMenuClick = (key: string) => {
        setSelectedOption(key);
    }

    const { current } = useSelector((state) => state.user)

    return (
        <div className={style.mainProfile}>
            <div className={style.contentProfile}>
                <div className={style.sideBar}>
                    <div className={style.formProfile}>
                        <div className={style.avatar}></div>
                        <div className={style.nameUser}>
                            <div>
                                {current.UserName}
                            </div>
                            <div>{current.Email}</div></div>


                    </div>
                    <Menu mode="vertical" items={items} className={style.menu} onClick={({ key }) => handleMenuClick(key)} />
                </div>

                <div className={style.content}>
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}
