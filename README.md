<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
 
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 900px; margin: auto;">

  <h1>SkillShare — Developer Collaboration Platform (Backend)</h1>

  <p><strong>SkillShare</strong> is a collaborative platform where developers can sign up, post their skills, and join or create projects based on matching expertise. This repository includes the backend built with <strong>Node.js</strong>, <strong>Express.js</strong>, and <strong>MongoDB</strong>.</p>

  <h2>🚀 Features</h2>
  <ul>
    <li><strong>User Authentication:</strong> JWT-based login/signup with email & password.</li>
    <li><strong>Role-based Access:</strong> Support for User and Admin roles.</li>
    <li><strong>User Profiles:</strong> Bio, profile picture URL, skills list, and social links (GitHub, LinkedIn).</li>
    <li><strong>Project Listings:</strong> Create and manage projects with title, description, required skills, and status (open/closed).</li>
    <li><strong>Matching System:</strong> Fetch projects based on a user's skills.</li>
    <li><strong>Collaboration Requests:</strong> Request to join projects and accept/reject members.</li>
    <li><strong>Admin Panel (optional):</strong> Monitor users, ban/report abuse (to be implemented).</li>
  </ul>

  <h2>🛠 Tech Stack</h2>
  <ul>
    <li><strong>Backend:</strong> Node.js, Express.js</li>
    <li><strong>Database:</strong> MongoDB (Mongoose ODM)</li>
    <li><strong>Authentication:</strong> JWT (JSON Web Tokens)</li>
  </ul>

  <h2>📦 Installation</h2>
  <pre><code>git clone https://github.com/your-username/skillshare-backend.git
cd skillshare-backend
npm install
</code></pre>

  <h2>⚙️ Setup</h2>
  <p>Create a <code>.env</code> file in the root with the following variables:</p>
  <pre><code>PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
</code></pre>

  <h2>📡 Run the Server</h2>
  <pre><code>npm run dev</code></pre>

  <h2>📁 Project Structure</h2>
  <pre><code>.
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── config/
├── server.js
</code></pre>

  <h2>📌 API Endpoints</h2>
  <ul>
    <li><code>POST /api/v1/auth/register</code> — Register a new user</li>
    <li><code>POST /api/v1/auth/login</code> — Login user</li>
    <li><code>GET /api/v1/projects</code> — Get all projects</li>
    <li><code>POST /api/v1/projects</code> — Create a new project</li>
    <li><code>POST /api/v1/need/:projectId/join</code> — Request to join a project</li>
    <li><code>POST /api/v1/request/my-requests</code> — View all join requests by the current user</li>
    <li><code>GET /api/v1/users/me</code> — Get current user profile</li>
  </ul>

  <h2>📎 Future Enhancements</h2>
  <ul>
    <li>Admin panel UI & moderation tools</li>
    <li>Email notifications</li>
    <li>Search and filter by tech stack</li>
    <li>Real-time chat/collaboration features</li>
  </ul>

  <h2>🧑‍💻 Author</h2>
  <p>Developed by <strong>Hrishabh Gupta</strong> — Connect with me on 
    <a href="https://github.com/Hrishabh3829" target="_blank">GitHub</a>
  </p>

</body>
</html>
