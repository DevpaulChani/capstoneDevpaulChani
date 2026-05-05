import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import MyMeetingsPage from "./components/pages/MyMeetingsPage";
import MyTimesPage from "./components/pages/MyTimesPage";
import RequestPage from "./components/pages/RequestPage";
import * as api from "./api/apiService";

export default function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [meetingRequests, setMeetingRequests] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from json-server
  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, timesData, requestsData, statusesData] =
          await Promise.all([
            api.getUsers(),
            api.getAvailableTimes(),
            api.getMeetingRequests(),
            api.getStatuses(),
          ]);
        setUsers(usersData || []);
        setAvailableTimes(timesData || []);
        setMeetingRequests(requestsData || []);
        setStatuses(statusesData || []);
      } catch (error) {
        console.error("Error loading data from json-server:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Always start with no user (login page first)
  // Don't use localStorage - require login each session
  useEffect(() => {
    localStorage.removeItem("currentUserId");
    setCurrentUserId(null);
  }, []);

  const handleLogin = (userId) => {
    setCurrentUserId(userId);
  };

  const handleLogout = () => {
    setCurrentUserId(null);
  };

  const handleRegister = async (userName) => {
    try {
      const newUser = await api.createUser(userName);
      if (newUser) {
        setUsers([...users, newUser]);
        setCurrentUserId(newUser.id);
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleAddAvailableTime = async (userId, time) => {
    try {
      const newTime = await api.createAvailableTime(userId, time);
      if (newTime) {
        setAvailableTimes([...availableTimes, newTime]);
      }
    } catch (error) {
      console.error("Error adding available time:", error);
    }
  };

  const handleDeleteAvailableTime = async (timeId) => {
    try {
      const success = await api.deleteAvailableTime(timeId);
      if (success) {
        setAvailableTimes(availableTimes.filter((t) => t.id !== timeId));
      }
    } catch (error) {
      console.error("Error deleting available time:", error);
    }
  };

  const handleRequestMeeting = async (
    requesterId,
    requesteeId,
    proposedTimeId,
  ) => {
    try {
      const newRequest = await api.createMeetingRequest(
        requesterId,
        requesteeId,
        proposedTimeId,
      );
      if (newRequest) {
        setMeetingRequests([...meetingRequests, newRequest]);
      }
    } catch (error) {
      console.error("Error creating meeting request:", error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const updatedRequest = await api.updateMeetingRequestStatus(requestId, 2);
      if (updatedRequest) {
        setMeetingRequests(
          meetingRequests.map((req) =>
            req.id === requestId ? updatedRequest : req,
          ),
        );
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDenyRequest = async (requestId) => {
    try {
      const success = await api.deleteMeetingRequest(requestId);
      if (success) {
        setMeetingRequests(
          meetingRequests.filter((req) => req.id !== requestId),
        );
      }
    } catch (error) {
      console.error("Error denying request:", error);
    }
  };

  const handleCancelMeeting = async (meetingId) => {
    try {
      const success = await api.deleteMeetingRequest(meetingId);
      if (success) {
        setMeetingRequests(
          meetingRequests.filter((req) => req.id !== meetingId),
        );
      }
    } catch (error) {
      console.error("Error canceling meeting:", error);
    }
  };

  const currentUser = users.find((u) => u.id === currentUserId);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>Loading app...</div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {!currentUserId ? (
          <>
            <Route
              path="/"
              element={<Login users={users} onLogin={handleLogin} />}
            />
            <Route
              path="/register"
              element={<Register onRegister={handleRegister} users={users} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/app" element={<Navigate to="/app/my-meetings" />} />
            <Route
              path="/app/my-meetings"
              element={
                <MyMeetingsPage
                  currentUser={currentUser}
                  meetingRequests={meetingRequests}
                  users={users}
                  availableTimes={availableTimes}
                  statuses={statuses}
                  onLogout={handleLogout}
                  onCancelMeeting={handleCancelMeeting}
                />
              }
            />
            <Route
              path="/app/my-times"
              element={
                <MyTimesPage
                  currentUser={currentUser}
                  availableTimes={availableTimes}
                  onLogout={handleLogout}
                  onAddTime={handleAddAvailableTime}
                  onDeleteTime={handleDeleteAvailableTime}
                />
              }
            />
            <Route
              path="/app/request"
              element={
                <RequestPage
                  currentUser={currentUser}
                  users={users}
                  availableTimes={availableTimes}
                  meetingRequests={meetingRequests}
                  statuses={statuses}
                  onLogout={handleLogout}
                  onRequestMeeting={handleRequestMeeting}
                  onAcceptRequest={handleAcceptRequest}
                  onDenyRequest={handleDenyRequest}
                />
              }
            />
            <Route path="/" element={<Navigate to="/app/my-meetings" />} />
            <Route path="*" element={<Navigate to="/app/my-meetings" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
