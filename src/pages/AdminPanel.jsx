import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, changeUserRole, setUserActive } from '../redux/userSlice';
import { toast } from 'react-toastify';
import ConfirmationModal from '../components/ConfirmationModal';






const AdminPanel = () => {
  const dispatch     = useDispatch();
  const { currentUser, allUsers = [], error } = useSelector(s => s.user);

  // Only show everybody except yourself
  const otherUsers = allUsers.filter(u => u.id !== currentUser?.id);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRoleChange = (userId, newRole) => {
    dispatch(changeUserRole({ userId, role: newRole }))
      .unwrap()
      .then(() => toast.success('Role has been changed'))
      .catch(err => toast.error('Failed to change role: ' + err));
  };

  // Called when clicking the Ban/Unban button
  const promptToggleActive = user => {
    setUserToToggle(user);
    setModalOpen(true);
  };

  // Actually perform ban/unban after confirmation
  const confirmToggleActive = () => {
    dispatch(
      setUserActive({
        userId:    userToToggle.id,
        is_active: !userToToggle.is_active
      })
    )
      .unwrap()
      .then(() => {
        toast.success(
          `${userToToggle.username} has been ${userToToggle.is_active ? 'banned' : 'unbanned'}`
        );
      })
      .catch(err => toast.error('Failed to update status: ' + err));
    setModalOpen(false);
    setUserToToggle(null);
  };

  const cancelToggleActive = () => {
    setModalOpen(false);
    setUserToToggle(null);
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
                onClick={() => promptToggleActive(user)}
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

      <ConfirmationModal
        isOpen={modalOpen}
        title={
          userToToggle && userToToggle.is_active
            ? 'Confirm Ban'
            : 'Confirm Unban'
        }
        message={
          userToToggle
            ? `Are you sure you want to ${
                userToToggle.is_active ? 'ban' : 'unban'
              } "${userToToggle.username}"?`
            : ''
        }
        onConfirm={confirmToggleActive}
        onCancel={cancelToggleActive}
      />
    </div>
  );
};

export default AdminPanel;
