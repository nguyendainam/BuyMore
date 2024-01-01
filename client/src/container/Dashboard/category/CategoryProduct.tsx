import React, { useEffect, useState } from 'react'
import ImgCrop from 'antd-img-crop'
import { Upload, message } from 'antd'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import style from './CategoryProduct.module.scss'
import { Input, Typography, Button } from 'antd'
import FormData from 'form-data'
import { CorUCategories } from '../../../services/product'
import { List } from 'antd'
import { getListCategory } from '../../../components/GetdataCategory'
import { Image } from 'antd'
import { URL_SERVER_IMG } from '../../../until/enum'
import { MdEditSquare, MdDelete } from 'react-icons/md'

interface ICategory {
  idCate?: string | number
  nameVI: string
  nameEN: string
  oldImage?: string
}

interface IActionCategory {
  action: 'create' | 'update'
}

export default function CategoryProduct() {
  const [actionCat, setactionCat] = useState<IActionCategory>({
    action: 'create'
  })
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [category, setCategory] = useState<ICategory>({
    idCate: '',
    nameVI: '',
    nameEN: '',
    oldImage: ''
  })
  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const [dataCategory, setDataCategory] = useState([])

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as RcFile)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  const handleOnchange = (value: string, id: string) => {
    setCategory(prevCategory => ({ ...prevCategory, [id]: value }))
  }

  const handleOnSave = async () => {
    const formData = new FormData()
    formData.append('action', actionCat.action)
    formData.append('Image', JSON.stringify(fileList))
    formData.append('nameVI', category.nameVI)
    formData.append('nameEN', category.nameEN)

    if (actionCat.action === 'create') {
      const saveData = await CorUCategories(formData)
      if (saveData.data.err === 0) {
        const data = await getListCategory()
        setDataCategory(data)
        handleClear()


        message.success('Created category successfully')
      } else {
        message.error('Error creating category')
      }
    } else if (actionCat.action === 'update') {
      formData.append('Id', category.idCate)
      const updateCat = await CorUCategories(formData)
      if (updateCat.data.err === 0) {
        message.success('Update category successfully')
        const fetchData = async () => {
          const data = await getListCategory()
          setDataCategory(data)
        }

        setFileList([])

        setactionCat({ action: 'create' })
        setCategory({
          nameEN: '',
          nameVI: '',
          oldImage: ``
        })

        fetchData().catch(console.error)
      } else {
        message.error('Error updating category')
      }
    }
  }

  const handleEditCategory = async item => {
    setactionCat({ action: 'update' })
    setCategory({
      idCate: item.key,
      nameEN: item.titleEN,
      nameVI: item.titleVi,
      oldImage: `${URL_SERVER_IMG}${item.image}`
    })
  }

  const handleClear = () => {
    setactionCat({ action: 'create' })
    setCategory({
      nameEN: '',
      nameVI: '',
      oldImage: ``
    })
    setFileList([])
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getListCategory()
      setDataCategory(data)
    }
    fetchData().catch(console.error)
  }, [])

  return (
    <>
      <div className={style.mainCategory}>
        <div className={style.formAddCategory}>
          <div className={style.inputMaxWidth}>
            <Typography.Title level={5}>Name Product VI </Typography.Title>
            <Input
              value={category.nameVI}
              onChange={event => handleOnchange(event.target.value, 'nameVI')}
            />
          </div>
          <div className={style.inputMaxWidth}>
            <Typography.Title level={5}>Name Product EN</Typography.Title>
            <Input
              value={category.nameEN}
              onChange={event => handleOnchange(event.target.value, 'nameEN')}
            />
          </div>
          <div className={style.formImageCate}>
            <div className={style.inputWidth45}>
              <Typography.Title level={5}>Icon Category</Typography.Title>
              <ImgCrop rotationSlider beforeCrop={handleOnchange}>
                <Upload
                  listType='picture-card'
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                >
                  {fileList.length < 1 && '+ Upload'}
                </Upload>
              </ImgCrop>
            </div>
            {actionCat.action === 'update' ? (
              <div className={style.inputWidth45}>
                <Typography.Title level={5}>Old Image</Typography.Title>
                <Image className={style.Oldimage} src={category.oldImage} />
              </div>
            ) : (
              ''
            )}
          </div>

          <div className={style.inputMaxWidth}>
            <Button type='primary' onClick={handleOnSave}>
              {actionCat.action === 'create' ? 'Save' : 'Update'}
            </Button>

            <Button
              type='dashed'
              style={{ marginLeft: '5px' }}
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        </div>
        <div className={style.formListCategory}>
          <List itemLayout='horizontal' dataSource={dataCategory}>
            {dataCategory.map((item, index) => {
              return (
                <div className={style.formListItem} key={index}>
                  <div className={style.formText}>
                    <div className={style.formItem}>
                      Tiếng Việt: {item.titleVi}
                    </div>
                    <div className={style.formItem}>
                      Tiếng Anh: {item.titleEN}
                    </div>
                  </div>
                  <div className={style.formImage}>
                    <Image
                      className={style.image}
                      src={`${URL_SERVER_IMG}${item.image}`}
                    />
                  </div>

                  <div className={style.formButton}>
                    <div
                      className={style.buttonEdit}
                      onClick={() => handleEditCategory(item)}
                    >
                      <MdEditSquare />
                    </div>

                    <div className={style.buttonDelete}>
                      <MdDelete />
                    </div>
                  </div>
                </div>
              )
            })}
          </List>
        </div>
      </div>
    </>
  )
}
