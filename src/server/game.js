const Server = require('./server');
const EventSystem = require('../shared/eventSystem');
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

    
    constructor(){
        this.#server = new Server(1,3000,this);
    }
          

    Init(){
        this.#server.Init();
        // this.#server = new Server(1,3000,this);

    }

  

    Start(){
        this.#server.Start();

        this.#lastUpdate = Date.now();
        this.#simLag = 0;
      
        let update = EventSystem.eventFactory(Events.UpdateSimulation);
        update.data.timeStamp = this.#lastUpdate;
        EventSystem.scheduleEvent(update,Constants.GAME_TICK);
        this.pollEventQueue();
    }

    update(){
        console.log("UPDATE SIM");
        let currentTime = Date.now();
        let dt = currentTime - this.#lastUpdate;
        this.#lastUpdate = currentTime; 
        //Tracks how far the simulation is behind the real world.
        this.#simLag = this.#simLag + dt - 600;
        // console.log(`DT= ${dt}`);
        // console.log(`Sim LAG = ${this.#simLag}`);
 
        let update = EventSystem.eventFactory(Events.UpdateSimulation, {timeStamp: this.#lastUpdate});
        //If Simulation is behind by a full game tick then instantly update sim again until caught up.
        EventSystem.scheduleEvent(update, this.#simLag > Constants.GAME_TICK ? 0 : Constants.GAME_TICK - this.#simLag);
    }

    pollEventQueue(){
        //Poll Event Queue until empty or until events = lastUpdateTime
        console.log("Polling");
        let event;
        do{
            event = EventSystem.poll(this.#lastUpdate);
           
            if(event){
                if(event.name === "UPDATE_SIMULATION"){
                    this.update();
                }

                if(event.name === "PLAYER_CONNECTED"){
                    this.handleAddPlayer(event.data)
                }
            }
         
        }while(event); 
        //Setup up polling to occur.
        setTimeout(()=> this.pollEventQueue(),300);
    }

    handleAddPlayer({socket}){
        console.log("hanldle Player");
    }


}

module.exports = Game;