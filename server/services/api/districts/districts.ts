"use server";
import axios from "axios";
import * as api from "../../../routes/districts";
import { withToken } from "../auth/authRequests";

export const getDistricts = async (): Promise<District[] | null> =>
    withToken((decodedToken, authHeader) =>
        axios.get(api.DISTRICTS_API.GET, {
            headers: authHeader,
            withCredentials: true,
        }),
    );

export const createDistrict = async (data: District): Promise<District | null> =>
    withToken((decodedToken, authHeader) =>
        axios.post(
            api.DISTRICTS_API.CREATE,
            data,
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );

export const updateDistrict = async (id: number, data: District): Promise<District | null> =>
    withToken((decodedToken, authHeader) =>
        axios.patch(
            api.DISTRICTS_API.UPDATE(id),
            {
                name: data.name,
                governorate_id: data.governorate_id,
            },
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );

export const deleteDistrict = async (id: number): Promise<any | null> =>
    withToken((decodedToken, authHeader) =>
        axios.delete(api.DISTRICTS_API.DELETE(id), {
            headers: authHeader,
            withCredentials: true,
        }),
    );
