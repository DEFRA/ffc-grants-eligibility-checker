// create the functions for the following should generate pageUIConfig.country the override function merges the meta object with the object passed in
export const pageGlobals = {
  serviceTitle: 'Example Grant',
  serviceStartUrl: '/eligibility-checker/example-grant/start'
};

export const pageUIConfig = {
  country: {
    inputOptions: {
      title: 'Is the planned project in England?',
      hint: {
        text: 'The site where the work will happen'
      },
      classes: 'govuk-radios--inline govuk-fieldset__legend--l',
      answers: [
        {
          key: 'country-A1',
          value: 'Yes'
        },
        {
          key: 'country-A2',
          value: 'No'
        }
      ]
    },
    sidebar: {
      values: [
        {
          heading: 'Eligibility',
          content: [
            {
              para: `This grant is only for projects in England.
              
              Scotland, Wales and Northern Ireland have other grants available.`
            }
          ]
        }
      ]
    }
  },
  consent: {
    inputOptions: {
      title: 'Confirm and send',
      answers: [
        {
          key: 'consent-A1',
          value: 'CONSENT_OPTIONAL',
          text: '(Optional) I consent to being contacted by Defra or a third party about service improvements'
        }
      ]
    },
    warning: {
      text: 'You can only submit your details once'
    },
    consentOptionalCheckboxData: {
      hiddenInput: {
        id: 'consentMain',
        name: 'consentMain',
        value: 'true',
        type: 'hidden'
      },
      idPrefix: 'consent',
      name: 'consent'
    }
  },
  confirmation: {
    title: 'Details submitted',
    reference: {
      titleText: 'Details submitted',
      html: 'Your reference number<br><strong>{{_confirmationId_}}</strong>',
      surveyLink: process.env.SURVEY_LINK
    }
  }
};
