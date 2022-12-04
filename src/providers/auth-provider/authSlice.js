import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {authService} from "../../services/authService";

const initialState = {
    user: null,
    isLoading: false,
    isLogin: false,
    isError: false
}

export const login = createAsyncThunk(
    "auth/login",
    async (user) => {
        const response = await authService.login(user)
        const data = response.result
        localStorage.setItem("userInfo", JSON.stringify(data))
        return response?.result
    }
)


export const logout = createAsyncThunk(
    "auth/logout",
    async () => {
        localStorage.removeItem("userInfo")
    }
)

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        addUserInfo: (state, action) => {
            state.user = action.payload
            state.isLogin = true
        }
    },
    extraReducers: {
        [login.pending]: (state) => {
            state.isLoading = true
            state.isError = false
            state.isLogin = false
        },
        [login.fulfilled]: (state, action) => {
            state.user = action.payload;
            state.isLogin = true
            state.isLoading = false
            state.isError = false
        },
        [login.rejected]: (state) => {
            state.isLoading = false
            state.isError = true
            state.isLogin = false
        },
        [logout.fulfilled]: (state) => {
            state.isLogin = false
        }
    },
})

// Action creators are generated for each case reducer function
export const { addUserInfo } = authSlice.actions;

export default authSlice.reducer;
