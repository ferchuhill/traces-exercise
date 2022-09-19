import { RequestGenericInterface, RouteShorthandOptions } from 'fastify';


//Request body interface
export interface StatisticsRequest extends RequestGenericInterface {
  Body: { }
}

// Response body interface
const statisticsResponseJsonSchema = {
  description: 'Response with the longest distance to USA and most traced country',
  type: 'object',
  properties: {
    longest_distance: {
      type: 'object',
      properties: {
        country: { type: 'string' },
        value: { type: 'number' },
      },
    },
    most_traced: {
      type: 'object', 
      properties: {
        country: { type: 'string' },
        value: { type: 'number' },
      },
    },
  },
};

// Schema options
const schema : RouteShorthandOptions = {
  schema: {
    description: 'Return the longest distance and most traced country',
    response: {
      200: statisticsResponseJsonSchema,
    },
  },
};



export { schema };