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
require("reflect-metadata"); // add support for js decorators
const express_1 = __importDefault(require("express"));
// extra packages for security purpose
const helmet_1 = __importDefault(require("helmet")); // helps to secure our app by setting various HTTP headers
const cors_1 = __importDefault(require("cors")); // helps us to enable cors
const hpp_1 = __importDefault(require("hpp")); // helps us to sanitize user input
const compression_1 = __importDefault(require("compression")); // compression middleware
// import AppDataSource from './config/appDataSource';
// import errorHandlerMiddleware from './middleware/errorMiddleware';
// import morganMiddleware from './middleware/morganMiddleware';
// import IndexRoute from './routes/index.route';
class App {
    constructor(port) {
        this.app = (0, express_1.default)();
        // this.indexRoutes = new IndexRoute()
        this.PORT = port;
        this.initializeMiddlewares();
        this.initializeAppRoutes();
        this.initializeErrorHandler();
        this.initializeDatabase();
    }
    initializeMiddlewares() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, hpp_1.default)());
        this.app.use(express_1.default.json()); // parses json request body
        this.app.use(express_1.default.urlencoded({ extended: true })); // parse urlencoded request body
        this.app.use((0, compression_1.default)());
        this.app.use((0, cors_1.default)());
        // this.app.use(morganMiddleware);
    }
    initializeAppRoutes() {
        // this.app.use('/api', this.indexRoutes.router)
        this.app.use('/api', (req, res) => res.status(200).send('Radha'));
    }
    initializeErrorHandler() {
        // this.app.use(errorHandlerMiddleware)
    }
    initializeDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // await AppDataSource.initialize();
                // new RepositoryProvider(AppDataSource)
            }
            catch (error) {
                console.log('database init error', error);
            }
        });
    }
    server() {
        return this.app.listen(this.PORT, () => console.log(`Server listening on PORT ${this.PORT}`))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .on('error', (err) => {
            if (err === 'EADDRINUSE') {
                console.log('Address already in use', JSON.stringify(err));
            }
            else {
                console.log(JSON.stringify(err));
            }
        });
    }
}
exports.default = App;
