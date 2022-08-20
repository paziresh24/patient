import { useQuery } from 'react-query';
import { getBooks } from './api';

export const useGetBooks = (params: GetBooksParams) => {
    return useQuery(['getBooks', params], () => getBooks(params), {
        enabled: false
    });
};
