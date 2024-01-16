import React, { useEffect, useState } from 'react'
import style from './ProductByBrand.module.scss'
import { getAllAboutBrand } from '../../../components/GetBrand'
import { useNavigate, useParams } from 'react-router-dom'
// import { Image } from 'antd'
import { URL_SERVER_IMG } from '../../../until/enum'
import DOMPurify from 'dompurify';
import { Empty, Image } from 'antd'
import { useSelector } from 'react-redux'
export default function ProductByBrands() {
    const [aboutBrand, setAboutBrand] = useState({})
    const [products, setProducts] = useState([])
    const { idbrand } = useParams()
    const handleGetData = async () => {
        const result = await getAllAboutBrand(idbrand)
        setAboutBrand(result.aboutBrand)
        setProducts(result?.product)

    }
    const { language } = useSelector((state) => state.system);
    const navigate = useNavigate();

    useEffect(() => {
        handleGetData()
    }, [])



    const removeHTMLTags = (htmlString) => {
        const doc = new DOMParser().parseFromString(htmlString, 'text/html');
        return doc.body.textContent || "";
    };

    const handleDetailProduct = (key: string) => {
        navigate(`/d/chi-tiet-san-pham?product=${key}`);
    };

    return (
        <div className={style.mainView}>
            <div className={style.content}>
                <div className={style.inforAboutBrand}>
                    <div className={style.logo}>
                        <img className={style.imglogo} src={URL_SERVER_IMG + aboutBrand.ImageBrand} />
                    </div>
                    <div className={style.formRight} >
                        <div className={style.nameLogo}>{aboutBrand.NameBrand}</div>
                        <div className={style.desc}>
                            {removeHTMLTags(aboutBrand.DescVI)}
                        </div>
                    </div>
                </div>
                <div className={style.formProduct}>
                    <div className={style.allProduct}>
                        {products.length ? products.map((item) => {
                            console.log(item)
                            return (
                                <div
                                    className={style.itemProduct}
                                    onClick={() => handleDetailProduct(item.productId)}
                                >
                                    <div className={style.formImage}>
                                        <Image src={URL_SERVER_IMG + item.image} preview={false} />
                                    </div>
                                    {item.savingPrice > 0 ? (
                                        <div className={style.savingMoney}>
                                            <span>Tiết kiệm</span>
                                            <span>
                                                {item.savingPrice?.toLocaleString().replace(/,/g, ".")}
                                            </span>
                                        </div>
                                    ) : (
                                        ""
                                    )}

                                    <div className={style.nameProduct}>
                                        <div className={style.formNameProduct}>
                                            {language === "vi" ? item.nameVI : item.nameEN}
                                        </div>
                                    </div>

                                    <div className={style.price}>
                                        {item.priceAfterDiscount?.toLocaleString().replace(/,/g, ".")}{" "}
                                        <u className={style.iconvnd}>đ</u>{" "}
                                    </div>
                                    {item.savingPrice > 0 ? (
                                        <div className={style.oldPrice}>
                                            {item.price?.toLocaleString().replace(/,/g, ".")} đ
                                        </div>
                                    ) : (
                                        ""

                                    )}
                                </div>
                                // {/* ))} */ }

                            )
                        }) : <div className={style.allProduct}>
                            <Empty description="Không có sản phẩm nào" />
                        </div>}

                    </div>
                </div>
            </div>
        </div >
    )
}
