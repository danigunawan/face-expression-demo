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

import { GAMESTATE } from '../states/GameState.js';

import Vector2 from '../libs/Vector2.js';
import Element from './Element.js';
import Word from './Word.js';

export default class WordSpawner extends Element {

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
    	this.words = [];


    	this.bindEvents();
    }


    /**
     * Create `Word` element
     * @param {Vector2} position
     * @param {string}  text
     */
    createWord(position, text) {
        let word = new Word(this.canvas, this.context, position, text);
        this.words.push(word);

        /* Run resize function initially */
        word.onWindowResize();
    }


    /**
     * ==================================================================================
     * @Events
     * ==================================================================================
     **/

    bindEvents() {
    	//
    }


    /**
     * ==================================================================================
     * @Controller
     * ==================================================================================
     **/

    /**
     * Spawn a `Word` element
     * @param {Vector2} position
     * @param {string}  text
     */
    spawn(position, text) {
        this.createWord(position, text);
    }


    update() {
        if(GAMESTATE.isPlaying()) {

            /* Update or remove dead `Word` elements */
            for(var i = 0; i < this.words.length; i++) {
                let word = this.words[i];
                if(word.isDead()) {
                    this.words.splice(i, 1);
                } else {
                    word.update();
                }
            }
        }
    }


    /**
     * ==================================================================================
     * @Renderer
     * ==================================================================================
     **/

    draw() {
        if(GAMESTATE.isPlaying()) {
            UTILS.runCollection(this.words, 'draw');
        }
    }


    log(message) {
        LOGGER.log("WordSpawner.js | " + message, GLOBAL.findLogLevel('elements'));
    }


    /**
     * ==================================================================================
     * @Getter/Setter
     * ==================================================================================
     **/

    //


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
