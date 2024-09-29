import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class GetFilmDTO {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  _id: Types.ObjectId;
}
