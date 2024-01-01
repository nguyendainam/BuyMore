import React, { useState } from 'react';
import { Input, Space } from 'antd';
import { BsSearch } from 'react-icons/bs';
import styles from './search.module.scss';
import { handleSearchProduct } from '../services/product';
import { URL_SERVER_IMG } from '../until/enum';
import { useSelector } from 'react-redux';

export const Search: React.FC = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [dataSearch, setDataSearch] = useState('')

  const { language } = useSelector((state) => state.system)

  const handleOnSearch = async (key: string) => {

    setDataSearch(key)
    try {
      const result = await handleSearchProduct(key);
      setSearchResults(result.data.items);
    } catch (error) {
      console.error('Lỗi khi thực hiện tìm kiếm:', error);
      // Xử lý lỗi nếu cần
    }
  };

  return (
    <div className={styles.formSearch}>
      <Space.Compact direction='vertical' size='large' style={{ position: 'relative' }}>
        <Input
          className={styles.searchInputCustom}
          addonAfter={<div><BsSearch /></div>}
          placeholder='Search....'
          onChange={(event) => handleOnSearch(event.target.value)}
        />
      </Space.Compact>

      {dataSearch && <div className={styles.formSearchContainer}>

        {searchResults && searchResults.length > 0 ? (
          <div className={styles.items}>
            {/* Hiển thị kết quả tìm kiếm */}
            {searchResults.map((item, index) => (
              <div key={index} className={styles.item}>
                <div className={styles.image}>
                  <img src={`${URL_SERVER_IMG}${item.Image}`} alt={`Product ${index + 1}`} />
                </div>
                <div className={styles.information}>
                  {language === 'vi' ? item.NameVI : item.NameEN}
                  {/* Hiển thị thông tin sản phẩm, tùy thuộc vào cấu trúc của item */}
                </div>
                <div className={styles.price}>
                  {JSON.parse(item.ProductInventory)[0].Price.toLocaleString().replace(/,/g, '.') + ' vnđ'}
                </div>
              </div>
            ))}
          </div>
        ) : <div>Empty</div>}

      </div>}


    </div>
  );
};
