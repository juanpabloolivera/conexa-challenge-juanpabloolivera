# CONEXA - Star Wars - Juan Pablo Olivera

## Installation

Install the necessary dependencies:

```bash
$ npm install
```

## Environment Variables

Create a `.env` file in the root directory and define the following variables - values will be securely shared:

```plaintext
MONGODB_USER=<mongodb_user>

MONGODB_PASSWORD=<mongodb_password>

MONGODB_HOST=<mongodb_host>

DATABASE_URL=<database_url>

JWT_EXPIRE=<jwt_expire>

JWT_SECRET=<jwt_secret>
```

## MongoDB Connection URL

To connect to MongoDB (e.g., via Compass), use the following connection string:

```plaintext
mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/challenge-db?retryWrites=true&w=majority&appName=conexa-challenge&authSource=admin
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Testing

```bash
# unit tests
$ npm run test
```

## API Documentation

Access the API documentation via Swagger:

**Local Version**: http://localhost:3000/api

**Deployed Version**: https://conexa-challenge-juanpabloolivera.onrender.com/api

## Usage Example: Using cURL

To access protected routes (all except login/signup) include the `Authorization` header with your JWT token:

### Local

```bash
curl -X GET http://localhost:3000/film \
-H "Authorization: bearer <token>"
```

### Deployed

```bash
curl -X GET https://conexa-challenge-juanpabloolivera.onrender.com/film \
-H "Authorization: bearer <token>"
```

## Dependencies

- Nest.js
- Mongoose
- Jest
- Swagger

## Estructure

```bash
- src
  ├── app.module.ts # Main application module
  ├── main.ts # Entry point of the application
  ├── core # Core functionalities of the application
  │ ├── decorator # Custom decorators
  │ │ ├── roles.decorator.ts # Decorator for handling user roles
  │ │ └── swagger.decorator.ts # Decorator for Swagger documentation
  │ ├── dto # Data Transfer Objects
  │ │ ├── create-film.dto.ts # DTO for creating a film
  │ │ ├── delete-film.dto.ts # DTO for deleting a film
  │ │ ├── get-film.dto.ts # DTO for retrieving a film
  │ │ ├── login.dto.ts # DTO for user login
  │ │ ├── response-film.dto.ts # DTO for film response
  │ │ ├── signup.dto.ts # DTO for user signup
  │ │ └── update-film.dto.ts # DTO for updating a film
  │ ├── enum # Enums used in the application
  │ │ └── roles.enum.ts # Enum for user roles
  │ └── guard # Guards for route protection
  │ ├── allow-by-role.guard.ts # Guard for allowing access by user roles
  │ └── allow-by-role.guard.spec.ts # Tests for the allow-by-role guard
  ├── cronjobs # Scheduled tasks for the application
  │ └── film.job.ts # Job for handling film-related tasks
  ├── database # Database-related files
  │ ├── interface # Interfaces for type definitions
  │ │ ├── film.interface.ts # Interface for film data structure
  │ │ └── user.interface.ts # Interface for user data structure
  │ └── schemas # Database schemas
  │ ├── film.schema.ts # Schema for film collection
  │ └── user.schema.ts # Schema for user collection
  └── modules # Feature modules
  ├── auth # Authentication module
  │ ├── auth.controller.ts # Controller for authentication
  │ ├── auth.module.ts # Module definition for authentication
  │ ├── auth.service.ts # Service for authentication logic
  │ └── jwt.ts # JWT utility functions
  └── film # Film module
  ├── film.controller.ts # Controller for film operations
  ├── film.service.ts # Service for film-related business logic
  ├── film.controller.spec.ts # Tests for film controller
  ├── film.service.spec.ts # Tests for film service
  └── film.module.ts # Module definition for films
```

## Contact

Juan Pablo Olivera  
Email: [juanpablooliv94@gmail.com](mailto:juanpablooliv94@gmail.com)  
LinkedIn: [Juan Pablo Olivera](https://www.linkedin.com/in/juan-pablo-olivera/)
