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
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { CreateManifestDto } from './dto/create-manifest.dto';
import { UpdateManifestDto } from './dto/update-manifest.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

interface RequestWithUser {
  user: {
    userId: string;
    role: string;
  };
}

@Controller('manifests')
@UseGuards(JwtAuthGuard)
export class ManifestsController {
  constructor(private readonly manifestsService: ManifestsService) {}

  @Post()
  create(@Body() createManifestDto: CreateManifestDto) {
    try{  
      return this.manifestsService.create(createManifestDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    try{
    if (req.user && req.user.role === 'driver') {
          return this.manifestsService.findByDriver(req.user.userId);
        }
        return this.manifestsService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    try{
      return this.manifestsService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateManifestDto: UpdateManifestDto,
  ) {
    try{
      return this.manifestsService.update(id, updateManifestDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id/departure')
  recordDeparture(@Param('id', ParseObjectIdPipe) id: string) {
    try{
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
    try{
      return this.manifestsService.updateLocation(id, updateLocationDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id/arrival')
  recordArrival(@Param('id', ParseObjectIdPipe) id: string) {
    try{
      return this.manifestsService.recordArrival(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    try{
      return this.manifestsService.delete(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
