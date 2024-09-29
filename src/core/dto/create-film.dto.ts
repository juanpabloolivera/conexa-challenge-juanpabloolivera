import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsDateString,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFilmDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  opening_crawl: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  producer: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDateString()
  release_date: Date;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  species: string[];

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  starships: string[];

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  vehicles: string[];

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  characters: string[];

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  planets: string[];

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsUrl()
  @IsOptional()
  url?: string;
}
