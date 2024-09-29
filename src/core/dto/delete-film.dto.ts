import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class DeleteFilmDTO {
  @ApiProperty({ type: String })
  @IsMongoId()
  @IsNotEmpty()
  _id: Types.ObjectId;
}
