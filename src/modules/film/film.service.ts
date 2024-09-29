import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Film } from '../../database/schemas/film.schema';
import { IFilm } from '../../database/interface/film.interface';
import { CreateFilmDTO } from '../../core/dto/create-film.dto';
import { DeleteFilmDTO } from '../../core/dto/delete-film.dto';
import { UpdateFilmDTO } from '../../core/dto/update-film.dto';

@Injectable()
export class FilmService {
  constructor(
    @InjectModel(Film.name)
    private filmModel: Model<Film>,
  ) {}

  async findAll(): Promise<IFilm[]> {
    return this.filmModel.find();
  }

  async create(film: CreateFilmDTO): Promise<IFilm> {
    return this.filmModel.create({ ...film, isCustomEpisode: true }); //All user created films have 'isCustomEpisode' as 'true' to differentiate from API ones
  }

  async findById(id: Types.ObjectId): Promise<IFilm> {
    const film = await this.filmModel.findById(id);

    if (!film) {
      throw new NotFoundException(`Film with ID "${id}" not found.`);
    }

    return film;
  }
  async findOneOnEpisodeId(episode_id: number): Promise<IFilm> {
    const film = await this.filmModel.findOne({ episode_id });
    return film;
  }

  async updateById(film: UpdateFilmDTO): Promise<IFilm> {
    const updatedFilm = await this.filmModel.findByIdAndUpdate(
      { _id: film._id },
      film,
      { new: true, runValidators: true },
    );

    if (!updatedFilm) {
      throw new NotFoundException(`Film with ID "${film._id}" not found.`);
    }

    return updatedFilm;
  }

  async deleteById(film: DeleteFilmDTO): Promise<void> {
    const deletedFilm = await this.filmModel.findByIdAndDelete(film._id);

    if (!deletedFilm) {
      throw new NotFoundException(`Film with ID "${film._id}" not found.`);
    }
  }
  async validateDuplicatedName(
    query: UpdateFilmDTO | CreateFilmDTO,
  ): Promise<boolean> {
    const matchCondition: {
      $match: {
        title: string;
        _id?: { $ne: Types.ObjectId };
      };
    } =
      '_id' in query
        ? // Is 'UpdateFilmDTO' -> searches for duplicate (except self)
          {
            $match: {
              title: query.title,
              _id: { $ne: query._id },
            },
          }
        : //Is 'CreateFilmDTO' -> searches duplicate
          {
            $match: {
              title: query.title,
            },
          };

    const isDuplicated = await this.filmModel.aggregate([matchCondition]);

    return isDuplicated.length > 0;
  }

  async updateOrInsert(query: Partial<IFilm>, filmData: IFilm): Promise<IFilm> {
    return this.filmModel.findOneAndUpdate(
      query,
      { $set: filmData },
      { upsert: true, new: true, runValidators: true },
    );
  }
}
