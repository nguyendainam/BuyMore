import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { getCurrent } from '../action/asyncAction'

interface InforUser {
    isLogin: boolean,
    accessToken: string,
    isLoading: boolean,
    current: object,
    msg: string,
    userCart: []
}
const initialState: InforUser = {
    isLogin: false,
    accessToken: '',
    isLoading: false,
    current: {},
    msg: '',
    userCart: []
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        saveAccessToken: (state, action: PayloadAction<{ accessToken: string }>) => {
            return {
                ...state,
                accessToken: action.payload.accessToken,
                isLogin: true
            }
        },

        choosenItemInCart: (state, action: PayloadAction<{ dataItem: [] }>) => {
            const payloadArray = action.payload.dataItem || [];
            state.userCart = payloadArray;
        },

        logoutUser: (state) => {
            // Đặt lại trạng thái đăng nhập khi đăng xuất
            state.isLogin = false;
            // Xóa thông tin người dùng khác nếu có
            state.accessToken = '';
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(getCurrent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCurrent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.current = action.payload;
                state.isLogin = true;
            })
            .addCase(getCurrent.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.current = initialState.current;
                state.isLogin = false;
                state.msg = 'Phiên đăng nhập hết hạn'
                state.accessToken = ''
                console.error('Error fetching data SDASDASDASDAS:', action.error);

            });

    },
})

export const { saveAccessToken, choosenItemInCart, logoutUser } = userSlice.actions
export default userSlice.reducer
