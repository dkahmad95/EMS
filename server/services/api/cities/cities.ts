"use server";
import axios from "axios";
import * as api from "../../../routes/cities";
import { withToken } from "../auth/authRequests";

export const getCities = async (): Promise<City[] | null> =>
    withToken((decodedToken, authHeader) =>
        axios.get(api.CITIES_API.GET, {
            headers: authHeader,
            withCredentials: true,
        }),
    );

export const createCity = async (data: City): Promise<City | null> =>
    withToken((decodedToken, authHeader) =>
        axios.post(
            api.CITIES_API.CREATE,
            data,
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );

export const updateCity = async (id: number, data: City): Promise<City | null> =>
    withToken((decodedToken, authHeader) =>
        axios.patch(
            api.CITIES_API.UPDATE(id),
            {
                name: data.name,
                district_id: data.district_id,
            },
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );

export const deleteCity = async (id: number): Promise<any | null> =>
    withToken((decodedToken, authHeader) =>
        axios.delete(api.CITIES_API.DELETE(id), {
            headers: authHeader,
            withCredentials: true,
        }),
    );
