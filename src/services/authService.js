import axiosClient from "./axiosClient";

export const authService = {

    async login(user) {
        return axiosClient.post(`api/user/auth`, user)
    },
}