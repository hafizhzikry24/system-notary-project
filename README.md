# System Project

A full-stack web application built with Laravel (Backend) and Next.js (Frontend).

## 🏗️ Project Structure

```
system-project/
├── backend/          # Laravel API Backend
├── frontend/         # Next.js Frontend
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- **PHP** >= 8.1
- **Composer**
- **Node.js** >= 18.0
- **npm** or **yarn**
- **MySQL** or **PostgreSQL**

### Backend Setup (Laravel)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Generate application key:
   ```bash
   php artisan key:generate
   ```

5. Configure your database in `.env` file

6. Run migrations:
   ```bash
   php artisan migrate
   ```

7. Start the development server:
   ```bash
   php artisan serve
   ```

The Laravel API will be available at `http://localhost:8000`

### Frontend Setup (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your environment variables in `.env.local`

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The Next.js frontend will be available at `http://localhost:3000`

## 📁 Directory Structure

### Backend (Laravel)
- `app/` - Application logic
- `config/` - Configuration files
- `database/` - Migrations and seeders
- `routes/` - API routes
- `storage/` - File storage
- `tests/` - Test files

### Frontend (Next.js)
- `src/` - Source code
- `public/` - Static assets
- `components/` - React components
- `pages/` - Next.js pages
- `styles/` - CSS/SCSS files

## 🔧 Development

### Running Both Services

You can run both services simultaneously:

**Terminal 1 (Backend):**
```bash
cd backend && php artisan serve
```

**Terminal 2 (Frontend):**
```bash
cd frontend && npm run dev
```

### Building for Production

**Backend:**
```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Frontend:**
```bash
cd frontend
npm run build
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
php artisan test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📦 Deployment

### Backend Deployment
1. Upload backend files to your server
2. Run `composer install --optimize-autoloader --no-dev`
3. Set up environment variables
4. Run migrations: `php artisan migrate`
5. Configure your web server to point to `public/` directory

### Frontend Deployment
1. Build the project: `npm run build`
2. Upload the `.next/` folder and other necessary files
3. Configure your hosting platform (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open-sourced software licensed under the [MIT license](LICENSE).

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub. 