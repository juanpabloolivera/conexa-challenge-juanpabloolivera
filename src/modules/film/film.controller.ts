import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilmService } from './film.service';
import { CreateFilmDTO } from '../../core/dto/create-film.dto';
import { UpdateFilmDTO } from '../../core/dto/update-film.dto';
import { DeleteFilmDTO } from '../../core/dto/delete-film.dto';
import { isMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { IFilm } from '../../database/interface/film.interface';
import { AllowByRoleGuard } from '../../core/guard/allow-by-role.guard';
import { Roles } from '../../core/decorator/roles.decorator';
import { RolesEnum } from '../../core/enum/roles.enum';
import {
  GetAllFilmsSwagger,
  CreateFilmSwagger,
  GetFilmSwagger,
  UpdateFilmSwagger,
  DeleteFilmSwagger,
} from '../../core/decorator/swagger.decorator';

@ApiTags('Film Endopoints')
@Controller('film')
@UseGuards(AuthGuard(), AllowByRoleGuard)
@ApiBearerAuth()
export class FilmController {
  private readonly logger = new Logger(FilmController.name);

  constructor(private filmService: FilmService) {}

  @Get()
  @GetAllFilmsSwagger()
  async getAllFilms(): Promise<IFilm[]> {
    try {
      this.logger.log('GET /film - Fetching all films');
      return await this.filmService.findAll();
    } catch (error) {
      this.logger.error(`Error in GET /film: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Post()
  @Roles(RolesEnum.ADMIN)
  @CreateFilmSwagger()
  async createFilm(@Body() film: CreateFilmDTO): Promise<IFilm> {
    try {
      this.logger.log('POST /film - Creating a new film');
      const isDuplicatedName = await this.filmService.validateDuplicatedName(
        film,
      );
      if (isDuplicatedName) {
        throw new BadRequestException(
          "There's already a film with that name. Copyright. Elegí otro",
        );
      }
      return await this.filmService.create(film);
    } catch (error) {
      this.logger.error(`Error in POST /film: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  @Roles(RolesEnum.REGULAR_USER)
  @GetFilmSwagger()
  async getFilm(@Param('id') id: string): Promise<IFilm> {
    try {
      this.logger.log(`GET /film/${id} - Fetching film details`);
      const isValidId = isMongoId(id);
      if (!isValidId) {
        throw new BadRequestException('Invalid id.');
      }
      return await this.filmService.findById(new Types.ObjectId(id));
    } catch (error) {
      this.logger.error(
        `Error in GET /film/${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Put()
  @Roles(RolesEnum.ADMIN)
  @UpdateFilmSwagger()
  async updateFilm(@Body() film: UpdateFilmDTO): Promise<IFilm> {
    try {
      this.logger.log('PUT /film - Updating film');
      const isDuplicatedName = await this.filmService.validateDuplicatedName(
        film,
      );
      if (isDuplicatedName) {
        throw new BadRequestException(
          "There's already a film with that name. Copyright. Elegí otro",
        );
      }
      return await this.filmService.updateById(film);
    } catch (error) {
      this.logger.error(`Error in PUT /film: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete()
  @Roles(RolesEnum.ADMIN)
  @DeleteFilmSwagger()
  async deleteFilm(@Body() film: DeleteFilmDTO): Promise<IFilm> {
    try {
      this.logger.log('DELETE /film - Deleting film');
      return await this.filmService.deleteById(film);
    } catch (error) {
      this.logger.error(`Error in DELETE /film: ${error.message}`, error.stack);
      throw error;
    }
  }
}
