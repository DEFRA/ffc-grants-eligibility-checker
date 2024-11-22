export default {
  name: 'ffc-grants-eligibility-checker',
  contactDetailsQueue: {
    address: process.env.CONTACT_DETAILS_QUEUE_ADDRESS,
    type: 'queue',
    host: process.env.SERVICE_BUS_HOST,
    password: process.env.SERVICE_BUS_PASSWORD,
    username: process.env.SERVICE_BUS_USER,
    useCredentialChain: process.env.NODE_ENV === 'production'
  },
  // desirabilitySubmittedMsgType: 'uk.gov.ffc.grants.addval.desirability.notification',
  msgSrc: 'ffc-grants-eligibility-checker'
};
