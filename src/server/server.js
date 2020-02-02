
const express = require('express');
const NetworkWorker = require('../shared/workers/networkWorker');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../../webpack.dev.js');

class Server {
    #id;
    #port;
    #expressServer = express();
    #gameServer;
    #networkWorker;
    #game;

    constructor(serverID, port,game){
        this.#id = serverID;
        this.#port = port; 
        this.#game = game;
    }

    Init(){
        //Set up Express Server
        this.#expressServer.use(express.static('public'));

            // const compiler = webpack(webpackConfig);
            // this.#expressServer.use(webpackDevMiddleware(compiler));
    }

    Start(){
        //Start listening for connections
        this.#gameServer = this.#expressServer.listen(this.#port);
        console.log(`Server Listening on port ${this.#port}`);
        
        this.#networkWorker = new NetworkWorker(this.#gameServer);

        

        
    }

    getId(){ return this.#id;}
    
}

module.exports = Server;
