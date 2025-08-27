import { config } from '@notifications/config';
import { IEmailLocals, winstonLogger } from '@heloyom/shared-develope-tools';
import { Logger } from 'winston';
import { emailTemplates } from '@notifications/helpers';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransport', 'debug');

async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> {
    try {
        await emailTemplates(template, receiverEmail, locals);
        log.info('Emails sent successfully.')
    } catch (error) {
        log.log('error', 'NotificationService MailTransport() methd error:', error);
    }
}

export { sendEmail };
