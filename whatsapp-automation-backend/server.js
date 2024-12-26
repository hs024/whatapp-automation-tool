require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const schedule = require("node-schedule");
const twilio = require("twilio");

// Twilio Config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(accountSid, authToken);

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Message Schema
const messageSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  message: { type: String, required: true },
  scheduledTime: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Sent"], default: "Pending" },
});

const Message = mongoose.model("Message", messageSchema);

// Schedule a Message Endpoint
app.post("/schedule", async (req, res) => {
  const { phoneNumber, message, scheduledTime } = req.body;

  // Phone number validation (E.164 format)
  if (!/^\+\d{1,15}$/.test(phoneNumber)) {
    return res.status(400).json({
      message:
        "Invalid phone number format. Use E.164 format, e.g., +1234567890.",
    });
  }

  try {
    // Create new message in the database
    const newMessage = new Message({ phoneNumber, message, scheduledTime });
    await newMessage.save();

    // Schedule the job to send the message at the specified time
    schedule.scheduleJob(new Date(scheduledTime), async () => {
      try {
        // Sending the message via Twilio
        // message="From Himanshu to you :        "+message +"     Thank you"
        const sentMessage = await twilioClient.messages.create({
          from: `whatsapp:${twilioPhoneNumber}`,
          to: `whatsapp:${phoneNumber}`,
          body:message,
          
        });

        console.log(`Sent message SID: ${sentMessage.sid}`);
        newMessage.status = "Sent";
        await newMessage.save();
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    res
      .status(201)
      .json({ message: "Message scheduled successfully!", data: newMessage });
  } catch (error) {
    console.error("Error scheduling message:", error);
    res.status(500).json({ message: "Error scheduling message", error });
  }
});

// Get All Messages Endpoint
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json({ data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages", error });
  }
});

// Delete a Message Endpoint
app.delete("/messages/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Message ID is required" });
  }

  try {
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res
      .status(200)
      .json({ message: "Message deleted successfully", data: deletedMessage });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "Error deleting message", error });
  }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
