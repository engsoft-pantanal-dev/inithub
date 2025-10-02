import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInitiativeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  theme: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  context: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deliverable: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  evaluationCriteria: string;
}