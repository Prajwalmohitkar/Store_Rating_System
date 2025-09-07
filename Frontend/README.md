Store Rating Platform
This is a full-stack web application that allows users to submit ratings for stores. It includes three distinct user roles: System Administrator, Store Owner, and Normal User, each with different functionalities.

Tech Stack
Backend: Node.js with Express.js

Database: MySQL

Frontend: React.js

Getting Started
Follow these instructions to set up and run the project on your local machine.

Prerequisites
Node.js (v14.x or higher)

MySQL (v8.0 or higher)

A code editor like VS Code

A terminal or command prompt

Step 1: Database Setup
Open your MySQL client (e.g., MySQL Workbench, DBeaver) and create a new database.

Open the database.sql file located in the store-rating-backend folder.

Copy and paste the entire content of database.sql into your MySQL client and execute the queries. This will create all the necessary tables and populate them with initial user data.

Step 2: Backend Setup
Navigate to the store-rating-backend folder in your terminal.

Install the backend dependencies:

npm install

Create a file named .env in the store-rating-backend folder. Copy the contents from env.example into it and fill in your MySQL credentials and a secure JWT secret.

# .env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_DATABASE=store_rating_platform
JWT_SECRET=your_secret_key

Start the backend server:

npm start

The server should start on http://localhost:5000. You can test it by visiting this URL in your browser.

Step 3: Frontend Setup
Navigate to the Frontend folder in a new terminal window.

Install the frontend dependencies:

npm install

Start the frontend development server:

npm run dev

The application will open in your browser, typically at http://localhost:5173.

Default Login Credentials
You can use the following pre-configured credentials to test the application for each user role. These are defined in the database.sql file.

System Administrator

Email: admin@example.com

Password: MyNewPass@123

Store Owner

Email: owner@example.com

Password:MyNewPass@123

Normal User

Email: user@example.com

Password: MyNewPass@1234