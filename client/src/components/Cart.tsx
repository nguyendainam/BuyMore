import FormData from "form-data";
import React from "react";
import { addToCart, getItemsInCart, updateItemInCart } from "../services/user";
// import { useSelector } from "react-redux"

export const AddproductToCard = async (data) => {
    const Options = {
        Color: data.Color,
        Size: data.Size,
        memory: data.memory,
        scanFrequency: data.scanFrequency,
        screenSize: data.screenSize,
        screenType: data.screenType,
    };

    const product_Inv = data.Id
    const quantity = data.Quantity
    const price = data.Price
    const formdata = new FormData()
    formdata.append('option', JSON.stringify(Options))
    formdata.append('product_Inv', product_Inv)
    formdata.append('quantity', quantity)
    formdata.append('price', price)

    const result = await addToCart(formdata)
    return result
};


interface IItem {
    CartId: number,
    Option: object,
    OrderId: string,
    ProductID: string,
    Quantity: number,
    Image: string,
    NameVI: string,
    NameEN: string,
    OldPrice: number,
    ProductPrice: number,
    Discount: number,
    Decreased: number


}


export const getAllItemsCart = async () => {
    const result = await getItemsInCart()
    const dataProduct = result.data.items

    if (dataProduct.length > 0) {
        const itemsInCart: IItem[] = dataProduct.map((item) => {
            const quantity = item.Quantity
            const priceProduct = item.Price // gia cua san pham
            const discount = item.Discount_Percent  // % giam gia
            return ({
                CartId: item.CartID,
                Option: JSON.parse(item?.Options),
                OrderId: item.OrderID,
                ProductID: item.ProductID,
                Image: item.Image,
                NameVI: item.NameVI,
                NameEN: item.NameEN,
                Quantity: quantity,
                Discount: discount,
                ProductPrice: priceProduct,

            })
        })

        return itemsInCart
    } else {
        return []
    }





    // const items = result.data.items

    // const ArrItem: IItem[] = items.map((i) => ({
    //     CartId: i.CartID,
    //     Option: JSON.parse(i?.Options),
    //     OrderId: i.OrderID,
    //     Price: i.Price,
    //     ProductID: i.ProductID,
    //     Quantity: i.Quantity,
    //     Image: i.Image,
    //     NameVI: i.NameVI,
    //     NameEN: i.NameEN
    // }))

    // return ArrItem
}
export const updateItem = async (data) => {
    const result = await updateItemInCart(data)
    return result
}