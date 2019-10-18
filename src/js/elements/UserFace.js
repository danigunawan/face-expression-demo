/**
 * ==================================================================================
 * Handles all User & Face Spawner interaction
 *
 * ==================================================================================
 **/

import { GLOBAL } from '../Global.js';
import { EVENTBUS } from '../EventBus.js';
import { LOGGER } from '../libs/Logger.js';

import { USERFACEATTR } from '../attributes/elements/UserFaceAttr.js';
import { FACEATTR } from '../attributes/elements/FaceAttr.js';
import { FACESPAWNERATTR } from '../attributes/elements/FaceSpawnerAttr.js';

import { GAMESTATE } from '../states/GameState.js';

import Math2 from '../libs/Math2.js';
import Vector2 from '../libs/Vector2.js';
import Element from './Element.js';


export default class UserFace extends Element {

    constructor(canvas, context, user, faceSpawner, wordSpawner) {
        super();

    	this.canvas = canvas;
    	this.context = context;
    	this.user = user;
        this.faceSpawner = faceSpawner;
        this.wordSpawner = wordSpawner;


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
        this.bounderyColor = USERFACEATTR.bounderyColor;
        this.bounderyWidth = USERFACEATTR.bounderyWidth;

        this.currActive = null;

    	this.bindEvents();
    }

    /**
     * Overrided function from `Element`
     */
    setupCanvasVars() {
        this.spawnCoords = FACESPAWNERATTR.getSpawnCoordinates(this.canvas, FACEATTR.fontSize / 2);
        this.topBoundery = Math2.percentOf(this.canvas.height, USERFACEATTR.hitBoundery);
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
     * Toggle `Face` element as a match to the current expression
     * @param  {Face} face
     */
    matched(face) {
        /* Calculate point base on distance */
        let point = this.getMatchedPoint(face);

        /* Toggle and add label to `Face` element */
        face.enable(false);
        face.toggle();
        switch(point.text) {
            case 'perfect': this.perfect(face); break;
            case 'good':    this.good(face);    break;
            case 'bad':     this.bad(face);     break;
        }

        /* Update active `Face` element */
        this.updateActive();


        /* Add score */
        EVENTBUS.emit('hasScored', point.score);
    }

    /**
     * Add in labels to `Face` element
     * @param  {Face} face
     */
    perfect(face) { this.addWord(face, USERFACEATTR.getPerfect()); }
    good(face) { this.addWord(face, USERFACEATTR.getGood()); }
    bad(face) { this.addWord(face, USERFACEATTR.getBad()); }
    miss(face) { this.addWord(face, USERFACEATTR.getMiss()); }

    /**
     * Spawn in `Word` on the specified `Face` element
     * @param  {Face} face
     * @param  {Text} text
     */
    addWord(face, text) {
        this.wordSpawner.spawn(new Vector2(face.position.x, face.currY), text);
    }


    /**
     * Update active element
     */
    updateActive() {
        for(var i = 0; i < this.faceSpawner.faces.length; i++) {
            let face = this.faceSpawner.faces[i];
            if(face.enabled)
                return this.currActive = face.activate();
        }

        return this.currActive = null;
    }


    update() {
        if(GAMESTATE.isPlaying()) {

            /* Handle interaction w/ the active `Face` elements */
            let hasActive = false;
            for(var i = 0; i < this.faceSpawner.faces.length; i++) {
                let face = this.faceSpawner.faces[i];

                /* Check if out-of-bounds already */
                if(face.enabled && this.isOutOfBounds(face)) {
                    face.enable(false);

                    /* Toggle as `miss` */
                    this.miss(face);
                }

                /* Check for current active */
                if(!hasActive && face.enabled) {
                    face.activate();

                    this.currActive = face;
                    hasActive = true;
                }
            }


            /* Check for expression match on the current active */
            if(this.currActive && this.isMatch(this.currActive)) {
                this.matched(this.currActive);
            }
        }
    }


    /**
     * ==================================================================================
     * @Renderer
     * ==================================================================================
     **/

    /**
     * Draw play line boundery
     */
    drawBoundery() {
        this.context.save();


        this.context.strokeStyle = this.bounderyColor;
        this.context.lineWidth = this.bounderyWidth;
        this.context.lineWidth = 10;
        this.context.shadowBlur = 15;
        this.context.shadowColor = this.bounderyColor;

        this.context.beginPath();
        this.context.moveTo(this.spawnCoords.min, this.topBoundery);
        this.context.lineTo(this.spawnCoords.max, this.topBoundery);
        this.context.stroke();


        this.context.restore();
    }

    draw() {
        if(GAMESTATE.isPlaying()) {
            this.drawBoundery();
        }
    }


    log(message) {
        LOGGER.log("UserFace.js | " + message, GLOBAL.findLogLevel('elements'));
    }


    /**
     * ==================================================================================
     * @Getter/Setter
     * ==================================================================================
     **/

    /**
     * Calculate points base on `Face` distance from the stage boundery
     * @param  {Face} face
     * @return {Int}
     */
    getMatchedPoint(face) {
        let faceTop = face.position.y - FACEATTR.getFontHeight(),
            label, score;

        /* Perfect if doesn't even collide w/ the boundery stage... */
        if(faceTop > this.topBoundery) {
            return USERFACEATTR.getPerfect();
        /* ...Bad if its in collision w/ the stage already */
        } else {
            return USERFACEATTR.getBad();
        }
    }


    /**
     * ==================================================================================
     * @Checker
     * ==================================================================================
     **/

    /**
     * Check if expression matches the active `Face`
     * @param  {Face}    face
     * @return {Boolean}
     */
    isMatch(face) {
        if(this.user.isExpression(face.type))
            return true;

        return false;
    }

    /**
     * Check if `Face` is out of the playing area
     * @param  {Face}       face
     * @return {Boolean}
     */
    isOutOfBounds(face) {
        if(face.currY + (FACEATTR.getFontHeight() / 2) < this.topBoundery)
            return true;

        return false;
    }




    /**
     * ==================================================================================
     * @DEVELOPMENT
     * ==================================================================================
     **/

    //
}
