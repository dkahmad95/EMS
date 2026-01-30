"use server";
import axios from "axios";
import * as api from "../../../routes/offices";
import { withToken } from "../auth/authRequests";

export const getOffices = async (): Promise<Office[] | null> =>
    withToken((decodedToken, authHeader) =>
        axios.get(api.OFFICES_API.GET, {
            headers: authHeader,
            withCredentials: true,
        }),
    );

export const createOffice = async (data: Office): Promise<Office | null> =>
    withToken((decodedToken, authHeader) =>
        axios.post(
            api.OFFICES_API.CREATE,
            data,
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );

export const updateOffice = async (id: number, data: Office): Promise<Office | null> =>
    withToken((decodedToken, authHeader) =>
        axios.patch(
            api.OFFICES_API.UPDATE(id),
            {
                name: data.name,
                address: data.address,
                city_id: data.city_id,
            },
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );

export const deleteOffice = async (id: number): Promise<any | null> =>
    withToken((decodedToken, authHeader) =>
        axios.delete(api.OFFICES_API.DELETE(id), {
            headers: authHeader,
            withCredentials: true,
        }),
    );
