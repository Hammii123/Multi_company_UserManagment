Multi-Tenant User Management API
A RESTful backend built with Node.js, Express, MongoDB, and Mongoose
for managing users across multiple companies. Each company has its own
users, and authenticated requests are restricted to the user's company.
Features
- Company registration with an initial Admin account
- Login using company email, user email, and password
- JWT-based authentication
- Role-based access control (RBAC): Admin, Manager, and Employee
- Company-level tenant isolation
- Create, read, update, and soft-delete users
- User listing with pagination, search, and role filtering
- Request validation with express-validator
- Password hashing with bcrypt
- Security headers with helmet
- Centralized error handling
Tech Stack
- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens (jsonwebtoken)
- bcrypt
- express-validator
- helmet
- express-rate-limit
- dotenv
Prerequisites
Install the following before running the project:
- Node.js and npm
- MongoDB Community Server, running locally or on a hosted MongoDB
  service
- Postman or another API client (for testing)
Installation
1. Clone the repository or open the project folder.
2. Install dependencies:
   npm install
3. Create a .env file in the project root:
   PORT=3000
   JWT_SECRET=replace_this_with_a_long_random_secret
   MONGODB_URI=mongodb://127.0.0.1:27017/multi_tenant_db
   Replace the JWT secret with a strong, private value. Do not commit
   .env to Git.
4. Start the development server:
   npm run dev
   If your project does not define a dev script, start it with:
   node src/server.js
When the server starts successfully, it should report that MongoDB
connected and the server is listening on port 3000.
Base URL
http://localhost:3000
Health check:
GET /
Expected response:
{
  "message": "Multi-Tenant User Management API is running"
}
Authentication and Authorization
Most user endpoints require a valid JWT access token.

In Postman, select Authorization → Bearer Token and paste the token
returned by login. Alternatively, send this header:
Authorization: Bearer YOUR_JWT_TOKEN
The login token is configured to expire after one hour. Log in again to
obtain a new token when it expires.
Roles
  Role                                Permissions
  Admin                             Create users, list users, update
                                      users, and soft-delete users

  Manager                           List users

  Employee                          No access to the user-management
                                      routes unless explicitly allowed by
                                  the application
The current routes also include an Admin-only test endpoint.
API Endpoints
1. Register a company and its first Admin
POST /api/companies/register
Content-Type: application/json
Request body:
{
  "companyName": "Test Company",
  "companyEmail": "testcompany2026@example.com",
  "adminName": "Ali",
  "adminEmail": "ali@testcompany.example",
  "password": "TestAdmin2026!"
}
This registers a company and creates its initial Admin account. Use
unique company and email addresses when registering new records.
2. Log in
POST /api/auth/login
Content-Type: application/json
Request body:
{
  "companyEmail": "testcompany2026@example.com",
  "email": "ali@testcompany.example",
  "password": "TestAdmin2026!"
}
Use the exact password supplied during registration. The successful
response should include an access token; copy it into the Bearer Token
authorization setting for protected requests.
3. Check the authenticated user
GET /api/users/me
Authorization: Bearer YOUR_JWT_TOKEN
Returns information from the authenticated token, including the user ID,
company ID, and role.
4. Admin-only test endpoint
GET /api/users/admin-test
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
Checks that the request is authenticated as an Admin.
5. Create a user
POST /api/users
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
Content-Type: application/json
Request body:
{
  "name": "Ayesha Khan",
  "email": "ayesha@bluesky.example",
  "password": "AyeshaSecure2026!",
  "role": "Employee"
}
The new user is assigned to the company associated with the
authenticated Admin's token. The password should be hashed before
storage and should not be returned in API responses.

Allowed roles: Admin, Manager, Employee.
6. List users
GET /api/users
Authorization: Bearer YOUR_TOKEN
Supported query parameters:
  Parameter               Example                 Purpose
  page                  page=2                Selects the page
                                                  (starts at 1)

  limit                 limit=10              Number of users per
                                                  page (maximum 100)

  search                search=ayesha         Searches user names and
                                                  emails

  role                  role=Employee         Filters by Admin,
                                                  Manager, or
                                              Employee
Examples:
GET /api/users?page=1&limit=10
GET /api/users?page=2&limit=5
GET /api/users?search=ayesha
GET /api/users?role=Manager
GET /api/users?page=1&limit=10&search=ali&role=Employee
The response includes pagination metadata such as currentPage,
limit, totalUsers, and totalPages. Only active users belonging to
the authenticated user's company should be returned.
7. Update a user
PUT /api/users/USER_ID
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
Content-Type: application/json
Example request body:
{
  "name": "Ayesha Khan",
  "role": "Manager"
}
Replace USER_ID with the target user's MongoDB ObjectId. Send the
fields supported by your update controller.
8. Soft-delete a user
DELETE /api/users/USER_ID
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
This marks the user as deleted rather than physically removing the
document. Deleted users are excluded from the normal user list.
Validation
The API validates request data before creating or updating records.
Current user-creation rules include:
- Name must be a non-empty string and contain permitted name
  characters.
- Email must be a valid email format and include a letter in the part
  before @.
- Password must be 8--72 characters and contain at least one uppercase
  letter, one lowercase letter, and one special character.
- Role must be one of Admin, Manager, or Employee.
Validation failures return HTTP 400 Bad Request with field-specific
error messages. Authentication failures normally return
401 Unauthorized; insufficient role permissions return
403 Forbidden; resources not found in the current company return
404 Not Found.
Multi-Tenant Data Isolation
The authenticated user's companyId is used to scope user operations.
This is important: a user from one company must not be able to view,
update, or delete users belonging to another company. Do not trust a
client-supplied companyId for creating users; the server should use
the authenticated token's company ID.
Suggested Test Checklist
- Register a company and its initial Admin.
- Log in with the correct company email, user email, and password.
- Call /api/users/me with a valid token.
- Try a protected endpoint without a token and with an invalid/expired
  token.
- Create a user with valid data.
- Try invalid names, emails, passwords, and roles; confirm
  field-specific validation errors.
- Test pagination, search, and role filters.
- Update a user and confirm invalid IDs are handled.
- Soft-delete a user and verify the user no longer appears in the
  normal list.
- Verify that users from one company cannot access another company's
  users.
- Confirm passwords are never returned in API responses.
Security Notes
- Keep .env and JWT secrets private.
- Never commit passwords, access tokens, or production connection
  strings.
- Store passwords only as hashes; never store plain-text passwords.
- Use HTTPS and a managed secret store in production.
- Review rate-limit settings and CORS configuration before deployment.
- Use strong, unique passwords for Admin accounts.
Project Structure
The project uses a src directory. Core files include:
src/
├── app.js
├── server.js
├── config/
│   └── db.js
├── controllers/
├── middleware/
├── models/
├── routes/
Additional files may exist depending on your current implementation.
License
Add a license here if you intend to publish or distribute this project.