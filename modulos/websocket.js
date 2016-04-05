module.exports = function(config, server){

    var wsServerConfig =  {
        // All options *except* 'httpServer' are required when bypassing
        // WebSocketServer.
        maxReceivedFrameSize: config.ws.maxReceivedFrameSize,
        maxReceivedMessageSize: config.ws.maxReceivedMessageSize, 
        fragmentOutgoingMessages:  config.ws.fragmentOutgoingMessages,
        fragmentationThreshold: config.ws.fragmentationThreshold,
        keepalive: config.ws.keepalive,
        keepaliveInterval: config.ws.keepaliveInterval,
        assembleFragments: config.ws.assembleFragments,
        // autoAcceptConnections is not applicable when bypassing WebSocketServer
        // autoAcceptConnections: false,
        disableNagleAlgorithm: config.ws.disableNagleAlgorithm,
        closeTimeout: config.ws.closeTimeout,
        httpServer: server
    };

    var webSocketServer = require('websocket').server;
    return new webSocketServer(wsServerConfig);
};