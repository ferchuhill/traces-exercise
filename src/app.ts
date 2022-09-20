import fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyRedis from '@fastify/redis'; 
import swagger from '@fastify/swagger';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import createError from 'http-errors';

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
    const mongoUrl = process.env.MONGO_URL || '' ;
    // const mongoPassword = process.env.MONGO_PASSWORD || '' ;
    // const mongoHost = process.env.MONGO_HOST || 'localhost' ;
    // const mongoPort = process.env.MONGO_PORT || 27017 ;
    // const mongoDatabase = process.env.MONGO_DATABASE || 'traces' ;
    // const mongoUrl = (mongoUser == '') ? `mongodb://${mongoHost}:${mongoPort}/${mongoDatabase}` : `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}`;
    mongoose.connect(mongoUrl);
  } catch (err) {
    throw createError(500, 'Error connecting to MongoDB');
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

   // Register Redis cache
   try {
    const url = process.env.REDIS_URL || '';
    server.register(fastifyRedis, {url: url});
  } catch (err) {
    throw createError(500,'Error connecting to Redis');
  }

  server.register(tracesRoutes, { prefix: 'traces' });
  server.register(statisticsRoutes, { prefix: 'statistics' });

  return server;
};

export default buildServer;