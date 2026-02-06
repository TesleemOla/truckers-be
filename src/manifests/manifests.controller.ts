import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ManifestsService } from './manifests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { CreateManifestDto } from './dto/create-manifest.dto';
import { UpdateManifestDto } from './dto/update-manifest.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { TrucksService } from 'src/trucks/trucks.service';

interface RequestWithUser {
  user: {
    _id: string;
    role: string;
  };
}

@Controller('manifests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ManifestsController {
  constructor(
    private readonly manifestsService: ManifestsService,
    private readonly trucksService: TrucksService,
  ) { }

  @Post()
  @Roles('admin', 'dispatcher')
  create(@Body() createManifestDto: CreateManifestDto) {
    try {
      return this.manifestsService.create(createManifestDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    try {
      if (req.user && req.user.role === 'driver') {
        return this.manifestsService.findByDriver(req.user._id);
      }
      return this.manifestsService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      return this.manifestsService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @Roles('admin', 'dispatcher')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateManifestDto: UpdateManifestDto,
  ) {
    try {
      return this.manifestsService.update(id, updateManifestDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id/departure')
  @Roles('admin', 'dispatcher')
  async recordDeparture(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      await this.manifestsService.update(id, { status: 'in-transit' });
      const manifest = await this.manifestsService.findOne(id);
      if (manifest && manifest.truck) {
        await this.trucksService.update(manifest.truck._id.toString(), { status: 'in-transit' });
      }
      return this.manifestsService.recordDeparture(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id/location')
  updateLocation(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    try {
      return this.manifestsService.updateLocation(id, updateLocationDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id/arrival')
  @Roles('admin', 'dispatcher')
  async recordArrival(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      const manifest = await this.manifestsService.findOne(id);
      if (manifest) {
        this.trucksService.update(manifest.truck._id.toString(), { status: 'available' });
      }
      this.manifestsService.update(id, { status: 'completed' });
      return this.manifestsService.recordArrival(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @Roles('admin', 'dispatcher')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    try {
      return this.manifestsService.delete(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
