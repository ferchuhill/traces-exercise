import { FastifyInstance } from 'fastify';
import buildServer from '../../app';

describe('Traces', () => {
  
  let app: FastifyInstance;
  let timeFirstRequest = 0;

  const responseApi = {
    'ip': '190.191.237.90',
    'name': 'Argentina',
    'code': 'AR',
    'lat': -36,
    'lon': -59.9964,
    'currencies': [
      {
        'iso': 'ARS',
        'symbol': '$',
        'convertion_rate': 0.00711,
      },
      {
        'iso': 'USD',
        'symbol': '$',
        'convertion_rate': 1,
      },
    ],
    'distance_to_usa': 8922.51,
  }; 

  beforeEach(() => {
    app = buildServer();
  });
  
  afterEach( async () => {
    await app.close();
  });
  
  test('Getting information from external sources', async () => {

    const dateStart = new Date();
    const res = await app.inject({
      method: 'POST',
      url: '/traces',
      payload: {  
        ip: '190.191.237.90',
      },
    });
    const dateEnd = new Date();
    timeFirstRequest = dateEnd.getTime() - dateStart.getTime();
    expect(JSON.parse(res.payload)).toEqual(responseApi);
  });

  test('Getting information from Cache', async () => {

    const dateStart = new Date();
    const res = await app.inject({
      method: 'POST',
      url: '/traces',
      payload: {  
        ip: '190.191.237.90',
      },
    });
    const dateEnd = new Date();
    expect(dateEnd.getTime() - dateStart.getTime()).toBeLessThan(timeFirstRequest);
    expect(JSON.parse(res.payload)).toEqual(responseApi);
  });

});