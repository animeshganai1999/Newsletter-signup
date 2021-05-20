const express = require("express");
const bodyPerser = require('body-parser');
// const request = require('request');
const https = require("https");
const app = express();
app.use(bodyPerser.urlencoded({extended:true}));

//static folder
app.use(express.static("public")); // we need this to server our static folders

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
    var firstName = req.body.FirstName;
    var lastName = req.body.SecondName;
    var email = req.body.email;
    // console.log(firstName);
    // console.log(SecondName);
    // console.log(email);
    var data = {    // in this format you have to send the data to mailchimp
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url = "https://us1.api.mailchimp.com/3.0/lists/8d79ab0c46";
    const options = {
        method:"POST",
        auth:"animesh1:f823238b96771badf38552010213b1f9-us1"
    }
    const request = https.request(url,options,function(response){
        if(response.statusCode===200){    //statusCode = 200 means everything is OK
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})


app.post("/faliure",function(req,res){
    res.redirect("/");   //this method redirect our page from faliure to / (Home route)
})




app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000.");
})

