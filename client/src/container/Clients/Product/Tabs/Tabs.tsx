import React from 'react'
import style from './Tabs.module.scss'
import { Tabs } from 'antd';
// import type { TabsProps } from 'antd';

export default function TabsProducts() {

    const onChange = (key: string) => {
        console.log(key);
    };
    const items = [
        {
            key: '1',
            label: 'Lap Top',
            children: [
                { list: 1, image: 2 },
                { list: 1, image: 2 },
                { list: 1, image: 2 }

            ],
        },
        {
            key: '2',
            label: 'Iphone',
            children: [
                { list: 1, image: 2 },
                { list: 1, image: 2 },
                { list: 1, image: 2 }

            ],
        },
        {
            key: '3',
            label: 'MacBook',
            children: [
                { list: 1, image: 2 },
                { list: 1, image: 2 },
                { list: 1, image: 2 }

            ],
        },
        {
            key: '4',
            label: 'Samsung',
            children: [
                { list: 1, image: 2 },
                { list: 1, image: 2 },
                { list: 1, image: 2 }

            ],
        },

    ];



    return (
        <div className={style.mainTabs}>
            <div className={style.formQC}>
                <img src='https://lh3.googleusercontent.com/9V_zby1_B-tjpUPAuqZmNpm0X7phAPHgL9NQsdzPkCdXTT6nqTsstvdBJljkZbPOdYZomcfNFYYCE-PsoHpQIPzI5OeExDU=w300-rw' />
            </div>
            <div className={style.Tab}>
                <div className={style.countdown}>Coundown</div>
                <Tabs defaultActiveKey="1" onChange={onChange} >

                    {items.map(item => (
                        <Tabs.TabPane key={item.key} tab={item.label}>
                            {item.children?.map((i) => {
                                return (
                                    <div className={style.formProduct}>
                                        {item.children[0].image} {item.key}
                                    </div>
                                )
                            })}

                        </Tabs.TabPane>
                    ))}

                </Tabs>

            </div>
        </div>
    )
}
