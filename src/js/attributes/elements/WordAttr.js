/**
 * ==================================================================================
 * Holds all Word attributes
 *
 * ==================================================================================
 **/



class WordAttr {

    constructor() {
        this.font = 'Permanent Marker';
        this.fontSize = 50;

        this.animDuration = 800;
    }


    /**
     * ==================================================================================
     * @Methods
     * ==================================================================================
     **/

     init() {
        //
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
        return (size ? size : this.fontSize) * 0.35;
    }
}



export const WORDATTR = new WordAttr();
export default WORDATTR;