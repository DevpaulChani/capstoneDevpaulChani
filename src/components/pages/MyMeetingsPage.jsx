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

  // Get accepted meetings for current user
  const myMeetings = meetingRequests.filter((req) => req.statusId === 2);

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
      <h1>My Meetings Page</h1>
      <nav>
        <button onClick={() => navigate("/app/my-meetings")}>
          My Meetings
        </button>
        <button onClick={() => navigate("/app/my-times")}>My Times</button>
        <button onClick={() => navigate("/app/request")}>Request</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <h2>Upcoming Meetings</h2>
      {myMeetings.length === 0 ? (
        <p>No scheduled meetings yet</p>
      ) : (
        <div>
          {myMeetings.map((meeting) => {
            const details = getMeetingDetails(meeting);
            return (
              <div
                key={meeting.id}
                style={{
                  border: "1px solid black",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <p>
                  You have a meeting at {details.time} with {details.otherUser}{" "}
                  ({details.role})
                </p>
                <button onClick={() => handleCancelMeeting(meeting.id)}>
                  Cancel Meeting
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
