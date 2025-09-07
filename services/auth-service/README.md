# Auth Service (Node.js + Express + MySQL)

A simple authentication and user management service with role-based access and audit logging.

-----

## 🛠️ Setup

1.  **Clone repo & install dependencies:**
    ```bash
    git clone https://github.com/rushitest4559/ERP_SYSTEM.git
    cd ERP_SYSTEM
    npm install
    ```
2.  **Create MySQL DB and tables:**
    The `src/scripts/authdb.sql` file contains the necessary commands to create the database and tables. Run the following command:
    ```bash
    mysql -u root -p < src/scripts/authdb.sql
    ```
3.  **Create the first admin user:**
    After setting up the database, you'll need an initial user with admin privileges. Run the `scripts/createAdmin.js` file to create the first admin user:
    ```bash
    node src/scripts/createAdmin.js
    ```
4.  **Configure `.env` file:**
    Create a `.env` file in the project root and add the following:
    ```ini
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=authdb
    JWT_SECRET=supersecret
    ```
5.  **Start server:**
    ```bash
    npm start
    ```

-----

## 🗄️ Database Schema

### `users`

  - `id` (INT, PK, AUTO\_INCREMENT)
  - `username` (VARCHAR, UNIQUE)
  - `password_hash` (TEXT)
  - `role` (ENUM: `'admin', 'user'`)
  - `created_at` (TIMESTAMP DEFAULT CURRENT\_TIMESTAMP)

### `audit_logs`

  - `id` (INT, PK, AUTO\_INCREMENT)
  - `user_id` (INT, FK → `users.id`)
  - `action` (VARCHAR)
  - `ip_address` (VARCHAR)
  - `created_at` (TIMESTAMP DEFAULT CURRENT\_TIMESTAMP)

-----

## 🔑 Auth Routes

### `POST /auth/login`

  - **Description:** Authenticates a user and returns a JWT token.
  - **Body:**
    ```json
    { 
      "username": "admin", 
      "password": "admin123" 
    }
    ```
  - **Response:** JWT token

### `POST /auth/logout`

  - **Description:** The logout functionality is handled by the frontend, which simply deletes the JWT token from the browser's storage.

-----

## 👤 User Routes (Protected)

### `PUT /user/profile`

  - **Description:** Updates the authenticated user's profile.
  - **Headers:** `Authorization: Bearer <token>`
  - **Body:**
    ```json
    { 
      "username": "newname" 
    }
    ```

### `PUT /user/change-password`

  - **Description:** Allows the authenticated user to change their password.
  - **Headers:** `Authorization: Bearer <token>`
  - **Body:**
    ```json
    { 
      "currentPassword": "oldpass", 
      "newPassword": "newpass" 
    }
    ```

-----

## 👑 Admin Routes (Admin Access Only)

### `POST /admin/create-user`

  - **Description:** Creates a new user with a specified role.
  - **Headers:** `Authorization: Bearer <admin-token>`
  - **Body:**
    ```json
    { 
      "username": "user1", 
      "password": "pass123", 
      "role": "user" 
    }
    ```

### `GET /admin/users`

  - **Description:** Retrieves a list of all users.
  - **Headers:** `Authorization: Bearer <admin-token>`

### `PUT /admin/update-user/:id`

  - **Description:** Updates a user's information by their ID.
  - **Headers:** `Authorization: Bearer <admin-token>`
  - **Body:**
    ```json
    { 
      "username": "newname", 
      "role": "admin" 
    }
    ```

### `DELETE /admin/delete-user/:id`

  - **Description:** Deletes a user by their ID.
  - **Headers:** `Authorization: Bearer <admin-token>`

-----

## 📝 Notes

  - **JWT tokens are stateless**, so there is no server-side "logout" mechanism.
  - Audit logs are automatically created to track user actions.
  - Only users with the **`admin` role** can access the admin routes.
  - The **`scripts` folder** contains essential setup files, including `authdb.sql` for database creation and `createAdmin.js` for creating the initial admin user.