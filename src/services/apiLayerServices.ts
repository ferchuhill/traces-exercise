import got from 'got';

type IpLayerRequest = {
  success: boolean,
  result: string,
  date: string,
};

const apiLayerServices = {
    
  getConvertCurrency: 
    async (currencyCodeFrom: string, currencyCodeTo: string, amount:number)
    : Promise<IpLayerRequest> => {
        
      const options = {
        headers: {
          apikey: process.env.API_LAYER_API_TOKEN,
        },
      };

      const url = `${process.env.API_LAYER_HOST}`
                  + `?to=${currencyCodeTo}`
                  + `&from=${currencyCodeFrom}`
                  + `&amount=${amount}`;

      return got(url, options).json();
    },   
};

export default apiLayerServices;