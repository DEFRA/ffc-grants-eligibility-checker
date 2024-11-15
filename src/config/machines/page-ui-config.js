export const pageUIConfig = {
  country: {
    title: 'Is the planned project in England?',
    hint: {
      text: 'The site where the work will happen'
    },
    classes: 'govuk-radios--inline govuk-fieldset__legend--l',
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
    title: 'Confirm and send',
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
    reference: {
      titleText: 'Details submitted',
      html: 'Your reference number<br><strong>{{_confirmationId_}}</strong>',
      surveyLink: process.env.SURVEY_LINK
    }
  }
};
