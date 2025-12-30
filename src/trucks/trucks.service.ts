import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Truck, TruckDocument } from './schemas/truck.schema';

@Injectable()
export class TrucksService {
  constructor(
    @InjectModel(Truck.name) private truckModel: Model<TruckDocument>,
  ) {}

  async create(createTruckDto: any): Promise<Truck> {
    const truck = new this.truckModel(createTruckDto);
    return truck.save();
  }

  async findAll(): Promise<Truck[]> {
    return this.truckModel.find().populate('assignedDriver', 'name email').exec();
  }

  async findOne(id: string): Promise<Truck | null> {
    return this.truckModel.findById(id).populate('assignedDriver', 'name email').exec();
  }

  async update(id: string, updateTruckDto: any): Promise<Truck | null> {
    return this.truckModel.findByIdAndUpdate(id, updateTruckDto, { new: true }).exec();
  }

  async updateLocation(id: string, location: { latitude: number; longitude: number; address?: string }): Promise<Truck | null> {
    return this.truckModel.findByIdAndUpdate(
      id,
      {
        currentLocation: {
          ...location,
          lastUpdated: new Date(),
        },
      },
      { new: true },
    ).exec();
  }

  async delete(id: string): Promise<void> {
    await this.truckModel.findByIdAndDelete(id).exec();
  }
}

