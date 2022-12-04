import {useDispatch} from "react-redux";
import {useEffect} from "react";
// eslint-disable-next-line import/named
import {addUserInfo} from "./authSlice";

// eslint-disable-next-line react/prop-types
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