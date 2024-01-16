import React, { useEffect, useState } from 'react'
import style from './Profile.module.scss'
import { Avatar, Menu, MenuProps } from 'antd'
import { AppstoreOutlined, ProfileOutlined, UserOutlined, NotificationOutlined, PushpinOutlined } from '@ant-design/icons';
import ChangeProfile from './ChangeProfile';
import { useSelector } from 'react-redux';
import ChangeAddress from './ChangeAddress';
import ListOrderByUser from './ListOrderByUser';

const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
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
                return <div>Đang trong quá trình phát triển...</div>;
            case 'voucher':
                return <div>Đang trong quá trình phát triển...</div>;
            default:
                return <div>Profile Content</div>;
        }
    };

    const handleMenuClick = (key: string) => {
        setSelectedOption(key);
    }
    const [color, setColor] = useState(ColorList[0]);

    const { current } = useSelector((state) => state.user)
    const random = (array) => array[Math.floor(Math.random() * array.length)];
    useEffect(() => {
        setColor(random(ColorList))
    }, [])


    return (
        <div className={style.mainProfile}>
            <div className={style.contentProfile}>
                <div className={style.sideBar}>
                    <div className={style.formProfile}>
                        <div className={style.avatar}>
                            <Avatar style={{ backgroundColor: color, verticalAlign: 'middle', width: '100%', height: '100%', display: 'flex', alignItems: 'center' }} size="large" >
                                {current.UserName}
                            </Avatar>
                        </div>
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
