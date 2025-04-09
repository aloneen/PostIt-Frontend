import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../redux/userSlice';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { allUsers, error } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {allUsers.length > 0 ? (
        <ul>
          {allUsers.map(user => (
            <li key={user.id}>
              {user.username} ({user.email}) - Role: {user.role}
              <button onClick={() => handleDelete(user.id)} style={{ color: 'red' }}>
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
