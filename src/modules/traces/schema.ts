import { RequestGenericInterface, RouteShorthandOptions } from 'fastify';

//Json Schema for the request body with a IP Address
const tracesBodyJsonSchema = {
  type: 'object',
  properties: {
    ip: {
      type: 'string',
    },
  },
  required: ['ip'],
};

//Request body interface
export interface TracesRequest extends RequestGenericInterface {
  Body: {
    ip: string
  }
}

// Response body interface
const tracesResponseJsonSchema = {
  description: 'Response with the country information, distance to USA and currencies',
  type: 'object',
  properties: {
    ip: { type: 'string' },
    name: { type: 'string' },
    code: { type: 'string' },
    lat: { type: 'number' },
    lon: { type: 'number' },
    currencies: { 
      type: 'array', 
      items: {
        type: 'object',
        properties: {
          iso: { type: 'string' },
          symbol: { type: 'string' },
          convertion_rate: { type: 'number' },
        },
      },  
    },
    distance_to_usa: { type: 'number' },
  },
};

// Schema options
const schema : RouteShorthandOptions = {
  schema: {
    description: 'Base an IP address and return the country information',
    body: tracesBodyJsonSchema,
    response: {
      200: tracesResponseJsonSchema,
    },
  },
};



export { schema };