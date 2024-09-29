import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FilmService } from '../modules/film/film.service';
import { IFilm } from '../database/interface/film.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FilmJob {
  private readonly logger = new Logger(FilmJob.name);

  constructor(
    private readonly filmService: FilmService,
    private readonly httpService: HttpService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async updateFilmCollection() {
    this.logger.log('Initializing film collection update cron job...');
    try {
      this.logger.log('Fetching films from API...');
      const response = await firstValueFrom(
        this.httpService.get('https://swapi.dev/api/films'),
      );

      const films: IFilm[] = response.data.results;
      this.logger.log(`Fetched ${films.length} films from API.`);

      let insertedCount = 0;
      let updatedCount = 0;

      for (const film of films) {
        const beforeOperation = await this.filmService.findOneOnEpisodeId(
          film.episode_id,
        );

        const result: IFilm = await this.filmService.findOrInsert(
          { episode_id: film.episode_id },
          { ...film, isCustomEpisode: false },
        );

        if (beforeOperation) {
          updatedCount++;
          this.logger.log(`Updated film: ${result.title}`);
        } else {
          insertedCount++;
          this.logger.log(`Inserted new film: ${result.title}`);
        }
      }

      this.logger.log(`Film collection update completed.`);
      this.logger.log(`Inserted ${insertedCount} new films.`);
      this.logger.log(`Updated ${updatedCount} existing films.`);
    } catch (error) {
      this.logger.error('Error updating film collection:', error);
    }
  }
}
