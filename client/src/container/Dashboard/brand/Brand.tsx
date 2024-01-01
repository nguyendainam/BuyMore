import React, { useState } from 'react'
import style from './Brand.module.scss'
import { Button, Input, Modal, Typography, Upload, UploadFile, message } from 'antd'
import { TextEditor } from '../../../components/textEditor';
import { RcFile, UploadProps } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons'
import FormData from 'form-data';
import { CreateorUpdateBrand } from '../../../services/product';



const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
    })

const uploadButton = (
    <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
    </div>
)

interface IBrand {
    NameBrand: string,
    DescVI: string,
    DescEN: string
}


export default function Brand() {
    const [brand, setBrands] = useState<IBrand>({
        NameBrand: '',
        DescVI: '',
        DescEN: ''
    })
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [action, setAction] = useState<'create' | 'update'>('create')

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile)
        }

        setPreviewImage(file.url || (file.preview as string))
        setPreviewOpen(true)
        setPreviewTitle(
            file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1)
        )
    }

    const ValidateFileUpload = file => {
        const isJpgorPng =
            file.type === 'image/jpeg' ||
            file.type === 'image/png' ||
            file.type === 'image/jpg'
        if (!isJpgorPng) {
            console.error('You can only upload JPG or PNG files')
            return false
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            console.error('Images must be smaller than 2MB')
            return false
        }

        return isJpgorPng && isLt2M
    }
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        if (newFileList) {
            const isValidFiles = newFileList.every(file => ValidateFileUpload(file))
            if (isValidFiles) {
                const data = newFileList.map(obj => {
                    if (obj.status === 'error') {
                        return { ...obj, status: 'done' }
                    }
                    return obj
                })

                setFileList(data)
            }
        }
    }


    const handleGetdata = (data: string, key: string) => {
        setBrands((prevState) => ({
            ...prevState,
            [key]: data
        }));
    };

    const handleSaveData = async () => {
        if (!brand.NameBrand) {
            message.error('Không được để trống Tên')
        } else {
            const formdata = new FormData()
            formdata.append('ImageBrand', JSON.stringify(fileList))
            formdata.append('NameBrand', brand.NameBrand)
            formdata.append('DescVI', brand.DescVI)
            formdata.append('DescEN', brand.DescEN)
            formdata.append('action', action)

            const saveBrand = await CreateorUpdateBrand(formdata)
            if (saveBrand.data.err === 0) {
                message.success('Create Brand successful')
            } else {
                message.error('Create Brand Fail')
            }
        }
    }




    return (
        <div className={style.mainBrand}>
            <div className={style.formInput}>
                <div className={style.inputWidth}>
                    <Typography.Title level={5}>Name Brand VI </Typography.Title>
                    <Input value={brand.NameBrand} onChange={(event) => handleGetdata(event.target.value, 'NameBrand')} />
                </div>
                <div className={style.inputWidth}>
                    <Typography.Title level={5}>Image</Typography.Title>
                    <Upload
                        listType='picture-card'
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        multiple
                        accept='.png,.jpeg,.jpg,'
                    >
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>

                    <Modal
                        open={previewOpen}
                        title={previewTitle}
                        footer={null}
                        onCancel={() => setPreviewOpen(false)}
                    >
                        <img alt='example' style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </div>
            </div>
            <div className={style.formEditor}>
                <Typography.Title level={5}>Description VI</Typography.Title>
                <TextEditor editorKey='DescVI' handleSendContext={(data, key) => handleGetdata(data, key)} />
            </div>
            <div className={style.formEditor}>
                <Typography.Title level={5}>Description EN</Typography.Title>
                <TextEditor editorKey='DescEN' handleSendContext={(data, key) => handleGetdata(data, key)} />
            </div>


            <div className={style.formButton}>
                <Button type='primary' onClick={handleSaveData}>
                    Save
                </Button>
                <Button type='default'>Clear</Button>
            </div>
        </div>
    )
}


