import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../providers/auth-provider/authSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer
    },
})
