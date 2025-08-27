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
exports.consumerAuthEmailMessages = consumerAuthEmailMessages;
exports.consumerOrderEmailMessages = consumerOrderEmailMessages;
const config_1 = require("../config");
const shared_develope_tools_1 = require("@heloyom/shared-develope-tools");
const connection_1 = __importDefault(require("./connection"));
const mail_transport_1 = require("../queues/mail.transport");
const log = (0, shared_develope_tools_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');
function consumerAuthEmailMessages(channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!channel) {
                channel = (yield (0, connection_1.default)());
            }
            const exchangeName = 'jobber-email-notification';
            const routingKey = 'auth-email';
            const queueName = 'auth-email-queue';
            yield channel.assertExchange(exchangeName, 'direct');
            const jobberQueue = yield channel.assertQueue(queueName, { durable: true, autoDelete: false });
            yield channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
            channel.consume(jobberQueue.queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg.content.toString());
                const locals = {
                    appLink: `${config_1.config.CLIENT_URL}`,
                    appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
                    username,
                    verifyLink,
                    resetLink
                };
                yield (0, mail_transport_1.sendEmail)(template, receiverEmail, locals);
                // channel.ack(msg!)
            }));
        }
        catch (error) {
            log.log('error', 'NotificationService EmailConsumer consumeAuthEmailMessages() method error:', error);
        }
    });
}
function consumerOrderEmailMessages(channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!channel) {
                channel = (yield (0, connection_1.default)());
            }
            const exchangeName = 'jobber-order-notification';
            const routingKey = 'order-email';
            const queueName = 'order-email-queue';
            yield channel.assertExchange(exchangeName, 'direct');
            const jobberQueue = yield channel.assertQueue(queueName, { durable: true, autoDelete: false });
            yield channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
            channel.consume(jobberQueue.queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                const { receiverEmail, username, template, sender, offerLink, amount, buyerUsername, sellerUsername, title, description, deliveryDays, orderId, orderDue, requirements, orderUrl, originalDate, newDate, reason, subject, header, type, message, serviceFee, total } = JSON.parse(msg.content.toString());
                const locals = {
                    appLink: `${config_1.config.CLIENT_URL}`,
                    appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
                    username,
                    sender,
                    offerLink,
                    amount,
                    buyerUsername,
                    sellerUsername,
                    title,
                    description,
                    deliveryDays,
                    orderId,
                    orderDue,
                    requirements,
                    orderUrl,
                    originalDate,
                    newDate,
                    reason,
                    subject,
                    header,
                    type,
                    message,
                    serviceFee,
                    total
                };
                if (template === 'orderPlaced') {
                    yield (0, mail_transport_1.sendEmail)('orderPlaced', receiverEmail, locals);
                    yield (0, mail_transport_1.sendEmail)('orderReceipt', receiverEmail, locals);
                }
                else {
                    yield (0, mail_transport_1.sendEmail)(template, receiverEmail, locals);
                }
                channel.ack(msg);
            }));
        }
        catch (error) {
            log.log('error', 'NotificationService EmailConsumer consumeAuthEmailMessages() method error:', error);
        }
    });
}
//# sourceMappingURL=email.consumer.js.map