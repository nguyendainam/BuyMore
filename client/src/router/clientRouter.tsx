import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Cart from '../container/Clients/Cart/Cart'
import Header from '../container/Clients/Header/Header'
import Profile from '../container/Clients/User/Profile'
import Checkout from '../container/Clients/Checkout/Checkout'
import CheckoutSuccess from '../container/Clients/Checkout/CheckoutSuccess'
import Fotter from '../container/Clients/Footer/Fotter'

export default function clientRouter() {
    return (
        <>
            <Header />
            <Routes>
                <Route path='cart' element={<Cart />} />
                <Route path='profile' element={<Profile />} />
                <Route path='checkout' element={<Checkout />} />
                <Route path='checkoutsuccess' element={<CheckoutSuccess />} />
            </Routes>


        </>

    )
}
