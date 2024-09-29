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
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  opening_crawl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  producer: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  release_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  species: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  starships: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  vehicles: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  characters: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  planets: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  @IsOptional()
  url?: string;
}
