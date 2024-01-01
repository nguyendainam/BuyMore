import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface ISystem {
    language: string
}
const initialState: ISystem = {
    language: 'vi',
}

const systemSlice = createSlice({
    name: 'systems',
    initialState,
    reducers: {
        changeLanguage: (state, action: PayloadAction<{ language: string }>) => {
            return {
                ...state,
                language: action.payload.language
            }
        },


    }
})

export const { changeLanguage } = systemSlice.actions
export default systemSlice.reducer
