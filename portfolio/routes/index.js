var express = require('express');


var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/project-list', function(req, res) {
  
   MongoClient.connect(MongoServerUrl, function(err, db) {
      if(err) {
        console.log('Unable to connect to the server ' + err);
      } else {
        console.log('connection established');
        
        var collection = db.collection('projects'); 
        
        collection.find({}).toArray(function(err, result) {
          console.log(result);

          if(err) {
            res.send(err);
          } else {
            res.render('projects/projectlist', {
              "projectlist" : result
            });
          }

          db.close();
        });
      }
   });
});


// Route to the page we can add projects
router.get('/project-entry', function(req, res){
  res.render('projects/project-entry', {title: 'Add Project' });
});


router.post('/project-create', function(req, res){

  // Connect to the server
  MongoClient.connect(MongoServerUrl, function(err, db){
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');

      // Get the documents collection
      var collection = db.collection('projects');

      // Get the project data passed from the form
      var project = {name: req.body.name, client: req.body.client,
        technologies: req.body.technologies, no_of_resource: req.body.no_of_resource, deveopment_time: req.body.deveopment_time, 
        project_description: req.body.project_description, demo_url: req.body.demo_url, screenshots_url: req.body.screenshots_url};

      // Insert the project data into the database
      collection.insert([project], function (err, result){
        console.log(result);
        if (err) {
          console.log(err);
        } else {
          var inserted_project_id = result.insertedIds;
          var sampleFile = req.files.thumb;
          sampleFile.mv('public/uploads/project-thumb/' + req.body.name + '.jpg', function(err) {
            if (err) {
              console.log(err);
              return res.status(500).send(err);
            } else {
                res.redirect("project-list");
            }
          });
        }
        
        // Close the database
        db.close();
      });
      
    }
  });

  return;

  // Connect to the server
  MongoClient.connect(MongoServerUrl, function(err, db){
    // "use strict";
    if (err) {
      console.log('Unable to connect to the Server:', err);
    } else {
      console.log('Connected to Server');

      // Get the documents collection
      var collection = db.collection('projects');

      // Get the project data passed from the form
      var project = {name: req.body.project_name, client: req.body.client,
        technologies: req.body.technologies, no_of_resource: req.body.no_of_resource, project_time: req.body.project_time};

      // Insert the project data into the database
      collection.insert([project], function (err, result){
        if (err) {
          console.log(err);
        } else {
          // Redirect to the updated project list
          res.redirect("project-list");
        }
        // Close the database
        db.close();
      });
      // console.log(req.body);
      // return;
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      var sampleFile = req.files.project_thumb;
      // Use the mv() method to place the file somewhere on your server
      sampleFile.mv('/public/uploads/filename.jpg', function(err) {
        if (err)
          return res.status(500).send(err);
    
        res.send('File uploaded!');
      });

    }
  });

});

router.get('/test-mail',  function(req, res) {

  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    // host: 'smtp.gmail.com',
    port: 465,
   // secure: true, // use SSL
    auth: {
      user: 'paragnstu@gmail.com',
      pass: 'allahuakbar'
    }
  });
  
  var mailOptions = {
    from: 'paragnstu@gmail.com',
    to: 'joynal.abedin@sebpo.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      res.send("Mail Sent Failed");
      console.log("Errorses: "+ error);
    } else {
      res.send("Mail Sent");
      console.log('Email sent: ' + info.response);
    }
  }); 

});

module.exports = router;
