import {useDispatch} from "react-redux";
import {useEffect} from "react";
// eslint-disable-next-line import/named
import {addUserInfo} from "./authSlice";

export function AuthProvider({ children }) {
    const dispatch = useDispatch()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) {
            dispatch(addUserInfo(user))
        }
    })

    return <>{children}</>
}