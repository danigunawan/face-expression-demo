/**
 * ==================================================================================
 * Holds all Face  attributes
 *
 * ==================================================================================
 **/



class FaceAttr {

    constructor() {
        this.font = 'Font Awesome 5 Free';
        this.fontSize = 90;
        this.fontSpeed = 2.5;

        this.alphaSpeed = 0.05;

        this.posSpeed = 0.75;
        this.maxPosSpeed = 10;

        this.defaultColor = '#f6e58d';
        this.activeColor = '#f9ca24';
        this.disableColor = '#e74c3c';
    }


    /**
     * ==================================================================================
     * @Getter/Setter
     * ==================================================================================
     **/

    /**
     * Get font height
     * @param  {int} size
     * @return {Int}
     */
    getFontHeight(size = null) {
        return (size ? size : this.fontSize) * 0.5;
    }
}



export const FACEATTR = new FaceAttr();
export default FACEATTR;