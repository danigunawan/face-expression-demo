/**
 * ==================================================================================
 * Loading label element
 *
 * ==================================================================================
 **/

import { GLOBAL } from '../../Global.js';
import { EVENTBUS } from '../../EventBus.js';
import { LOGGER } from '../../libs/Logger.js';
import { UTILS } from '../../libs/Utils.js';

import { LOADINGLABELATTR } from '../../attributes/gui/LoadingLabelAttr.js';

import Label from './Label.js';

export default class LoadingLabel extends Label {

    constructor() {
        super(LOADINGLABELATTR.id);

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
        //
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

    //


    /**
     * ==================================================================================
     * @Renderer
     * ==================================================================================
     **/

    log(message) {
        LOGGER.log("LoadingLabel.js | " + message, GLOBAL.findLogLevel('elements'));
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