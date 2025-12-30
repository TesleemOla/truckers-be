import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrucksService } from './trucks.service';
import { TrucksController } from './trucks.controller';
import { Truck, TruckSchema } from './schemas/truck.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Truck.name, schema: TruckSchema }]),
  ],
  controllers: [TrucksController],
  providers: [TrucksService],
  exports: [TrucksService],
})
export class TrucksModule {}

