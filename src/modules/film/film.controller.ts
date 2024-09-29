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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilmService } from './film.service';
import { CreateFilmDTO } from '../../core/dto/create-film.dto';
import { UpdateFilmDTO } from '../../core/dto/update-film.dto';
import { DeleteFilmDTO } from '../../core/dto/delete-film.dto';
import { GetFilmDTO } from '../../core/dto/get-film.dto';
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
  constructor(private filmService: FilmService) {}

  @Get()
  @GetAllFilmsSwagger()
  async getAllFilms(): Promise<IFilm[]> {
    return this.filmService.findAll();
  }

  @Post()
  @Roles(RolesEnum.ADMIN)
  @CreateFilmSwagger()
  async createFilm(
    @Body()
    film: CreateFilmDTO,
  ): Promise<IFilm> {
    const isDuplicatedName = await this.filmService.validateDuplicatedName(
      film,
    );
    if (isDuplicatedName) {
      throw new BadRequestException(
        "There's already a film with that name. Copyright. Elegí otro",
      );
    }
    return this.filmService.create({ ...film, isCustomEpisode: true }); //All user created films have 'isCustomEpisode' as 'true' to differentiate from API ones
  }

  @Get(':id')
  @Roles(RolesEnum.REGULAR_USER)
  @GetFilmSwagger()
  async getFilm(
    @Param('id')
    { _id }: GetFilmDTO,
  ): Promise<IFilm> {
    return this.filmService.findById(_id);
  }

  @Put()
  @Roles(RolesEnum.ADMIN)
  @UpdateFilmSwagger()
  async updateFilm(
    @Body()
    film: UpdateFilmDTO,
  ): Promise<IFilm> {
    const isDuplicatedName = await this.filmService.validateDuplicatedName(
      film,
    );

    if (isDuplicatedName) {
      throw new BadRequestException(
        "There's already a film with that name. Copyright. Elegí otro",
      );
    }
    return this.filmService.updateById(film);
  }

  @Delete()
  @Roles(RolesEnum.ADMIN)
  @DeleteFilmSwagger()
  async deleteFilm(
    @Body()
    film: DeleteFilmDTO,
  ): Promise<IFilm> {
    return this.filmService.deleteById(film);
  }
}
