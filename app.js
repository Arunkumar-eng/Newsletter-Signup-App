const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require('https');

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log("First Name: " + firstName);
  console.log("Second Name: " + lastName);
  console.log("Email: " + email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us9.api.mailchimp.com/3.0/lists/43f8e225a5";

  const option = {
    method: "POST",
    auth: "arunkumar49r:a22e1575f51b316b1cda4b2dee27e9cc-us9"
  }

  const request = https.request(url, option, function (response) {
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});


app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
})

// API KEY:
// a22e1575f51b316b1cda4b2dee27e9cc-us9
// LIST ID:
// 43f8e225a5
