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

export const getGrantType = (request, h) => {
    const context = {
        siteTitle: "FFC Grants Eligibility Checker",
        urlPrefix: '/eligibility-checker',
        showTimeout: true,
        surveyLink: 'https://example.com/survey',
        sessionTimeoutInMin: 15,
        timeoutPath: '/timeout',
        cookiesPolicy: {
            confirmed: false,
            analytics: true
        }
    };

    return h.view('layout.njk', context);
}

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
