import React, { useEffect, useState } from 'react'
import style from './Discount.module.scss'
import { Button, DatePicker, Input, Space, Table, Typography, message } from 'antd'
import { getListDiscount } from '../../../components/Discount'
import Column from 'antd/es/table/Column'
import ColumnGroup from 'antd/es/table/ColumnGroup'
import moment from 'moment'
import dayjs from 'dayjs';
import FormData from 'form-data'
import { createOrUpdateDiscount } from '../../../services/product'
import { MdDelete, MdEditSquare } from 'react-icons/md'
const { RangePicker } = DatePicker;


interface IDataDiscount {
    Id: string,
    nameVI: string,
    nameEN: string,
    Percent: number,
    Quantity: number,
    dateTime: [
        {
            dateStart: string | Date,
            dateEnd: string | Date
        }
    ]
}

export default function Discount() {
    const [listDiscount, setListDiscount] = useState([])
    const [dataDiscount, setDataDiscount] = useState<IDataDiscount>({
        Id: '',
        nameVI: '',
        nameEN: '',
        Percent: 0,
        Quantity: 0,
        dateTime: [
            {
                dateStart: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
                dateEnd: moment(Date.now()).format('YYYY-MM-DD HH:mm')
            }
        ]
    })
    const [action, setAction] = useState<'create' | 'update'>('create')

    const handleGetList = async () => {
        const data = await getListDiscount()
        if (data) {
            setListDiscount(data)
        } else {
            setListDiscount([])
        }
    }

    useEffect(() => {
        handleGetList()

    }, [])

    const handleTimeChange = (dates) => {
        if (dates.length > 0) {
            setDataDiscount(prevState => (
                {
                    ...prevState,
                    dateTime: [
                        {
                            dateStart: moment(dates[0].$d).format('YYYY-MM-DD HH:mm'),
                            dateEnd: moment(dates[1].$d).format('YYYY-MM-DD HH:mm')
                        }
                    ]

                }


            ))
        }
    };


    const handleOnchange = (value: string, id: string) => {
        setDataDiscount(prevCategory => ({ ...prevCategory, [id]: value }))
    }

    const handleOnSave = async () => {
        const formdata = new FormData()
        formdata.append('action', action)
        formdata.append('Id', dataDiscount.Id)
        formdata.append('NameVI', dataDiscount.nameVI)
        formdata.append('NameEN', dataDiscount.nameEN)
        formdata.append('Quantity', dataDiscount.Quantity)
        formdata.append('Percent', dataDiscount.Percent)
        formdata.append('DateStart', dataDiscount.dateTime[0].dateStart)
        formdata.append('DateEnd', dataDiscount.dateTime[0].dateEnd)

        const saveData = await createOrUpdateDiscount(formdata)
        if (saveData.data.err === 0) {
            message.success('Create Discount successfull ')
            handleGetList()
        } else {
            message.error('Create failed')
        }

    }

    const fetchDataUpdate = (data) => {
        setDataDiscount({
            Id: data.Id,
            nameEN: data.NameEN,
            nameVI: data.NameVI,
            Percent: data.Discount_Percent,
            Quantity: data.Quantity,
            dateTime: [
                {
                    dateStart: moment(data.DateStart).format('YYYY-MM-DD HH:mm'),
                    dateEnd: moment(data.DateEnd).format('YYYY-MM-DD HH:mm')
                }
            ]
        })

        setAction('update')
        handleGetList()
    }

    const handleClear = () => {
        setDataDiscount({
            Id: '',
            nameEN: '',
            nameVI: '',
            Percent: 0,
            Quantity: 0,
            dateTime: [
                {
                    dateStart: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
                    dateEnd: moment(Date.now()).format('YYYY-MM-DD HH:mm')
                }
            ]
        })

        setAction('create')
    }


    return (
        <div className={style.mainDiscount}>

            <div className={style.formInput}>
                <div className={style.inputWidth}>
                    <Typography.Title level={5}>Name Discount VI </Typography.Title>
                    <Input
                        onChange={(event) => handleOnchange(event.target.value, 'nameVI')}
                        value={dataDiscount.nameVI}
                    />
                </div>
                <div className={style.inputWidth}>
                    <Typography.Title level={5}>Name Discount EN </Typography.Title>
                    <Input
                        onChange={(event) => handleOnchange(event.target.value, 'nameEN')}
                        value={dataDiscount.nameEN}

                    />
                </div>
                <div className={style.inputWidth}>
                    <Typography.Title level={5} >Percent</Typography.Title>
                    <Input
                        type='number'
                        onChange={(event) => handleOnchange(event.target.value, 'Percent')}
                        value={dataDiscount.Percent}
                        max={100}
                        min={0}

                    />
                </div>
                <div className={style.inputWidth}>
                    <Typography.Title level={5}>Quantity</Typography.Title>
                    <Input
                        type='number'
                        onChange={(event) => handleOnchange(event.target.value, 'Quantity')}
                        value={dataDiscount.Quantity}
                        min={0} />
                </div>
                <div className={style.inputWidth}>
                    <Typography.Title level={5}>Date</Typography.Title>
                    <Space direction="vertical" size={12}>
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}

                            format="DD-MM-YYYY HH:mm"
                            onChange={handleTimeChange}
                            defaultValue={[
                                dayjs(dataDiscount.dateTime[0].dateStart),
                                dayjs(dataDiscount.dateTime[0].dateEnd)
                            ]}

                            value={
                                [
                                    dayjs(dataDiscount.dateTime[0].dateStart),
                                    dayjs(dataDiscount.dateTime[0].dateEnd)
                                ]
                            }
                        />
                    </Space>
                </div>

                <div className={style.formMaxWidth}>
                    <Button className={style.btnPrimary} onClick={handleOnSave}>
                        {action === 'create' ? 'Create' : 'Update'}
                    </Button>
                    <Button className={style.btnWhite} onClick={handleClear}>Clear</Button>
                </div>
            </div>

            <div className={style.listDiscount}>
                <Table dataSource={listDiscount} pagination={false} scroll={{ y: 300 }}>
                    <ColumnGroup title='Name Discount'>
                        <Column title='nameVI' dataIndex='NameVI' />
                        <Column title='nameEN' dataIndex='NameEN' />
                    </ColumnGroup>
                    <Column title='Discount Percent' dataIndex='Discount_Percent'
                        render={(text) => <span>{`${text}%`}</span>}
                    />

                    <Column title='Quantity' dataIndex='Quantity' />
                    <ColumnGroup title='Date'>
                        <Column title='Date Start' dataIndex='DateStart'
                            render={(dateString) => {
                                const date = new Date(dateString);
                                const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                                return <span>{moment(formattedDate).format('DD/MM/YYYY HH:mm')}</span>;
                            }}
                        />
                        <Column title='Date End' dataIndex='DateEnd'
                            render={(dateString) => {
                                const date = new Date(dateString);
                                const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
                                return <span>{moment(formattedDate).format('DD/MM/YYYY HH:mm')}</span>;
                            }} />
                    </ColumnGroup>
                    <Column
                        title='Action'
                        key='Id'
                        render={record => (
                            <Space size='middle'>
                                <div
                                    className={style.buttonEdit}
                                    onClick={() => fetchDataUpdate(record)}
                                >
                                    <MdEditSquare />
                                </div>

                                <div className={style.buttonDelete}>
                                    <MdDelete

                                    />
                                </div>
                            </Space>
                        )}
                    />


                </Table>
            </div>
        </div>
    )
}
