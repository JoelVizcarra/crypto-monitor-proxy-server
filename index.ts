const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');
import type { IncomingMessage } from 'http';
import type { Request, Response } from 'express';

dotenv.config();

const app = express();

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const API_SERVICE_URL = process.env.API_SERVICE_URL;

app.use(morgan('dev'));

app.use(
	'/api',
	createProxyMiddleware({
		target: API_SERVICE_URL,
		changeOrigin: true,
		pathRewrite: {
			[`^/api`]: '',
		},
		onProxyRes: (proxyRes: IncomingMessage, req: Request, res: Response) => {
			proxyRes.headers['Access-Control-Allow-Origin'] =
				process.env.ALLOWED_HOSTS;
			proxyRes.headers['Access-Control-Allow-Headers'] = 'x-access-token';
		},
	})
);

app.listen(PORT, HOST, () => {
	console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
