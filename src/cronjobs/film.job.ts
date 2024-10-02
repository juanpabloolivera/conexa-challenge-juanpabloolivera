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

  //Endpoint o cron que sincronice el listado de películas que devuelve la API de Stars Wars. Solo para "Administradores" en caso de ser un endpoint.
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
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

      for (const film of films) {
        const isFilm = await this.filmService.findOneOnEpisodeId(
          film.episode_id,
        );

        const result: IFilm = await this.filmService.updateOrInsert(
          { episode_id: film.episode_id },
          { ...film, isCustomEpisode: false },
        );

        if (!isFilm) {
          insertedCount++;
          this.logger.log(`Inserted new film: ${result.title}`);
        }
      }

      this.logger.log(`Film collection update completed.`);
      this.logger.log(`Inserted ${insertedCount} new films.`);
    } catch (error) {
      this.logger.error('Error updating film collection:', error);
    }
  }
  @Cron(CronExpression.EVERY_10_MINUTES) // Runs every 14 minutes
  async keepServerAlive() {
    this.logger.log('Call to keep server alive...');
    try {
      await firstValueFrom(
        this.httpService.get(
          'https://conexa-challenge-juanpabloolivera.onrender.com/film/',
          {
            headers: {
              Accept: '*/*',
              'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
              Authorization: `bearer ${process.env.ADMIN_USER_TOKEN}`,
            },
          },
        ),
      );
    } catch (error) {
      this.logger.error('Error fetching film data:', error);
    }
  }
}
