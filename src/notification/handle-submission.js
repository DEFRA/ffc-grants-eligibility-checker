import { v4 as uuidv4 } from 'uuid';
import { EmailService } from './Email-Service.js';
import { EmailFormatter } from './Email-Formatter.js';
import { getConnecter } from '../lib/service-bus/get-connector.js';
import { app } from '../config/app.js';

const connector = getConnecter(app);
const service = new EmailService(connector, app);
const emailFormatter = new EmailFormatter(app);

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
  const formattedEmail = emailFormatter.formatSubmissionEmail(machineContext);
  const correlationId = app.environment === 'local' ? app.serviceBus.local.correlationId : uuidv4();

  return await service.sendSubmissionEmail(formattedEmail, correlationId);
}
