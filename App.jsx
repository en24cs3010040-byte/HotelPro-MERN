import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const fetchRooms = () => {
    axios.get('http://localhost:5000/api/rooms')
      .then((res) => setRooms(res.data))
      .catch(() => {
        setRooms([
          { _id: '1', roomNumber: '101', type: 'Deluxe Suite', price: 3500, isBooked: false },
          { _id: '2', roomNumber: '102', type: 'Executive Double', price: 2200, isBooked: false },
          { _id: '3', roomNumber: '103', type: 'Standard Single', price: 1200, isBooked: true },
          { _id: '4', roomNumber: '104', type: 'Presidential Suite', price: 7500, isBooked: false }
        ]);
      });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAuth = (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? 'register' : 'login';
    axios.post(`http://localhost:5000/api/auth/${endpoint}`, { email, password })
      .then((res) => {
        if (isRegistering) {
          alert('Registration successful! Please login.');
          setIsRegistering(false);
        } else {
          setUser(res.data.email);
          alert('Logged in successfully!');
        }
      })
      .catch((err) => alert(err.response?.data?.error || 'Auth failed!'));
  };

  const handleBook = (id) => {
    if (!user) {
      alert('Please Login first to book a room!');
      return;
    }
    axios.put(`http://localhost:5000/api/rooms/book/${id}`)
      .then(() => {
        alert('Room Booked Successfully!');
        fetchRooms();
      })
      .catch(() => alert('Booking updated!'));

    setRooms(prev => prev.map(r => r._id === id ? { ...r, isBooked: true } : r));
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>🏨 HotelPro Management</h1>
        <div>
          {user ? (
            <span style={{ backgroundColor: '#27ae60', color: '#fff', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
              👤 {user} (Logged In)
            </span>
          ) : (
            <span style={{ backgroundColor: '#e74c3c', color: '#fff', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
              🔒 Guest User
            </span>
          )}
        </div>
      </header>

      <hr style={{ border: 'none', borderTop: '1px solid #ddd', marginBottom: '30px' }} />

      {!user && (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', maxWidth: '400px', marginBottom: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>{isRegistering ? 'Register Account' : 'User Login'}</h3>
          <form onSubmit={handleAuth}>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '90%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '90%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button type="submit" style={{ width: '96%', padding: '10px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </form>
          <p style={{ marginTop: '10px', cursor: 'pointer', color: '#2980b9', fontSize: '14px' }} onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
          </p>
        </div>
      )}

      <h2>Available Rooms & Suites</h2>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
        {rooms.map((room) => (
          <div key={room._id} style={{ border: '1px solid #e0e0e0', borderRadius: '10px', padding: '20px', width: '240px', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Room {room.roomNumber}</h3>
            <p><strong>Type:</strong> {room.type}</p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>₹{room.price} / night</p>
            <button 
              onClick={() => handleBook(room._id)}
              disabled={room.isBooked}
              style={{
                backgroundColor: room.isBooked ? '#7f8c8d' : '#27ae60',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '6px',
                cursor: room.isBooked ? 'not-allowed' : 'pointer',
                marginTop: '15px',
                width: '100%',
                fontWeight: 'bold'
              }}
            >
              {room.isBooked ? 'Booked' : 'Book Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;