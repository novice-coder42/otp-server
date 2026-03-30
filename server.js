const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let otpStore = {};

// Send OTP
app.post("/send-otp", (req, res) => {

  const { phone } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[phone] = otp;

  console.log("OTP for", phone, "is", otp);

  // SMS API will be added later

  res.json({ success: true });

});


// Verify OTP
app.post("/verify-otp", (req, res) => {

  const { phone, otp } = req.body;

  if (otpStore[phone] == otp) {

    delete otpStore[phone];

    res.json({ success: true });

  } else {

    res.json({ success: false });

  }

});


app.get("/", (req,res)=>{
  res.send("OTP Server Running");
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});