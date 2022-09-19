import got from 'got';

type IpApiRequest = {
  status: string,
  country: string,
  countryCode: string,
  lat: number,
  lon: number,
  currency: string,
};

const ipApiServices = {
  getIpInfo: async (ip: string): Promise<IpApiRequest> => {
    const url = `${process.env.IP_API_HOST}/json/${ip}` 
      + '?fields=status,message,country,countryCode,lat,lon,currency';
    return got(url).json();
  },
};

export default ipApiServices;