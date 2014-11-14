var http = require('http');
var https = require('https');
var express = require('express');
var mysql = require('mysql');
var fs = require('fs');

// connect to database
var client = mysql.createConnection({
	user: 'root',
	password: 'q1w2e3r4',
	database: 'project',
    insecureAuth: true
});


// make a web server
var app = express();
app.use(express.static('public'));
app.use(express.bodyParser());
app.use(app.router);


// daum api key
var daumLocalApiKey = '15e9a80af4b72b9101d4d985c737f7e1b6308416';
var daumMapApiKey = 'e0d5fc7d17aa2f5abb974f8c0aebec4ebf66cf40';


// google apis
//var google = require('googleapis');
////var drive = google.drive('v2');
//var OAuth2Client = google.auth.OAuth2;
//
//// client id and client secret are available at
//var CLIENT_ID = '88728940115.apps.googleusercontent.com';
//var CLIENT_SECRET = '8AL1KRaVBraWCr84-vNA85EA';
//var REDIRECT_URL = 'http://songdamkr1.cafe24.com/';
//
//var oauth2Client  = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
//var fs = require('fs');
//var drive = google.drive({ version: 'v2', auth: oauth2Client });
//
//app.get('/imageTest', function (request, response) {
//        drive.files.insert({
//                           resource: {
//                           title: 'testimage.png',
//                           mimeType: 'image/png'
//                           },
//                           media: {
//                           mimeType: 'image/png',
//                           body: fs.createReadStream('test.png') // read streams are awesome!
//                           }
//                                     },function(err, response) {
////                                     console.log('error:', err, 'updated:', response.id);
//                                     });
//        });
//



// brand
app.get('/brand', function(request, response){
        client.query('SELECT * FROM brand', function(error, data){
                     response.send(data);
                     });
        });

app.get('/admin/brand', function(request, response) {
        client.query('SELECT * FROM brand', function(error, data) {
                     response.send(data);
                     });
        });

app.get('/brand/:id', function(request, response){
        
        var id = Number(request.param('id'));
        
        client.query('SELECT * FROM brand WHERE id=?', [id], function(error, data){
                     response.send(data);
                     });
        
        });

app.post('/brand', function(request, response){
         
         var name = request.param('name');
         var image = request.files.uploadImage;
         var imageSavePath = "images\/logo\/" + name + ".png";
         var imagePath = "public\/" + imageSavePath;
         
         fs.readFile(image.path, function (error, data) {
                     
                     fs.writeFile(imagePath, data, function (err) {
                                  if (err) { throw err; }
                                  else { response.redirect("/hq.html"); }
                                  });
                     
                     });
         
         client.query('INSERT INTO brand (name, imageurl) VALUES(?, ?)', [name, imageSavePath], function(error, data){
                      });
         
         });

app.get('/admin/showItem?', function(request, response){
        
        var id = Number(request.param('id'));
        var show = Number(request.param('show'));

        console.log('request id :' + id + ' show : ' + show);
        client.query('UPDATE items SET clientShow=? WHERE id=?', [show, id], function(error, data){
                     response.send(data);
                     });
        
        });

app.put('/brand/:id', function(request, response){
        
        var id = Number(request.param('id'));
        var name = request.param('name');
        var imageurl = request.param('imageurl');
        var query = 'UPDATE brand SET';
        
        if (name) query += 'name="' + name + '" ';
        if (imageurl) query += 'imageurl"' + imageurl + '" ';
        query += 'WHERE id=' + id;
        
        client.query('query', function(error, data){
                     response.send(data);
                     });
        
        });

app.del('/brand/:id', function(request, response){
        
        var id = Number(request.param('id'));
        
        client.query('DELETE FROM brand WHERE id=?', [id], function(error, data){
                     response.send(data);
                     });
        
        });

app.get('/data.redirect?', function(request, response) {
        
        var lat = request.param('lat');
        var lon = request.param('lon');
        var name = request.param('name');
        
        var url = 'https://apis.daum.net/local/v1/search/keyword.xml?' + 'apikey=' + daumLocalApiKey + '&location=' + lat + ',' + lon + '&query=' + name;
        
        console.log(url);
        
        https.get(url, function (web) {
                 
                 web.on('data', function (buffer) {
                        response.write(buffer);
                        });
                 
                 web.on('end', function (buffer) {
                        response.end();
                        });
                 });
        
        });

// items
app.get('/items', function(request, response){
        client.query('SELECT * FROM items WHERE clientShow=1', function(error, data){
                     response.send(data);
                     });
        });

app.get('/admin/items', function(request, response){
        client.query('SELECT * FROM items', function(error, data){
                     console.log('admin brand items data : ' + data.length);
                     response.send(data);
                     });
        });

app.get('/admin/brandItems/:id', function(request, response){
        
        var id = Number(request.param('id'));
        
        client.query('SELECT I.* FROM items AS I, brand AS B WHERE I.brandId=? AND I.brandId=B.id', [id], function(error, data){
                     response.send(data);
                     });
        });

app.get('/items/:id', function(request, response){
        
        var id = Number(request.param('id'));
        
        client.query('SELECT * FROM items WHERE id=?', [id], function(error, data){
                     response.send(data);
                     });
        
        
        });

app.get('/brandItems/:id', function(request, response){
        
        var id = Number(request.param('id'));
        
        client.query('SELECT B.name AS brandName, I.* FROM items AS I, brand AS B WHERE I.brandId=? AND I.brandId=B.id', [id], function(error, data){
                     response.send(data);
                     });
        
        
        });

app.post('/item', function(request, response){
         
         console.log('hi');
         
         var brandId = Number(request.param('brandId'));
         console.log('brandId:'+brandId);
         
         var name = request.param('name');
         var subtitle = request.param('subtitle');
         var price = Number(request.param('price'));
         var detail = request.param('detail');
         
         var image = request.files.uploadImage;
         var imageSavePath = "images\/" + name + ".png";
         var imagePath = "public\/" + imageSavePath;
         
         fs.readFile(image.path, function (error, data) {
                     
                     fs.writeFile(imagePath, data, function (err) {
                                  if (err) { throw err; }
                                  else { response.redirect("/hq.html"); }
                                  });
                     
                     });
         
         client.query('INSERT INTO items (brandId, name, subtitle, price, detail, imageurl, clientShow) VALUES(?, ?, ?, ?, ?, ?, 0)', [brandId, name, subtitle, price, detail, imageSavePath], function(error, data){
                      response.send(data);
                      });
         
         });

app.put('/items/:id', function(request, response){
        
        var id = Number(request.param('id'));
        var brandId = request.param('brandId');
        var name = request.param('name');
        var subtitle = request.param('subtitle');
        var price = request.param('param');
        var detail = request.param('detail');
        var imageurl = request.param('imageurl');
        var query = 'UPDATE items SET';
        
        if (brandId) query += 'brandId=' + brandId + ' ';
        if (name) query += 'name="' + name + '" ';
        if (subtitle) query += 'subtitle="' + subtitle + '" ';
        if (price) query += 'price=' + price + ' ';
        if (detail) query += 'detail="' + detail + '" ';
        if (imageurl) query += 'imageurl="' + imageurl + '" ';
        query += 'WHERE id=' + id;
        
        client.query('query', function(error, data){
                     response.send(data);
                     });
        
        });

app.del('/items/:id', function(request, response){
        
        var id = Number(request.param('id'));
        
        client.query('DELETE FROM items WHERE id=?', [id], function(error, data){
                     response.send(data);
                     });
        
        });


// launch a web server
http.createServer(app).listen(52273, function(){
	console.log('Server Running at http://127.0.0.1:52273');
});
