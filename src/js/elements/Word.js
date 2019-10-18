/**
 * ==================================================================================
 * Word element
 *
 * ==================================================================================
 **/

import { GLOBAL } from '../Global.js';
import { EVENTBUS } from '../EventBus.js';
import { LOGGER } from '../libs/Logger.js';

import { WORDATTR } from '../attributes/elements/WordAttr.js';
import { FACEATTR } from '../attributes/elements/FaceAttr.js';

import { Tween } from '../libs/Tween.js';
import Math2 from '../libs/Math2.js';
import Vector2 from '../libs/Vector2.js';
import Element from './Element.js';

export default class Word extends Element {

    constructor(canvas, context, position, attribute) {
        super();

        this.canvas = canvas;
        this.context = context;
        this.position = position;
        this.attribute = attribute;


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
        this.currY = this.position.y;
        this.yGoal = this.currY - 75;

        this.alphaGoal = 0;
        this.currAlpha = 1;

        this.fontGoal = WORDATTR.fontSize;
        this.currFont = WORDATTR.fontSize * .6;

        this.animDuration = WORDATTR.animDuration;
        this.isAnimating = false;


    	this.bindEvents();


        this.fadeOut();
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
     * Start fade-out animation
     */
    fadeOut() {
        if(this.isAnimating) return;

        this.isAnimating = true;

        /* Animate properties */
        new Tween(this, {
                    currY: this.yGoal,
                    currFont: this.fontGoal,
                    currAlpha: this.alphaGoal
                },
                this.animDuration,
                Tween.linearTween,
                null,
                () => { this.isAnimating = false; }
            );
    }


    update() {
        if(this.isAnimating) return;
    }


    /**
     * ==================================================================================
     * @Renderer
     * ==================================================================================
     **/

    /**
     * Draw the text
     * @return {[type]} [description]
     */
    drawText() {
        this.context.save();

        this.context.globalAlpha = this.currAlpha;

        this.context.font = this.getCanvasFont();
        this.context.fillStyle = this.attribute.color;
        this.context.lineWidth = 10;
        this.context.shadowBlur = 15;
        this.context.shadowColor = this.attribute.color;

        let textSize = this.context.measureText(this.attribute.text);
        this.context.translate(this.position.x - (textSize.width / 2), this.currY + WORDATTR.getFontHeight());
        this.context.fillText(this.attribute.text.toUpperCase(), 0, 0);

        this.context.restore();
    }

    draw() {
        this.drawText();
    }


    log(message) {
        LOGGER.log("Word.js | " + message, GLOBAL.findLogLevel('elements'));
    }


    /**
     * ==================================================================================
     * @Getter/Setter
     * ==================================================================================
     **/

    /**
     * Get canvas font
     */
    getCanvasFont() {
        return "400 " + this.currFont + "px '" + WORDATTR.font + "'";
    }


    /**
     * ==================================================================================
     * @Checker
     * ==================================================================================
     **/

    /**
     * Checker if the element is not in used
     * @return {Boolean}
     */
    isDead() {
        return false;//this.currAlpha == 0;
    }



    /**
     * ==================================================================================
     * @DEVELOPMENT
     * ==================================================================================
     **/

    //
}
