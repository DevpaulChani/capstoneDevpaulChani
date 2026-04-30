import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RequestPage({ currentUser, users, availableTimes, meetingRequests, onLogout, onRequestMeeting, onAcceptRequest, onDenyRequest }) {
  const navigate = useNavigate()
  const [selectedUserId, setSelectedUserId] = useState(null)

  if (!currentUser) return <div>Loading...</div>

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  const otherUsers = users.filter(u => u.id !== currentUser.id)
  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null
  const selectedUserTimes = selectedUserId ? availableTimes.filter(t => t.userId === selectedUserId) : []

  const handleRequestMeeting = async (proposedTimeId) => {
    await onRequestMeeting(currentUser.id, selectedUserId, proposedTimeId)
  }

  // Get pending requests to current user
  const pendingRequests = meetingRequests.filter(
    req => req.requesteeId === currentUser.id && req.statusId === 1
  )

  const handleAcceptRequest = async (requestId) => {
    await onAcceptRequest(requestId)
  }

  const handleDenyRequest = async (requestId) => {
    await onDenyRequest(requestId)
  }

  return (
    <div>
      <h1>Request Page</h1>
      <nav>
        <button onClick={() => navigate('/app/my-meetings')}>My Meetings</button>
        <button onClick={() => navigate('/app/my-times')}>My Times</button>
        <button onClick={() => navigate('/app/request')}>Request</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <h2>Pending Requests to You</h2>
      {pendingRequests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <div>
          {pendingRequests.map(req => {
            const requester = users.find(u => u.id === req.requesterId)
            const time = availableTimes.find(t => t.id === req.proposedTimeId)
            return (
              <div key={req.id} style={{ border: '1px solid black', padding: '10px', marginBottom: '10px' }}>
                <p>{requester?.userName} requested a meeting at {time?.time}</p>
                <button onClick={() => handleAcceptRequest(req.id)}>Accept</button>
                <button onClick={() => handleDenyRequest(req.id)}>Deny</button>
              </div>
            )
          })}
        </div>
      )}

      <h2>Request a Meeting</h2>
      <div>
        <label>Select User: </label>
        <select value={selectedUserId || ''} onChange={(e) => setSelectedUserId(parseInt(e.target.value))}>
          <option value="">-- Select a user --</option>
          {otherUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.userName}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <div style={{ marginTop: '20px' }}>
          <h3>{selectedUser.userName}'s Available Times</h3>
          {selectedUserTimes.length === 0 ? (
            <p>This user has no available times</p>
          ) : (
            <ul>
              {selectedUserTimes.map(time => (
                <li key={time.id}>
                  {time.time}
                  <button onClick={() => handleRequestMeeting(time.id)}>Request</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
