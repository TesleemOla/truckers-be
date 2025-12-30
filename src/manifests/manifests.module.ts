import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManifestsService } from './manifests.service';
import { ManifestsController } from './manifests.controller';
import { Manifest, ManifestSchema } from './schemas/manifest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manifest.name, schema: ManifestSchema }]),
  ],
  controllers: [ManifestsController],
  providers: [ManifestsService],
  exports: [ManifestsService],
})
export class ManifestsModule {}

