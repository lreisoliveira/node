var MysqlClient   = require('mysql'),
    EventEmitter  = require('events').EventEmitter,
    Connection;

function Mysql(config)
{

    if (!(this instanceof Mysql)) return new Mysql(config);

    EventEmitter.call(this);

    this.config    = config;
    this.connected = false;
    this.resultado;

};

Mysql.prototype = Object.create(EventEmitter.prototype);

Mysql.prototype.init = function() {

    var _this = this;

    Connection = MysqlClient.createConnection({
        host      : _this.config.mysql.host,
        user      : _this.config.mysql.username,
        password  : _this.config.mysql.password,
        database  : _this.config.mysql.database,
        port      : _this.config.mysql.port,
        socketPath: _this.config.mysql.socketPath 
    });

    Connection.on('error', _this.handleError);
    _this.connect();
}

Mysql.prototype.connect = function(){
    var _this = this;

    Connection.connect(function(err){
        if( err ){
            return _this.handleError(err);
        }
        _this.connected = true;
        _this.emit('connect');
    });
}

Mysql.prototype.handleError = function(err){   
    var _this = this;

    if( err.code === 'PROTOCOL_CONNECTION_LOST' ){
        _this.connected = false;

        // Re-initialize application
        Connection.removeListener('error', _this.handleError) // Remove error handler, in case if effects GC
        Connection = null; // Remove reference to Connection
        return _this.init(); // Create new Connection and reset Event Listener(s)
    }

    _this.emit('error', err);
}


Mysql.prototype.narracoes = function(data)
{   
    var _this = this;
    var resultado;
    
    // function getEventos(callback){
      var query = Connection.query('SELECT * FROM eventos', function(err, rows) {
        _this.resultado = rows[0];
        // if (err) 
        //     callback(null);
        // else
        //     callback(rows[0]);
        // if( err ) {
        //    return _this.handleError(err);
        // }
        // _this.emit('narracoes', rows);

      });
    // }
    // getEventos(function(data){
    //   resultado = data;
    // });
    return _this.resultado;
}

module.exports = Mysql;