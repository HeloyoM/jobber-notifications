"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_develope_tools_1 = require("@heloyom/shared-develope-tools");
const config_1 = require("./config");
const express_1 = __importDefault(require("express"));
const server_1 = require("./server");
const log = (0, shared_develope_tools_1.winstonLogger)(`${config_1.config.ELASTIC_SEARCH_URL}`, 'notificationsApp', 'debug');
function initialize() {
    const app = (0, express_1.default)();
    (0, server_1.start)(app);
    log.info('Notification Service initialize');
}
;
initialize();
//# sourceMappingURL=app.js.map