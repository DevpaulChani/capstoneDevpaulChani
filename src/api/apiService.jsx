const API_URL = 'http://localhost:8088'

// Users
export const getUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`)
    if (!response.ok) throw new Error('Failed to fetch users')
    return await response.json()
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export const createUser = async (userName) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName })
    })
    if (!response.ok) throw new Error('Failed to create user')
    return await response.json()
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

// Available Times
export const getAvailableTimes = async () => {
  try {
    const response = await fetch(`${API_URL}/availableTimes`)
    if (!response.ok) throw new Error('Failed to fetch available times')
    return await response.json()
  } catch (error) {
    console.error('Error fetching available times:', error)
    return []
  }
}

export const createAvailableTime = async (userId, time) => {
  try {
    const response = await fetch(`${API_URL}/availableTimes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, time })
    })
    if (!response.ok) throw new Error('Failed to create available time')
    return await response.json()
  } catch (error) {
    console.error('Error creating available time:', error)
    return null
  }
}

export const deleteAvailableTime = async (timeId) => {
  try {
    const response = await fetch(`${API_URL}/availableTimes/${timeId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete available time')
    return true
  } catch (error) {
    console.error('Error deleting available time:', error)
    return false
  }
}

// Meeting Requests
export const getMeetingRequests = async () => {
  try {
    const response = await fetch(`${API_URL}/meetingRequests`)
    if (!response.ok) throw new Error('Failed to fetch meeting requests')
    return await response.json()
  } catch (error) {
    console.error('Error fetching meeting requests:', error)
    return []
  }
}

export const createMeetingRequest = async (requesterId, requesteeId, proposedTimeId) => {
  try {
    const response = await fetch(`${API_URL}/meetingRequests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requesterId,
        requesteeId,
        proposedTimeId,
        statusId: 1 // pending
      })
    })
    if (!response.ok) throw new Error('Failed to create meeting request')
    return await response.json()
  } catch (error) {
    console.error('Error creating meeting request:', error)
    return null
  }
}

export const updateMeetingRequestStatus = async (requestId, statusId) => {
  try {
    // First, fetch the current meeting request to preserve all properties
    const getResponse = await fetch(`${API_URL}/meetingRequests/${requestId}`)
    if (!getResponse.ok) throw new Error('Failed to fetch meeting request')
    const currentRequest = await getResponse.json()

    // Then, update it with all properties intact
    const response = await fetch(`${API_URL}/meetingRequests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...currentRequest,  // Keep all existing properties
        statusId            // Update only the statusId
      })
    })
    if (!response.ok) throw new Error('Failed to update meeting request')
    return await response.json()
  } catch (error) {
    console.error('Error updating meeting request:', error)
    return null
  }
}

export const deleteMeetingRequest = async (requestId) => {
  try {
    const response = await fetch(`${API_URL}/meetingRequests/${requestId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete meeting request')
    return true
  } catch (error) {
    console.error('Error deleting meeting request:', error)
    return false
  }
}

// Statuses
export const getStatuses = async () => {
  try {
    const response = await fetch(`${API_URL}/statuses`)
    if (!response.ok) throw new Error('Failed to fetch statuses')
    return await response.json()
  } catch (error) {
    console.error('Error fetching statuses:', error)
    return []
  }
}