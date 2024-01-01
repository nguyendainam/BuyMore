import React, { useEffect, useState } from 'react'
import styles from './ListCategory.module.scss'
import { Button, Input, Select, Space, Table, Typography, message } from 'antd'
import { ShowLoading } from '../../../components/Loading'
import { getListCategory } from '../../../components/GetdataCategory'
import FormData from 'form-data'
import { CorUListCategory } from '../../../services/product'
import { AllListCategory } from '../../../components/GetdataCategory'
import Column from 'antd/es/table/Column'
import { MdDelete, MdEditSquare } from 'react-icons/md'

interface IOptions {
  value: string
  label: string
}

interface IListCategory {
  idListCat?: string
  nameVI: string
  nameEN: string
  IdCat: string
}

interface DataType {
  key: string
  Category: string
  nameVI: string
  nameEN: string
  IdCategory: string
}

export default function ListCategory () {
  const [options, setOptions] = useState<IOptions[]>([])
  const [listCategory, setListCategory] = useState<IListCategory>({
    idListCat: '',
    nameVI: '',
    nameEN: '',
    IdCat: ''
  })

  const [action, setAction] = useState('create')
  const [dataTable, setDataTable] = useState<DataType[]>([])

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
    const allDataTable = data.map(item => ({
      key: item.idListCat,
      Category: item.nameENCategory,
      nameVI: item.nameVI,
      nameEN: item.nameEN,
      IdCategory: item.IdCat
    }))

    setDataTable(allDataTable)
  }

  const handleOnchange = (value: string, id: string) => {
    setListCategory(prevCategory => ({ ...prevCategory, [id]: value }))
  }

  useEffect(() => {
    handleGetCategory()
    handleGetListItem()
  }, [])

  const handleOnSave = async () => {
    if (!listCategory.nameEN || !listCategory.nameVI || !listCategory.IdCat) {
      message.error('Không được để trống')
    } else {
      const formdata = new FormData()

      if (action === 'create') {
        formdata.append('action', action)
        formdata.append('nameVI', listCategory.nameVI)
        formdata.append('nameEN', listCategory.nameEN)
        formdata.append('IdCat', listCategory.IdCat)
        const result = await CorUListCategory(formdata)
        if (result.data.err === 0) {
          message.success('Created  list category successfully')
          handleGetListItem()
        } else {
          message.error('Failed to create list category')
        }
      } else if (action === 'update') {
        formdata.append('action', action)
        formdata.append('nameVI', listCategory.nameVI)
        formdata.append('nameEN', listCategory.nameEN)
        formdata.append('IdCat', listCategory.IdCat)
        formdata.append('Id', listCategory.idListCat)
        const result = await CorUListCategory(formdata)
        if (result.data.err === 0) {
          message.success('Update  list category successfully')
          handleGetListItem()
        } else {
          message.error('Failed to update list category')
        }
      }
    }
  }

  const handleDataupdate = (data, action: string) => {
    if (action === 'update') {
      setListCategory({
        IdCat: data.IdCategory.toString(),
        nameEN: data.nameEN,
        nameVI: data.nameVI,
        idListCat: data.key
      })
      setAction(action)
    }
  }

  return (
    <div className={styles.mainListCategory}>
      <div className={styles.formInput}>
        <div className={styles.inputMaxWidth}>
          <Typography.Title level={5}>Select Category</Typography.Title>
          <Select
            defaultValue='Select Type Category'
            className={styles.formSelect}
            options={options}
            onChange={value => handleOnchange(value, 'IdCat')}
            value={listCategory.IdCat}
          ></Select>
        </div>
        <div className={styles.inputMaxWidth}>
          <Typography.Title level={5}>Name VI </Typography.Title>
          <Input
            onChange={event => handleOnchange(event.target.value, 'nameVI')}
            value={listCategory.nameVI}
          />
        </div>

        <div className={styles.inputMaxWidth}>
          <Typography.Title level={5}>Name EN </Typography.Title>
          <Input
            onChange={event => handleOnchange(event.target.value, 'nameEN')}
            value={listCategory.nameEN}
          />
        </div>

        <div className={styles.inputMaxWidth}>
          <Button type='primary' onClick={handleOnSave}>
            Save
          </Button>
          <Button type='dashed' style={{ marginLeft: '5px' }}>
            Clear
          </Button>
        </div>
      </div>
      <div className={styles.formList}>
        <Table dataSource={dataTable} pagination={false} scroll={{ y: 500 }}>
          <Column title='Category' dataIndex='Category' key='IdCategory' />
          <Column title='NameVi' dataIndex='nameVI' key='IdCategory' />
          <Column title='NameEN' dataIndex='nameEN' key='IdCategory' />
          <Column
            title='Action'
            key='key'
            render={record => (
              <Space size='middle'>
                <div
                  className={styles.buttonEdit}
                  onClick={() => handleDataupdate(record, 'update')}
                >
                  <MdEditSquare />
                </div>

                <div className={styles.buttonDelete}>
                  <MdDelete
                    onClick={() => handleDataupdate(record, 'delete')}
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
