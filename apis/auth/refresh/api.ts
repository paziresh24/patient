import { paziresh24AppClient } from '../../client';

export const refresh = async () => {
    return await paziresh24AppClient.post(`V1/auth/refresh`);
};
