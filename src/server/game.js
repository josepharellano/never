const Server = require('./server');
const EventSystem = require('../shared/eventQueue');
const EventScheduler = require('../shared/eventQueue');
const Entity = require('../game/entity');
const Position = require('../game/position');
const Vector2D = require('../game/utils/vector2D');
const Constants = require('./constants');
const Events = require('../shared/events');

const ECS = require( '../shared/ecs');

const util = require('util');


class Game {
    #entities = [];
    #sockets = [];
    #server;
    #lastUpdate;
    #simLag;
    #ecs = new ECS();
    #eventQueue = new EventSystem.EventQueue();
    #eventScheduler;
    
    constructor(){
        this.#server = new Server(1,3000,this);
        
       
        this.#eventScheduler = new EventSystem.EventScheduler(this.#eventQueue);

    }
          

    Init(){
        this.#server.Init();
        // this.#server = new Server(1,3000,this);

    }

  

    Start(){
        this.#server.Start();

        this.#lastUpdate = Date.now();
        this.#simLag = 0;
      
        let update = this.#eventScheduler.createEvent(Events.UpdateSimulation);
        update.data.timeStamp = this.#lastUpdate;
        this.#eventScheduler.schedule(update,Constants.GAME_TICK);
        this.pollEventQueue();
    }

    update(){
        console.log("UPDATE SIM");
        let currentTime = Date.now();
        let dt = currentTime - this.#lastUpdate;
        this.#lastUpdate = currentTime; 
        this.#simLag = this.#simLag + dt - 600;
        console.log(`DT= ${dt}`);
        console.log(`Sim LAG = ${this.#simLag}`);
        //Get last update time
        //Get current time
        //elaspe time = currentTime - lastUpdateTime
        //Update Simulation 
        //Catch the server up to gameworld time by scheduling next update to be elapseTime - tickRate
        //Start polling event queue with the lastUpdateTime
 
        let update = this.#eventScheduler.createEvent(Events.UpdateSimulation);
        update.data.timeStamp = this.#lastUpdate;

        let timer = 600 - this.#simLag;

        this.#eventScheduler.schedule(update, timer > 0 ? timer : 0);
    }

    pollEventQueue(){
        //Poll Event Queue until empty or until events = lastUpdateTime
        let event;
        do{
            event = this.#eventQueue.poll(this.#lastUpdate);
            if(event){
                if(event.name === "UPDATE_SIMULATION"){
                    this.update();
                }

                if(event.name === "ADD_PLAYER_TO_WORLD"){

                }
            }

        
            
        }while(event); 

        //Setup up polling to occur.
        setTimeout(()=> this.pollEventQueue(),300);
    }


}

module.exports = Game;