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
exports.emailTemplates = emailTemplates;
const shared_develope_tools_1 = require("@heloyom/shared-develope-tools");
const config_1 = require("./config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_templates_1 = __importDefault(require("email-templates"));
const node_path_1 = __importDefault(require("node:path"));
const log = (0, shared_develope_tools_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug');
function emailTemplates(template, receiver, locals) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const smtpTransporter = nodemailer_1.default.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: config_1.config.SENDER_EMAIL,
                    pass: config_1.config.SENDER_EMAIL_PASSWORD
                }
            });
            const email = new email_templates_1.default({
                message: {
                    from: `jobber app <${config_1.config.SENDER_EMAIL}>`
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
                        rebaseRelativeTo: node_path_1.default.join(__dirname, '../build')
                    }
                }
            });
            yield email.send({
                template: node_path_1.default.join(__dirname, '..', 'src/emails', template),
                message: { to: receiver },
                locals
            });
        }
        catch (error) {
            log.error(error);
        }
    });
}
//# sourceMappingURL=helpers.js.map