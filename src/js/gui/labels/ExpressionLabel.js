/**
 * ==================================================================================
 * Face Expression label element
 *
 * ==================================================================================
 **/

import { GLOBAL } from '../../Global.js';
import { EVENTBUS } from '../../EventBus.js';
import { LOGGER } from '../../libs/Logger.js';
import { UTILS } from '../../libs/Utils.js';

import { EXPRESSIONLABELATTR } from '../../attributes/gui/ExpressionLabelAttr.js';

import Label from './Label.js';

export default class ExpressionLabel extends Label {

    constructor() {
        super(EXPRESSIONLABELATTR.id);

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
    	this.setupLabels();


    	this.bindEvents();
    }

   	/**
   	 * Setup labels
   	 */
    setupLabels() {
        this.icon = UTILS.getElementByClass(EXPRESSIONLABELATTR.iconClassName);
        this.label = UTILS.getElementByClass(EXPRESSIONLABELATTR.labelClassName);
    }


    /**
     * ==================================================================================
     * @Events
     * ==================================================================================
     **/

    bindEvents() {
        EVENTBUS.register('onDetecting', (value) => { this.onDetecting(value) });
    	EVENTBUS.register('onExpressionChange', (value) => { this.setExpressionIcon(value) });
    }

    /**
     * On face detection
     * @param {boolean} value
     */
    onDetecting(value) {
        if(value) {
            this.enable();
        } else {
            this.disable();
        }
    }


    /**
     * ==================================================================================
     * @Controller
     * ==================================================================================
     **/

    /**
     * Add enable or disable class to the panel
     */
    enable() {
        this.panel.classList.add(EXPRESSIONLABELATTR.detectedClass);
    }

    disable() {
        this.panel.classList.remove(EXPRESSIONLABELATTR.detectedClass);
    }

    /**
     * Remove all attached icon classes
     */
    removeIconClass() {
        let list = this.icon.classList;
        for(var i = 0; i < list.length; i++) {
            let c = list[i];
            if(c.indexOf(EXPRESSIONLABELATTR.iconClassPrefix) >= 0) {
                list.remove(c);
            }
        }
    }


    /**
     * ==================================================================================
     * @Renderer
     * ==================================================================================
     **/

    log(message) {
        LOGGER.log("ExpressionLabel.js | " + message, GLOBAL.findLogLevel('elements'));
    }


    /**
     * ==================================================================================
     * @Getter/Setter
     * ==================================================================================
     **/

    /**
     * Set expression
     * @param {string} expression
     */
    setExpressionIcon(expression) {
        this.removeIconClass();

        let icon = this.getExpressionIcon(expression);
        this.label.innerHTML = icon.expression;
        this.icon.classList.add(icon.icon);
    }

    /**
     * Get expression icon class name
     * @param  {string} expression
     * @return {String}
     */
    getExpressionIcon(expression) {
        let icon = null, exp = null;
        switch(expression) {
            case 'neutral':     icon = 'fa-meh';        break;
            case 'happy':       icon = 'fa-smile';      break;
            case 'surprised':   icon = 'fa-surprise';   break;
            case 'angry':       icon = 'fa-angry';      break;
            case 'sad':         icon = 'fa-frown';      break;
            case 'fearful':     icon = null;            break;

            case 'unknown': case 'question': default:
                icon = null;
                exp = '???';
            break;
        }

        return {
            expression: exp ? exp : expression,
            icon: icon ? icon : this.iconDefaultClass
        };
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