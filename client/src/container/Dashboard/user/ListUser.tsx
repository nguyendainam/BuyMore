import React, { useEffect, useState } from 'react'
import { getAllUserComponent } from '../../../components/ManageUser'
import style from './ListUser.module.scss'
import { Button, Input, Table } from 'antd';
import Column from 'antd/es/table/Column';
import man from '../../../assets/image/man.png'
import woman from '../../../assets/image/woman.png'
import { AiOutlineForm, AiTwotoneStop } from "react-icons/ai";
const { Search } = Input;
export default function ListUser() {
    const [dataUser, setDataUser] = useState([])

    const handleGetListUser = async () => {
        const data = await getAllUserComponent()

        setDataUser(data)
    }

    useEffect(() => {
        handleGetListUser()
    }, [])
    return (
        <div className={style.mainView}>
            <div className={style.formView}>
                <div className={style.formSearch}>
                    <div className={style.search}>
                        <Search placeholder="Search" enterButton />
                    </div>
                    <div className={style.addNewUser}>
                        <Button className={style.btnBlue} >Create New</Button>
                    </div>
                </div>
                <div className={style.formTable}>
                    <Table dataSource={dataUser}>
                        <Column title='Image'
                            render={(value, record) => (<div className={style.imageUser}>
                                <img src={record.Gender === 'M' ? man : woman} />
                            </div>)}
                        />
                        <Column title='UserName' dataIndex={'UserName'} />
                        <Column title='Email' dataIndex={'Email'} />
                        <Column title='Gender'
                            render={(value, record) => {
                                let color;
                                let name;
                                switch (record.Gender) {
                                    case 'M':
                                        color = '#C3E2C2';
                                        name = 'Man'
                                        break;
                                    case 'F':
                                        color = '#FFC0D9';
                                        name = 'Woman'
                                        break;
                                    case 'O':
                                        color = 'green';
                                        name = 'Other'
                                        break;
                                    default:
                                        color = 'gray'; // Mặc định cho trường hợp khác
                                }
                                return (
                                    <div className={style.formInfor} style={{ background: `${color}` }} >
                                        <div style={{ fontWeight: 'bold', color: 'white' }}>{name}</div>
                                    </div>
                                );
                            }}
                        />

                        <Column title='Is Active' dataIndex={'Active'}
                            render={(value, record) => {
                                console.log('record', record)
                                return (
                                    <div className={style.formInfor} >{record.Active === true ? 'True' : 'False'}</div>
                                )
                            }}
                        />

                        <Column title='Action'
                            render={(value, record) => {
                                console.log('record', record)
                                return (
                                    <div className={style.formInforAction} >
                                        < AiOutlineForm className={style.icon} />
                                        < AiTwotoneStop className={style.icon} />
                                    </div>
                                )
                            }}
                        />
                    </Table>
                </div>
            </div>
        </div>
    )
}
