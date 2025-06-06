/* eslint-disable no-console */
import 'express-async-errors';
import { config as dotenvConfig } from 'dotenv';
import { Server } from 'http';
import App from './app';

dotenvConfig(); // helps to work with environment variables

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const server: Server = new App(PORT).server()

export default server