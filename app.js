	var express = require('express'); 
    var app = express(); 
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var convertExcel = require('excel-as-json').processFile

    app.use(bodyParser.json());  

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });

    var upload = multer({ //multer settings
                    storage: storage,
                    fileFilter : function(req, file, callback) { //file filter
                        if (['xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                            return callback(new Error('Wrong extension type'));
                        }
                        callback(null, true);
                    }
                }).single('file');

    app.post('/upload', function(req, res) {
        var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
        
            console.log(req.file.path);
            try {
               convertExcel(req.file.path,"uploads/a.json", {isColOriented: true}, (err, data)=>{
                if (err){
                console.log(err);
                }
               });
   
            } catch (e){
               console.log(e);
            }
        })
       
    });
	
	app.get('/',function(req,res){
		res.sendFile(__dirname + "/index.html");
	});

    app.listen('3000', function(){
        console.log('running on 3000...');
    });