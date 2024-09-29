import { ApiProperty } from '@nestjs/swagger';

export class FilmResponseDTO {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  episode_id: number;

  @ApiProperty()
  opening_crawl: string;

  @ApiProperty()
  director: string;

  @ApiProperty()
  producer: string;

  @ApiProperty()
  release_date: Date;

  @ApiProperty({ type: [String] })
  species: string[];

  @ApiProperty({ type: [String] })
  starships: string[];

  @ApiProperty({ type: [String] })
  vehicles: string[];

  @ApiProperty({ type: [String] })
  characters: string[];

  @ApiProperty({ type: [String] })
  planets: string[];

  @ApiProperty()
  isCustomEpisode: boolean;

  @ApiProperty()
  url: string;
}
