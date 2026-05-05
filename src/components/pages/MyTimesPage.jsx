import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
 
export default function MyTimesPage({ currentUser, availableTimes, onLogout, onAddTime, onDeleteTime }) {
  const navigate = useNavigate()
  const [newTime, setNewTime] = useState('')
 
  if (!currentUser) return <div>Loading...</div>
 
  const handleLogout = () => {
    onLogout()
    navigate('/')
  }
 
  const myTimes = availableTimes.filter(t => t.userId === currentUser.id)
 
  const handleAddTime = async (e) => {
    e.preventDefault()
    if (newTime.trim()) {
      await onAddTime(currentUser.id, newTime)
      setNewTime('')
    }
  }
 
  const handleDeleteTime = async (timeId) => {
    await onDeleteTime(timeId)
  }
 
  return (
    <div>
      <div className="page-header">
        <h1>My Times</h1>
      </div>

      <nav className="page-nav">
        <button onClick={() => navigate('/app/my-meetings')}>My Meetings</button>
        <button onClick={() => navigate('/app/my-times')}>My Times</button>
        <button onClick={() => navigate('/app/request')}>Request</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>
 
      <div className="times-container">
        <div className="times-section">
          <h2>Your Available Times</h2>
          {myTimes.length === 0 ? (
            <div className="empty-state">
              <p>No available times set</p>
            </div>
          ) : (
            <ul className="times-list">
              {myTimes.map(time => (
                <li key={time.id}>
                  <span>{time.time}</span>
                  <button 
                    onClick={() => handleDeleteTime(time.id)}
                    className="danger"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
 
        <div className="add-time-form">
          <h3>Add New Time</h3>
          <form onSubmit={handleAddTime}>
            <input
              type="text"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              placeholder="e.g., 2pm Monday, 3pm Tuesday"
            />
            <button type="submit" className="success">Add Time</button>
          </form>
        </div>
      </div>
    </div>
  )
}