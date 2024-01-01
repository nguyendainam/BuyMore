import React, { useEffect, useState } from "react";
import style from "./Cart.module.scss";
import { Button, Checkbox, Input, InputNumber, Result, message } from "antd";
import { getAllItemsCart, updateItem } from "../../../components/Cart";
import { URL_SERVER_IMG } from "../../../until/enum";
import { Navigate, useNavigate } from "react-router-dom";
import Select from "../../../components/datatest/Select";
import { dataItemCart } from "../../../redux/action/asyncAction";
import { useDispatch } from "react-redux";
import { choosenItemInCart } from "../../../redux/Slice/userSlice";



interface IItem {
    CartId: number,
    Option: object,
    OrderId: string,
    ProductID: string,
    Quantity: number,
    Image: string,
    NameVI: string,
    NameEN: string,
    TotalPrice: number,
    Discount: number,
    ProductPrice: number,

}

export default function Cart() {
    const [dataItems, setDataItems] = useState<IItem[]>([]);
    const [checkItems, setCheckItem] = useState([
        {
            key: "",
            choosen: false,
        },
    ]);

    const interestedProperties = [
        "Color",
        "Size",
        "memory",
        "screenSize",
        "scanFrequency",
        "screenType",
    ];

    const renderProperty = (key, value) => (
        <div key={key} style={{ margin: '5px' }}>
            <strong>{key}:</strong> {value}
        </div>
    );

    const dispatch = useDispatch()

    const [bill, setBill] = useState({
        totalProduct: 0,
        totalPrice: 0,
        discount: 0,
        amountToPay: 0,
    });

    const handleGetItems = async () => {
        const items = await getAllItemsCart();

        let data: IItem[] = []

        if (items.length) {
            data = items.map((item) => {
                const quantity = item.Quantity
                const discount = item.Discount
                const productPrice = item.ProductPrice
                const totalPrice = productPrice * quantity

                return ({
                    CartId: item.CartId,
                    Option: item.Option,
                    OrderId: item.OrderId,
                    ProductID: item.ProductID,
                    Image: item.Image,
                    NameVI: item.NameVI,
                    NameEN: item.NameEN,
                    Quantity: quantity,
                    Discount: discount,
                    ProductPrice: productPrice,
                    TotalPrice: totalPrice,

                })
            })
        }

        setDataItems(data)
        // setDataItems(items);
        const updatedDataItems = items.map((i) => ({
            key: i.CartId,
            choosen: false,
        }));
        setCheckItem(updatedDataItems);
    };

    const onChange = async (value: number, id: number) => {
        console.log('changed', value, id);

        const key = id + '-' + value
        const data = await updateItem(key)
        const updatedDataItems = dataItems.map((item) =>
            item.CartId === id ? { ...item, Quantity: value } : item
        );

        setDataItems(updatedDataItems);
        console.log(updatedDataItems)

        const getItemChoosen = await Promise.all(
            checkItems
                .filter((item) => item.choosen === true)
                .map((item) => {
                    // Sửa ở đây: Loại bỏ async từ hàm find
                    const data = updatedDataItems.find((obj) => obj.CartId === item.key);
                    return data;
                })
        );
        handleUpdateQuantity(getItemChoosen)

    };

    const handleUpdateQuantity = (data) => {
        const selectedDataItems = data.filter((item) => {
            const correspondingCheckItem = checkItems.find(
                (checkItem) => checkItem.key === item.CartId
            );
            return correspondingCheckItem && correspondingCheckItem.choosen;
        });

        let totalMoney = 0;
        let totalProduct = 0;
        let savingPrice = 0;

        selectedDataItems.forEach((item) => {
            // Tính giá của sản phẩm với giảm giá
            const discountedPrice = item.ProductPrice * item.Quantity * (1 - item.Discount / 100);
            totalMoney += discountedPrice;

            // Tính tổng số sản phẩm và giá giảm giá
            totalProduct += item.Quantity;
            savingPrice += (item.ProductPrice * item.Quantity) - discountedPrice;
        });

        // Tính tổng giá trị giảm giá từ các sản phẩm
        const amount = totalMoney - savingPrice;

        setBill({
            totalPrice: totalMoney,
            totalProduct: totalProduct,
            discount: savingPrice,
            amountToPay: amount,
        });
    };

    const handleCheckboxChange = async (product) => {
        const updatedItems = [...checkItems];

        const itemToUpdate = updatedItems.find((item) => item.key === product);
        if (itemToUpdate) {
            itemToUpdate.choosen = !itemToUpdate.choosen;
            setCheckItem(updatedItems);
        }
        handleChangeBill();
    };
    // const handleCheckboxChange = async (product) => {

    //     console.log(checkItems, '---------------------------------')
    //     console.log('---------------------------------')
    //     const updatedItems = [...checkItems];


    //     const itemToUpdate = updatedItems.find((item) => item.key === product);
    //     if (itemToUpdate) {
    //         itemToUpdate.choosen = !itemToUpdate.choosen;
    //         setCheckItem(updatedItems);
    //         // const data = updatedItems.filter((item) => item.choosen === true);
    //         // const data = updatedItems.filter((item) => item.choosen);


    //     }
    //     await dispatch(choosenItemInCart({ dataItem: updatedItems }))
    //     handleChangeBill();
    // };

    const handleChangeBill = () => {
        const selectedDataItems = dataItems.filter((item) => {
            const correspondingCheckItem = checkItems.find(
                (checkItem) => checkItem.key === item.CartId
            );
            return correspondingCheckItem && correspondingCheckItem.choosen;
        });

        let totalMoney = 0;
        let totalProduct = 0;
        let savingPrice = 0;

        selectedDataItems.forEach((item) => {
            // Tính giá của sản phẩm với giảm giá
            const discountedPrice = item.ProductPrice * item.Quantity * (1 - item.Discount / 100);
            totalMoney += discountedPrice;

            // Tính tổng số sản phẩm và giá giảm giá
            totalProduct += item.Quantity;
            savingPrice += (item.ProductPrice * item.Quantity) - discountedPrice;
        });

        // Tính tổng giá trị giảm giá từ các sản phẩm
        const amount = totalMoney - savingPrice;

        setBill({
            totalPrice: totalMoney,
            totalProduct: totalProduct,
            discount: savingPrice,
            amountToPay: amount,
        });


    };

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const handleSelectAll = () => {
        // Sử dụng map để tạo một bản sao của mảng với giá trị choosen là true cho tất cả các phần tử
        const updatedCheckItems = checkItems.map((item) => ({
            ...item,
            choosen: !selectAllChecked
        }));
        // Cập nhật state với mảng mới

        setCheckItem(updatedCheckItems);
        setSelectAllChecked(!selectAllChecked)
        handleChangeBill()
    };


    const navigate = useNavigate()
    const returnHome = () => { navigate('/') }



    useEffect(() => {
        handleGetItems();
        handleChangeBill();
    }, []);

    useEffect(() => {
        handleChangeBill();
    }, [checkItems]);

    const handleCheckOut = async () => {
        const datacheckOut = dataItems.map((item) => {
            const correspondingCheckItem = checkItems.find((check) => check.key === item.CartId && check.choosen);

            return correspondingCheckItem ? { ...item, choosen: correspondingCheckItem.choosen } : null;
        }).filter((item) => item !== null);

        if (datacheckOut.length > 0) {
            await dispatch(choosenItemInCart({ dataItem: datacheckOut }))
            navigate('/us/checkout')
        } else {
            message.info("Bạn chưa chọn sản phẩm nào")
        }
    };
    return (

        <div className={style.mainCart}>
            <div className={style.formLeft}>
                <div className={style.title}>Your Cart</div>
                <div className={style.formItems}>
                    <div className={style.itemHeader}>
                        <Checkbox className={style.checkbox} onChange={handleSelectAll}></Checkbox>
                        <div className={style.ChangeOption}>
                            <div className={style.Item}>Sản phẩm </div>
                            <div className={style.Item}>Gía tiền </div>
                            <div className={style.Item}>Số lượng</div>
                            <div className={style.Item}>Tổng</div>
                        </div>
                    </div>
                    {dataItems.length ?
                        dataItems.map((item) => {
                            const options = item.Option ? item.Option : null;
                            const resumeData = (options) =>
                                interestedProperties.map((property) => {
                                    const data = options[property]
                                        ? Select[property].filter((item) => item.value === options[property])
                                        : null;

                                    return data ? renderProperty(property, data[0].label) : null;
                                });

                            const totalPrice = item.ProductPrice * item.Quantity
                            let afterUsingDiscount = 0
                            if (item.Discount === 0) afterUsingDiscount = totalPrice
                            else afterUsingDiscount = totalPrice - (totalPrice * item.Discount) / 100

                            return (
                                <div className={style.item}>
                                    <Checkbox
                                        // checked={check}
                                        className={style.checkbox}
                                        onChange={() => handleCheckboxChange(item.CartId)}

                                    ></Checkbox>
                                    <div className={style.image}>
                                        <img
                                            src={`${URL_SERVER_IMG}${item.Image}`}

                                        />
                                    </div>

                                    <div className={style.details}>
                                        <div className={style.namePr}>{item.NameVI}</div>
                                        <div>
                                            {options && resumeData(options)}
                                        </div>
                                    </div>

                                    <div className={style.ChangeOption}>
                                        <div className={style.Item}>
                                            <Input
                                                value={item.ProductPrice.toLocaleString().replace(/,/g, '.')}
                                            />
                                        </div>

                                        <div className={style.Item}>
                                            <InputNumber
                                                min={1}
                                                max={100000}
                                                value={item.Quantity}
                                                onChange={(value) => onChange(value, item.CartId)}
                                            />
                                        </div>
                                    </div>
                                    <div className={style.inforBuy}>

                                        <div className={style.formPrice}  >
                                            {item.Discount > 0 ? (
                                                <>
                                                    <div className={style.oldPrice}>
                                                        {totalPrice.toLocaleString().replace(/,/g, '.')}
                                                    </div>

                                                    <div className={style.price}>
                                                        {afterUsingDiscount.toLocaleString().replace(/,/g, '.')}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className={style.price}>
                                                    {afterUsingDiscount.toLocaleString().replace(/,/g, '.')}
                                                </div>
                                            )}

                                        </div>
                                    </div>

                                    <div className={style.lastOption}>
                                        <span>Xóa</span>

                                        <span>Tìm các sản phẩm tương tự</span>
                                    </div>
                                </div>
                            );
                        }) :

                        <div className={style.cartEmpty}>
                            <Result
                                status="404"
                                title="404"
                                subTitle="Your Cart Is Empty"
                                extra={<Button type="primary" >Back Home</Button>}
                            />
                        </div>
                    }
                </div>
            </div>

            <div className={style.formRight}>
                <div className={style.title}>Order Sumary</div>
                <div className={style.formTotal}>
                    <div className={style.item}>
                        <span>Tổng số sản phẩm</span>
                        <span>{bill.totalProduct}</span>
                    </div>
                    <div className={style.item}>
                        <span>Số tiền phải trả</span>
                        <span>{bill.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className={style.item}>
                        <span>Giảm giá</span>
                        <span>{bill.discount.toLocaleString()}</span>
                    </div>

                    <div className={style.item}>
                        <span>Total</span>
                        <span>{bill.amountToPay.toLocaleString()}</span>
                    </div>
                </div>

                <div className={style.formButton}>
                    <Button className={style.buttonBuy} onClick={handleCheckOut}>Mua Hàng</Button>
                </div>
            </div>
        </div>
    );
}
