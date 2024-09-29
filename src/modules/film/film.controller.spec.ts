import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';
import { CreateFilmDTO } from '../../core/dto/create-film.dto';
import { UpdateFilmDTO } from '../../core/dto/update-film.dto';
import { IFilm } from '../../database/interface/film.interface';
import { NotFoundException } from '@nestjs/common';
import { AllowByRoleGuard } from '../../core/guard/allow-by-role.guard';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { GetFilmDTO } from '../../core/dto/get-film.dto';
import { DeleteFilmDTO } from '../../core/dto/delete-film.dto';

describe('FilmController', () => {
  let controller: FilmController;
  let service: FilmService;

  const mockFilm: IFilm = {
    _id: new Types.ObjectId(),
    title: 'Ron Weasley y los Jedi',
    director: 'Moria Casan',
    release_date: new Date('2024-01-01'),
    opening_crawl: 'Voldemort',
    producer: 'Coqui Argento',
    species: [],
    starships: [],
    vehicles: [],
    characters: [],
    planets: [],
    url: 'http://test.com/harry-test',
  };

  const mockFilmService = {
    findAll: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
    validateDuplicatedName: jest.fn(),
  };

  const emptyLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmController],
      providers: [
        {
          provide: FilmService,
          useValue: mockFilmService,
        },
        {
          provide: Logger,
          useValue: emptyLogger,
        },
      ],
    })
      .overrideGuard(AuthGuard())
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(AllowByRoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<FilmController>(FilmController);
    service = module.get<FilmService>(FilmService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFilms', () => {
    it('should return an array of films', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockFilm]);
      const result = await controller.getAllFilms();
      expect(result).toEqual([mockFilm]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('createFilm', () => {
    it('should create and return a new film', async () => {
      const createFilmDTO: CreateFilmDTO = {
        title: 'Harry Potter y Arturito',
        director: 'Ricardo Fort',
        release_date: new Date('2024-01-01'),
        opening_crawl: 'expelliarmus',
        producer: 'Paola Argento',
        species: [],
        starships: [],
        vehicles: [],
        characters: [],
        planets: [],
        url: 'http://test.com/harry-potter',
      };

      const createdFilm: IFilm = {
        ...createFilmDTO,
        isCustomEpisode: true,
        _id: new Types.ObjectId(),
      };

      jest.spyOn(service, 'validateDuplicatedName').mockResolvedValue(false);
      jest.spyOn(service, 'create').mockResolvedValue(createdFilm);

      const result = await controller.createFilm(createFilmDTO);
      expect(result).toEqual(createdFilm);
      expect(service.create).toHaveBeenCalledWith(createFilmDTO);
    });
  });

  describe('getFilm', () => {
    const getFilmDTO: GetFilmDTO = { _id: mockFilm._id };

    it('should return a film by id', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockFilm);
      const result = await controller.getFilm(getFilmDTO);
      expect(result).toEqual(mockFilm);
      expect(service.findById).toHaveBeenCalledWith(getFilmDTO._id);
    });

    it('should throw NotFoundException if film is not found', async () => {
      const id = new Types.ObjectId();
      jest
        .spyOn(service, 'findById')
        .mockRejectedValue(
          new NotFoundException(`Film with ID "${id}" not found.`),
        );

      await expect(controller.getFilm(getFilmDTO)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateFilm', () => {
    const updateFilmDTO: UpdateFilmDTO = {
      _id: mockFilm._id,
      title: 'Updated Film',
    };
    it('should update and return the film', async () => {
      jest.spyOn(service, 'validateDuplicatedName').mockResolvedValue(false);
      jest.spyOn(service, 'updateById').mockResolvedValue({
        ...mockFilm,
        ...updateFilmDTO,
      });

      const result = await controller.updateFilm(updateFilmDTO);
      expect(result).toEqual({ ...mockFilm, ...updateFilmDTO });
      expect(service.updateById).toHaveBeenCalledWith(updateFilmDTO);
    });

    it('should throw NotFoundException if film to update is not found', async () => {
      jest.spyOn(service, 'validateDuplicatedName').mockResolvedValue(false);
      jest
        .spyOn(service, 'updateById')
        .mockRejectedValue(
          new NotFoundException(
            `Film with ID "${updateFilmDTO._id}" not found.`,
          ),
        );

      await expect(controller.updateFilm(updateFilmDTO)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteFilm', () => {
    const deleteFilmDTO: DeleteFilmDTO = { _id: new Types.ObjectId() };
    it('should delete the film and return a success message', async () => {
      jest.spyOn(service, 'deleteById').mockResolvedValue(undefined);

      const result = await controller.deleteFilm(deleteFilmDTO);

      expect(result).toEqual({ message: 'Film deleted successfully' });
      expect(service.deleteById).toHaveBeenCalledWith(deleteFilmDTO);
    });

    it('should throw NotFoundException if film to delete is not found', async () => {
      jest
        .spyOn(service, 'deleteById')
        .mockRejectedValue(
          new NotFoundException(
            `Film with ID "${deleteFilmDTO._id}" not found.`,
          ),
        );

      await expect(controller.deleteFilm(deleteFilmDTO)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
