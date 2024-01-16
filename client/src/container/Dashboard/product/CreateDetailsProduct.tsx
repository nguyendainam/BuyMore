import React, { useEffect, useState } from "react";
import style from "./CreateDetailsProduct.module.scss";
import {
    Button,
    Input,
    Select,
    SelectProps,
    Tabs,
    TabsProps,
    Typography,
    message,
} from "antd";
import { TextEditor } from "../../../components/textEditor";
import { getAllProductDashboard } from "../../../components/AllProduct";
import { GetAllListsBrand } from "../../../components/GetBrand";
import {
    AllProductType,
    getAllCategorybyItem,
} from "../../../components/GetdataCategory";
import FormData from "form-data";
import {
    getAllDescProductById,
    handleCreateDescProduct,
    handleGetDescProduct,
} from "../../../services/product";
export default function CreateDetailsProduct() {
    const [options, setOptions] = useState([]);
    const [action, setAction] = useState<'create' | 'update'>('create')
    const [listBrand, setListBrand] = useState<SelectProps["options"]>([]);
    const [listCategory, setListCategory] = useState<SelectProps["options"]>([]);
    const [listTypeProduct, setListTypeProduct] = useState<
        SelectProps["options"]
    >([]);
    const [description, setDescription] = useState({
        basicInforVI: "",
        basicInforEN: "",
        descVI: "",
        descEN: "",

    });

    const [selectedProduct, setSelectedProduct] = useState({
        idProduct: "",
        nameVI: "",
        nameEN: "",
        brandId: "",
        category: "",
        listTag: [],
    });
    const items: TabsProps["items"] = [
        {
            key: "basicInforVI",
            label: "Vietnamese",
        },
        {
            key: "basicInforEN",
            label: "English",
        },
    ];

    const desc: TabsProps["items"] = [
        {
            key: "descVI",
            label: "Vietnamese",
        },
        {
            key: "descEN",
            label: "English",
        },
    ];

    useEffect(() => {
        // Fetch data and update options, listBrand, etc.
        const fetchData = async () => {
            try {
                const productData = await getAllProductDashboard();
                const brandData = await GetAllListsBrand();
                const typeProductData = await AllProductType();
                const categoryData = await getAllCategorybyItem();

                const productOptions = productData.map((item) => ({
                    label: item.nameVI,
                    value: item.productId,
                    brand: item.brand,
                    nameVI: item.nameVI,
                    nameEN: item.nameEN,
                    category: item.category,
                    brandId: item.brand_id,
                    typeProduct: item.type_product,
                }));

                const brandOptions = brandData.map((item) => ({
                    value: item.idBrand,
                    label: item.nameBrand,
                }));

                const typeProductOptions = typeProductData.map((item) => ({
                    value: item.Id,
                    label: item.nameVI,
                }));

                const categoryOptions = categoryData.map((item) => ({
                    value: item.IdItemCat,
                    label: item.nameVI,
                }));

                // console.log(productOptions)
                setOptions(productOptions);

                setListBrand(brandOptions);
                setListTypeProduct(typeProductOptions);
                setListCategory(categoryOptions);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // Run this effect only once on mount

    const handleOnChange = async (option) => {

        const resultDesc = await getAllDescProductById(option.value)

        console.log(resultDesc.data.items)
        if (resultDesc.data.items.length > 0) {
            const result = resultDesc.data.items[0]
            setAction('update')
            setDescription({
                basicInforVI: result.Config_VI,
                basicInforEN: result.Config_EN,
                descVI: result.Des_Details_VI,
                descEN: result.Des_Details_EN,
            })
        } else {
            setAction('create')
            setDescription({
                basicInforVI: "",
                basicInforEN: "",
                descVI: "",
                descEN: "",
            })
        }


        if (option) {
            setSelectedProduct({
                idProduct: option.value,
                nameVI: option.nameVI,
                nameEN: option.nameEN,
                brandId: option.brandId,
                category: option.typeProduct,
                listTag: option.category,
            });

        }
    };

    const handleGetContent = (key, content) => {
        setDescription((prevState) => ({
            ...prevState,
            [key]: content,
        }));
    };

    const renderTabContent = (key) => {
        return (
            <TextEditor
                handleSendContext={(value) => handleGetContent(key, value)}
                content={description[key]}
                editorKey={key}
            />
        );
    };

    const renderTabDesc = (key) => {
        return (
            <TextEditor
                handleSendContext={(value) => handleGetContent(key, value)}
                content={description[key]}
                editorKey={key}

            />
        );
    };

    const handleOnSave = async () => {
        if (action === 'create') {
            const IdProduct = selectedProduct.idProduct;
            if (!IdProduct) {
                message.error("Vui Lòng Chọn đầy đủ thông tin");
            } else {
                console.log(IdProduct);
                const formData = new FormData();
                formData.append("IdProduct", IdProduct);
                formData.append("descVI", JSON.stringify(description.descVI));
                formData.append("descEN", JSON.stringify(description.descEN));
                formData.append("basicInforVI", JSON.stringify(description.basicInforVI));
                formData.append("basicInforEN", JSON.stringify(description.basicInforEN));
                formData.append("action", "create");

                const result = await handleCreateDescProduct(formData);
                if (result.data.err === 0) {
                    message.success("Lưu thành công");
                } else {
                    message.error("Lưu thất bại");
                }
            }
        }

        else if (action === 'update') {
            const IdProduct = selectedProduct.idProduct;
            if (!IdProduct) {
                message.error("Vui Lòng Chọn đầy đủ thông tin");
            } else {
                console.log(IdProduct);
                const formData = new FormData();
                formData.append("IdProduct", IdProduct);
                formData.append("descVI", JSON.stringify(description.descVI));
                formData.append("descEN", JSON.stringify(description.descEN));
                formData.append("basicInforVI", JSON.stringify(description.basicInforVI));
                formData.append("basicInforEN", JSON.stringify(description.basicInforEN));
                formData.append("action", "update");

                const result = await handleCreateDescProduct(formData);
                if (result.data.err === 0) {
                    message.success("Cập nhật  thành công");
                } else {
                    message.error(" cập nhật thất bại");
                }
            }
        }

    };

    return (
        <div className={style.mainViewDesc}>
            <div className={style.left}>
                <div className={style.basicFormProduct}>
                    <div className={style.formBtnSave}>
                        <Button className={style.btnBlue} onClick={handleOnSave}>
                            {action === 'create' ? 'Lưu' : 'Cập Nhật'}
                        </Button>
                    </div>
                    <div className={style.title}>Open Product</div>
                    <div className={style.selectProduct}>
                        <Select
                            className={style.formRegister}
                            options={options}
                            onChange={(value, option) => handleOnChange(option)}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? "").includes(input)
                            }
                        />
                    </div>
                    <div className={style.inforProduct}>
                        <div className={style.inputWidth45}>
                            <Typography.Title
                                level={5}
                                className={style.fontTitle}
                                aria-required
                            >
                                Product Name VI
                            </Typography.Title>
                            <Input
                                className={style.formInputcustom}
                                value={selectedProduct.nameVI}
                                disabled
                            />
                        </div>
                        <div className={style.inputWidth45}>
                            <Typography.Title
                                level={5}
                                className={style.fontTitle}
                                aria-required
                            >
                                Product Name Other
                            </Typography.Title>
                            <Input
                                className={style.formInputcustom}
                                value={selectedProduct.nameEN}
                                disabled
                            />
                        </div>
                    </div>
                </div>
                <div className={style.Config}>
                    <div className={style.title}>Basic Information</div>

                    <Tabs className={style.Description}>
                        {items.map((item) => (
                            <Tabs.TabPane tab={item.label} key={item.key}>
                                {renderTabContent(item.key)}
                            </Tabs.TabPane>
                        ))}
                    </Tabs>
                </div>

                <div className={style.Description}>
                    <div className={style.title}>Description</div>

                    <div className={style.formDesc}>
                        <Tabs >
                            {desc.map((item) => (
                                <Tabs.TabPane tab={item.label} key={item.key}>
                                    {renderTabDesc(item.key)}
                                </Tabs.TabPane>
                            ))}
                        </Tabs>
                    </div>
                </div>
            </div>

            <div className={style.right}>
                <div className={style.otherInformation}>
                    <div className={style.title}>Categoty</div>

                    <div className={style.inputMaxWidth}>
                        <Select
                            className={style.formTags}
                            showSearch
                            options={listTypeProduct}
                            value={selectedProduct.category}
                        // onChange={(value) => handleOnChange(value)}
                        />
                    </div>
                </div>

                <div className={style.otherInformation}>
                    <div className={style.title}>Tags</div>
                    <div className={style.inputMaxWidth}>
                        <Select
                            mode="multiple"
                            className={style.formTags}
                            showSearch
                            placeholder="Option Product"
                            options={listCategory}
                            value={selectedProduct.listTag}
                        />
                    </div>
                </div>

                <div className={style.otherInformation}>
                    <div className={style.title}>Brand</div>
                    <div className={style.inputMaxWidth}>
                        <Select
                            className={style.formTags}
                            showSearch
                            placeholder="Option Product"
                            options={listBrand}
                            value={selectedProduct.brandId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
