/**
 * ==================================================================================
 * Face element spawner
 *
 * ==================================================================================
 **/

import { GLOBAL } from '../Global.js';
import { EVENTBUS } from '../EventBus.js';
import { LOGGER } from '../libs/Logger.js';
import { UTILS } from '../libs/Utils.js';

import { FACESPAWNERATTR } from '../attributes/elements/FaceSpawnerAttr.js';
import { FACEATTR } from '../attributes/elements/FaceAttr.js';
import { USERATTR } from '../attributes/elements/UserAttr.js';
import { GAMESTATE } from '../states/GameState.js';

import Math2 from '../libs/Math2.js';
import Vector2 from '../libs/Vector2.js';

import Face from './Face.js';
import Element from './Element.js';

export default class FaceSpawner extends Element {

    constructor(canvas, context) {
        super();

    	this.canvas = canvas;
    	this.context = context;


    	this.init();
    }


    /**
     * ==================================================================================
     * @Methods
     * ==================================================================================
     **/

    /**
     * Initial setup
     */
    init() {
    	this.faces = [];
        this.faceTypes = this.setSpawnTypes(USERATTR.getExpressions());
        this.lastSpawnType = null;

        this.delta = 0;
        this.interval = 0;


    	this.bindEvents();
    }

    /**
     * Overrided function from `Element`
     */
    setupCanvasVars() {
        this.spawnCoords = FACESPAWNERATTR.getSpawnCoordinates(this.canvas);
    }


    /**
     * Create `Face` element
     */
    createFace() {
        let face = new Face(this.canvas, this.context, this.getSpawnLocation(), this.getSpawnType());
        this.faces.push(face);
    }


    /**
     * ==================================================================================
     * @Events
     * ==================================================================================
     **/

    bindEvents() {
    	EVENTBUS.register('onStartGame', () => { this.enable(); });
        EVENTBUS.register('onPauseGame', () => { this.enable(false); });
        EVENTBUS.register('onEndGame', () => { this.enable(false); });
    }


    /**
     * ==================================================================================
     * @Controller
     * ==================================================================================
     **/

    /**
     * Enable/Disable the `spawner`
     * @param {boolean} bool
     */
    enable(bool = true) {
        this.createFace();

        EVENTBUS.emit('onSpawnEnable', bool);
    }

    /**
     * Spawn a `Face` element
     */
    spawn(delta) {
        let spawn = false;

        /* If no `Faces` remain */
        if(this.faces.length == 0)
            spawn = true;

        /* If spawn timer reaches the required time */
        this.delta += delta;
        this.interval = this.getSpawnInterval();
        if(this.delta > this.interval)
            spawn = true;


        /* Spawn if conditions are met */
        if(spawn) {
            this.createFace();

            this.delta = 0;
        }
    }


    update(delta) {
        if(GAMESTATE.isPlaying()) {

            /* Update or remove dead `Face` elements */
            for(var i = 0; i < this.faces.length; i++) {
                let face = this.faces[i];
                if(face.isDead()) {
                    this.faces.splice(i, 1);
                } else {
                    face.update();
                }
            }


            if(GAMESTATE.isSpawning)
                this.spawn(delta);
        }
    }


    /**
     * ==================================================================================
     * @Renderer
     * ==================================================================================
     **/

    draw() {
        if(GAMESTATE.isPlaying()) {
            UTILS.runCollection(this.faces, 'draw');
        }
    }


    log(message) {
        LOGGER.log("FaceSpawner.js | " + message, GLOBAL.findLogLevel('elements'));
    }


    /**
     * ==================================================================================
     * @Getter/Setter
     * ==================================================================================
     **/

    /**
     * Get spawn type
     * @return {Integer}
     */
    getSpawnType() {
        let type = null;
        while(!type || this.lastSpawnType == type) {
            type = this.faceTypes[Math2.randomInt(0, this.faceTypes.length)];
        }

        /* Update last spawn type */
        this.lastSpawnType = type;

        return type;
    }

    /**
     * Set spawn types
     * @param  {array} types
     * @return {Array}
     */
    setSpawnTypes(types) {
        let arr = [];
        for(var prop in types) {
            arr.push(prop);
        }

        return arr;
    }

    /**
     * Get spawn location
     * @return {Vector2}
     */
    getSpawnLocation() {
        return new Vector2(
                    Math2.randomInt(this.spawnCoords.min, this.spawnCoords.max, false),
                    this.spawnCoords.y,
                );
    }

    /**
     * Get spawn interval depending on the current score
     * @return {Integer}
     */
    getSpawnInterval() {
        let currScore = GAMESTATE.getCurrScore(),
            interval = 0;

        /* Set cap for minimum interval */
        interval = FACESPAWNERATTR.interval - (currScore);
        if(interval < FACESPAWNERATTR.minInterval)
            interval = FACESPAWNERATTR.minInterval;

        return interval;
    }


    /**
     * ==================================================================================
     * @Checker
     * ==================================================================================
     **/

    //




    /**
     * ==================================================================================
     * @DEVELOPMENT
     * ==================================================================================
     **/

    //
}
