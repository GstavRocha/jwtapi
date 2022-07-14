
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

const http = require('http');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const {decode} = require("jsonwebtoken");
app.use(bodyParser.json());

app.get('/',(req,res,next) => {
    res.json({message: "Tudo está OK"})
});

app.get('/clientes', (req, res, next) => {
    res.json([{id:1,nome:'Gustavo'}]);
    console.log("Retornou todos clientes!");
})
const server = http.createServer(app);
server.listen(3000);
console.log("Servidor escutando porta 3000")

app.post('/login',( req, res, next) =>{
    if(req.body.user === 'Gustavo' && req.body.password === '1234'){
        const id = 1;
        const token = jwt.sign(jwt.sign({id},process.env.SECRET,{
            expiresIn: 300
        }))
        return res.json({auth: true, token: token});
    }
    res.status(500).json({message: 'Login Inválido'});
});
app.post('/logout',function (req, res){
    res.json({auth: false, token: null});
})

function verifyJWT( req, res, next){
    const token = req.headers['x-access-token'];
    if(!token) return res.status(401).json({ auth: false, message: 'No token provided'});


jwt.verify(token, process.env.SECRET, function (err, decoded){
    if(err) return res.status(500).json({auth: false, message: 'Autenticação falhou!'})
    req.userId = decoded.id;
    next();
});
app.get('/clientes', verifyJWT,( req, res, next)=>{
    console.log("Retornou todos os clientes");
    res.json([{id: 1, nome: 'Gustavo'}]);
}
)};
