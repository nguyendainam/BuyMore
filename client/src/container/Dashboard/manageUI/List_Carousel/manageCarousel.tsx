import React, { useEffect, useState } from 'react'
import {
  Button,
  Image,
  Modal,
  Space,
  Table,
  Upload,
  UploadFile,
  UploadProps,
  message
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/es/upload'
import style from './manageCarousel.module.scss'

import { createNewSlide } from '../../../../services/product'

import { ImageCarousel } from '../../../../components/CarouselImage'
import { IImageCarousel } from '../../../../components/CarouselImage'
import Column from 'antd/es/table/Column'
import { URL_SERVER_IMG } from '../../../../until/enum'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { MdDelete, MdEditSquare } from 'react-icons/md'
import FormData from 'form-data'

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })

export default function ManageCarousel() {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [previewTitle, setPreviewTitle] = useState<string>('')
  const [dataListImage, setdataListImage] = useState<IImageCarousel[]>([])
  const key = 'All'
  const onChange: UploadProps['onChange'] = async ({
    fileList: newFileList
  }) => {
    setFileList(newFileList)


    // Use Promise.all to handle asynchronous image previews
    const previews = await Promise.all(
      newFileList.map(async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj as RcFile)
        }
        return file.url || (file.preview as string)
      })
    )

    setPreviewImages(previews)


  }

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file)
    setPreviewOpen(true)
  }

  const handleOnSave = async () => {
    // console.log(Object.values(fileList))
    // console.log(typeof fileList)
    const formData = new FormData()
    formData.append('ListImage', JSON.stringify(fileList))
    formData.append('typeImage', 'mainCarousel')

    const result = await createNewSlide(formData)
    if (result.data.err === 0) {
      message.success('Created successfully')
      handleGetListImage()
    } else {
      message.error('Failed to create')
    }
  }

  const handleGetListImage = async () => {

    const ListImage = await ImageCarousel(key)
    setdataListImage(ListImage)
  }

  useEffect(() => {
    handleGetListImage()

  }, [])

  const handleCancel = () => setPreviewOpen(false)
  return (
    <div className={style.mainManage}>
      <div>
        <span>Add Image Carousel</span>
      </div>
      <div className={style.formAddImg}>
        <div className={style.inputWidth45}>
          <Space direction='vertical' style={{ width: '100%' }} size='large'>
            <Upload
              multiple
              listType='picture'
              maxCount={5}
              onChange={onChange}
            >
              <Button icon={<UploadOutlined />}>Upload (Max: 5)</Button>
            </Upload>
          </Space>
        </div>

        <div className={style.previewImage}>
          {previewImages.length > 0 &&
            previewImages.map((image, index) => (
              <div className={style.image} key={index}>
                <img
                  alt={previewTitle}
                  style={{ width: '100%', height: '100%' }}
                  src={image}
                  onClick={() => handlePreview(image)}
                />
              </div>
            ))}
        </div>

        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt='example' style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
      <div className={style.formButton}>
        <Button className={style.btnPrimary} onClick={handleOnSave}>
          Save
        </Button>
        <Button className={style.btnWhite}>Clear</Button>
      </div>

      <div className={style.formTable}>
        <Table dataSource={dataListImage} pagination={false} scroll={{ y: 450 }}>
          <Column
            title='Image'
            dataIndex={'Image'}
            render={data => (
              <div>
                <Image
                  width={300}
                  height={150}
                  src={`${URL_SERVER_IMG}${data}`}
                />
              </div>
            )}
          />
          <Column title='Type Image' dataIndex={'type'} />
          <Column
            title='Action'
            key='key'
            render={record => (
              <Space size='middle'>
                <div className={style.fontIconsm}>
                  {record.IsShow === true ? <FaRegEye className={style.iconGreen} /> :
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
    </div>
  )
}
