import {
  IsString,
  IsOptional,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsString()
  address: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}

export class UpdateManifestDto {
  @IsOptional()
  @IsString()
  manifestNumber?: string;

  @IsOptional()
  @IsString()
  truck?: string;

  @IsOptional()
  @IsString()
  driver?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  origin?: LocationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  destination?: LocationDto;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  cargoDescription?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
