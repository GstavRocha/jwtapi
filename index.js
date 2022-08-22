require("dotenv-safe").config();
const http = require('http');
const cors = require('cors')

const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

app.get('/',(req,res,next) => {
    res.json({message: "Tudo está OK"})
})
const verifyJWT = (req, res, next) =>{
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

        req.userId = decoded.id;
        next();
    });
}

app.get('/clientes',(req, res, next) => {
    console.log( "Retornou cliente ");
    res.json([{id:1,nome:'Aluno Exemplar'}]);
})
app.post('/login',( req, res) =>{
    if(req.body.user === 'Gustavo' && req.body.password === '123'){
        const id = 1;
        let token = jwt.sign({id},process.env.SECRET, {expiresIn: 300});
        return res.json({ auth: true, token: token});
    }
    res.status(500).json({message: 'Login Inválido'});
})

app.post('/logout',function (req, res){
    res.json({auth: false, token: null});
})

const server = http.createServer(app);
server.listen(3000);
console.log("Servidor escutando porta 3000")
