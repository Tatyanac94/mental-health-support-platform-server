# mental-health-support-platform-server

## Author: Tatyana Cuttino

## Description

The Mental Health Support Platform Server is a user-friendly backend API designed to enhance mental health support and connections on a digital platform. It allows users to easily create, share, and engage with content through forums, posts and comments, making it simple for everyone to connect and express their thoughts.

This API provides all the necessary tools for an active community, encouraging meaningful interactions and conversations among users. If a user chooses not to provide their name when creating a post or comment, the system will automatically label them as "Anonymous." This ensures that everyone can participate comfortably, fostering an inclusive environment for all users.

## How to Run

Clone the repository: <https://github.com/Tatyanac94/mental-health-support-platform-server.git>

Navigate to the project directory:

```bash
cd [project-directory]
```

## Installation Command

Install dependencies using the following command:

```bash
npm install
```

## Set Up Environmental Variables

Create a `.env` file in the root directory of the project:

```plaintext
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key
```

## Run the Server

For production:

```bash
npm start
```

For development with auto-reloading:

```bash
npm run dev
```

Open your browser and navigate to <http://localhost:4000> to see the app in action.

## API Routes

FORUMS:

POST /api/forums - Creates a new forum.
GET /api/forums - Retrieves a list of all forums.
GET /api/forums/:id - Retrieves details of a specific forum.
GET /api/forums/:id/posts - Retrieves all posts associated with a specific forum.
PUT /api/forums/:id - Updates the details of a specific forum.
DELETE /api/forums/:id - Deletes a specific forum.

POSTS:

* GET /api/posts- Retrieves all posts.
* GET /api/posts/3 - Retrieves a specific post.
* POST /api/posts - Creates a new post associated with a forum.
* PUT /api/posts/3 - Update a post.
* DELETE /api/comments/likes/:likeId - Deletes a post.

POST LIKES:

* GET /api/posts/:id/likes - Fetches all likes associated with a specific post identified by its ID.
* POST /api/posts/:id/likes - Adds a like to a specific post identified by its ID.

* DELETE /api/likes/:likeId - Removes a like identified by its like ID.

COMMENTS:

* POST /api/posts/:id/comments - Creates a new comment on a post identified by its ID.
* GET /api/posts/:id/comments - Retrieves all comments for a post identified by its ID.
* PUT /api/comments/:commentid - Updates a comment identified by its comment ID.
* DELETE /api/comments/:commentid - Deletes a comment identified by its comment ID.

COMMENT LIKES:

* GET /api/comments/:id/likes - Fetches all likes associated with a specific comment identified by its ID.
* POST /api/comments/:id/likes - Adds a like to a specific comment identified by its ID.
* DELETE /api/comments/likes/:likeId - Removes a like identified by its like ID for a comment.

## Request Body Format for Posting and Updating Comments and Posts

When making a POST or PUT request to create or update a comment or post entry, ensure that you send a valid JSON body. The request body should be formatted as follows:

For creating or updating a Post:
(Username is optional. If you remove the username, your post will be labeled as Anonymous.)

```json
{
    "title": "Your post title",
    "content": "Your post content here",
    "username": "Your name here"
}
```

For creating or updating a Comment:
(Username is optional. If you remove the username, your comment will be labeled as Anonymous.)

```json
{
    "content": "Your updated comment here",
    "username": "Your name here"
}
```

## Technologies and Resources Used

* Vercel: Deployment platform for serverless functions and static sites.

* Node.js: JavaScript runtime for building the server.

* Express: Web application framework for Node.js used to handle HTTP requests.

* Supabase: Backend-as-a-service platform providing a PostgreSQL database and RESTful API.

* Javascript: Programming language used for both server-side and client-side code.

* Postman: Write and run automated tests for API endpoints. (GET, POST, PUT, DELETE, etc.).

* Jest & SuperTest: Tools for testing and HTTP assertions.

* Axios: HTTP client for making requests to the Supabase API.

* CORS: Middleware for handling cross-origin requests.

* Nodemon: Development tool for auto-reloading the server on file changes.
