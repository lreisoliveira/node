// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

process.title = 'websocket';

var config       = require('./config/config'),
    EventEmitter = require('events').EventEmitter,
    // emitter      = new EventEmitter(),
    http         = require('http'),
    server       = http.createServer(),
    fs           = require('fs'),
    chokidar     = require('chokidar'),
    log          = console.log.bind(console),
    history      = [ ],
    clients      = [ ],
    websocket    = require('./modulos/websocket')(config, server),
    Mysql        = require('./modulos/mysql'),
    dados;       

var mysql        = new Mysql(config);    

mysql.on('connect', function() {
    log('Conectado ao mysql');
});

// mysql.on('narracoes', function(rows)
// {
//     // id           = rows[0].id;
//     // nome         = rows[0].nome;
//     // data_criacao = rows[0].data_criacao;
//     // status       = rows[0].status;
//     // return rows[0];

// });

mysql.on('error', function(err)
{
    log(err);
});

mysql.init();


// emitter.on('boot',function(){
//     console.log("hello world !");
// });

// emitter.emit('boot');

// chamado toda vez que alguma requisição ao servidor é realizada
server.on('request', function(request, response) {

    log((new Date()) + ' HTTP server. URL' + request.url + ' requested.');

    if (request.url === '/status') {
        response.writeHead(200, {'Content-Type': 'application/json'});
        var responseObject = {
            currentClients: clients.length,
            totalHistory: history.length
        }
        response.end(JSON.stringify(responseObject));
     } 
});

// define a porta para listen
server.listen(config.websocket.porta, function() {
    log((new Date()) + " server is listening on port " + config.websocket.porta);
});

// chamado toda vez que alguma conexão ao websocket é realizada
websocket.on('request', function(request) {
    
    log((new Date()) + ' connection from origin ' + request.origin + '.');

    var connection  = request.accept(null, request.origin),
        index       = clients.push(connection) - 1, 
        obj, 
        evento_id, 
        file_json, 
        resposta;

    if (history.length > 0) {
        connection.sendUTF(JSON.stringify( { type: 'history', data: history} ));
    }

    // usuário envia alguma mensagem
    connection.on('message', function(message) {

        evento_id   = message.utf8Data;
        
        log('Recebi evento', evento_id);

        /////////////////////////////////////////////////////////////////////////////////
        // BANCO DE DADOS MYSQL   
        /////////////////////////////////////////////////////////////////////////////////

        var resultado;
        var string_json;
        
        setInterval(function(){         

            resultado = mysql.narracoes(); 

            if (typeof resultado != 'undefined') {
                string_json = { mensagem: {id: resultado.id, nome: resultado.nome, data_criacao: resultado.data_criacao, status: resultado.status} };
                connection.sendUTF(JSON.stringify({ mensagem: resultado }));                
            }

        }, 3000);
        
        file_json   = config.json.path + evento_id + '.json'  
        
        /////////////////////////////////////////////////////////////////////////////////
        // ARQUIVO
        /////////////////////////////////////////////////////////////////////////////////

        var watcher = chokidar.watch(file_json, {
          ignored: /[\/\\]\./, persistent: true
        });

        // esperando por alterações no arquivo json
        watcher.on('change', function(path) { 
            
            setTimeout(function() { 
                fs.readFile(file_json, 'utf8', function (err, data) {
                    if (err) throw err;
                    obj = JSON.parse(data);
                });  
                setTimeout(function(){ 
                    connection.sendUTF(JSON.stringify({ mensagem: obj }));
                },1000);
            }, 1000);
        });
    
    });

    // usuário desconectado
    connection.on('close', function(connection) {
        clients.splice(index, 1);
    });

});