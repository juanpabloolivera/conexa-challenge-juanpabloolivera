import { ApiProperty } from '@nestjs/swagger';

export class FilmResponseDTO {
  @ApiProperty({ type: String })
  _id: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ type: Number })
  episode_id: number;

  @ApiProperty({ type: String })
  opening_crawl: string;

  @ApiProperty({ type: String })
  director: string;

  @ApiProperty({ type: String })
  producer: string;

  @ApiProperty({ type: Date })
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

  @ApiProperty({ type: Boolean })
  isCustomEpisode: boolean;

  @ApiProperty({ type: String })
  url: string;
}
