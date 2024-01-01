
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import FormData from "form-data";

import { useEffect } from "react";
import { createNewOrderByUser, getListOderUser } from "../services/user";
import { useNavigate } from "react-router-dom";

// This value is from the props in the UI
const style = { "layout": "horizontal" };


// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({ currency, showSpinner, ammount, address, cart, totalVnd }) => {
    const [{ isPending, options }, disspatch] = usePayPalScriptReducer();

    const navigate = useNavigate()

    useEffect(() => {
        disspatch({
            type: 'resetOptions',
            value: {
                ...options, currency: currency
            }
        })
    }, [currency, showSpinner])

    return (
        <>
            {(showSpinner && isPending) && <div className="spinner" />}
            <PayPalButtons
                // style={style}
                disabled={false}
                forceReRender={[style, currency, ammount]}
                fundingSource={undefined}
                createOrder={(data, actions) => actions.order.create({
                    purchase_units: [
                        {
                            amount: { currency_code: currency, value: ammount },

                            payee: {
                                email_address: 'sb-2aiyy28893080@personal.example.com'
                            }
                        },

                    ]
                }).then(orderId => orderId)
                }
                onApprove={(data, actions) => actions.order?.capture().then(async (response) => {
                    const dataIdCart = cart.map(item => item.CartId);
                    const addressUser = address.addressUser
                    const total = totalVnd
                    if (response.status === 'COMPLETED') {

                        // console.log(addressUser)
                        const formdata = new FormData()
                        formdata.append('ListIdCart', dataIdCart)
                        formdata.append('address', addressUser)
                        formdata.append('total', total)
                        formdata.append('status', response.status)

                        const resultOrder = await createNewOrderByUser(formdata)
                        if (resultOrder.data.err === 0) {
                            console.log('create Order Successfull')
                            navigate('/')
                        } else {
                            console.log('create order false')
                        }
                    }
                })}
            />
        </>
    );
}

export default function Paypal({ amount, cart, address, totalVND }) {
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <PayPalScriptProvider options={{ clientId: "AZVHrp0G-CfYAod8DE7lhEQSlDHtnEQoedUrdY2WlCetjZqhV3WoNxYqQAIpRgPLXol6-EwbsdjE8QVU", components: "buttons", currency: "USD" }}>
                <ButtonWrapper showSpinner={false} currency={'USD'} ammount={amount} cart={cart} address={address} totalVnd={totalVND} />
            </PayPalScriptProvider>
        </div>
    );
}