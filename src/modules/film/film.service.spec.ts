import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FilmService } from './film.service';
import { Film } from '../../database/schemas/film.schema';
import { IFilm } from '../../database/interface/film.interface';
import { CreateFilmDTO } from '../../core/dto/create-film.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateFilmDTO } from 'src/core/dto/update-film.dto';
import { DeleteFilmDTO } from 'src/core/dto/delete-film.dto';
import { GetFilmDTO } from 'src/core/dto/get-film.dto';

describe('FilmService', () => {
  let service: FilmService;
  let model: Model<Film>;

  const mockFilm: IFilm = {
    _id: new Types.ObjectId(),
    title: 'Harry Potter y los Jedi',
    director: 'Juan José Campanella',
    release_date: new Date('2024-01-01'),
    opening_crawl: 'wingardium leviosa',
    producer: 'Pepe Argento',
    species: [],
    starships: [],
    vehicles: [],
    characters: [],
    planets: [],
    url: 'http://example.com/mock-film',
  };

  const mockFilmModel = {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOneAndUpdate: jest.fn(),
    aggregate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmService,
        {
          provide: getModelToken(Film.name),
          useValue: mockFilmModel,
        },
      ],
    }).compile();

    service = module.get<FilmService>(FilmService);
    model = module.get<Model<Film>>(getModelToken(Film.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of films', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([mockFilm]);
      const result = await service.findAll();
      expect(result).toEqual([mockFilm]);
      expect(model.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new film', async () => {
      const createFilmDto: CreateFilmDTO & { isCustomEpisode: boolean } = {
        ...mockFilm,
        isCustomEpisode: true,
      };
      const mockCreatedFilm = {
        ...createFilmDto,
        _id: new Types.ObjectId(),
      };

      jest.spyOn(model, 'create').mockResolvedValue(mockCreatedFilm as any);
      const result = await service.create(createFilmDto);
      expect(result).toEqual(mockCreatedFilm);
      expect(model.create).toHaveBeenCalledWith(createFilmDto);
    });
  });

  describe('findById', () => {
    const getFilmDTO: GetFilmDTO = { _id: new Types.ObjectId(mockFilm._id) };

    it('should find and return a film by id', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockFilm);
      const result = await service.findById(getFilmDTO._id);
      expect(result).toEqual(mockFilm);
      expect(model.findById).toHaveBeenCalledWith(getFilmDTO._id);
    });

    it('should throw NotFoundException if film is not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);
      await expect(service.findById(getFilmDTO._id)).rejects.toThrow(
        NotFoundException,
      );
      expect(model.findById).toHaveBeenCalledWith(getFilmDTO._id);
    });
  });

  describe('updateById', () => {
    const updateFilmDTO: UpdateFilmDTO = {
      _id: mockFilm._id,
      title: 'Harry Potter y los Jedi: 2',
    };

    it('should update and return a film', async () => {
      const updatedFilm = { ...mockFilm, ...updateFilmDTO };

      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedFilm);
      const result = await service.updateById(updateFilmDTO);

      expect(result).toEqual(updatedFilm);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: updateFilmDTO._id },
        updateFilmDTO,
        { new: true, runValidators: true },
      );
    });

    it('should throw NotFoundException if film to update is not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(null);
      await expect(service.updateById(updateFilmDTO)).rejects.toThrow(
        NotFoundException,
      );

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: updateFilmDTO._id },
        updateFilmDTO,
        { new: true, runValidators: true },
      );
    });
  });

  describe('deleteById', () => {
    const deleteFilmDTO: DeleteFilmDTO = { _id: new Types.ObjectId() };

    it('should delete a film successfully', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockFilm as any);
      await service.deleteById(deleteFilmDTO);

      expect(model.findByIdAndDelete).toHaveBeenCalledWith(deleteFilmDTO._id);
    });

    it('should throw NotFoundException if film to delete is not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(null);
      await expect(service.deleteById(deleteFilmDTO)).rejects.toThrow(
        NotFoundException,
      );
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(deleteFilmDTO._id);
    });
  });

  describe('findOneOnEpisodeId - for cron job', () => {
    const query: { episode_id: number } = { episode_id: 1 };

    it('should find and return a film based on episode_id', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockFilm);
      const result = await service.findOneOnEpisodeId(query.episode_id);
      expect(result).toEqual(mockFilm);
      expect(model.findOne).toHaveBeenCalledWith(query);
    });

    it('should return null when no document found', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      const result = await service.findOneOnEpisodeId(query.episode_id);
      expect(result).toEqual(null);
      expect(model.findOne).toHaveBeenCalledWith(query);
    });
  });

  describe('updateOrInsert', () => {
    it('should find an existing film', async () => {
      const query = { title: 'Harry Potter y Obi Wan Kenobi' };
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(mockFilm as any);
      const result = await service.updateOrInsert(query, mockFilm);
      expect(result).toEqual(mockFilm);
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        query,
        { $set: mockFilm },
        { upsert: true, new: true, runValidators: true },
      );
    });

    it('should insert a new film if not found', async () => {
      const query = { title: 'Harry: soy tu padre' };
      const newFilm = { ...mockFilm, title: 'Harry: soy tu hijo' };
      jest.spyOn(model, 'findOneAndUpdate').mockResolvedValue(newFilm as any);
      const result = await service.updateOrInsert(query, newFilm);
      expect(result).toEqual(newFilm);
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        query,
        { $set: newFilm },
        { upsert: true, new: true, runValidators: true },
      );
    });
  });

  describe('validateDuplicatedName', () => {
    const updateFilmDTO: UpdateFilmDTO = {
      _id: mockFilm._id,
      title: mockFilm.title,
    };

    const createFilmDTO: CreateFilmDTO = {
      title: mockFilm.title,
      director: 'Another Director',
      release_date: new Date(),
      opening_crawl: 'Another crawl',
      producer: 'Another Producer',
      species: [],
      starships: [],
      vehicles: [],
      characters: [],
      planets: [],
      url: 'http://example.com/another-mock-film',
    };

    it('should return true if a duplicate title exists for UpdateFilmDTO', async () => {
      jest.spyOn(model, 'aggregate').mockResolvedValue([{ count: 1 }]);
      const result = await service.validateDuplicatedName(updateFilmDTO);
      expect(result).toBe(true);
      expect(model.aggregate).toHaveBeenCalledWith([
        {
          $match: {
            title: mockFilm.title,
            _id: { $ne: mockFilm._id },
          },
        },
      ]);
    });

    it('should return false if no duplicate title exists for CreateFilmDTO', async () => {
      jest.spyOn(model, 'aggregate').mockResolvedValue([]);
      const result = await service.validateDuplicatedName(createFilmDTO);
      expect(result).toBe(false);
      expect(model.aggregate).toHaveBeenCalledWith([
        { $match: { title: mockFilm.title } },
      ]);
    });
  });
});
