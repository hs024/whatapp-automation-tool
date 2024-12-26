import React, { useState, useEffect } from "react";
import axios from "axios";

const BulkMessageSender = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [numbersList, setNumbersList] = useState([]);
  const [message, setMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [messages, setMessages] = useState([]);

  // Fetch scheduled messages
  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/messages");
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Add phone number to the list
  const addNumber = () => {
    if (phoneNumber.startsWith("+") && phoneNumber.length >= 11) {
      setNumbersList((prevList) => [...prevList, phoneNumber]);
      setPhoneNumber("");
    } else {
      alert(
        "Invalid phone number format. Use E.164 format, e.g., +1234567890."
      );
    }
  };

  // Remove a number from the list
  const removeNumber = (index) => {
    setNumbersList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // Send message to all numbers
  const sendMessageToAll = async () => {
    if (!message) {
      alert("Please enter a message.");
      return;
    }

    if (numbersList.length === 0) {
      alert("Please add at least one phone number.");
      return;
    }

    if (!scheduledDate) {
      alert("Please select a scheduled date and time.");
      return;
    }

    try {
      for (const number of numbersList) {
        await axios.post("http://localhost:5000/schedule", {
          phoneNumber: number,
          message: message,
          scheduledTime: new Date(scheduledDate).toISOString(),
        });
      }
      alert("Message scheduled for all numbers!");
      setMessage("");
      setNumbersList([]);
      setScheduledDate("");
      fetchMessages(); // Refresh scheduled messages
    } catch (error) {
      console.error("Error scheduling messages:", error);
      alert("Failed to schedule messages.");
    }
  };

  // Delete a scheduled message
  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/messages/${id}`);
      alert("Message deleted!");
      fetchMessages(); // Refresh scheduled messages
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete the message.");
    }
  };

  return (
    <div className="form-container" id="home">
      <h1>WhatsApp Automation Tool</h1>
      <h2>Bulk Message Sender</h2>

      <div className="input-group">
        <input
          type="text"
          placeholder="Phone Number (e.g., +1234567890)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button onClick={addNumber}>Add Number</button>
      </div>

      <ul className="numbers-list">
        {numbersList.map((number, index) => (
          <li key={index}>
            {number} <button onClick={() => removeNumber(index)}>Remove</button>
          </li>
        ))}
      </ul>

      <textarea
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="schedule-group">
        <label>
          Scheduled Date and Time:
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
        </label>
      </div>

      <button className="send-button" onClick={sendMessageToAll}>
        Send Message to All
      </button>
    </div>
  );
};

export default BulkMessageSender;
