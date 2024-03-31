# Backend Assessment
This repository contains the backend code for an assessment project. The project includes features such as user authentication (login, register, and logout), as well as authenticated API endpoints for fetching Ethereum balance and retrieving data from a public API with pagination and filtering capabilities.

## Features
### User Authentication:

- Register a new user
- Login an existing user
- Logout a logged-in user

### Ethereum Balance API:

- GET Ethereum balance for a user's address (authenticated)

### Data API:

- Fetch data from Public APIs API
- Pagination support
- Limit the number of items per page
- Filter data by category

## Endpoints
### Authentication
- POST /api/v1/register: Register a new user.
- POST /api/v1/login: Login an existing user.
- GET /api/v1/logout: Logout a logged-in user.
### Ethereum Balance
- GET /api/v1/balance/:address: Fetch Ethereum balance for a user's address.
### Data
- GET /api/v1/get-all: Fetch all data from the Public APIs API.
- Query Parameters:
- page: Page number for pagination (default is 1).
- limit: Maximum number of items per page (default is 10).
- category: Filter data by category.

## Authentication
User authentication is implemented using JWT (JSON Web Tokens). When a user registers or logs in, a JWT token is generated and stored in a secure HTTP-only cookie. This token is required to access authenticated endpoints.

## Error Handling
### The backend handles various error cases gracefully:

- Invalid email/password during login
- Missing email/password during login
- Invalid Ethereum address
- Page number exceeding total number of pages
- Invalid category filter
- Internal server errors

## Swagger Documentation
API documentation is available at /api-docs, powered by Swagger UI. This documentation provides detailed information about each endpoint, including request parameters, response formats, and error handling.

## Usage
- Clone the repository.
- Install dependencies using `npm install`.
- Create a config.env file inside the config folder with the following parameters:
``` PORT=4000
DB_URI=
JWT_SECRET=
JWT_EXPIRE=5d
COOKIE_EXPIRE=5d
INFURA_URL=https://mainnet.infura.io/v3/Project_Id
```
- Start the server using `npm start`.
- Access the Swagger documentation at http://localhost:4000/api-docs.
- Use API endpoints as documented.
