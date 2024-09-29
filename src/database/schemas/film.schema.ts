import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  collection: 'Film',
  versionKey: false,
})
export class Film {
  @Prop()
  title: string;

  @Prop()
  episode_id: number;

  @Prop()
  opening_crawl: string;

  @Prop()
  director: string;

  @Prop()
  producer: string;

  @Prop()
  release_date: Date;

  @Prop([String])
  species: string[];

  @Prop([String])
  starships: string[];

  @Prop([String])
  vehicles: string[];

  @Prop([String])
  characters: string[];

  @Prop([String])
  planets: string[];

  @Prop()
  url: string;

  @Prop()
  isCustomEpisode: boolean;
}

export const FilmSchema = SchemaFactory.createForClass(Film);
