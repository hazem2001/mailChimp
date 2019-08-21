//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res)
{
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res)
{
  var user = {fName: req.body.firstName, lName: req.body.lastName, email: req.body.email};
  var options=
  {
    url: "https://us3.api.mailchimp.com/3.0/lists/83c0bed4ae",
    method: "POST",
    headers:
    {
      Authorization: "HazemSalem 0ef96fa9d2436ed8c5078a56d7dd62b9-us3"
    },
    body: JSON.stringify(
    {
      members:
      [{email_address: user.email,
        status: "subscribed",
        merge_fields:
        {
          FNAME: user.fName,
          LNAME: user.lName
        }
      }]
    }
      )
  };

  request(options, function(error, response, body)
  {
    if (error)
    {
      res.sendFile(__dirname + "/failure.html");
    }
    else if (response.statusCode !== 200)
    {
      res.sendFile(__dirname + "/failure.html");
    }
    else
    {
      res.sendFile(__dirname + "/successPage.html");
      console.log(response.statusCode);
    }
  });
});

app.post("/failure.html", function(req, res)
{
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function()
{
  console.log("Server is running");
});
