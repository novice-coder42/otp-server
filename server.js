const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let otpStore = {};
// Send OTP
const axios = require('axios').default;

const options = {
  method: 'POST',
  url: 'https://control.msg91.com/api/v5/otp',
  params: {
    mobile: '918956505618',
    authkey: '504469AbVrc4TwXV69ca448bP1',
    template_id: '69ca501632e12bca8103d412'
  },
  headers: {'content-type': 'application/json', 'Content-Type': 'application/JSON'},
  data: '{\n  "Param1": "value1",\n  "Param2": "value2",\n  "Param3": "value3"\n}'
};

try {
  const { data } = await axios.request(options);
  console.log(data);
} catch (error) {
  console.error(error);
}
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