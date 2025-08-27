import { IEmailLocals, winstonLogger } from '@heloyom/shared-develope-tools';
import { config } from '@notifications/config';
import { Logger } from 'winston';
import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';
import path from 'node:path';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug');


async function emailTemplates(template: string, receiver: string, locals: IEmailLocals): Promise<void> {
    try {

        const smtpTransporter: Transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: config.SENDER_EMAIL,
                pass: config.SENDER_EMAIL_PASSWORD
            }
        });

        const email = new Email({
            message: {
                from: `jobber app <${config.SENDER_EMAIL}>`
            },
            send: true,
            transport: smtpTransporter,
            preview: false,
            views: {
                options: {
                    extension: 'ejs'
                }
            },
            juice: true,
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    rebaseRelativeTo: path.join(__dirname, '../build')
                }
            }
        });


        await email.send({
            template: path.join(__dirname, '..', 'src/emails', template),
            message: { to: receiver },
            locals
        })
    } catch (error) {
        log.error(error)
    }
}

export {emailTemplates}