var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');


var jwt = require('jsonwebtoken');
var user = require('./models/user');

//Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));
var apiRoutes = express.Router();

apiRoutes.post('/', function (req, res) {

    if (req.body.UserName != "tadriano" || req.body.PassWord != "102030") {
        res.json({ success: false, message: 'Usuário ou senha incorreto(s)!' });

    } else {

        let usuario = new user()
        { 
           name : "tadriano";
           admin: true
        }; 

        var token = jwt.sign(usuario, 'batman batman batman', {
            expiresInMinutes: 1440
        });
     
        res.json({
            success: true,
            message: 'Token criado!!!',
            toke: token
        });
    }


});


apiRoutes.use(function(req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, 'batman batman batman', function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Falha ao tentar autenticar o token!' });    
            } else {
            //se tudo correr bem, salver a requisição para o uso em outras rotas
            req.decoded = decoded;    
            next();
            }
        });

        } else {
        // se não tiver o token, retornar o erro 403
        return res.status(403).send({ 
            success: false, 
            message: '403 - Forbidden' 
        });       
    }
});


apiRoutes.get('/', function (req, res) {
    res.json({ message: 'Node.js com JWT' });
});

app.use('/', apiRoutes);

var port = process.env.PORT || 8000;
app.listen(port);
console.log('Aplicação rodando na porta:' + port);