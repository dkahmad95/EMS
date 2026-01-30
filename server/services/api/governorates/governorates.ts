"use server";
import axios from "axios";
import * as api from "../../../routes/governorates";
import { withToken } from "../auth/authRequests";

export const getGovernorates = async (): Promise<Governorate[] | null> =>
    withToken((decodedToken, authHeader) =>
        axios.get(api.GOVERNORATES_API.GET, {
            headers: authHeader,
            withCredentials: true,
        }),
    );

export const createGovernorate = async (data: Governorate): Promise<Governorate | null> =>
    withToken((decodedToken, authHeader) =>
        axios.post(
            api.GOVERNORATES_API.CREATE,
            data,
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );

export const updateGovernorate = async (id: number, data: Governorate): Promise<Governorate | null> =>
    withToken((decodedToken, authHeader) =>
        axios.patch(
            api.GOVERNORATES_API.UPDATE(id),
            {
                name: data.name,
            },
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );

export const deleteGovernorate = async (id: number): Promise<any | null> =>
    withToken((decodedToken, authHeader) =>
        axios.delete(api.GOVERNORATES_API.DELETE(id), {
            headers: authHeader,
            withCredentials: true,
        }),
    );
