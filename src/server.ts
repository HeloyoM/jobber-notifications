import "express-async-errors";
import http from 'http';
import { Logger } from "winston";
import { winstonLogger, } from '@heloyom/shared-develope-tools';
import { config } from "@notifications/config";
import { Application } from "express";
import { healthRoutes } from '@notifications/routes'
// import { checkConnection } from "@notifications/elasticsearch";
import createConnection from "@notifications/queues/connection";
import { Channel } from "amqplib";
import { consumerAuthEmailMessages, consumerOrderEmailMessages } from "./queues/email.consumer";

const SERVER_PORT = 4001;

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationsServer', 'debug');

export function start(app: Application): void {
    startServer(app);
    app.use('', healthRoutes);
    startQueues();
    // startElasticSearch();
}

async function startQueues(): Promise<void> {
    const emailChannel = await createConnection() as Channel;
    await consumerAuthEmailMessages(emailChannel);
    await consumerOrderEmailMessages(emailChannel);

    // const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=198y24iunmfoih78h3`;
    // const messageDetails: IEmailMessageDetails = {
    //     receiverEmail: `${config.SENDER_EMAIL}`,
    //     resetLink: verificationLink,
    //     username: 'Meir',
    //     template: 'forgotPassword'
    // }

    // await emailChannel.assertExchange('jobber-email-notification', 'direct');
    // const message = JSON.stringify(messageDetails);
    // emailChannel.publish('jobber-email-notification', 'auth-email', Buffer.from(message))
}

// function startElasticSearch(): void {
//     checkConnection();
// }

function startServer(app: Application): void {
    try {
        const httpServer: http.Server = new http.Server(app);
        log.info(`Worker with process id of ${process.pid} on notification server has started`);
        httpServer.listen(SERVER_PORT, () => {
            log.info(`Notifications server running on port ${SERVER_PORT}`);
        })
    } catch (error) {
        log.log('error', 'NotificationService startServer() method', error)
    }
}

