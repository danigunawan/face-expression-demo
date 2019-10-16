/**
 * ==================================================================================
 * Holds all Face Detection attributes
 *
 * ==================================================================================
 **/



class FaceDetectAttr {

    constructor() {
        this.minimizeClass = 'video--minimize';

        this.modelsUri = '/assets/models';
        this.detectionInterval = 500;
    }


    /**
     * ==================================================================================
     * @Methods
     * ==================================================================================
     **/

     init() {
        //
     }
}



export const FACEDETECTATTR = new FaceDetectAttr();
export default FACEDETECTATTR;