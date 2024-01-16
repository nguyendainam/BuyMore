import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IProduct {
    listProduct: any[]
}
const initialState: IProduct = {
    listProduct: []
}

const productSlice = createSlice({
    name: 'systems',
    initialState,
    reducers: {

        addProductViewed: (state, action: PayloadAction<{ product: any }>) => {
            if (action.payload.product.idProduct  && !action.payload.product.productId) {
                const checkProduct = state.listProduct.find((p) => p.idProduct === action.payload.product.idProduct);
                if (!checkProduct) {
                    const productItem = action.payload.product;
                    const product = {
                        idProduct: productItem.idProduct,
                        nameEN: productItem.nameEN,
                        nameVI: productItem.nameVI,
                        brand: productItem.brand,
                        image: productItem.image,
                        price: productItem.productPrice,
                        discount: productItem.discount
                    };

                    state.listProduct = [product, ...state.listProduct];
                }
            } else if (action.payload.product.productId) {
                const checkProduct = state.listProduct.find((p) => p.idProduct === action.payload.product.productId);
                if (!checkProduct) {
                    const productItem = action.payload.product;
                    const product = {
                        idProduct: productItem.productId,
                        nameEN: productItem.nameEn,
                        nameVI: productItem.nameVI,
                        brand: productItem.brand,
                        image: productItem.image,
                        price: productItem.price,
                        discount: productItem.discount
                    };

                    state.listProduct = [product, ...state.listProduct];
                }
            }
        },

    }
})

export const { addProductViewed } = productSlice.actions
export default productSlice.reducer
