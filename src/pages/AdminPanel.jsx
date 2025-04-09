import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../redux/userSlice';

const AdminPanel = () => {
  const dispatch = useDispatch();
  // Деструктурируем, подставляя дефолтное значение пустого массива
  const { allUsers = [], error } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel - Manage Users</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {allUsers && allUsers.length > 0 ? (
        <ul>
          {allUsers.map(user => (
            <li key={user.id}>
              {user.username} ({user.email}) - Role: {user.role}
              <button
                onClick={() => handleDelete(user.id)}
                style={{ marginLeft: '10px', color: 'red' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default AdminPanel;
