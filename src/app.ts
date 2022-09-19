import fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyRedis from '@fastify/redis'; 
import swagger from '@fastify/swagger';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import tracesRoutes from './modules/traces/route';
import statisticsRoutes from './modules/statistics/route';

const buildServer = () => {

  // Load environment variables from .env file, where API keys and passwords are configured
  dotenv.config();

  const parameters = ( process.env.NODE_ENV === 'development') 
    ? {
      logger: {
        level: 'info',
        transport: {
          target: 'pino-pretty',
        },
      },
    } 
    : {};

  // Create a http server. We pass the relevant typings for our http version used.
  const server = fastify(parameters);

  //connected fastify to mongoose
  try {
    const urlMongo = 
      `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/trace` 
      || 'mongodb://localhost:27017/trace';
    mongoose.connect(urlMongo);
  } catch (e) {
    console.error(e);
  }

  // Register cors
  server.register(cors, { 
    origin: true,
  });

  // Health Check of the server is running
  server.get('/healthcheck', async function () {
    return { status: 'OK' };
  });

  // Register Swagger API in development mode
  if (process.env.NODE_ENV === 'development') {
    server.register(swagger, {
      routePrefix: '/doc',
      swagger: {
        info: {
          title: 'Home exercise API',
          description: 
          'Implementation of a REST API for a home exercise to get traces and statistics',
          version: '0.1.0',
        },
        host: process.env.HOST || 'localhost',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
      },
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
      },
      uiHooks: {
        onRequest: function (request, reply, next) { next(); },
        preHandler: function (request, reply, next) { next(); },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      exposeRoute: true,
    });
  }

  let redisPort = process.env.REDIS_PORT 
    ? parseInt(process.env.REDIS_PORT) 
    : 6379;

  // Register Redis cache
  server.register(fastifyRedis, { 
    host: process.env.REDIS_HOST || '127.0.0.1', 
    port: redisPort,
  });

  server.register(tracesRoutes, { prefix: 'traces' });
  server.register(statisticsRoutes, { prefix: 'statistics' });

  return server;
};

export default buildServer;