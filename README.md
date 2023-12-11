# ECOMM Project Readme

Welcome to the ECOMM project! This project is a backend implementation of an e-commerce store, providing various functionalities such as managing products, user authentication, shopping carts, reviews, and more. Below, you'll find information on the project structure, technologies used, and how to set up and run the application.

## Table of Contents

- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [File Upload](#file-upload)
- [Database Relationships](#database-relationships)

## Technologies

- JavaScript (ES6+)
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Bcrypt (Password hashing)
- Multer (File upload)

## Project Structure

The project structure is organized as follows:

- **config:** Contains configuration files for the application, such as database configuration and JWT secret.
- **controllers:** Handles the application's business logic, including user authentication, product management, and more.
- **middlewares:** Custom middleware functions, such as authentication middleware.
- **models:** Defines Mongoose models for the application's data entities.
- **routes:** Contains route definitions for various API endpoints.
- **uploads:** Directory for storing uploaded files.
- **utils:** Utility functions used throughout the application.
- **app.js:** Entry point for the application.

## Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/ecomm-backend.git
    ```

2. Install dependencies:

    ```bash
    cd ecomm-backend
    npm install
    ```

3. Set up your MongoDB database and update the database configuration in `config/db.js`.

4. Set the JWT secret key in `config/auth.js`.

5. Start the application:

    ```bash
    npm start
    ```

## Usage

Once the application is running, you can use a tool like [Postman](https://www.postman.com/) to interact with the API endpoints. Refer to the [API Endpoints](#api-endpoints) section for a list of available endpoints and their descriptions.

## API Endpoints

Here are some of the main API endpoints provided by the application:

- `/api/auth/register`: Register a new user.
- `/api/auth/login`: Log in and obtain a JWT token.
- `/api/auth/forgot-password`: Request a password reset email.
- `/api/products`: Retrieve a list of products or add a new product.
- `/api/carts`: Manage shopping carts, add/remove items.
- `/api/reviews`: Add and retrieve product reviews.

Refer to the code and documentation in the `routes` and `controllers` directories for a complete list of endpoints and their functionalities.

## Authentication

This application uses JWT for authentication. After successfully registering or logging in, you will receive a token. Include this token in the headers of your requests as `Authorization: Bearer <your_token>` to access protected endpoints.

## File Upload

The application supports file uploads, such as product images. Use the `/api/products/upload` endpoint for uploading files.

## Database Relationships

The application utilizes various database relationships, including:

- Many-to-One: Products have many reviews.
- One-to-One: Users have one shopping cart.
- Many-to-Many: Users can have many products in their shopping cart.

Check the Mongoose models in the `models` directory for detailed information on the data relationships.

Feel free to explore the code and customize it to fit your specific needs. Happy coding!
