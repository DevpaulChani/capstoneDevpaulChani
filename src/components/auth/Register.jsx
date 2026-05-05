import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
 
export default function Register({ onRegister, users }) {
  const [userName, setUserName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
 
  const handleRegister = (e) => {
    e.preventDefault()
    setError('')
 
    if (!userName.trim()) {
      setError('Username cannot be empty')
      return
    }
 
    if (users.some(u => u.userName === userName)) {
      setError('Username already exists')
      return
    }
 
    onRegister(userName)
    navigate('/app/my-meetings')
  }
 
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter a username"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Register</button>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account? <a href="/">Login</a>
          </p>
        </div>
      </div>
    </div>
  )
}