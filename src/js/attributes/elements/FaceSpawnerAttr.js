/**
 * ==================================================================================
 * Holds all Face Spawner attributes
 *
 * ==================================================================================
 **/


import { FACEATTR } from './FaceAttr.js';

import Math2 from '../../libs/Math2.js';


class FaceSpawnerAttr {

    constructor() {
        this.interval = 7000;
        this.minInterval = 1500;

        this.margin = 20;
    }


    /**
     * ==================================================================================
     * @Getter/Setter
     * ==================================================================================
     **/

    /**
     * Get spawn min and max `X` coordinates
     * @param  {DOMElement} canvas
     * @param  {int}        offset
     * @return {Object}
     */
    getSpawnCoordinates(canvas, offset = 0) {
        let margin = Math2.percentOf(canvas.width, this.margin),
            max = canvas.width - margin,
            min = margin;

        return {
            min: min - offset,
            max: max + offset,
            y: canvas.height + FACEATTR.getFontHeight()
        };
    }
}



export const FACESPAWNERATTR = new FaceSpawnerAttr();
export default FACESPAWNERATTR;