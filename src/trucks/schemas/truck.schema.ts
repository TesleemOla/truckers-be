import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Query } from 'mongoose';

export type TruckDocument = Truck & Document;

@Schema({ timestamps: true })
export class Truck {
  @Prop({ required: true, unique: true })
  truckNumber: string;

  @Prop({ required: true })
  licensePlate: string;

  @Prop()
  make: string;

  @Prop()
  model: string;

  @Prop()
  year: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedDriver: Types.ObjectId;

  @Prop({ default: 'available' })
  status: string; // 'available' | 'in-transit' | 'maintenance'

  @Prop({
    type: {
      latitude: String,
      longitude: String,
      address: String,
      lastUpdated: Date,
    },
  })
  currentLocation: {
    latitude: number;
    longitude: number;
    address?: string;
    lastUpdated: Date;
  };

  @Prop({ default: false })
  isDeleted: boolean;
}

export const TruckSchema = SchemaFactory.createForClass(Truck);

TruckSchema.pre(/^find/, function (this: Query<any, any>) {
  this.where({ isDeleted: { $ne: true } });
});
