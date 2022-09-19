import { model, Schema, Document as DocumentMongoose } from 'mongoose';

interface Currencies {
  iso: string;
  symbol: string;
  convertion_rate: number;
}

export interface IStatistics extends DocumentMongoose {
  ip: string;
  name: string;
  code: string;
  lat: number;
  lon: number;
  currencies: Currencies[],
  distance_to_usa: number;
}

const StatisticsSchema: Schema = new Schema({
  ip: { type: String, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  currencies: [
    {
      iso: { type: String, required: true },
      symbol: { type: String, required: true },
      convertion_rate: { type: Number, required: true },
    },
  ],
  distance_to_usa: { type: Number, required: true },
});

export default model<IStatistics>('Statistics', StatisticsSchema);
