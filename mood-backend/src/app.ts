import { Environment, environment } from "./config";
import bodyParser from "body-parser";
import { errors } from "celebrate";
import express from "express";
import helloWorldRouter from "./routes/hello-world";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cors from "cors";

const apiSpecs = swaggerJSDoc({
    apis: ["src/routes/*.ts"],
    definition: {
        info: {
            description: "This is an API for Mood application",
            title: "Mood App API",
            version: "1.0.0",
        },
        openapi: "3.1.0",
    },
});

export function createApp() {
    const app = express();

    app.use(bodyParser.json());
    app.use(cors());

    if (environment !== Environment.PROD) {
        app.use("/docs", swaggerUI.serve, swaggerUI.setup(apiSpecs));
    }

    app.use("/hello", helloWorldRouter);
    app.use(errors());

    return app;
}
