import { FastifyReply, FastifyRequest } from 'fastify';
import { FastifyRedis } from '@fastify/redis';
import getSymbolFromCurrency from 'currency-symbol-map';
import createError from 'http-errors';

import ipApiServices from '../../services/ipApiServices';
import calculateDistanceToUSA from '../../util/calculeteDistances';
import checkIfValidIP  from '../../util/checkIp';
import { TracesRequest } from './schema';

import Statistics from '../../models/statistics';

import apiLayerServices from '../../services/apiLayerServices';

const tracesHandler = async (
  request: FastifyRequest<TracesRequest>,
  reply: FastifyReply,
  redis: FastifyRedis,
) => {
  const { ip } = request.body;

  // Redis TTL for 30 minutes
  const ttlRedis = 1800;

  // Check if IP is valid
  if ( !checkIfValidIP(ip) ) {
    throw createError(400, 'Must be a valid IP Addres');
  }

  // Check if IP information is in cache or make a new request
  let ipDetalle;
  const cacheIp = await redis.get(ip);
  if (cacheIp) {
    ipDetalle = JSON.parse(cacheIp);
  } else {
    try { 
      ipDetalle = await ipApiServices.getIpInfo(ip);
      if ( ipDetalle.status !== 'success' ) {
        throw createError(500, 'Not found information of this IP Addres');
      }
    } catch (err) {
      throw createError(503, 'Error getting the IP information');
    }
    await redis.set(ip, JSON.stringify(ipDetalle));
    await redis.expire(ip, ttlRedis);
  }

  // calculate distance to USA from the lat long of the IP
  const distanceToUsa = parseFloat(calculateDistanceToUSA(ipDetalle.lat, ipDetalle.lon).toFixed(2));

  // Check if currency information is in cache or make a new request
  let resultApiLayer;
  const currencieToCompare = 'USD';
  const currenciesKey = [ipDetalle.currency, currencieToCompare, 1].join('-');

  const cacheCurrency = await redis.get(currenciesKey);
  if (cacheCurrency) {
    resultApiLayer = JSON.parse(cacheCurrency);
  } else {
    try {
      resultApiLayer = await apiLayerServices
        .getConvertCurrency(ipDetalle.currency, currencieToCompare, 1);
    } catch (err) {
      throw createError(503, 'Error getting the currency information');
    }
    
    if ( ipDetalle.status !== 'success' ) {
      throw createError(400, 'Not found information fo the currency fro the IP Addres');
    }
   
    await redis.set(currenciesKey, JSON.stringify(resultApiLayer));
    await redis.expire(currenciesKey, ttlRedis);
  }
    
  if ( !resultApiLayer.success ) { 
    throw createError(400, 'No currency information found');
  }

  // Generate the response
  const resultCurrency = {
    ip: ip,
    name: ipDetalle.country,
    code: ipDetalle.countryCode,
    lat: ipDetalle.lat,
    lon: ipDetalle.lon,
    currencies: [
      {
        iso: ipDetalle.currency,
        symbol:  getSymbolFromCurrency(ipDetalle.currency) || '',
        convertion_rate: resultApiLayer?.result,
      },
      {
        iso: currencieToCompare,
        symbol:  getSymbolFromCurrency(currencieToCompare) || '',
        convertion_rate: 1,
      },
    ],
    distance_to_usa: distanceToUsa,
  };

  // Save statistics
  await Statistics.create(resultCurrency);

  return resultCurrency;
};

export { tracesHandler };
