import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  collection: 'Film',
  versionKey: false,
})
export class Film {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: false, type: Number })
  episode_id: number;

  @Prop({ required: true, type: String })
  opening_crawl: string;

  @Prop({ required: true, type: String })
  director: string;

  @Prop({ required: true, type: String })
  producer: string;

  @Prop({ required: true, type: Date })
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

  @Prop({ required: true, type: String })
  url: string;

  @Prop({ required: true, type: Boolean })
  isCustomEpisode: boolean;
}

export const FilmSchema = SchemaFactory.createForClass(Film);
