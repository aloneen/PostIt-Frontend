import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, deleteUser } from '../store/userSlice'

const AdminPanel = () => {
  const dispatch = useDispatch()
  const { users, currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  if (currentUser?.role !== 'Admin') {
    return <h2>Access Denied</h2>
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                {u.id !== currentUser.id && (
                  <button onClick={() => dispatch(deleteUser(u.id))} style={{ color: 'red' }}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminPanel
