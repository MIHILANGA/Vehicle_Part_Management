# Vehicle_Part_Management
Toyota Lanka Internship assignment

# Vehicle Parts Management System 🚗🔧

![React](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-16.x-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![License](https://img.shields.io/badge/License-MIT-brightgreen)

A full-stack inventory management system for automotive parts with real-time stock tracking and advanced filtering capabilities.

## ✨ Features

- **Complete CRUD operations** for parts management
- **Automated status tracking** (In Stock/Low Stock/Out of Stock)
- **Advanced filtering** by type, brand, status, and price range
- **Responsive design** works on all devices
- **Real-time updates** with automatic status calculation
- **Modern UI** with styled-components

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MySQL 8.0+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/vehicle-parts-management.git
cd vehicle-parts-management
```

2. Set up backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
```

3. Initialize database
```bash
mysql -u root -p < ../MySQL.sql
```

4. Set up frontend
```bash
cd ../frontend
npm install
```

### Running the Application

Start backend server:
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

Start frontend development server:
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## 🗃️ Database Schema

The system uses a MySQL database with the following structure:

```sql
CREATE TABLE parts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    partType VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/parts` | GET | Get all parts (supports filtering) |
| `/parts/:id` | GET | Get single part |
| `/parts` | POST | Create new part |
| `/parts/:id` | PUT | Update part |
| `/parts/:id` | DELETE | Delete part |

## 📂 Project Structure

```
vehicle-parts-management/
├── backend/               # Node.js/Express API
│   ├── config/           # Database configuration
│   ├── routes/           # API routes
│   └── server.js         # Server entry point
│
├── frontend/             # React application
│   ├── public/           # Static assets
│   ├── src/              # Application source
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── App.js        # Main application
│   │   └── index.js      # Entry point
│   └── package.json      # Frontend dependencies
│
├── MySQL.sql             # Database schema
└── README.md             # This file
```

## 🛠️ Built With

- **Frontend**: React, styled-components, React Router
- **Backend**: Node.js, Express, MySQL
- **Build Tools**: Vite, npm

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

(https://github.com/your-username/vehicle-parts-management)
