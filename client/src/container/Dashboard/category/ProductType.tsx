import React, { useEffect, useState } from 'react'
import style from './ProductType.module.scss'
import { Button, Image, Input, Modal, Space, Table, Typography, Upload, UploadFile, UploadProps, message } from 'antd'
import { RcFile } from 'antd/es/upload';
import FormData from 'form-data';
import { createOrUpdatePrType } from '../../../services/product';
import { AllProductType } from '../../../components/GetdataCategory';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import Column from 'antd/es/table/Column';
import { MdDelete, MdEditSquare } from 'react-icons/md';
import { URL_SERVER_IMG } from '../../../until/enum';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });


interface IdataTypeProduct {
    Id?: string,
    nameVI: string,
    nameEN: string
}

export default function ProductType() {

    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [action, setAction] = useState<'create' | 'update'>('create')
    const [dataTypePr, setDataTypePr] = useState<IdataTypeProduct>({
        Id: '',
        nameEN: '',
        nameVI: ''
    })
    const [listItem, setListItem] = useState([])

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };
    const handleCancel = () => setPreviewOpen(false);

    const handleOnChange = (value: string, id: string) => {
        setDataTypePr(prevState => (
            {
                ...prevState,
                [id]: value
            }
        ))
    }


    const handleSendData = async () => {

        if (!dataTypePr.nameEN || !dataTypePr.nameVI) {
            message.error('Missing data required')
        } else {
            const formdata = new FormData()
            formdata.append('action', action)
            formdata.append('Image', JSON.stringify(fileList))
            formdata.append('Id', dataTypePr.Id)
            formdata.append('nameVI', dataTypePr.nameVI)
            formdata.append('nameEN', dataTypePr.nameEN)

            const sendata = await createOrUpdatePrType(formdata)
            if (sendata.data.err === 0) {
                message.success('Create success full')
                setDataTypePr({
                    Id: '',
                    nameEN: '',
                    nameVI: ''
                })
                setAction('create')
                setFileList([])
                handleGetAllList()
            } else {

                message.error("Failed")
                setDataTypePr({
                    Id: '',
                    nameEN: '',
                    nameVI: ''
                })
                setAction('create')
                setFileList([])
            }
        }

    }

    const handleGetAllList = async () => {
        const data = await AllProductType()
        console.log(data)
        setListItem(data)
    }

    useEffect(() => {
        handleGetAllList()
    }, [])

    return (
        <> <div className={style.main}>
            <div className={style.inputWidthMin}>
                <Typography.Title level={5}>Name VI</Typography.Title>
                <Input
                    onChange={(event) => handleOnChange(event.target.value, 'nameVI')}
                    value={dataTypePr.nameVI}
                />
            </div>
            <div className={style.inputWidthMin}>
                <Typography.Title level={5}>Name VI</Typography.Title>
                <Input
                    onChange={(event) => handleOnChange(event.target.value, 'nameEN')}
                    value={dataTypePr.nameEN}
                />
            </div>
            <div className={style.inputWidthMin}>
                <Typography.Title level={5}>Image</Typography.Title>
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={handlePreview}
                >
                    {fileList.length < 1 && '+ Upload'}

                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>

            </div>

            <div className={style.formButton} >
                <Button className={style.btnPrimary}
                    onClick={handleSendData}
                >Save</Button>
                <Button className={style.btnWhite}>Clear</Button>
            </div>

        </div >

            <div className={style.formList}>
                <Table dataSource={listItem} pagination={false} scroll={{ y: 500 }}>
                    <ColumnGroup title='Category'>
                        <Column title='Tiếng Việt' dataIndex='nameVI' />
                        <Column title='English' dataIndex='nameEN' />
                    </ColumnGroup>

                    <Column title='Image' dataIndex='Image'
                        render={data => (
                            <div>
                                <Image
                                    width={100}
                                    src={`${URL_SERVER_IMG}${data}`}
                                />
                            </div>
                        )}
                    />
                    <Column
                        title='Action'
                        key='key'
                        render={record => (
                            <Space size='middle'>
                                <div className={style.fontIconsm}>
                                    {record.isShow === true ? <FaRegEye className={style.iconGreen} /> :
                                        <FaRegEyeSlash
                                            className={style.iconstrongGreen} />}
                                </div>
                                <div className={style.fontIconsm} >
                                    <MdEditSquare className={style.iconBlue} />
                                </div>
                                <div className={style.fontIconsm}>
                                    <MdDelete className={style.iconRed} />
                                </div>
                            </Space>
                        )}
                    />
                </Table>
            </div>

        </>
    )
}
