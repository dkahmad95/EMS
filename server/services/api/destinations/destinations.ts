"use server";
import axios from "axios";
import * as api from "../../../routes/destinations";
import { withToken } from "../auth/authRequests";

export const getDestinations = async (): Promise<Destination[] | null> =>
    withToken((decodedToken, authHeader) =>
        axios.get(api.DESTINATIONS_API.GET, {
            headers: authHeader,
            withCredentials: true,
        }),
    );

export const createDestination = async (data: Destination): Promise<Destination | null> =>
    withToken((decodedToken, authHeader) =>
        axios.post(
            api.DESTINATIONS_API.CREATE,
            data,
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );

export const updateDestination = async (id: number, data: Destination): Promise<Destination | null> =>
    withToken((decodedToken, authHeader) =>
        axios.patch(
            api.DESTINATIONS_API.UPDATE(id),
            {
                name: data.name,
            },
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );

export const deleteDestination = async (id: number): Promise<any | null> =>
    withToken((decodedToken, authHeader) =>
        axios.delete(api.DESTINATIONS_API.DELETE(id), {
            headers: authHeader,
            withCredentials: true,
        }),
    );
