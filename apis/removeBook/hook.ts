import { useMutation } from 'react-query';
import { removeBook } from './api';

export const useRemoveBook = () => {
    return useMutation(removeBook);
};
