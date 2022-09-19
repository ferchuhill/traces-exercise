import { FastifyInstance } from 'fastify';
import buildServer from '../../app';

describe('App', () => {

  let app: FastifyInstance;
  
  beforeEach(() => {
    app = buildServer();
  });
  
  afterEach( async () => {
    await app.close();
  });

  test('Getting the statistics for the operations', async () => {

    const res = await app.inject({
      method: 'GET',
      url: '/statistics',
    });

    expect(JSON.parse(res.payload)).toEqual(
      {
        longest_distance: { country: 'Argentina', value: 8922.51 },
        most_traced: { country: 'Argentina', value: 2 },
      },
    );
  });
  

});

