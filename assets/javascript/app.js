  // my firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyCtAYMOPHAro4wU5JOdw_TMLZhXsCAS27o",
    authDomain: "train-scheduler-f288b.firebaseapp.com",
    databaseURL: "https://train-scheduler-f288b.firebaseio.com",
    projectId: "train-scheduler-f288b",
    storageBucket: "train-scheduler-f288b.appspot.com",
    messagingSenderId: "404450226162",
    appId: "1:404450226162:web:218c0f55f9fc0d1368c56b",
    measurementId: "G-TW5LD3LV89"
  };
  
  // initialize
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();

  // button for adding train
  $("#add-train-btn").on("click", function(event) {
      event.preventDefault();

      // grab imput
      var trainName = $("#train-name").val().trim();
      var trainDestination = $("#destination").val().trim();
      var firstTrain = $("#first-train").val().trim();
      var trainFrequency = $("#frequency").val().trim();

      // temp var for holding
      var newTrain = {
          train : trainName,
          where : trainDestination,
          when: firstTrain,
          frequency: trainFrequency
      };

      // adds train info to database
      database.ref().push(newTrain);

      // Logs everything to the console
      console.log(newTrain.train);
      console.log(newTrain.where);
      console.log(newTrain.when);
      console.log(newTrain.frequency);

      alert("Train successfully added");

      // clear boxes
      $("#train-name").val("");
      $("#destination").val("");
      $("#first-train").val("");
      $("#frequency").val("");
  });

  // fire bass for adding schedule to db and adding row in html
  database.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val());

      // turn everything into variables
      var trainName = childSnapshot.val().train;
      var trainDestination = childSnapshot.val().where;
      var firstTrain = childSnapshot.val().when;
      var trainFrequency = childSnapshot.val().frequency;

      // train info
      console.log(trainName);
      console.log(trainDestination);
      console.log(firstTrain);
      console.log(trainFrequency);

      
      // time till next arrival
      // use time of first train and train frequency / also current time
      // put in military time
      var convertedTime = moment(firstTrain, "HH:mm").subtract(1, "years");
      console.log(convertedTime);

      var diffTime = moment().diff(moment(convertedTime), "minutes");  
      console.log("Difference in time: " + diffTime);

      var tRemainder = diffTime % trainFrequency;
      console.log(tRemainder);

      // minutes till next train from now
      // use next arrival with current time
      var now = moment();
      var minutesAway = trainFrequency - tRemainder;

      // next arrival
      var nextArrival = moment().add(minutesAway, "minutes");
      console.log("Arrival Time: " + moment(nextArrival).format("HH:mm"));

      // create new row
      var newRow = $("<tr>").append(
          $("<td>").text(trainName),
          $("<td>").text(trainDestination),
          $("<td>").text(trainFrequency),
          $("<td>").text(nextArrival.format("HH:mm")),
          $("<td>").text(minutesAway)
      );

      //Append the new row to the table
      $("#train-schedule-table > tbody").append(newRow);
  });