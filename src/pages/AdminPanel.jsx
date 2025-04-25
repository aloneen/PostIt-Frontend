import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  changeUserRole,
  setUserActive
} from '../redux/userSlice';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { currentUser, allUsers = [], error } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // remove yourself from the list
  const otherUsers = allUsers.filter(u => u.id !== currentUser?.id);

  const handleRoleChange = (userId, newRole) => {
    dispatch(changeUserRole({ userId, role: newRole }))
      .unwrap()
      .catch(err => console.error(err));
  };

  const handleBanToggle = (user) => {
    dispatch(setUserActive({ userId: user.id, is_active: !user.is_active }))
      .unwrap()
      .catch(err => console.error(err));
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel – Manage Users</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {otherUsers.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {otherUsers.map(user => (
            <li
              key={user.id}
              style={{
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <span>
                {user.username} ({user.email})
              </span>

              <select
                value={user.role}
                onChange={e => handleRoleChange(user.id, e.target.value)}
              >
                <option value="User">User</option>
                <option value="Moderator">Moderator</option>
                <option value="Admin">Admin</option>
              </select>

              <button
                onClick={() => handleBanToggle(user)}
                style={{
                  marginLeft: '8px',
                  background: user.is_active ? '#dc3545' : '#28a745',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {user.is_active ? 'Ban' : 'Unban'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No other users found.</p>
      )}
    </div>
  );
};

export default AdminPanel;
