import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Manifest, ManifestDocument } from './schemas/manifest.schema';
import { LocationGateway } from './manifests.gateway';
import { TrucksService } from '../trucks/trucks.service';

@Injectable()
export class ManifestsService {
  constructor(
    @InjectModel(Manifest.name) private manifestModel: Model<ManifestDocument>,
    private readonly locationGateway: LocationGateway,
    private readonly trucksService: TrucksService,
  ) { }

  async create(createManifestDto: any): Promise<Manifest> {
    const manifest = new this.manifestModel(createManifestDto);
    return manifest.save();
  }

  async findAll(): Promise<Manifest[]> {
    return this.manifestModel
      .find().limit(50)
      .populate('truck', 'truckNumber licensePlate')
      .populate('driver', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Manifest | null> {
    return this.manifestModel
      .findById(id)
      .populate('truck', 'truckNumber licensePlate currentLocation')
      .populate('driver', 'name email')
      .exec();
  }

  async findByDriver(driverId: string): Promise<Manifest[]> {
    return this.manifestModel
      .find({ driver: driverId })
      .populate('truck', 'truckNumber licensePlate')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updateManifestDto: any): Promise<Manifest | null> {
    return this.manifestModel
      .findByIdAndUpdate(id, updateManifestDto, { new: true })
      .exec();
  }

  async recordDeparture(id: string): Promise<Manifest | null> {
    return this.manifestModel
      .findByIdAndUpdate(
        id,
        {
          departureTime: new Date(),
          status: 'in-transit',
        },
        { new: true },
      )
      .exec();
  }

  async updateLocation(
    id: string,
    location: { latitude: number; longitude: number; address?: string },
  ): Promise<Manifest | null> {
    const manifest = await this.manifestModel.findById(id);
    if (!manifest) return null;

    const locationUpdate = {
      ...location,
      timestamp: new Date(),
    };

    manifest.locationHistory.push(locationUpdate);
    manifest.lastReportedLocation = locationUpdate;

    const savedManifest = await manifest.save();

    // Broadcast location update via WebSocket
    this.locationGateway.sendLocationUpdate(id, locationUpdate);

    // Also update the associated truck location
    if (manifest.truck) {
      const truckId = manifest.truck.toString();
      await this.trucksService.updateLocation(truckId, location);
      this.locationGateway.sendTruckLocationUpdate(truckId, locationUpdate);
    }

    return savedManifest;
  }

  async recordArrival(id: string): Promise<Manifest | null> {
    return this.manifestModel
      .findByIdAndUpdate(
        id,
        {
          arrivalTime: new Date(),
          status: 'completed',
        },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.manifestModel.findByIdAndUpdate(id, { isDeleted: true }).exec();
  }
}
