"use server";
import axios from "axios";
import * as api from "../../../routes/educationLevels";
import { withToken } from "../auth/authRequests";

export const getEducationLevels = async (): Promise<EducationLevel[] | null> =>
    withToken((decodedToken, authHeader) =>
        axios.get(api.EDUCATION_LEVELS_API.GET, {
            headers: authHeader,
            withCredentials: true,
        }),
    );

export const createEducationLevel = async (data: EducationLevel): Promise<EducationLevel | null> =>
    withToken((decodedToken, authHeader) =>
        axios.post(
            api.EDUCATION_LEVELS_API.CREATE,
            data,
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );

export const updateEducationLevel = async (id: number, data: EducationLevel): Promise<EducationLevel | null> =>
    withToken((decodedToken, authHeader) =>
        axios.patch(
            api.EDUCATION_LEVELS_API.UPDATE(id),
            {
                name: data.name,
            },
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );

export const deleteEducationLevel = async (id: number): Promise<any | null> =>
    withToken((decodedToken, authHeader) =>
        axios.delete(api.EDUCATION_LEVELS_API.DELETE(id), {
            headers: authHeader,
            withCredentials: true,
        }),
    );
