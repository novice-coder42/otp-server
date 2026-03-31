const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const axios = require("axios");
// Send OTP
app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  try {
    const response = await axios.post(
      "https://api.msg91.com/api/v5/otp",
      {
        mobile: "91"+phone,
        template_id: "69ca5092246d47534e050aa2"
      },
      {
        headers: {
          authkey: process.env.MSG91_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("SEND OTP RESPONSE:", response.data);

    res.json({
      success: true,
      message: "OTP sent"
    });

  } catch (error) {
    console.error("SEND OTP ERROR:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "Failed to send OTP"
    });
  }
});


// Verify OTP
app.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const response = await axios.post(
      "https://api.msg91.com/api/v5/otp/verify",
      {
        mobile: "91"+phone,
        otp: otp
      },
      {
        headers: {
          authkey: process.env.MSG91_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("VERIFY RESPONSE:", response.data);

    if (response.data.type === "success") {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }

  } catch (error) {
    console.error("VERIFY ERROR:", error.response?.data || error.message);

    res.status(400).json({
      success: false,
      error: "Invalid OTP"
    });
  }
});


app.get("/", (req, res) => {
  res.send("OTP Server Running");
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});