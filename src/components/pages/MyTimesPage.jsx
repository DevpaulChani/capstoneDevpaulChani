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
      <h1>My Times Page</h1>
      <nav>
        <button onClick={() => navigate('/app/my-meetings')}>My Meetings</button>
        <button onClick={() => navigate('/app/my-times')}>My Times</button>
        <button onClick={() => navigate('/app/request')}>Request</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>
 
      <h2>Your Available Times</h2>
      {myTimes.length === 0 ? (
        <p>No available times set</p>
      ) : (
        <ul>
          {myTimes.map(time => (
            <li key={time.id}>
              {time.time}
              <button onClick={() => handleDeleteTime(time.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
 
      <h3>Add New Time</h3>
      <form onSubmit={handleAddTime}>
        <input
          type="text"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          placeholder="e.g. 2pm"
        />
        <button type="submit">Add Time</button>
      </form>
    </div>
  )
}
