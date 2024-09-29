import { Test, TestingModule } from '@nestjs/testing';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';
import { CreateFilmDTO } from '../../core/dto/create-film.dto';
import { UpdateFilmDTO } from '../../core/dto/update-film.dto';
import { IFilm } from '../../database/interface/film.interface';
import { NotFoundException } from '@nestjs/common';
import { AllowByRoleGuard } from '../../core/guard/allow-by-role.guard';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmController],
      providers: [
        {
          provide: FilmService,
          useValue: mockFilmService,
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
    it('should return a film by id', async () => {
      const id = mockFilm._id;
      jest.spyOn(service, 'findById').mockResolvedValue(mockFilm);
      const result = await controller.getFilm(id.toString());
      expect(result).toEqual(mockFilm);
      expect(service.findById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if film is not found', async () => {
      const id = new Types.ObjectId();
      jest
        .spyOn(service, 'findById')
        .mockRejectedValue(
          new NotFoundException(`Film with ID "${id}" not found.`),
        );
      await expect(controller.getFilm(id.toString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateFilm', () => {
    it('should update and return the film', async () => {
      const id = new Types.ObjectId(mockFilm._id);
      const updateFilmDto: UpdateFilmDTO = { _id: id, title: 'Updated Film' };

      jest.spyOn(service, 'validateDuplicatedName').mockResolvedValue(false);
      jest.spyOn(service, 'updateById').mockResolvedValue({
        ...mockFilm,
        ...updateFilmDto,
      });
      const result = await controller.updateFilm(updateFilmDto);
      expect(result).toEqual({ ...mockFilm, ...updateFilmDto });
      expect(service.updateById).toHaveBeenCalledWith(updateFilmDto);
    });

    it('should throw NotFoundException if film to update is not found', async () => {
      const id = new Types.ObjectId();
      const updateFilmDto: UpdateFilmDTO = { _id: id, title: 'Updated Film' };

      jest.spyOn(service, 'validateDuplicatedName').mockResolvedValue(false);
      jest
        .spyOn(service, 'updateById')
        .mockRejectedValue(
          new NotFoundException(`Film with ID "${id}" not found.`),
        );
      await expect(controller.updateFilm(updateFilmDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteFilm', () => {
    it('should delete the film', async () => {
      const deleteFilmDTO = { _id: new Types.ObjectId() };
      jest.spyOn(service, 'deleteById').mockResolvedValue(mockFilm);
      const result = await controller.deleteFilm(deleteFilmDTO);
      expect(result).toEqual(mockFilm);
      expect(service.deleteById).toHaveBeenCalledWith(deleteFilmDTO);
    });

    it('should throw NotFoundException if film to delete is not found', async () => {
      const deleteFilmDTO = { _id: new Types.ObjectId() };
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
