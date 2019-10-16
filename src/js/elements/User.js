/**
 * ==================================================================================
 * User element
 *
 * ==================================================================================
 **/

import { GLOBAL } from '../Global.js';
import { EVENTBUS } from '../EventBus.js';
import { LOGGER } from '../libs/Logger.js';

import { USERATTR } from '../attributes/elements/UserAttr.js';

import Element from './Element.js';

export default class User extends Element {

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
        this.reset();

    	this.bindEvents();
    }


    /**
     * ==================================================================================
     * @Events
     * ==================================================================================
     **/

    bindEvents() {
    	EVENTBUS.register('onFaceDetect', (value) => { this.onFaceDetect(value); });
    }

    /**
     * On face detection
     * @return {Detections} detection
     */
    onFaceDetect(detection) {
        if(detection) {
            this.setCoordinates(detection);
        } else {
            this.reset();
        }
    }


    /**
     * ==================================================================================
     * @Controller
     * ==================================================================================
     **/

    /**
     * Reset all coordinates
     */
    reset() {
        this.leftEyeBrow = [];
        this.rightEyeBrow = [];
        this.leftEye = [];
        this.rightEye = [];
        this.nose = [];
        this.mouth = [];
        this.jaw = [];

        this.expressions = USERATTR.getExpressions();
        this.currExpression = null;
    }


    update() {

    }


    /**
     * ==================================================================================
     * @Renderer
     * ==================================================================================
     **/

    draw() {

    }


    log(message) {
        LOGGER.log("User.js | " + message, GLOBAL.findLogLevel('elements'));
    }


    /**
     * ==================================================================================
     * @Getter/Setter
     * ==================================================================================
     **/

    /**
     * Set face coordinates
     * @param {Detection} detection
     */
    setCoordinates(detection) {
        /* Set expression */
        if(detection.expressions)
            this.setExpressions(detection.expressions);
    }

    /**
     * Set face expression values
     * @param {Expressions} expressions
     */
    setExpressions(expressions) {
        for(var prop in this.expressions) {
            if(Object.prototype.hasOwnProperty.call(expressions, prop)) {
                this.expressions[prop] = parseFloat(expressions[prop].toFixed(4));
            } else {
                this.expressions[prop] = 0;
            }
        }

        this.setCurrExpression();
    }

    /**
     * Set current expression
     * @param {string} expression
     */
    setCurrExpression(expression = null) {
        let exp = expression ? expression : this.getHighestExpression();
        if(exp == this.currExpression)
            return;

        this.currExpression = exp;

        EVENTBUS.emit('onExpressionChange', exp);
    }

    /**
     * Get current face expression
     * @return {String}
     */
    getHighestExpression() {
        let highest = 0,
            expression = null;

        for(var prop in this.expressions) {
            let value = this.expressions[prop];

            if(value > highest) {
                highest = value;
                expression = prop;
            }
        }

        return expression;
    }


    /**
     * ==================================================================================
     * @Checker
     * ==================================================================================
     **/

    /**
     * Checker for current expression
     * @param  {string}  expression
     * @return {Boolean}
     */
    isExpression(expression) {
        if(this.getHighestExpression() == expression)
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
