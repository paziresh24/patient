import { useMutation } from 'react-query';
import { getPagingBook } from './api';

export const useGetPagingBook = () => {
    return useMutation(getPagingBook);
};
