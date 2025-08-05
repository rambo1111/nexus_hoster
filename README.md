# Nexus Hoster: A Modern Static Site Deployment Platform

![Nexus Hoster Dashboard](https://placehold.co/1200x630/0a1929/00ffff?text=Nexus%20Hoster)

Nexus Hoster is a full-stack web application that provides a seamless, secure, and professional platform for developers to deploy and manage their static websites. Built with a modern Node.js backend and a dynamic vanilla JavaScript frontend, it offers a complete solution from user authentication to file storage and delivery.

---

## ✨ Features

* **Secure User Authentication**: Robust signup and login system using email/password, with sessions managed by JSON Web Tokens (JWT) stored in secure cookies.
* **Unified Onboarding**: A sleek, single-form interface that intelligently switches between login and registration for a smooth user experience.
* **User Profiles**: Personalized user experience with display names and customizable profile picture uploads.
* **Multi-File Static Site Deployment**: Upload an entire project folder (HTML, CSS, JS, images) to deploy a new static site.
* **Centralized Dashboard**: View and manage all your deployed sites from a single, intuitive dashboard.
* **Database-Driven Storage**: All user data and site files are securely stored in MongoDB, with static assets managed by GridFS for efficient storage and retrieval.
* **Dynamic File Serving**: Deployed sites are served dynamically, allowing for clean URLs and robust file management.
* **Professional UI/UX**: A modern, dark-themed, and fully responsive interface designed for a professional development experience.

---

## 🛠️ Tech Stack

### Backend
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB with Mongoose ODM
* **File Storage**: MongoDB GridFS
* **Authentication**: JSON Web Tokens (JWT), bcryptjs for password hashing
* **File Uploads**: Multer and `multer-gridfs-storage`

### Frontend
* **Language**: Vanilla JavaScript (ES6 Modules)
* **Styling**: Custom CSS with a modern, dark-theme design system
* **Architecture**: Single-Page Application (SPA) with modular, component-based logic (`api.js`, `ui.js`, `app.js`)

---

## 🚀 Getting Started

Follow these instructions to get a local copy of Nexus Hoster up and running on your machine.

### Prerequisites

* **Node.js**: Version 14.x or higher. [Download here](https://nodejs.org/)
* **npm**: Included with Node.js.
* **MongoDB Atlas Account**: A free account is sufficient. [Sign up here](https://www.mongodb.com/cloud/atlas/register)

### Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/nexus-hoster.git](https://github.com/your-username/nexus-hoster.git)
    cd nexus-hoster
    ```

2.  **Install Dependencies**
    This project uses specific package versions for compatibility. It is crucial to use the provided `package.json`.
    ```bash
    npm install --legacy-peer-deps
    ```
    *Note: The `--legacy-peer-deps` flag is required to resolve dependency conflicts between `multer` and `multer-gridfs-storage`.*

3.  **Set Up Environment Variables**
    * Create a file named `.env` in the root of the project.
    * Get your MongoDB connection string from your Atlas dashboard.
    * Add the following content to your `.env` file, replacing the placeholder values:

    ```env
    # .env

    # Your MongoDB connection string (from Atlas)
    MONGODB_URI=mongodb+srv://<user>:<password>@cluster-name.mongodb.net/nexus-db?retryWrites=true&w=majority

    # A long, random, and secret string for signing JWTs
    JWT_SECRET=your_super_secret_string_for_jwt_that_is_long
    ```

4.  **Run the Server**
    ```bash
    node server.js
    ```
    Your application should now be running at `http://localhost:3000`.

    > **🚀 Server listening at http://localhost:3000**
    > **MongoDB Connected: [your-cluster-host]**

---

## 📁 Project Structure

The project is organized into a modular structure that separates concerns between the frontend, backend, and configuration.

/├── config/                 # Database and storage configurations├── controllers/            # Backend logic for handling requests├── middleware/             # Express middleware (e.g., authentication)├── models/                 # Mongoose schemas for MongoDB├── public/                 # All frontend files (HTML, CSS, JS)├── routes/                 # API route definitions├── .env                    # Environment variables (SECRET)├── server.js               # Main server entry point└── package.json            # Project dependencies
---

## 🔐 API Endpoints

All API routes are prefixed with `/api`.

### Authentication (`/api/auth`)

| Method | Endpoint                 | Protection | Description                               |
| :----- | :----------------------- | :--------- | :---------------------------------------- |
| `POST` | `/register`              | Public     | Creates a new user account.               |
| `POST` | `/login`                 | Public     | Logs in a user and returns a JWT cookie.  |
| `POST` | `/logout`                | Public     | Clears the user's session cookie.         |
| `GET`  | `/me`                    | Private    | Gets the profile of the currently logged-in user. |
| `POST` | `/profile-picture`       | Private    | Uploads a new avatar for the user.        |
| `GET`  | `/avatar/:filename`      | Public     | Serves a user's avatar image.             |

### Site Management (`/api/sites`)

*All site management routes are protected and require a valid JWT cookie.*

| Method   | Endpoint         | Description                               |
| :------- | :--------------- | :---------------------------------------- |
| `GET`    | `/`              | Lists all sites owned by the current user. |
| `POST`   | `/`              | Deploys a new static site.                |
| `GET`    | `/:siteName`     | Gets details and file list for a specific site. |
| `DELETE` | `/:siteName`     | Deletes a site and all its associated files. |

### Deployed Site Serving

| Method | Endpoint                 | Description                         |
| :----- | :----------------------- | :---------------------------------- |
| `GET`  | `/sites/:siteName/:file` | Serves a specific file from a deployed site. |

