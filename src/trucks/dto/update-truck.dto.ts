import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateTruckDto {
  @IsOptional()
  @IsString()
  truckNumber?: string;

  @IsOptional()
  @IsString()
  licensePlate?: string;

  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsString()
  assignedDriver?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

