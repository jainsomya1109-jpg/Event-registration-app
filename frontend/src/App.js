import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('register');
  
  // Admin Auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    github_profile: '',
    event_track: 'Web Development Hackathon'
  });

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    full_name: '',
    email: '',
    github_profile: '',
    event_track: ''
  });

  // Registrations
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get('https://event-registration-app-xlwt.onrender.com//api/registrations');
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchRegistrations();
    }
  }, [isAdminAuthenticated]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      setIsAdminAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect Admin Passcode!');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('https://event-registration-app-xlwt.onrender.com//api/register', formData);
      setMessage('🎉 Registration successful! See you at the event.');
      setIsSuccess(true);
      setFormData({
        full_name: '',
        email: '',
        github_profile: '',
        event_track: 'Web Development Hackathon'
      });
    } catch (error) {
      setMessage('❌ Registration failed. Please check your connection.');
      setIsSuccess(false);
    }
  };

  // Start Editing an Attendee
  const startEditing = (user) => {
    setEditingId(user.id);
    setEditFormData({
      full_name: user.full_name,
      email: user.email,
      github_profile: user.github_profile,
      event_track: user.event_track
    });
  };

  // Handle Edit Field Inputs
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // Save Edit to FastAPI
  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`https://event-registration-app-xlwt.onrender.com//api/registrations/${id}`, editFormData);
      setEditingId(null);
      fetchRegistrations(); // Refresh list
    } catch (error) {
      alert('Failed to update registration.');
    }
  };

  return (
    <div className="app-container">
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`} 
          onClick={() => setActiveTab('register')}
        >
          Register
        </button>
        <button 
          className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`} 
          onClick={() => setActiveTab('admin')}
        >
          Admin Portal 🔒
        </button>
      </div>

      {/* ================= PUBLIC REGISTRATION TAB ================= */}
      {activeTab === 'register' && (
        <div>
          <div className="header">
            <h1>Tech Summit 2026</h1>
            <p>Reserve your spot for the upcoming event</p>
          </div>

          {message && (
            <div className={isSuccess ? 'alert-success' : 'alert-error'}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                className="form-control"
                type="text"
                name="full_name"
                placeholder="e.g. Alex Smith"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>GitHub Profile</label>
              <input
                className="form-control"
                type="url"
                name="github_profile"
                placeholder="https://github.com/username"
                value={formData.github_profile}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Select Event Track</label>
              <select
                className="form-control"
                name="event_track"
                value={formData.event_track}
                onChange={handleChange}
              >
                <option value="Web Development Hackathon">Web Development Hackathon</option>
                <option value="AI/ML Innovation Coding">AI/ML Innovation Coding</option>
                <option value="Cybersecurity Challenge">Cybersecurity Challenge</option>
              </select>
            </div>

            <button type="submit" className="btn-submit">
              Complete Registration
            </button>
          </form>
        </div>
      )}

      {/* ================= PRIVATE ADMIN TAB ================= */}
      {activeTab === 'admin' && (
        <div>
          <div className="header">
            <h1>Admin Dashboard</h1>
            <p>Manage and edit registered attendees</p>
          </div>

          {!isAdminAuthenticated ? (
            <form onSubmit={handleAdminLogin} style={{ textAlign: 'center' }}>
              {authError && <div className="alert-error">{authError}</div>}
              <div className="form-group">
                <label>Enter Admin Passcode</label>
                <input
                  className="form-control"
                  type="password"
                  placeholder="Passcode: admin123"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-submit">
                Access Admin Panel
              </button>
            </form>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontWeight: '600' }}>Total Attendees: {registrations.length}</span>
                <button 
                  onClick={() => setIsAdminAuthenticated(false)} 
                  style={{ padding: '6px 12px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                >
                  Logout
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Track</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No registrations found.</td>
                      </tr>
                    ) : (
                      registrations.map((user) => (
                        <tr key={user.id}>
                          <td>#{user.id}</td>
                          
                          {/* If currently editing this row */}
                          {editingId === user.id ? (
                            <>
                              <td>
                                <input 
                                  className="form-control" 
                                  style={{ padding: '4px 8px' }} 
                                  name="full_name" 
                                  value={editFormData.full_name} 
                                  onChange={handleEditChange} 
                                />
                              </td>
                              <td>
                                <input 
                                  className="form-control" 
                                  style={{ padding: '4px 8px' }} 
                                  name="email" 
                                  value={editFormData.email} 
                                  onChange={handleEditChange} 
                                />
                              </td>
                              <td>
                                <select 
                                  className="form-control" 
                                  style={{ padding: '4px 8px' }} 
                                  name="event_track" 
                                  value={editFormData.event_track} 
                                  onChange={handleEditChange}
                                >
                                  <option value="Web Development Hackathon">Web Development</option>
                                  <option value="AI/ML Innovation Coding">AI/ML</option>
                                  <option value="Cybersecurity Challenge">Cybersecurity</option>
                                </select>
                              </td>
                              <td>
                                <button 
                                  onClick={() => handleSaveEdit(user.id)} 
                                  style={{ padding: '4px 8px', background: '#48bb78', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '4px' }}
                                >
                                  Save
                                </button>
                                <button 
                                  onClick={() => setEditingId(null)} 
                                  style={{ padding: '4px 8px', background: '#a0aec0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  Cancel
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>{user.full_name}</td>
                              <td>{user.email}</td>
                              <td><span className="badge">{user.event_track}</span></td>
                              <td>
                                <button 
                                  onClick={() => startEditing(user)} 
                                  style={{ padding: '4px 8px', background: '#4299e1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                  Edit
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;