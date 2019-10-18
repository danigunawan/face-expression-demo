/**
 * ==================================================================================
 * Face element
 *
 * ==================================================================================
 **/

import { GLOBAL } from '../Global.js';
import { EVENTBUS } from '../EventBus.js';
import { LOGGER } from '../libs/Logger.js';

import { FACEATTR } from '../attributes/elements/FaceAttr.js';
import { GAMESTATE } from '../states/GameState.js';

import { Tween } from '../libs/Tween.js';
import Vector2 from '../libs/Vector2.js';
import Element from './Element.js';

export default class Face extends Element {

    constructor(canvas, context, position, type) {
        super();

    	this.canvas = canvas;
    	this.context = context;
    	this.position = position;
        this.type = type;


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
    	this.text = this.getTypeString();
        this.defaultColor = FACEATTR.defaultColor;
        this.activeColor = FACEATTR.activeColor;
        this.disableColor = FACEATTR.disableColor;

        this.currY = this.position.y;

        this.currFont = FACEATTR.fontSize;
        this.fontGoal = this.currFont * 1.5;

        this.currAlpha = 1;
        this.alphaGoal = 0;

        this.toggleDuration = FACEATTR.toggleDuration;

        this.active = false;
        this.enabled = true;
        this.toggled = false;

        /* Run resize function initially */
        this.onWindowResize();


    	this.bindEvents();


        this.moveUp();
    }

    /**
     * Overrided function from `Element`
     */
    setupCanvasVars() {
        this.textSize = this.getTextMeasurement();
        this.yGoal = -FACEATTR.getFontHeight() * 1.25;
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
     * Toggling of diff. states
     */
    enable(bool = true) { this.enabled = bool; }
    activate(bool = true) { this.active = bool; }
    toggle(bool = true) {
        this.toggled = bool;
        this.fadeOut();
    }

    /**
     * Start default animation
     */
    moveUp() {
        if(this.toggled) return;

        /* Update `y` axis */
        new Tween(this, {
                    currY: this.yGoal,
                },
                this.getSpeed(),
                Tween.linearTween
            );
    }

    /**
     * Start fade-out animation
     */
    fadeOut() {
        if(!this.toggled) return;

        /* Update font & opacity */
        new Tween(this, {
                    currFont: this.fontGoal,
                    currAlpha: this.alphaGoal
                },
                this.toggleDuration,
                Tween.easeOutQuad
            );
    }

    update() {
        //
    }


    /**
     * ==================================================================================
     * @Renderer
     * ==================================================================================
     **/

    /**
     * Draw face text
     */
    drawFace() {
        this.context.save();

        let color = this.getColor();


        /* Set attributes depending on state */
        if(this.toggled) {

            this.textSize = this.getTextMeasurement();
            this.context.globalAlpha = this.currAlpha;

        } else {

            /* Change opacity on disable */
            if(!this.enabled)
                this.context.globalAlpha = 0.1;
        }

        this.context.font = this.getCanvasFont();
        this.context.fillStyle = color;
        this.context.lineWidth = 10;
        this.context.shadowBlur = 15;
        this.context.shadowColor = color;

        this.context.translate(this.position.x - (this.textSize.width / 2), this.currY + FACEATTR.getFontHeight(this.currFont));
        this.context.fillText(this.text, 0, 0);


        this.context.restore();
    }

    draw() {
        this.drawFace();
    }


    log(message) {
        LOGGER.log("Face.js | " + message, GLOBAL.findLogLevel('elements'));
    }


    /**
     * ==================================================================================
     * @Getter/Setter
     * ==================================================================================
     **/

    /**
     * Get speed depending on current score
     * @return {Integer}
     */
    getSpeed() {
        let currScore = GAMESTATE.getCurrScore(),
            speed = 0;


        /* Set cap for minimum interval */
        speed = FACEATTR.moveDuration - (currScore / 2);
        if(speed < FACEATTR.minMoveDuration)
            speed = FACEATTR.minMoveDuration;

        return speed;
    }

    /**
     * Get text measurement on `canvas`
     * @return {Object}
     */
    getTextMeasurement() {
        let textSize = null;

        this.context.save();
        this.context.font = this.getCanvasFont();
        textSize = this.context.measureText(this.text);
        this.context.restore();


        return textSize;
    }

    /**
     * Get canvas font
     */
    getCanvasFont() {
        return "400 " + this.currFont + "px '" + FACEATTR.font + "'";
    }

    /**
     * Get color depending on state
     * @return {String}
     */
    getColor() {
        if(!this.enabled && !this.toggled)
            return this.disableColor;

        return this.active ? this.activeColor : this.defaultColor;
    }

    /**
     * Get type content string
     * @return {String}
     */
    getTypeString() {
        switch(this.type) {
            case 'neutral':     return "\uf11a";
            case 'happy':       return "\uf118";
            case 'surprised':   return "\uf5c2";
            case 'angry':       return "\uf556";
            // case 'sad':         return "\uf119";
            // case 'fearful':     return "???";
        }
    }


    /**
     * ==================================================================================
     * @Checker
     * ==================================================================================
     **/

    /**
     * Check if element is dead or enabled
     * @return {Boolean}
     */
    isDead() {
                /* If toggled and faded-out... */
        return (this.toggled && this.currAlpha == 0) ||
                /* ...out of bounds*/
                this.currY + FACEATTR.fontSize < 0;
    }




    /**
     * ==================================================================================
     * @DEVELOPMENT
     * ==================================================================================
     **/

    //
}
