//Get Images Names by Id / Color from MongoDB

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://db_usr:db_pass@ds023550.mlab.com:23550/db_ringapp2016_g');
var userSchema = require('./1_define_schema');
var size = 0;
var express = require('express'),
	url = require('url'),
	app = express();
var fs = require('fs');
var http = require('http');
var Upload = require('s3-uploader');
var restify = require('restify');

app.listen(process.env.PORT || 8080);

// connection error
mongoose.connection.once('error', function (err) {
	console.log('connectiob error' + err);
});

//connecting to DB
mongoose.connection.once('open', function () {
	console.log("============================");
	console.log("Connected Successfully to DB");
	console.log("============================");

	userSchema.find({}, function(err, user){
		if(err) throw err;
		//first route - call first get function from WS.
		app.get('/AllPictures' , 

			function (req, res) {
				console.log("DB: Get all Pictures");
				res.status(200).json(user[0].Name);
		});
	})

	//second route - call second function from WS (by Id).
	app.get('/PicById/:Id/:Size', function (req, res) { 
		userSchema.find({Id:req.params.Id} , function(err, user){
			if(err) throw err;
				console.log("DB: Get Pic by ID: "+req.params.Id+" from MongoDB");
				console.log("Name Pic: "+user[0].Name);
				console.log("Size Pic: "+req.params.Size);
				var temp = user[0].Name.split(".");
				var result = temp[0]+req.params.Size+"."+temp[1];
				console.log(result);
				res.send('<!DOCTYPE HTML><html><head></head><body><img src="https://s3-us-west-2.amazonaws.com/galshaharbucket/'+result+'"></body></html>');
				console.log("============================");
			})
	})

	//thired route - call thired get from WS (by Color).
	app.get('/PicByColor/:Color', function (req, res) { 
		userSchema.find({Color:req.params.Color}, function(err, user){
			if(err) throw err;
			var names = [];
				console.log("DB: Get Pic by Color: "+req.params.Color+" from MongoDB");	
				console.log("--------------------");
				for(var i = 0; i<user.length; ++i){
					var temp = user[i].Name.split(".");
					names [i] = temp[0]+"S."+temp[1];
					console.log("Name Pic: "+names [i]);
					console.log("--------------------");
				}
				var temp = [];
				for(var i = 0; i<user.length; ++i){
					temp [i] = '<img src="https://s3-us-west-2.amazonaws.com/galshaharbucket/'+names [i]+'">'
				}
				var result = temp.join("");
				res.send('<!DOCTYPE HTML><html><head></head><body>'+result+'</body></html>');
				console.log("============================");
			})
	})

	app.get('/GetAllPictures', function (req, res) { 
		userSchema.find({}, function(err, user){
			if(err) throw err;
			var names = [];
				console.log("DB: Get All Pictures from MongoDB");	
				for(var i = 0; i<user.length; ++i){
					var temp = user[i].Name.split(".");
					names [i] = temp[0]+"S."+temp[1];
				}
				var temp = [];
				for(var i = 0; i<user.length; ++i){
					temp [i] = '<img src="https://s3-us-west-2.amazonaws.com/galshaharbucket/'+names [i]+'">'
				}
				var result = temp.join("");
				res.send('<!DOCTYPE HTML><html><head></head><body>'+result+'</body></html>');
				console.log("============================");
			})
	})

 	// Upload an image
	app.get('/Upload/:Path', function (req, res) { 
		var knox = require('knox').createClient({
		    key: 'AKIAJ4ROKKJBECGFSYIA'
		  , secret: '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'
		  , bucket: 'galshaharbucket'
		});

		var file = req.params.Path;
			console.log(file);
		  	var upload_name = "upload_"+ file; // or whatever you want it to be called

			knox.putFile(file, upload_name, {
		         "Content-Type": "image/jpeg"
		     }, function (err, result) {
		         if (err != null) {
		             return console.log(err);
		         } else {
		             console.log("Uploaded to amazon S3");
		             console.log("--------------------");
		         }
		     });
	})

	
});


// The function that recieve the name from mongo and display it

function getImageById(){
	Input = document.getElementById("imageId");
	Size = document.getElementById("imageSize");
	size=Size.value;
	alert(size);

	if(Input.value==""){
		alert("Please Enter Id Number Between 1-33");
		return;
	}

		url = "https://s3-us-west-2.amazonaws.com/galshaharbucket/PicById/"+Input.value+"/"+Size.value;
		//url = 'https://s3-us-west-2.amazonaws.com/galshaharbucket/'+name;

		if(Size.value=="L"){
			popupWindow = window.open(
			url,'popUpWindow','height=658,width=1120,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
		}

		if(Size.value=="M"){
			popupWindow = window.open(
			url,'popUpWindow','height=525,width=820,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
		}

		if(Size.value=="S"){
			popupWindow = window.open(
			url,'popUpWindow','height=330,width=520,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
		}
}


function getImageByColor(str){
	Input = document.getElementById("imageColor");

	if(Input.value==""){
		alert("Please Enter a Color: red / green / blue / yellow");
		return;
	}
	else{
		path = "https://s3-us-west-2.amazonaws.com/galshaharbucket/PicByColor/"+Input.value;
		popupWindow = window.open(
		path,'popUpWindow','height=608,width=1020,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
	}
}

function uploadImage(){
		var fileChooser = document.getElementById('path');
		var results = document.getElementById('results');
		var file = fileChooser.files[0];
		alert(file.name);
		path = "https://s3-us-west-2.amazonaws.com/galshaharbucket/Upload/"+file.name+"";
		popupWindow = window.open(
		path,'popUpWindow','height=608,width=1020,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')
}

function getAllPics(){
		path = "https://s3-us-west-2.amazonaws.com/galshaharbucket/GetAllPictures";
    //galshaharbucket.s3-website-us-west-2.amazonaws.com
		popupWindow = window.open(
		path,'popUpWindow','height=608,width=1020,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes')

}
