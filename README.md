# InnoView Tech

InnoView Tech is a full-stack web application designed to help users quickly search for medicines available in affiliated pharmacies. The platform provides real-time availability information, an interactive map to locate pharmacies, and simple tools for managing inventory.

It combines a modern, responsive frontend with a robust backend to ensure seamless user experience and reliable data handling.

 Key Features

User Authentication – secure login, registration, and logout functionality.

Real-time Medicine Search – query affiliated pharmacies for drug availability.

Interactive Map – powered by LeafletJS to visualize pharmacy locations near the user.

Inventory Management – backend controllers and routes to handle stock and medicine records.

Modern UI/UX – built with TailwindCSS for a responsive and clean interface.

Fast Development Workflow – Vite bundler provides hot reload and fast builds.

RESTful API – clean separation of frontend and backend logic.

# Tech Stack

Frontend:

HTML5

CSS3
 with TailwindCSS

JavaScript ES6+

LeafletJS
 for map rendering

Vite
 for frontend bundling and dev server

# Backend:

Node.js

Express.js
 for routing and middleware

Controllers and routes for auth, inventory, and medicines management

Middleware for authentication and structured responses

Build Tools & Config:

PostCSS

TailwindCSS custom configuration

.env for environment variables

# Project Structure
InnoView_Tech/
├── app/
│   ├── css/                 # Tailwind CSS build and styles
│   ├── js/                  # Frontend logic
│   │   ├── auth.js
│   │   ├── inventory.js
│   │   ├── router.js
│   │   ├── storage.js
│   │   └── map/
│   │       ├── api_map.js
│   │       ├── mapManager.js
│   │       ├── search.js
│   │       └── uiManager.js
│   └── view/                
│       ├── login.html
│       ├── register.html
│       ├── search.html
│       └── inventory.html
├── server/
│   ├── controllers/         
│   ├── routes/              
│   ├── middleware/          
│   ├── utils/               
│   ├── index.js             
│   └── connection_db.js     
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── .env

# Installation & Setup
Prerequisites

Node.js
 v16+

npm
 or yarn

Steps
# Clone repo
git clone https://github.com/your-username/InnoView_Tech.git
cd InnoView_Tech

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env   # (or create manually)

# Start development server
npm run dev

# Build for production
npm run build
npm run start

# Usage

Open the app at http://localhost:3000 (or configured port).

Register or log in.

Use the search form to find medicines available in affiliated pharmacies.

Explore results on the interactive map.

Manage inventory through admin tools.

# API Endpoints (Backend)
Method	Endpoint	Description
POST	/api/auth/login	User login
POST	/api/auth/register	User registration
GET	/api/inventory	Get inventory list
POST	/api/inventory	Add inventory item
GET	/api/medicines	Get available medicines
📸 Screenshots

(You can add UI screenshots here to showcase the app)

# Contributing

Contributions are welcome!

Fork this repo

Create a new branch (feature/your-feature)

Commit changes

Push and open a PR

# Authors & Contributors

Oscar Ochoa – Lead Developer

Team InnoView – Design & Backend integration

Community contributors – Improvements and fixes

If you contribute to this project, feel free to add your name here!

# Contact

Email: contact@innotech.com

GitHub: @your-username

# License

This project is licensed under the MIT License.
You are free to use, modify, and distribute it under the terms of the license.