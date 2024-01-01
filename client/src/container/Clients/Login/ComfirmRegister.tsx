import React, { useEffect, useState } from 'react';
import { Button, Result, Spin } from 'antd';
import style from './ComfirmRegister.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { comfirmEmail } from '../../../services/user';
import { LoadingOutlined } from '@ant-design/icons';
export default function ComfirmRegister() {
    const [caseRender, setCate] = useState<number>();
    const navigate = useNavigate();

    const [isComfirmed, setIsComfirmed] = useState(false);


    const renderCase = (caserender) => {
        switch (caserender) {
            case 1:
                return (
                    <div>
                        <Result
                            status="success"
                            title="Đăng ký thành công!"
                            extra={[
                                <Button onClick={() => navigate('/login')}>Đăng nhập</Button>,
                            ]}
                        />
                    </div>
                );

            case 2:
                return (
                    <div>
                        <Result
                            status="error"
                            title="Đăng ký không thành công!"
                            extra={[
                                <Button onClick={() => navigate('/')}>Trở về trang chính</Button>,
                                <Button onClick={() => navigate('/register')}>Quay Lại trang đăng ký</Button>,
                            ]}
                        />
                    </div>
                );
            default:
                return (
                    <div>
                        <Result
                            title="Đang kiểm tra...."
                            extra={[
                                <Spin indicator={<LoadingOutlined style={{ fontSize: 34 }} spin />} />,
                            ]}
                        />
                    </div>
                ); // or some default case
        }
    };

    const { token } = useParams();
    const handleComfirmEmail = async () => {
        try {
            const result = await comfirmEmail(token);
            console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
            console.log(result.data)
            console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
        } catch (error) {
            console.error('Error confirming email:', error);
            // Xử lý lỗi nếu cần
        }
    };


    useEffect(() => {

        handleComfirmEmail();
    }, []);
    return (
        <div className={style.mainView}>
            {/* <div className={style.formMain}>{renderCase(caseRender)}</div> */}
        </div>
    );
}
