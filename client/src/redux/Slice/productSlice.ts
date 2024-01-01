import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IProduct{
   listProduct: any[]
}
const initialState: IProduct = {
   listProduct: []
}

const productSlice = createSlice({
    name: 'systems',
    initialState,
    reducers: {
       
        addProductViewed: (state, action: PayloadAction<{product: any}> ) => {
            const existingProduct = state.listProduct.find((p) => p.idProduct === action.payload.product.idProduct);
            if (!existingProduct) {
                  state.listProduct = [action.payload.product, ...state.listProduct];
              }
            }


    }
})

export const {  addProductViewed} = productSlice.actions
export default productSlice.reducer
