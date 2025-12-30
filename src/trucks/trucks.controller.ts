import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { TrucksService } from './trucks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('trucks')
@UseGuards(JwtAuthGuard)
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @Post()
  create(@Body() createTruckDto: CreateTruckDto) {
    try{
    return this.trucksService.create(createTruckDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll() {
    try{
    return this.trucksService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    try{
      return this.trucksService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateTruckDto: UpdateTruckDto,
  ) {
    try{
      return this.trucksService.update(id, updateTruckDto);
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
      return this.trucksService.updateLocation(id, updateLocationDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    try{
      return this.trucksService.delete(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
