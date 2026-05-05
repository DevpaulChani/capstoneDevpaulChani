import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
 
export default function RequestPage({ 
  currentUser, 
  users, 
  availableTimes, 
  meetingRequests, 
  onLogout, 
  onRequestMeeting, 
  onAcceptRequest, 
  onDenyRequest 
}) {
  const navigate = useNavigate()
  const [selectedUserId, setSelectedUserId] = useState('')
 
  if (!currentUser) return <div>Loading...</div>
 
  const handleLogout = () => {
    onLogout()
    navigate('/')
  }
 
  const otherUsers = users.filter(u => u.id !== currentUser.id)
  const selectedUser = selectedUserId ? users.find(u => u.id === parseInt(selectedUserId)) : null
  const selectedUserTimes = selectedUserId ? availableTimes.filter(t => t.userId === parseInt(selectedUserId)) : []
 
  const handleRequestMeeting = async (proposedTimeId) => {
    await onRequestMeeting(currentUser.id, parseInt(selectedUserId), proposedTimeId)
    setSelectedUserId('')
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
      <div className="page-header">
        <h1>Request Meeting</h1>
      </div>

      <nav className="page-nav">
        <button onClick={() => navigate('/app/my-meetings')}>My Meetings</button>
        <button onClick={() => navigate('/app/my-times')}>My Times</button>
        <button onClick={() => navigate('/app/request')}>Request</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>
 
      <div className="request-container">
        {/* Pending Requests Section */}
        <div className="pending-requests-section">
          <h2>Pending Requests to You</h2>
          {pendingRequests.length === 0 ? (
            <div className="empty-state">
              <p>No pending requests</p>
            </div>
          ) : (
            <div>
              {pendingRequests.map(req => {
                const requester = users.find(u => u.id === req.requesterId)
                const time = availableTimes.find(t => t.id === req.proposedTimeId)
                return (
                  <div key={req.id} className="request-card">
                    <p>
                      <strong>{requester?.userName}</strong> requested a meeting at <strong>{time?.time}</strong>
                    </p>
                    <div className="request-card-actions">
                      <button 
                        onClick={() => handleAcceptRequest(req.id)}
                        className="success"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleDenyRequest(req.id)}
                        className="danger"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
 
        {/* Request a Meeting Section */}
        <div className="request-form-section">
          <h2>Request a Meeting</h2>
          
          <div className="user-selector">
            <label htmlFor="user-select">Select User</label>
            <select 
              id="user-select"
              value={selectedUserId} 
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">-- Select a user --</option>
              {otherUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.userName}
                </option>
              ))}
            </select>
          </div>
 
          {selectedUser && (
            <div className="available-times-section">
              <h3>{selectedUser.userName}'s Available Times</h3>
              {selectedUserTimes.length === 0 ? (
                <div className="no-times">
                  <p>This user has no available times</p>
                </div>
              ) : (
                <ul className="available-times-list">
                  {selectedUserTimes.map(time => (
                    <li key={time.id}>
                      <span>{time.time}</span>
                      <button 
                        onClick={() => handleRequestMeeting(time.id)}
                        className="success"
                      >
                        Request
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}