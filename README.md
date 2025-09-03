# InnoView Tech

InnoView Tech is a **full-stack web application** that helps patients quickly check the real-time availability of medicines in pharmacies affiliated with their EPS.  

The platform solves a key problem: **patients often waste time searching across multiple pharmacies for their prescribed medicines**. With InnoView Tech, they can:
- Find where the medicine is available.  
- View the **address and location on a map**.  
- See the **real-time stock** in each pharmacy.  

At the same time, pharmacists can manage their inventory (add, edit, or delete medicines) through a dedicated interface.

---

##  Deploy

The application is deployed on **Render** and publicly available at:  
 https://innoview-tech-yzty.onrender.com  

---

##  End-to-End Demo Flow

1. **Patient Registration** → Create an account.  
2. **Login** → Authenticate with email and password.  
3. **Medicine Search** → Search for a medicine and see results on the interactive map.  
4. **Pharmacist Inventory** → Add, edit, or delete stock in authorized points.  

This flow demonstrates the **complete navigability of the app in the cloud (end-to-end)**.

---

##  Key Features

- **User Authentication** – Secure login, registration, and logout.  
- **Real-time Medicine Search** – Availability in pharmacies linked to each EPS.  
- **Interactive Map** – Powered by **LeafletJS** to locate nearby pharmacies.  
- **Inventory Management** – CRUD of medicines for pharmacists.  
- **Modern UI/UX** – Responsive design with **TailwindCSS**.  
- **RESTful API** – Clear separation of frontend and backend.  

---

##  Tech Stack

### Frontend
- **HTML5**, **CSS3 (TailwindCSS)**, **JavaScript ES6+**  
- **LeafletJS** for interactive maps  
- **Vite** as a bundler and multipage builder  

### Backend
- **Node.js**, **Express.js**  
- **MySQL (Clever Cloud)**  
- **JWT** and **bcryptjs** for authentication  

### Build Tools
- **PostCSS**, **TailwindCSS**  
- **dotenv** for environment variables  

---

##  Project Structure

InnoView_Tech/
├── app/
│ ├── css/
│ ├── js/
│ └── view/
│ ├── login.html
│ ├── register.html
│ ├── search.html
│ └── inventory.html
├── server/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ └── index.js
├── index.html
├── vite.config.js
├── package.json
└── .env

yaml
Copiar código

---

## Installation & Setup (Local)

### Prerequisites
- **Node.js v20+**
- **npm** or **yarn**
- **MySQL** database (Clever Cloud or local)

### Steps
bash
# Clone repo
git clone https://github.com/LDanielreyes/InnoView_Tech.git
cd InnoView_Tech

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run backend
npm run backend

# Run frontend (dev mode)
npm run frontend

# Build for production
npm run build
npm start
Open at: http://localhost:3000

# Environment Variables
Variable	Description	Example
DB_HOST	Database host	xxx.mysql.db.clever-cloud.com
DB_USER	Database username	abc123
DB_PASS	Database password	mypassword
DB_NAME	Database name	healthcare_system
JWT_SECRET	Secret key for JWT auth	myjwtsecret

# API Endpoints (Examples)
Method	Endpoint	Description
POST	/api/auth/login	User login
POST	/api/auth/register	User registration
GET	/api/inventory	Get inventory list
POST	/api/inventory	Add medicine to inventory
GET	/api/medicines	List available medicines

# Database Schema (Overview)
eps → Stores EPS records.

authorized_points → Linked to EPS, represents pharmacies.

users → Patients with credentials.

pharmacists → Pharmacists linked to authorized points.

medicines → Catalog of medicines.

inventories → Medicines + quantity per authorized point.

# Security Considerations
Patients’ passwords are hashed with bcryptjs.

JWT tokens used for secure authentication.

Pharmacist login simplified for MVP (can be extended with stricter auth).

# Known Limitations
The free Clever Cloud MySQL plan allows only 5 concurrent connections.

MVP version: Pharmacists can log in without strict password validation.

# Future Improvements / Roadmap
More robust role management (admin EPS, superadmin).

Real-time notifications for medicine availability.

Integration with external EPS APIs.

Optimized queries for faster medicine search.

# Testing
Tested with Postman for API endpoints.

Example cases:

Registration with duplicate email.

Login with invalid credentials.

Inventory CRUD operations.

Search returning empty results.

# Team Roles
Frontend – Tailwind, Vite, LeafletJS.

Backend – Express, MySQL, JWT.

DevOps – Deploy on Render + Clever Cloud DB.

PM – Project organization, user stories.



Search (map)

Inventory

# Authors
Oscar Leonardo Ochoa Perez – Backend Integration

Lucas Daniel Chacon – Backend Integration

Gabriel Payares – Frontend Development

Fabian Camilo Lougo – Backend Integration

Jaider Rodriguez – Frontend Development

# License

This project is licensed under the MIT License.
You are free to use, modify, and distribute it under the license terms.