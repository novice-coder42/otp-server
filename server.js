const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let otpStore = {};

// Send OTP
/*app.post("/send-otp", (req, res) => {

  const { phone } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[phone] = otp;

  console.log("OTP for", phone, "is", otp);

  // SMS API will be added later

  res.json({ success: true });

});*/
app.post("/send-otp", async (req, res) => {

  const { phone } = req.body;

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