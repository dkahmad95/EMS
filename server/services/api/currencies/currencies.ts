"use server";
import axios from "axios";
import * as api from "../../../routes/currencies";
import { withToken } from "../auth/authRequests";

export const getCurrencies = async (): Promise<Currency[] | null> =>
    withToken((decodedToken, authHeader) =>
        axios.get(api.CURRENCIES_API.GET, {
            headers: authHeader,
            withCredentials: true,
        }),
    );

export const createCurrency = async (data: Currency): Promise<Currency | null> =>
    withToken((decodedToken, authHeader) =>
        axios.post(
            api.CURRENCIES_API.CREATE,
            data,
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );

export const updateCurrency = async (id: number, data: Currency): Promise<Currency | null> =>
    withToken((decodedToken, authHeader) =>
        axios.patch(
            api.CURRENCIES_API.UPDATE(id),
            {
                name: data.name,
                code: data.code,
            },
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );
export const deleteCurrency = async (id: number): Promise<any | null> =>
    withToken((decodedToken, authHeader) =>
        axios.delete(api.CURRENCIES_API.DELETE(id), {
            headers: authHeader,
            withCredentials: true,
        }),
    );