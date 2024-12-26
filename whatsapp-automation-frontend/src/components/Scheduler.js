import React, { useState, useEffect } from "react";
import axios from "axios";

const Scheduler = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [messages, setMessages] = useState([]);



 const deleteMessage = async (messageId) => {
   if (!messageId) {
     console.error("Message ID is undefined");
     return;
   }

   try {
     const response = await axios.delete(
       `http://localhost:5000/messages/${messageId}`
     );
     console.log("Message deleted:", response.data);

     // Update the UI
     setMessages((prevMessages) =>
       prevMessages.filter((msg) => msg._id !== messageId)
     );
   } catch (error) {
     console.error("Error deleting message:", error);
   }
 };


  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/messages");
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const scheduleMessage = async () => {
    try {
      const response = await axios.post("http://localhost:5000/schedule", {
        phoneNumber,
        message,
        scheduledTime,
      });
      alert("Message scheduled successfully!");
      setPhoneNumber("");
      setMessage("");
      setScheduledTime("");
      fetchMessages();
    } catch (error) {
      console.error("Error scheduling message:", error);
      alert("Failed to schedule message");
    }
  };

  return (
    <div className="personalize-container" id="features">
      <h2>Personalize WhatsApp Messaging</h2>
      <div className="personalize-form">
        <input
          type="text"
          placeholder="Phone Number (e.g., +1234567890)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
        />
        <button onClick={scheduleMessage}>Schedule Message</button>
      </div>
      <h2 id="schedule">Scheduled Messages</h2>
      <ul className="scheduled-messages">
        {messages.map((msg) => (
          <li key={msg._id}>
            <span className="message-details">
              {msg.phoneNumber} - {msg.message} -{" "}
              {new Date(msg.scheduledTime).toLocaleString()} - {msg.status}
            </span>
            <button
              className="delete-button"
              onClick={() => deleteMessage(msg._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scheduler;
