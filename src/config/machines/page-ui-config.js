export const pageUIConfig = {
  country: {
    classes: 'govuk-radios--inline govuk-fieldset__legend--l',
    title: 'Is the planned project in England?',
    hint: {
      text: 'The site where the work will happen'
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
    title: 'Confirm and send',
    messageHeader1: 'Confirm and send',
    messageHeader3: 'Improving our schemes',
    messageContent: [
      'I confirm that, to the best of my knowledge, the details I have provided are correct.',
      'I understand the score was based on the answers I provided.',
      'I am aware the information I submit will be checked.',
      'I am happy to be contacted by Defra and RPA (or a third-party on their behalf) about my application.',
      'As we develop new services we get feedback from farmers and agents.',
      'You may be contacted by us or a third party that we work with.'
    ],
    warning: {
      text: 'You can only submit your details once'
    },
    consentOptionalData: {
      hiddenInput: {
        id: 'consentMain',
        name: 'consentMain',
        value: 'true',
        type: 'hidden'
      },
      idPrefix: 'consent',
      name: 'consent'
    },
    classes: 'govuk-radios--inline govuk-fieldset__legend--l'
  },
  confirmation: {
    titleText: 'Details submitted',
    messageHeader1: 'Confirmation',
    messageContent: ['This is a confirmation page']
  }
};
