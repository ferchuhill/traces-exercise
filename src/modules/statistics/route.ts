import { FastifyInstance } from 'fastify';
import { statisticsHandler } from './controller';
import { schema, StatisticsRequest } from './schema';

async function statisticsRoutes(server: FastifyInstance) {
      
  server.get<StatisticsRequest>('/', schema, statisticsHandler);
}

export default statisticsRoutes;