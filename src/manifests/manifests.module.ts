import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManifestsService } from './manifests.service';
import { ManifestsController } from './manifests.controller';
import { Manifest, ManifestSchema } from './schemas/manifest.schema';
import { TrucksModule } from '../trucks/trucks.module';

import { LocationGateway } from './manifests.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manifest.name, schema: ManifestSchema }]),
    TrucksModule,
  ],
  controllers: [ManifestsController],
  providers: [ManifestsService, LocationGateway],
  exports: [ManifestsService, LocationGateway],
})
export class ManifestsModule { }

