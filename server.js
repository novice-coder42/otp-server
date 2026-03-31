const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let otpStore = {};
// Send OTP
const axios = require("axios");

app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[phone] = otp;
  console.log("OTP for", phone, "is", otp);
  try {
    const response = await axios.post(
      "https://api.msg91.com/api/v5/otp",
      {
        mobile: "91" + phone,
        template_id: "69ca501632e12bca8103d412"
      },
      {
        headers: {
          authkey: process.env.MSG91_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("MSG91 RESPONSE:", response.data);

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error("MSG91 ERROR:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || "Failed to send OTP"
    });
  }
});
/*const axios = require("axios");

app.post("/send-otp", async (req, res) => {

  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[phone] = otp;

  console.log("OTP for", phone, "is", otp);

  try {

    const response = await axios.post(
      "https://api.msg91.com/api/v5/otp",
      {
        mobile: "91" + phone,
        template_id: "69ca501632e12bca8103d412"
      },
      {
        headers: {
          "Content-Type": "application/json",
          authkey: process.env.MSG91_API_KEY
        }
      }
    );

    console.log("MSG91 RESPONSE:", response.data);

    res.json({ success: true });

  } catch (error) {
    console.error("MSG91 ERROR:", error.response?.data || error.message);
    res.json({ success: false });
  }

});*/


// Verify OTP
app.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const response = await axios.post(
      "https://api.msg91.com/api/v5/otp/verify",
      {
        mobile: "91" + phone,
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

    res.json({
      success: true,
      message: "OTP verified"
    });

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