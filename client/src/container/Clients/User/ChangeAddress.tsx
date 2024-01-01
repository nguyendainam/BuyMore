import React, { useEffect, useState } from 'react'
import style from './ChangeAddress.module.scss'
import { PlusOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd'
// import { getDataLocation } from '../../../components/Location';
import AddAddress from '../../../components/ModalcreateAddress';
import { ListAddUser } from '../../../components/GetUser';
import Column from 'antd/es/table/Column';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import { getDataLocation } from '../../../components/Location';
import { MdDelete, MdEditSquare } from "react-icons/md";
import { Checkbox } from 'antd';
interface IOption {
    key: string,
    label: string,
}

interface IOption1 {
    value: string,
    label: string,
}

interface dataUserAdd {
    City: IOption,
    District: IOption1,
    Id_Address: string,
    IsDefault: boolean,
    Line1: string,
    PhoneNumber: string,
    UserName: string,
    Ward: IOption1
}

export default function ChangeAddress() {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [dataUserAdd, setDataUserAdd] = useState<dataUserAdd[]>([])

    // useEffect(() => {
    //     getDataLocation()
    // }, [])


    const handleGetListUser = async () => {
        const list = await ListAddUser()
        const local = getDataLocation()
        const data: dataUserAdd[] = list.map(item => ({
            City: local.filter(city => city.key === item.City)[0],
            District: local.filter(city => city.key === item.City)[0].districts?.find((dis) => dis.value === item.District),
            Id_Address: item.Id_Address,
            IsDefault: item.IsDefault,
            Line1: item.Line1,
            PhoneNumber: item.PhoneNumber,
            UserName: item.UserName,
            Ward: local.filter(city => city.key === item.City)[0].districts?.filter((dis) => dis.value === item.District)[0].wards?.find((w) => w.value === item.Ward),
        }))
        setDataUserAdd(data)
    }

    useEffect(() => {
        handleGetListUser()
    }, [])


    const handleIsOpen = () => {
        setOpenModal(!openModal)
    }




    return (
        <div className={style.MainChangeAddress}>
            <AddAddress OpenModal={openModal} Onclose={handleIsOpen} updateAfterSave={handleGetListUser} />

            <div className={style.formTitlePro}>
                <div className={style.f14gray}>Địa chỉ nhận hàng</div>
                <Button className={style.btnBluelength} onClick={() => handleIsOpen()} > <PlusOutlined /> Thêm Địa Chỉ</Button>
            </div>
            <div className={style.form}>
                <Table dataSource={dataUserAdd} pagination={false} scroll={{ y: '100%' }}>
                    <Column title='Tên Người Nhận' dataIndex='UserName' />
                    <Column title='Số Điện Thoại' dataIndex='PhoneNumber' />
                    <Column
                        title='Địa Chỉ'
                        render={(text, record) => (
                            <div className={style.formAddress}>
                                {/* {record.Line1}, {record.Ward} , {record.District}  */}

                                {record.Line1}, {record.Ward.label}, {record.District.label} , {record.City.label}
                                {/* For example, you can use record.Id_Address to access the ID */}
                            </div>
                        )}
                    />

                    <Column title='Địa Chỉ Mặc Định'
                        render={(text, record) => (
                            <div className={style.formCheck}>  <Checkbox checked={record.IsDefault} value={record.IsDefault} ></Checkbox></div>

                        )}
                    />


                    <Column
                        title='Địa Chỉ'
                        render={(text, record) => (
                            <div className={style.formAction}>
                                <MdEditSquare class={style.icon} />
                                <MdDelete class={style.icon} />
                            </div>
                        )}
                    />


                </Table>
            </div>
        </div>
    )
}
