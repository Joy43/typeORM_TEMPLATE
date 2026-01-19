# Authentication Setup with TypeORM

This project now uses TypeORM for authentication instead of Prisma. Here's what has been set up:

## Files Created/Modified

### Entities

- `src/entities/user.entity.ts` - User entity with TypeORM decorators

### Auth Module

- `src/auth/auth.module.ts` - Auth module configuration
- `src/auth/auth.service.ts` - Authentication service with register/login
- `src/auth/auth.controller.ts` - Auth endpoints

### Updated Files

- `src/common/jwt/jwt.gurd.ts` - Fixed to use TypeORM Repository instead of Prisma
- `src/common/jwt/jwt.strategy.ts` - Added missing ENVEnum import
- `src/common/jwt/jwt.interface.ts` - Fixed roles type to be array
- `src/app.module.ts` - Simplified to import AuthModule

## Environment Variables

Make sure you have these in your `.env` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1d

# Server
PORT=3000
```

## API Endpoints

### Register a new user

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "roles": ["USER"]
  }
}
```

### Get Profile (Protected)

```bash
GET /auth/profile
Authorization: Bearer <your-token>
```

### Admin Endpoint (Role Protected)

```bash
GET /auth/admin
Authorization: Bearer <your-token>
# Only accessible by ADMIN or SUPER_ADMIN roles
```

## Using Guards in Your Controllers

### Protect a route with JWT authentication

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt/jwt.gurd';

@Get('protected')
@UseGuards(JwtAuthGuard)
getProtectedData() {
  return { message: 'This is protected' };
}
```

### Protect with role-based access

```typescript
import { ValidateAuth } from '../common/jwt/jwt.decorator';
import { UserEnum } from '../common/enum/user.enum';

@Get('admin-only')
@ValidateAuth(UserEnum.ADMIN, UserEnum.SUPER_ADMIN)
getAdminData() {
  return { message: 'Admin only' };
}
```

### Get current user

```typescript
import { GetUser } from '../common/jwt/jwt.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt/jwt.gurd';

@Get('me')
@UseGuards(JwtAuthGuard)
getCurrentUser(@GetUser() user: any) {
  return user;
}
```

## User Roles

Available roles (defined in `src/common/enum/user.enum.ts`):

- `USER` - Default role
- `ADMIN` - Administrator
- `SUPER_ADMIN` - Super administrator
- `MEMBER` - Member
- `CONTRIBUTOR` - Contributor

## Database Schema

The User entity includes:

- `id` - UUID primary key
- `email` - Unique email
- `password` - Hashed password
- `roles` - Array of user roles
- `isActive` - Boolean flag
- `isDeleted` - Soft delete flag
- `firstName` - Optional
- `lastName` - Optional
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

## Next Steps

1. Run migrations to create the users table
2. Test the authentication endpoints
3. Add more features like:
   - Password reset
   - Email verification
   - Refresh tokens
   - OAuth integration
