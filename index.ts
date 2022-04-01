const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');
import type { IncomingMessage, ClientRequest } from 'http';
import type { Request, Response } from 'express';

dotenv.config();

const app = express();

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const CRYPTO_API_URL = process.env.CRYPTO_API_URL;
const CRYPTO_API_TOKEN = process.env.CRYPTO_API_X_ACCESS_TOKEN as string;
const NEWS_API_URL = process.env.NEWS_API_URL;
const NEWS_API_XRAPIDAPI_HOST = process.env.NEWS_API_XRAPIDAPI_HOST as string;
const NEWS_API_XRAPIDAPI_KEY = process.env.NEWS_API_XRAPIDAPI_KEY as string;

app.use(morgan('dev'));

const onProxyRes = (proxyRes: IncomingMessage, req: Request, res: Response) => {
	proxyRes.headers['Access-Control-Allow-Origin'] = process.env.ALLOWED_HOSTS;
	proxyRes.headers['Access-Control-Allow-Headers'] = 'x-access-token';
};

app.use(
	'/api/crypto',
	createProxyMiddleware({
		target: CRYPTO_API_URL,
		changeOrigin: true,
		pathRewrite: {
			[`^/api/crypto`]: '',
		},
		onProxyReq: (proxyReq: ClientRequest, req: Request, res: Response) => {
			proxyReq.setHeader('x-access-token', CRYPTO_API_TOKEN);
		},
		onProxyRes,
	})
);

app.use(
	'/api/news',
	createProxyMiddleware({
		target: NEWS_API_URL,
		changeOrigin: true,
		pathRewrite: {
			[`^/api/news`]: '',
		},
		onProxyReq: (proxyReq: ClientRequest, req: Request, res: Response) => {
			proxyReq.setHeader('X-BingApis-SDK', 'true');
			proxyReq.setHeader('X-RapidAPI-Host', NEWS_API_XRAPIDAPI_HOST);
			proxyReq.setHeader('X-RapidAPI-Key', NEWS_API_XRAPIDAPI_KEY);
		},
		onProxyRes,
	})
);

app.listen(PORT, HOST, () => {
	console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
