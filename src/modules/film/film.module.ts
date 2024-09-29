import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';
import { FilmSchema } from '../../database/schemas/film.schema';
import { FilmJob } from '../../cronjobs/film.job';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Film', schema: FilmSchema }]),
    HttpModule,
  ],
  controllers: [FilmController],
  providers: [FilmService, FilmJob],
})
export class FilmModule {}
