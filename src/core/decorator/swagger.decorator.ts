import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { FilmResponseDTO } from '../dto/response-film.dto';

export function GetAllFilmsSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOkResponse({
      description: 'Success - get all films',
      isArray: true,
      type: FilmResponseDTO,
    }),
  );
}

export function CreateFilmSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOkResponse({
      description: 'Success - create one film',
      type: FilmResponseDTO,
    }),
    ApiResponse({
      status: 403,
      description:
        'Forbidden: Only users with role ADMIN can access this route.',
    }),
  );
}

export function GetFilmSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOkResponse({
      description: 'Success - get one film',
      type: FilmResponseDTO,
    }),
    ApiResponse({
      status: 403,
      description:
        'Forbidden: Only users with role REGULAR_USER can access this route.',
    }),
    ApiNotFoundResponse({
      description: 'Film with ID <id> not found.',
      status: 404,
    }),
  );
}

export function UpdateFilmSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOkResponse({
      description: 'Success - edit one film',
      type: FilmResponseDTO,
    }),
    ApiResponse({
      status: 403,
      description:
        'Forbidden: Only users with role ADMIN can access this route.',
    }),
    ApiNotFoundResponse({
      description: 'Film with ID <id> not found.',
      status: 404,
    }),
  );
}

export function DeleteFilmSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOkResponse({
      description: 'Success - delete one film',
      type: FilmResponseDTO,
    }),
    ApiResponse({
      status: 403,
      description:
        'Forbidden: Only users with role ADMIN can access this route.',
    }),
    ApiNotFoundResponse({
      description: 'Film with ID <id> not found.',
      status: 404,
    }),
  );
}
