import { IsString, IsObject, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsString()
  address: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

export class CreateManifestDto {
  @IsString()
  manifestNumber: string;

  @IsString()
  truck: string;

  @IsString()
  driver: string;

  @ValidateNested()
  @Type(() => LocationDto)
  origin: LocationDto;

  @ValidateNested()
  @Type(() => LocationDto)
  destination: LocationDto;

  @IsOptional()
  @IsString()
  cargoDescription?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

