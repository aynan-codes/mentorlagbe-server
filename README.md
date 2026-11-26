# MentorLagbe — Server

MentorLagbe Server is the backend application of MentorLagbe, an online tutoring platform that connects students with tutors across Bangladesh. It provides RESTful APIs for authentication, user management, tuition management, applications, bookmarks, and payment processing.

## 🚀 Features

- User authentication and authorization.
- Role-based access control for Students, Tutors, and Admins.
- User profile management.
- Tuition creation, updating, deletion, and browsing.
- Tuition application management.
- Bookmark and saved tuition management.
- Free and Pro membership management.
- Stripe Checkout integration.
- Stripe webhook payment verification.
- Payment history management.
- Profile image upload using ImgBB.
- MongoDB database integration.
- Protected API routes.
- Input validation and error handling.

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- JavaScript
- MongoDB

### Authentication & Payment
- Better Auth
- JSON Web Token (JWT)
- Stripe

### Image Hosting
- ImgBB API

### Development Tools
- Git
- GitHub
- npm
- Nodemon

## 📦 Installation

### 1. Clone the Repository

```bash
git clone YOUR_SERVER_REPOSITORY_URL
```

### 2. Navigate to the Project Directory

```bash
cd mentorlagbe-server
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root and configure the required environment variables.

Required configurations include:

- MongoDB connection
- Better Auth configuration
- Google OAuth credentials
- Client URL
- Stripe secret key
- Stripe webhook secret
- ImgBB API key

**Important:** Never upload your actual `.env` file or secret credentials to GitHub.

### 5. Run the Development Server

```bash
npm run dev
```

The backend server runs at:

```text
http://localhost:5000
```

### 6. Run in Production

```bash
npm start
```

## 💳 Payment Integration

MentorLagbe uses Stripe Checkout for Pro membership payments.

| Membership | Price |
|---|---:|
| Student Pro | $10 |
| Tutor Pro | $15 |

Stripe webhooks verify successful payments and update membership status.

## 🗄️ Database Collections

The application uses four MongoDB collections:

1. `users`
2. `tuitions`
3. `applications`
4. `payments`

## 🔐 Security

- Protected API endpoints.
- Authentication and authorization.
- Role-based permissions.
- Stripe webhook signature verification.
- Environment-based secret management.
- Payment verification before membership upgrades.

## 👨‍💻 Author

**Abu Baten Mohammad Aynan**

- GitHub: [aynan-codes](https://github.com/aynan-codes)
- LinkedIn: [Abu Baten Mohammad Aynan](https://www.linkedin.com/in/abu-baten-aynan/)

---

⭐ If you find this project useful, consider giving it a star!