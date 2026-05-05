import { useNavigate } from "react-router-dom";

export default function MyMeetingsPage({
  currentUser,
  meetingRequests,
  users,
  availableTimes,
  onLogout,
  onCancelMeeting,
}) {
  const navigate = useNavigate();

  if (!currentUser) return <div>Loading...</div>;

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  // Get accepted meetings for current user (either requester or requestee)
  const myMeetings = meetingRequests.filter(
    (req) =>
      req.statusId === 2 &&
      (req.requesterId === currentUser.id ||
        req.requesteeId === currentUser.id),
  );

  const getMeetingDetails = (meeting) => {
    const time = availableTimes.find((t) => t.id === meeting.proposedTimeId);
    const otherUserId =
      meeting.requesterId === currentUser.id
        ? meeting.requesteeId
        : meeting.requesterId;
    const otherUser = users.find((u) => u.id === otherUserId);
    const role =
      meeting.requesterId === currentUser.id ? "requested" : "received";

    return { time: time?.time, otherUser: otherUser?.userName, role };
  };

  const handleCancelMeeting = async (meetingId) => {
    await onCancelMeeting(meetingId);
  };

  return (
    <div>
      <div className="page-header">
        <h1>My Meetings</h1>
      </div>

      <nav className="page-nav">
        <button onClick={() => navigate("/app/my-meetings")}>
          My Meetings
        </button>
        <button onClick={() => navigate("/app/my-times")}>My Times</button>
        <button onClick={() => navigate("/app/request")}>Request</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <div className="meetings-container">
        <div className="meetings-header">
          <h2>Upcoming Meetings</h2>
        </div>

        {myMeetings.length === 0 ? (
          <div className="empty-state">
            <p>No scheduled meetings yet</p>
          </div>
        ) : (
          <div>
            {myMeetings.map((meeting) => {
              const details = getMeetingDetails(meeting);
              return (
                <div key={meeting.id} className="meeting-card">
                  <p>
                    You have a meeting at <strong>{details.time}</strong> with{" "}
                    <strong>{details.otherUser}</strong> ({details.role})
                  </p>
                  <button
                    onClick={() => handleCancelMeeting(meeting.id)}
                    className="danger"
                  >
                    Cancel Meeting
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
