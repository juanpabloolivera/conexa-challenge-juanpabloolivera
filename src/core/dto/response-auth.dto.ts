import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDTO {
  @ApiProperty()
  token: string;
}
