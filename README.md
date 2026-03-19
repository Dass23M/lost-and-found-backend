# Lost & Found — Backend API

A RESTful API built with Express.js and MongoDB for the Lost & Found community platform.

## Live API
```
https://lost-and-found-backend-production-0ce7.up.railway.app
```

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Express.js
- **Database** — MongoDB Atlas + Mongoose
- **Authentication** — JWT + bcryptjs
- **Image Upload** — Cloudinary + Multer
- **Email** — Nodemailer + Gmail SMTP
- **Hosting** — Railway

## Project Structure
```
lost-and-found-backend/
├── server.js
├── .env
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── Claim.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── item.routes.js
│   │   ├── claim.routes.js
│   │   └── user.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── item.controller.js
│   │   ├── claim.controller.js
│   │   └── user.controller.js
│   └── middleware/
│       ├── auth.middleware.js
│       └── error.middleware.js
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Gmail account

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/lost-and-found-backend.git
cd lost-and-found-backend
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file in the root directory
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lost-and-found
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

4. Generate JWT secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. Run in development
```bash
npm run dev
```

6. Run in production
```bash
npm start
```

The server runs on `http://localhost:5000`

## API Endpoints

### Auth

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Items

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/items` | Get all items (search + filter) | Public |
| GET | `/api/items/:id` | Get single item | Public |
| POST | `/api/items` | Create new item | Private |
| PATCH | `/api/items/:id` | Update item | Private (owner) |
| DELETE | `/api/items/:id` | Delete item | Private (owner) |
| PATCH | `/api/items/:id/resolve` | Mark item as resolved | Private (owner) |

### Claims

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/claims` | Submit a claim | Private |
| GET | `/api/claims/my-claims` | Get my claims | Private |
| GET | `/api/claims/item/:itemId` | Get claims on an item | Private (owner) |
| PATCH | `/api/claims/:id/approve` | Approve a claim | Private (owner) |
| PATCH | `/api/claims/:id/reject` | Reject a claim | Private (owner) |

### Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users/profile` | Get profile | Private |
| PATCH | `/api/users/profile` | Update profile | Private |
| GET | `/api/users/my-items` | Get my posted items | Private |
| GET | `/api/users/notifications` | Get notifications | Private |
| PATCH | `/api/users/notifications/read-all` | Mark all read | Private |
| PATCH | `/api/users/notifications/:id/read` | Mark one read | Private |
| GET | `/api/users/admin/users` | Get all users | Admin |
| GET | `/api/users/admin/items` | Get all items | Admin |
| DELETE | `/api/users/admin/items/:id` | Delete any item | Admin |
| DELETE | `/api/users/admin/users/:id` | Delete any user | Admin |

## Query Parameters for GET /api/items

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by title or description |
| `category` | string | Filter by category |
| `type` | string | Filter by lost or found |
| `status` | string | Filter by active or resolved |
| `location` | string | Filter by location |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLIENT_URL` | Frontend URL for CORS |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASS` | Gmail app password |

## Deployment

This API is deployed on Railway.

1. Push code to GitHub
2. Connect repository on Railway
3. Add all environment variables
4. Generate domain in Settings → Networking

## Database Collections

| Collection | Description |
|------------|-------------|
| `users` | User accounts with roles |
| `items` | Lost and found item posts |
| `claims` | Claims submitted on items |
| `notifications` | User notification messages |

## Author

Developed by [Your Name]

## License

MIT