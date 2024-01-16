import React, { useEffect, useState } from 'react';
import { Modal, Switch } from 'antd';
import style from '../assets/style/modalAboutProduct.module.scss'
import { getConfigProductById } from '../services/product';
import ReactHtmlParser from 'react-html-parser';
interface ModalContent {
    isOpen: boolean,
    idProduct: string,
    handleCloseModal: () => void
}


const ModalDetails: React.FC<ModalContent> = ({ idProduct, isOpen, handleCloseModal }) => {
    const [open, setOpen] = useState(isOpen);
    const [dataDetailsVI, setDataDetailsVI] = useState()
    const [dataDetailsEN, setDataDetailsEN] = useState()


    const handleGetDescProduct = async () => {
        const result = await getConfigProductById(idProduct)
        if (result.data.items.length > 0) {
            const desc = result.data.items[0]
            setDataDetailsVI(desc.Config_VI)
            setDataDetailsEN(desc.Config_EN)
        }
    }

    const [language, setLanguage] = useState<string>('vi')

    const onChangeLanguage = (checked: boolean) => {
        if (checked === false) {
            setLanguage('en')
        } else {
            setLanguage('vi')
        }

    }




    useEffect(() => {
        handleGetDescProduct()
    }, [idProduct])



    const HtmlContent = (htmlString) => {
        if (htmlString) {

            const transform = (node, index) => {
                if (node.type === 'tag' && node.name === 'button') {
                    return <button key={index}>{node.children[0].data}</button>;
                }
            };

            return <div>{ReactHtmlParser(htmlString, { transform })}</div>;
        } else {
            return <div>{language === 'vi' ? 'Bài viết sẽ được cập nhật trong thời gian tới' : 'The article will be updated in the near future'}</div>
        }

    }


    return (

        <Modal
            // title="Modal 1000px width"
            centered
            open={open}
            onOk={handleCloseModal}
            onCancel={handleCloseModal}
            width={1000}
            className={style.mainModal}
        >
            <div className={style.title}>
                <Switch checkedChildren="Tiếng Việt" unCheckedChildren="English" defaultChecked onChange={onChangeLanguage} />
            </div>

            <div className={style.content}>
                {HtmlContent(language === 'vi' ? dataDetailsVI : dataDetailsEN)}
            </div>


        </Modal>

    );
};

export default ModalDetails;