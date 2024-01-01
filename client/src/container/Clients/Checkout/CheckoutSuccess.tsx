import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import style from './CheckoutSuccess.module.scss';
import successPaymentImage from '../../../assets/image/successPayment.svg';
import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const CountdownTimer = ({ initialTime, onTimeout }) => {
    const [time, setTime] = useState(initialTime);


    useEffect(() => {
        const timer = setInterval(() => {
            if (time > 0) {
                setTime((prevTime) => prevTime - 1);
            } else {
                clearInterval(timer);
                if (onTimeout) {
                    onTimeout();
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [time, onTimeout]);

    return <div>{time} giây</div>;
};


const CountdownButton = () => {
    const navigate = useNavigate()
    const handleTimeout = () => {
        navigate('/')
    };


    const [countdownTime, setCountdownTime] = useState(10);

    return (
        <div className={style.formMain}>
            <Confetti />
            <img src={successPaymentImage} alt="Success Payment" />

            <div className={style.titleSuccess}>
                Thanh toán thành công,
                <div className={style.timeOut}>

                    <span>  Tiếp tục mua sắm:</span> <span><CountdownTimer initialTime={countdownTime} onTimeout={handleTimeout} /></span>

                </div>
            </div>
        </div>
    );
};

export default CountdownButton;
