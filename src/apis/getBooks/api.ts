import { paziresh24AppClient } from '../client';

export const getBooks = (params: GetBooksParams) => {
    return paziresh24AppClient.get('/V1/patient/visits', { params });
};
