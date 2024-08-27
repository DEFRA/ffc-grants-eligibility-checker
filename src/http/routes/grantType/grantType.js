import { v4 as uuid } from 'uuid';

let grantType;

export const addGrantType = (title, description) => {
    grantType = {
        id: uuid(),
        title,
        description,
    };

    return grantType;
};

export const getGrantType = () => grantType;
