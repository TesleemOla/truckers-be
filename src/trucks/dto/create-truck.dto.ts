import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class CreateTruckDto {
  @IsString()
  truckNumber: string;

  @IsString()
  licensePlate: string;

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

