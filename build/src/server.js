"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = start;
require("express-async-errors");
const http_1 = __importDefault(require("http"));
const shared_develope_tools_1 = require("@heloyom/shared-develope-tools");
const config_1 = require("./config");
const routes_1 = require("./routes");
// import { checkConnection } from "./elasticsearch";
const connection_1 = __importDefault(require("./queues/connection"));
const email_consumer_1 = require("./queues/email.consumer");
const SERVER_PORT = 4001;
const log = (0, shared_develope_tools_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'notificationsServer', 'debug');
function start(app) {
    startServer(app);
    app.use('', routes_1.healthRoutes);
    startQueues();
    // startElasticSearch();
}
function startQueues() {
    return __awaiter(this, void 0, void 0, function* () {
        const emailChannel = yield (0, connection_1.default)();
        yield (0, email_consumer_1.consumerAuthEmailMessages)(emailChannel);
        yield (0, email_consumer_1.consumerOrderEmailMessages)(emailChannel);
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
    });
}
// function startElasticSearch(): void {
//     checkConnection();
// }
function startServer(app) {
    try {
        const httpServer = new http_1.default.Server(app);
        log.info(`Worker with process id of ${process.pid} on notification server has started`);
        httpServer.listen(SERVER_PORT, () => {
            log.info(`Notifications server running on port ${SERVER_PORT}`);
        });
    }
    catch (error) {
        log.log('error', 'NotificationService startServer() method', error);
    }
}
//# sourceMappingURL=server.js.map