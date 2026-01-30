"use server";
import axios from "axios";
import * as api from "../../../routes/jobTitles";
import { withToken } from "../auth/authRequests";

export const getJobTitles = async (): Promise<JobTitle[] | null> =>
    withToken((decodedToken, authHeader) =>
        axios.get(api.JOB_TITLES_API.GET, {
            headers: authHeader,
            withCredentials: true,
        }),
    );

export const createJobTitle = async (data: JobTitle): Promise<JobTitle | null> =>
    withToken((decodedToken, authHeader) =>
        axios.post(
            api.JOB_TITLES_API.CREATE,
            data,
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );

export const updateJobTitle = async (id: number, data: JobTitle): Promise<JobTitle | null> =>
    withToken((decodedToken, authHeader) =>
        axios.patch(
            api.JOB_TITLES_API.UPDATE(id),
            {
                name: data.name,
            },
            {
                headers: authHeader,
                withCredentials: true,
            },
        ),
    );

export const deleteJobTitle = async (id: number): Promise<any | null> =>
    withToken((decodedToken, authHeader) =>
        axios.delete(api.JOB_TITLES_API.DELETE(id), {
            headers: authHeader,
            withCredentials: true,
        }),
    );
