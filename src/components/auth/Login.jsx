import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login({ users, onLogin }) {
  const [selectedUserId, setSelectedUserId] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    if (selectedUserId) {
      onLogin(parseInt(selectedUserId))
      navigate('/app/my-meetings')
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Select User: </label>
          <select
            id="username"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">-- Select a user --</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.userName}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={!selectedUserId}>
          Login
        </button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  )
}
