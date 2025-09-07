# Auth Service (Node.js + Express + MySQL)

A simple authentication and user management service with role-based access and audit logging.

---

## 🛠 Setup

1. Clone repo & install dependencies:
   ```bash
   npm install
Create MySQL DB and tables:

bash
Copy code
mysql -u root -p < authdb.sql
Configure .env file in project root:

ini
Copy code
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=authdb
JWT_SECRET=supersecret
Start server:

bash
Copy code
npm start
🗄 Database Schema
users

id (INT, PK, AUTO_INCREMENT)

username (VARCHAR, UNIQUE)

password_hash (TEXT)

role (ENUM: 'admin','user')

created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

audit_logs

id (INT, PK, AUTO_INCREMENT)

user_id (INT, FK → users.id)

action (VARCHAR)

ip_address (VARCHAR)

created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

🔑 Auth Routes
Login
POST /auth/login
Body:

json
Copy code
{ "username": "admin", "password": "admin123" }
Response: JWT token

Logout
POST /auth/logout
(optional, frontend usually handles by deleting token)

👤 User Routes
Update Profile
PUT /user/profile
Headers:
Authorization: Bearer <token>
Body:

json
Copy code
{ "username": "newname" }
Change Password
PUT /user/change-password
Headers:
Authorization: Bearer <token>
Body:

json
Copy code
{ "currentPassword": "oldpass", "newPassword": "newpass" }
👑 Admin Routes
Create User
POST /admin/create-user
Headers:
Authorization: Bearer <admin-token>
Body:

json
Copy code
{ "username": "user1", "password": "pass123", "role": "user" }
List Users
GET /admin/users
Headers:
Authorization: Bearer <admin-token>

Update User
PUT /admin/update-user/:id
Headers:
Authorization: Bearer <admin-token>
Body:

json
Copy code
{ "username": "newname", "role": "admin" }
Delete User
DELETE /admin/delete-user/:id
Headers:
Authorization: Bearer <admin-token>

📝 Notes
JWT tokens are stateless. Logout = frontend deletes token.

Audit logs automatically track user actions.

Only admin role can manage users.

