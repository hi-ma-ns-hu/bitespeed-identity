"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
require("express-async-errors");
// import './utils/ErrorUtils/nodeProcessException';
const dotenv_1 = require("dotenv");
const app_1 = __importDefault(require("./app"));
// 
(0, dotenv_1.config)(); // helps to work with environment variables
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const server = new app_1.default(PORT).server();
exports.default = server;
