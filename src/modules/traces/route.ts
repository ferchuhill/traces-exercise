import { FastifyInstance } from 'fastify';
import { tracesHandler } from './controller';
import { schema, TracesRequest } from './schema';

async function tracesRoutes(server: FastifyInstance) {
      
  server.post<TracesRequest>('/', schema, async (request, reply) => {
    return tracesHandler(request, reply, server.redis);
  });
}

export default tracesRoutes;