# CSV to JSON Conversion API 

## Introduction
This project provides a CSV to JSON conversion API using Node.js and Express. It reads CSV data, transforms it into JSON format, and then inserts the data into a PostgreSQL database. The API also calculates and displays the age distribution of the data.

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js
- npm (Node Package Manager)
- PostgreSQL

## Installation

Follow these steps to set up the project locally:

### Clone the repository

git clone [https://github.com/your-username/your-repository.git](https://github.com/BhavarSingh/Test-Kelp.git)
cd your-repository

### Install dependencies

npm install

### Set up environment variables

Create a .env file in the root of your project and update the following settings according to your database configuration:

DB_USER=your_database_user
DB_HOST=your_database_host
DB_DATABASE=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=your_database_port
CSV_FILE_PATH=path_to_your_csv_file

### Usage 

To start the server, run:

npm start

This will launch the server on http://localhost:3000. To convert CSV data and insert it into the database, navigate to:

http://localhost:3000/convert-csv


### Screenshot of testing using postman:


![image](https://github.com/user-attachments/assets/a073b153-9647-4c63-ac93-ebfd70947f65)

Age distribution: 
![image](https://github.com/user-attachments/assets/e4bb557e-9629-43ea-80df-43178fd8c563)
