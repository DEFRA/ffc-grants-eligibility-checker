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

export const routes = [
    {
        method: 'GET',
        path: '/{grantType}',
        handler: getGrantType,
    },
    {
        method: 'POST',
        path: '/{grantType}',
        handler: addGrantType.bind(this, 'Test Title', 'Test Description'),
    }
]
