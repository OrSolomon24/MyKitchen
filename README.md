# MyKitchen

## Overview

**MyKitchen** is a web application designed to manage recipes and food categories. It allows users to log in, view, add, edit, and delete recipes, and organize them under categories. The application is built with a client-server architecture, using React for the frontend and Node.js with Express for the backend.
Link To The Website - https://my-kitchen-two.vercel.app/
## Features

- User authentication (restricted access to recipe management)
- Add, edit, and delete food categories and recipes
- Search functionality to quickly find recipes
- Responsive design with a clean user interface

## Tech Stack

- **Frontend:** React, React Router, CSS
- **Backend:** Node.js, Express.js, MongoDB
- **Deployment:** Railway

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/OrSolomon24/MyKitchen.git


Navigate to the project directory:

bash
Copy code
cd MyKitchen
Install dependencies for the client:

bash
Copy code
cd client
npm install
Install dependencies for the server:

bash
Copy code
cd ../server
npm install
Create a .env file in the server directory and set the following variables:

makefile
Copy code
MONGODB_URI=<your-mongodb-uri>

Create a .env file in the client directory and set the following variables:
makefile
Copy code
REACT_APP_API_URL=http://localhost:5000
Run the client and server:

Start the backend:

bash
Copy code
cd server
npm start
Start the frontend:

bash
Copy code
cd client
npm start
Deployment
The app is deployed using Railway. The deployment settings include the configuration for the backend and frontend build processes.

Usage
Navigate to the homepage.


Log in with your credentials (the app is restricted to authorized users only).
Explore food categories, add new recipes, edit existing ones, or delete recipes as needed.
Future Enhancements
Improve UI/UX for mobile devices.
Implement advanced search and filtering.
Add support for user accounts and role-based permissions.

![תמונה של WhatsApp‏ 2024-08-26 בשעה 16 05 33_b9dddee0](https://github.com/user-attachments/assets/9faf1002-3c4e-4659-9537-ad8f19c15f28)

![תמונה של WhatsApp‏ 2024-08-26 בשעה 16 05 33_77a10919](https://github.com/user-attachments/assets/dbc3cfcb-e1b9-4696-b66f-00d2c5e495cf)

![תמונה של WhatsApp‏ 2024-08-26 בשעה 16 05 33_0bbdd685](https://github.com/user-attachments/assets/921d2817-15af-42d9-9aa0-29b76b5db1a9)

![תמונה של WhatsApp‏ 2024-08-26 בשעה 16 05 33_07053a3a](https://github.com/user-attachments/assets/aeb6055b-b799-4a6c-af3e-47d299723b4e)

