import axiosClient from "./axiosClient";

export const contentService = {

    async getAll(token) {
        return axiosClient.get(`api/content`, {headers: {Authorization: `Bearer ${token}`}})
    },

    async getStatisticInfo(token) {
        return axiosClient.get(`api/statistic`, {headers: {Authorization: `Bearer ${token}`}})
    },

    async createContent(data, token) {
        const header = {
            Authorization: `Bearer ${token}`
        }

        return axiosClient.post('api/content', data, {headers: header})
    },

    async speechToTextRecognizer(formData, token) {
        const header = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
        return axiosClient.post('/api/speech-recognizer', formData, {headers: header})
    },

    async compareText(data, token) {
        const header = {
            Authorization: `Bearer ${token}`
        }

        return axiosClient.post('api/content/test', data, {headers: header})
    }
}