import React, { useEffect, useState } from 'react'
import styles from './ListCategory.module.scss'
import { Button, Input, Select, Space, Table, Typography, message } from 'antd'
import {
  getListCategory,
  AllListCategory,
  getAllCategorybyItem
} from '../../../components/GetdataCategory'
import { CorUItemCategory, getAllListCategory } from '../../../services/product'
import FormData from 'form-data'
import Column from 'antd/es/table/Column'
import ColumnGroup from 'antd/es/table/ColumnGroup'
import { MdDelete, MdEditSquare } from 'react-icons/md'

interface IOptions {
  value: string
  label: string
}

interface IitemCategory {
  idItem?: string
  IdListCat: string
  IdCat: string
  nameVI: string
  nameEN: string
}

interface DataType {
  key: string
  Category: string
  nameVI: string
  nameEN: string
  IdCategory: string
}

export default function ItemsCategory() {
  const [options, setOptions] = useState<IOptions[]>([])
  const [optionsList, setOptionsList] = useState<IOptions[]>([])
  const [openSelect, setOpenSelect] = useState<boolean>(true)
  const [action, setAction] = useState('create')
  const [itemCategory, setItemCategory] = useState<IitemCategory>({
    idItem: '',
    IdListCat: '',
    nameVI: '',
    nameEN: '',
    IdCat: ''
  })

  const [listItems, setListItems] = useState([])

  const [dataListCat, setDataListCat] = useState([])
  const handleGetCategory = async () => {
    // ShowLoading.show()

    const data = await getListCategory()
    const newOptions = data.map(item => ({
      value: item.key.toString(),
      label: item.titleVi
    }))
    setOptions(newOptions)
  }

  const handleGetListItem = async () => {
    const data = await AllListCategory()
    setDataListCat(data)
  }

  const handleOnchangeCate = async (value: string, id: string) => {
    setItemCategory(prevCategory => ({ ...prevCategory, [id]: value }))

    const listCatById = dataListCat.filter(
      item => item.IdCat.toString() === value
    )
    const newOptionList = listCatById.map(item => ({
      value: item.idListCat,
      label: item.nameEN
    }))

    setItemCategory(prevState => ({
      ...prevState,
      IdListCat: ''
    }))
    setOptionsList(newOptionList)

    if (listCatById.length > 0) {
      setItemCategory(prevState => ({
        ...prevState,
        IdListCat: ''
      }))
      setOpenSelect(false)
    } else {
      setOptionsList([])
      setOpenSelect(true)
    }
  }

  const handleOnchange = (value: string, id: string) => {
    setItemCategory(prevCategory => ({ ...prevCategory, [id]: value }))
  }

  const handleOnSave = async () => {
    const formdata = new FormData()
    if (action === 'create') {
      formdata.append('action', action)
      formdata.append('nameVI', itemCategory.nameVI)
      formdata.append('nameEN', itemCategory.nameEN)
      formdata.append('Id_listCategory', itemCategory.IdListCat)
      const SaveItem = await CorUItemCategory(formdata)
      if (SaveItem.data.err === 0) {
        hanleGetListItembyId()
        setOpenSelect(true)
        setItemCategory({
          IdCat: '',
          IdListCat: '',
          idItem: '',
          nameEN: '',
          nameVI: ''
        })
        message.success('Create Items Successfully')
      } else {
        message.error('Create Items Failure')
      }
    } else if (action === 'update') {
      formdata.append('IdItem', itemCategory.idItem)
      formdata.append('action', action)
      formdata.append('nameVI', itemCategory.nameVI)
      formdata.append('nameEN', itemCategory.nameEN)
      formdata.append('Id_listCategory', itemCategory.IdListCat)
      const SaveItem = await CorUItemCategory(formdata)
      if (SaveItem.data.err === 0) {
        hanleGetListItembyId()
        setOpenSelect(true)
        setItemCategory({
          IdCat: '',
          IdListCat: '',
          idItem: '',
          nameEN: '',
          nameVI: ''
        })
        message.success('Create Items Successfully')
      } else {
        message.error('Create Items Failure')
      }
    }
  }

  const hanleGetListItembyId = async (key?: string) => {
    const data = await getAllCategorybyItem('ALL')
    setListItems(data)
  }

  useEffect(() => {
    handleGetCategory()
    handleGetListItem()
    hanleGetListItembyId()
  }, [])

  const handleOnEdit = data => {
    const listCatById = dataListCat.filter(
      item => item.IdCat.toString() === data.IdCat.toString()
    )
    const newOptionList = listCatById.map(item => ({
      value: item.idListCat,
      label: item.nameEN
    }))
    setAction('update')
    setOptionsList(newOptionList)
    setOpenSelect(false)
    setItemCategory({
      IdCat: data.IdCat.toString(),
      IdListCat: data.IdListCat.toString(),
      idItem: data.IdItemCat,
      nameEN: data.nameEN,
      nameVI: data.nameVI
    })
  }

  const handleClear = () => {
    setAction('create')
    setOpenSelect(true)
    setItemCategory({
      IdCat: '',
      IdListCat: '',
      idItem: '',
      nameEN: '',
      nameVI: ''
    })
  }

  return (
    <div className={styles.mainListCategory}>
      <div className={styles.formInput}>
        <div className={styles.inputMaxWidth}>
          <Typography.Title level={5}>Category</Typography.Title>
          <Select
            defaultValue='Select Type Category'
            className={styles.formSelect}
            options={options}
            onChange={value => handleOnchangeCate(value, 'IdCat')}
            value={itemCategory.IdCat}
          ></Select>
        </div>
        <div className={styles.inputMaxWidth}>
          <Typography.Title level={5}>List Item</Typography.Title>
          <Select
            defaultValue='Select Type Category'
            className={styles.formSelect}
            disabled={openSelect}
            options={optionsList}
            onChange={value => handleOnchange(value, 'IdListCat')}
            value={itemCategory.IdListCat}
          ></Select>
        </div>
        <div className={styles.inputMaxWidth}>
          <Typography.Title level={5}>Name VI </Typography.Title>
          <Input
            value={itemCategory.nameVI}
            onChange={event => handleOnchange(event.target.value, 'nameVI')}
          />
        </div>
        <div className={styles.inputMaxWidth}>
          <Typography.Title level={5}>Name EN </Typography.Title>
          <Input
            value={itemCategory.nameEN}
            onChange={event => handleOnchange(event.target.value, 'nameEN')}
          />
        </div>
        <div className={styles.inputMaxWidth}>
          <Button type='primary' onClick={handleOnSave}>
            {action}
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
      <div className={styles.formList}>
        <Table dataSource={listItems} pagination={false} scroll={{ y: 500 }}>
          <ColumnGroup title='Category'>
            <Column title='Tiếng Việt' dataIndex='CatNameVI' />
            <Column title='English' dataIndex='CatNameEN' />
          </ColumnGroup>
          <ColumnGroup title='List Category'>
            <Column title='Tiếng Việt' dataIndex='ListNameVI' />
            <Column title='English' dataIndex='ListNameEN' />
          </ColumnGroup>
          <ColumnGroup title='Item'>
            <Column title='Tiếng Việt' dataIndex='nameVI' />
            <Column title='English' dataIndex='nameEN' />
          </ColumnGroup>
          <Column
            title='Action'
            key='key'
            render={record => (
              <Space size='middle'>
                <div
                  className={styles.buttonEdit}
                  onClick={() => handleOnEdit(record)}
                >
                  <MdEditSquare />
                </div>

                <div className={styles.buttonDelete}>
                  <MdDelete />
                </div>
              </Space>
            )}
          />
        </Table>
      </div>
    </div>
  )
}
