import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000"
});

export const predictDisease = (formData) => {
    return API.post("/predict", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};