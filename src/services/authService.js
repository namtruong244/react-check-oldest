import axiosClient from "./axiosClient";

export const authService = {

    async login(user) {
        return axiosClient.post(`api/user/auth`, user)
    },

    async update(user, token) {
        const header = {
            Authorization: `Bearer ${token}`
        }

        return axiosClient.put(`api/user`, user, {headers: header})
    },
}