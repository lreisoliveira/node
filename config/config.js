var config              = {};

config.websocket        = {};
config.json             = {};

config.websocket.porta  = 1337;
config.json.path        = '/var/www/json/';

config.ws               =  {
  maxReceivedFrameSize:     0x10000,
  maxReceivedMessageSize:   0x100000,
  fragmentOutgoingMessages: true,
  fragmentationThreshold:   0x4000,
  keepalive:                true,
  keepaliveInterval:        20000,
  assembleFragments:        true,
  disableNagleAlgorithm:    true,
  closeTimeout:             500
};

config.mysql            =  {
  host:     'localhost',
  username: 'root',
  password: 'root'   ,
  database: 'eventos',
  port    : 3306,
  socketPath: '/var/run/mysqld/mysqld.sock'  
};


module.exports = config;