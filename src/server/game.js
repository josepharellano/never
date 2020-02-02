const Server = require('./server');
const EventQueue = require('../shared/eventQueue');
const Entity = require('../game/entity');
const Position = require('../game/position');
const Vector2D = require('../game/utils/vector2D');
const Constants = require('./constants');

const ECS = require( '../shared/ecs');


class Game {
    #entities = [];
    #sockets = [];
    #server;
    #lastUpdate;
    #ecs = new ECS();
    #eventQueue;
    
    constructor(){
        this.#server = new Server(1,3000,this);
        this.#eventQueue = new EventQueue();
    }
          

    Init(){
        this.#server.Init();
        // this.#server = new Server(1,3000,this);
        //Update every tick
        setInterval(this.update.bind(this), Constants.GAME_TICK);
    }

  

    Start(){
        this.#server.Start();
        this.#lastUpdate = Date.now();

    }

    update(){
        let currentTime = Date.now();
        let dt = currentTime - this.#lastUpdate;
        this.#lastUpdate = currentTime; 
        //Get last update time
        //Get current time
        //elaspe time = currentTime - lastUpdateTime
        //Update Simulation 
        //Catch the server up to gameworld time by scheduling next update to be elapseTime - tickRate
        //Start polling event queue with the lastUpdateTime
        this.pollEventQueue();

    }

    pollEventQueue(){
        //Poll Event Queue until empty or until events = lastUpdateTime
        let event;
        do{
            event = this.#eventQueue.poll();
        }while(event);
        
    }


}

module.exports = Game;