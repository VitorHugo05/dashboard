import axios from "axios";

export interface Response<T> {
    statusCode: number;
    data: T
}

export const api = axios.create({
    baseURL: process.env.API_URL || "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
});
