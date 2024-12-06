import { v4 as uuidv4 } from 'uuid';
import { initialiseServiceBus } from './initialise-service-bus.js';

/**
 * Handles a submission by formatting it into an email and sending it.
 * @param {object} machineContext - The complete state machine context containing:
 *   @property {object} userAnswers - The user's answers to questions
 *   @property {string[]} completedPageIds - Array of completed page IDs
 *   @property {string} currentPageId - Current page ID
 *   @property {object} pageErrors - Any page errors
 * @returns {Promise<boolean>} - true if the email is sent successfully, false if not.
 */
export const handleSubmission = async (machineContext) => {
  const { emailService, emailFormatter, config } = initialiseServiceBus();
  const formattedEmail = emailFormatter.formatSubmissionEmail(machineContext);
  const correlationId = config.environment === 'local' ? config.correlationId : uuidv4();

  await emailService.sendSubmissionEmail(formattedEmail, correlationId);
};
