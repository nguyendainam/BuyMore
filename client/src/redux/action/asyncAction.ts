import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetCurrent } from "../../services/user";
import { choosenItemInCart, logoutUser } from "../Slice/userSlice";
import { useDispatch } from "react-redux";

export const getCurrent = createAsyncThunk('', async (_, { rejectWithValue }) => {
    try {
        const response = await apiGetCurrent();
        if (response.data.dataUser) {

            return response.data.dataUser;
        } else {
            if (response.data.error === 'TokenExpiredError') {
                // Dispatch a logout action or handle token expiration appropriately
                console.log('Logout.......')
            }
            return rejectWithValue(response.data);
        }
    } catch (error) {

        console.error('Error fetching data:', error);
        throw error;
    }
});


export const dataItemCart = (data) => async dispatch => {
    console.log('ssssssssssssssssss', data);
    // Gửi dữ liệu đến store Redux thông qua dispatch
    await dispatch(choosenItemInCart(data)); // Giả sử choosenItemInCart là một action khai báo trước đó
};


export const logout = () => async dispatch => {
    // Thực hiện các thao tác cần thiết để đăng xuất (xoá token, reset trạng thái, v.v.)
    // Sau đó, dispatch action để cập nhật trạng thái đăng nhập về false
    // console.log('aaaaa')

    dispatch(logoutUser());
};