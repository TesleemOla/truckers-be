import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ManifestDocument = Manifest & Document;

@Schema()
class Location {
  @Prop({ type: Number, required: true })
  latitude: number;

  @Prop({ type: Number, required: true })
  longitude: number;

  @Prop({ type: String })
  address: string;
}
@Schema({ timestamps: true })
export class Manifest {
  @Prop({ required: true, unique: true })
  manifestNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Truck', required: true })
  truck: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  driver: Types.ObjectId;

  @Prop({ required: true, type: Location })
  origin: {
    address: string;
    latitude: number;
    longitude: number;
  };

  @Prop({ required: true, type: Location })
  destination: {
    address: string;
    latitude: number;
    longitude: number;
  };

  @Prop()
  departureTime?: Date;

  @Prop()
  arrivalTime?: Date;

  @Prop({ default: 'pending' })
  status: string; // 'pending' | 'in-transit' | 'completed' | 'cancelled'

  @Prop([
    {
      latitude: Number,
      longitude: Number,
      address: String,
      timestamp: { type: Date, default: Date.now },
    },
  ])
  locationHistory: Array<{
    latitude: number;
    longitude: number;
    address?: string;
    timestamp: Date;
  }>;

  @Prop({ type: Location })
  lastReportedLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
    timestamp: Date;
  };

  @Prop()
  cargoDescription?: string;

  @Prop()
  notes?: string;
}

export const ManifestSchema = SchemaFactory.createForClass(Manifest);
