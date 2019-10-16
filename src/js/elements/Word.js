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
        this.ySpeed = this.getVertSpeed();
        this.currY = this.position.y;

        this.alphaSpeed = WORDATTR.alphaSpeed;
        this.alphaGoal = 0;
        this.currAlpha = 1;

        this.fontSpeed = WORDATTR.fontSpeed;
        this.fontGoal = WORDATTR.fontSize;
        this.currFont = 1;

    	this.bindEvents();
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
     * Update the font size
     */
    updateFont() {
        if(this.currFont < this.fontGoal)
            this.currFont += this.fontSpeed;
    }

    /**
     * Update the vertical position
     */
    updateVertical() {
        this.currY -= this.ySpeed;
    }

    /**
     * Update the opacity
     */
    updateAlpha() {
        if(this.currAlpha > 0) {
            let tmpAlpha = this.currAlpha - this.alphaSpeed;
            this.currAlpha = tmpAlpha < 0 ? 0 : tmpAlpha;
        }
    }

    update() {
        this.updateFont();
        this.updateVertical();
        this.updateAlpha();
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
     * Get vertical position speed
     * @return {Int}
     */
    getVertSpeed() {
        let speed = FACEATTR.posSpeed * 1.75;
        return speed <= WORDATTR.maxPosSpeed ? speed : WORDATTR.maxPosSpeed;
    }

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
        return this.currAlpha == 0;
    }



    /**
     * ==================================================================================
     * @DEVELOPMENT
     * ==================================================================================
     **/

    //
}
