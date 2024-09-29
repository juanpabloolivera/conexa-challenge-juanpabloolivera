import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsDateString,
  IsUrl,
  IsMongoId,
  IsOptional,
  IsISO8601,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';

export class UpdateFilmDTO {
  @ApiProperty({ required: true, type: String })
  @IsMongoId()
  @IsNotEmpty()
  _id: Types.ObjectId;

  @ApiProperty({ required: false, type: String })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  opening_crawl?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  director?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  producer?: string;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  @Transform(({ value }) => {
    const isValidDate = IsISO8601(value);
    if (!isValidDate) {
      throw new Error(
        `Property "release_date" should be a valid ISO8601 date string`,
      );
    }
    return new Date(value);
  })
  release_date?: Date;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  species?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  starships?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  vehicles?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  characters?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  planets?: string[];

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  url?: string;
}
