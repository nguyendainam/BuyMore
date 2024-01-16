import React from 'react'
import style from './Footer.module.scss'
import { Col, Divider, Row } from 'antd'
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaTwitter, FaInstagramSquare, FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import data from './textdata.json'
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
export default function Fotter() {
    const { t } = useTranslation()
    const { language } = useSelector((state) => state.system)
    return (
        <div className={style.mainView}>
            <div className={style.content}>
                <Divider orientation="left">{t('ourInfor')}</Divider>
                <Row justify="space-around">
                    <Col span={9}>
                        <div className={style.formInfor}>
                            <div className={style.formTitle}>BuyMore</div>
                            <div className={style.contendBuyMore}>{
                                language === 'vi' ? data.vi : data.en
                            }
                            </div>
                        </div>
                    </Col>

                    <Col span={4}>
                        <div className={style.formInfor}>
                            <div className={style.formTitle1}>{t('contact')}</div>
                            <div className={style.contendBuyMore1}><FcGoogle /> <FaFacebook className={style.facebook} />
                                <FaTwitter className={style.facebook} /> <FaInstagramSquare className={style.instargram} /></div>

                            <div className={style.Email}>
                                <div> <MdEmail /> Email:  </div> <div>buymore@example.com</div>
                            </div>
                            <div className={style.Phone}>
                                <div> <FaPhone /> Phone:  </div> <div>01233321123</div>
                            </div>
                        </div>
                    </Col>

                </Row>

            </div>
        </div>
    )
}
