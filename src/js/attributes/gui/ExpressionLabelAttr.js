/**
 * ==================================================================================
 * Holds all Face expression label attributes
 *
 * ==================================================================================
 **/



class ExpressionLabelAttr {

    constructor() {
        this.id = 'face-expression';
        this.iconClassName = 'face-expression__icon';
        this.labelClassName = 'face-expression__label';

        this.iconClassPrefix = 'fa-';
        this.iconDefaultClass = this.iconClassPrefix + 'question-circle';

        this.detectedClass = 'face-expression--detected';
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

    //
}



export const EXPRESSIONLABELATTR = new ExpressionLabelAttr();
export default EXPRESSIONLABELATTR;