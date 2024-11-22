import { v4 as uuidv4 } from 'uuid';
import { EmailService } from './Email-Service.js';
import { EmailFormatter } from './Email-Formatter.js';

const emailService = new EmailService();
const emailFormatter = new EmailFormatter();

/**
 * Handles a submission by formatting it into an email and sending it.
 * @param {object} machineContext - The complete state machine context containing:
 *   @property {object} userAnswers - The user's answers to questions
 *   @property {string[]} completedPageIds - Array of completed page IDs
 *   @property {string} currentPageId - Current page ID
 *   @property {object} pageErrors - Any page errors
 * @returns {Promise<boolean>} - true if the email is sent successfully, false if not.
 */
export async function handleSubmission(machineContext) {
  console.log('handleSubmission');
  const formattedEmail = emailFormatter.formatSubmissionEmail(machineContext);
  const correlationId = uuidv4();

  console.log('Processing submission:', {
    formattedEmail,
    correlationId
  });

  return emailService.sendSubmissionEmail(formattedEmail, correlationId);
}
