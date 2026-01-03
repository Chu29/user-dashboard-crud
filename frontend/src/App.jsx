import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/users";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    role: "user",
  });

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setUsers(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Create or Update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/${editingUser._id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchUsers();
      resetForm();
    } catch (err) {
      setError(editingUser ? "Failed to update user" : "Failed to create user");
      console.error(err);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchUsers();
      } catch (err) {
        setError("Failed to delete user");
        console.error(err);
      }
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      age: user.age,
      role: user.role,
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: "", email: "", age: "", role: "user" });
    setEditingUser(null);
    setShowForm(false);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>User Dashboard</h1>
        <p>MongoDB + Node.js + React</p>
      </header>

      <main className="container">
        {error && <div className="error-message">{error}</div>}

        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ Add New User"}
          </button>
        </div>

        {showForm && (
          <div className="form-container">
            <h2>{editingUser ? "Edit User" : "Create New User"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Role:</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingUser ? "Update User" : "Create User"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="users-section">
          <h2>All Users ({users.length})</h2>

          {loading ? (
            <div className="loading">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="no-users">
              No users found. Create one to get started!
            </div>
          ) : (
            <div className="users-grid">
              {users.map((user) => (
                <div key={user._id} className="user-card">
                  <div className="user-header">
                    <h3>{user.name}</h3>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="user-details">
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Age:</strong> {user.age || "N/A"}
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="user-actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
