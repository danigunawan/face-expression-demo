/**
 * ==================================================================================
 * Face Detection element
 *
 * ==================================================================================
 **/

import { GLOBAL } from '../Global.js';
import { EVENTBUS } from '../EventBus.js';
import { LOGGER } from '../libs/Logger.js';

import { FACEDETECTATTR } from '../attributes/elements/FaceDetectAttr.js';
import { USERATTR } from '../attributes/elements/UserAttr.js';
import { GAMESTATE } from '../states/GameState.js';

export default class FaceDetect {

    constructor(video, body) {
    	this.video = video;
    	this.body = body;


        /**
         * @DEVELOPMENT: Disable face detection and add in keyboard detection
         * for testing purposes
         */
        if(GLOBAL.showKeyboard()) {

            this.bindDebugKeyboard();

        } else {

            this.init();
        }
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
        this.loading = false;

    	this.setupAssets();


        /* @DEVELOPMENT */
        this.hasDebugCanvas = false;
    }

	/**
     * Initialize all model assets used on `face-api. Will call the `setupStream` once
     * all models were loaded
     */
    setupAssets() {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(FACEDETECTATTR.modelsUri),
            faceapi.nets.faceExpressionNet.loadFromUri(FACEDETECTATTR.modelsUri)
        ]).then(() => {
            this.setupStream();
        });
    }

    /**
     * Initialize the camera to start streaming
     */
    setupStream() {
        /* Set `mediaDevices` as empty for older browsers who have no property of this yet */
        if(navigator.mediaDevices === undefined)
            navigator.mediaDevices = {};

        /* Check if `getUserMedia` function doesn't exist */
        if(navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function(constraints) {

                /* Throw error if `getUserMedia` is not found... */
                if(!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia)
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                /* ...return otherwise */
                return new Promise(function(resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            }
        }

        /* Run the native device camera */
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
        }).then((stream) => {

            /* Set stream to `video` element */
            if('srcObject' in this.video) {
                this.video.srcObject = stream;
            } else {
                this.video.src = window.URL.createObjectURL(stream);
            }

            /* Play on load */
            this.video.onloadedmetadata = () => {
                this.stream();
            };

        }).catch((error) => {
            console.log('We encountered an error trying to access your camera. Please allow the app permission to continue. ' + error);
        });
    }


    /**
     * ==================================================================================
     * @Events
     * ==================================================================================
     **/

    //


    /**
     * ==================================================================================
     * @Controller
     * ==================================================================================
     **/

	/**
     * Start `play` event on the `video` element
     */
    stream() {
        this.video.play();

        /* Bind events */
        this.video.addEventListener('play', () => {

            /* Run `Faceapi` detection method per set interval */
            setInterval(async () => {

                this.detect();

            }, FACEDETECTATTR.detectionInterval);
        });
    }

    /**
     * Detect face landmarks & expressions
     */
    detect() {
        if(this.loading) return;

        this.loading = true;

        faceapi.detectSingleFace(
            this.video,
            new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 })
        )
        .withFaceExpressions()
            .then((detections) => {

                /* DEVELOPMENT: Clear debug canvas */
                if(this.debugCanvas)
                    this.debugCanvas.getContext('2d').clearRect(0, 0, this.debugCanvas.width, this.debugCanvas.height);

                if(detections) {
                    this.setDetections(detections);
                } else {
                    if(GAMESTATE.isDetecting)
                        EVENTBUS.emit('onDetecting', false);
                }


                this.loading = false;


                if(!GAMESTATE.hasDetection)
                    EVENTBUS.emit('onHasDetection');

            }, (error) => {
                this.log('ERROR: ' + error);
            });
    }


    /**
     * ==================================================================================
     * @Renderer
     * ==================================================================================
     **/

    log(message) {
        LOGGER.log("FaceDetect.js | " + message, GLOBAL.findLogLevel('elements'));
    }


    /**
     * ==================================================================================
     * @Getter/Setter
     * ==================================================================================
     **/

    /**
     * Set detections
     * @param {Detections} detections
     */
    setDetections(detections) {
    	this.detections = detections;


        /* Emit events */
        EVENTBUS.emit('onFaceDetect', detections);

		if(!GAMESTATE.isDetecting)
	    	EVENTBUS.emit('onDetecting', true);


        /**
         * @DEVELOPMENT! Canvas for displaying the `Face-api` detections, landmarks,
         * and expressions.
         */

	    if(GLOBAL.showMarkers()) {
	        this.showFaceMarkers(detections);
	    }
    }

    /**
     * Get `video` current width & height
     * @return {Object}
     */
    getVideoSize() {
        return {
            width: this.video.width,
            height: this.video.height,
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

    /**
     * Bind expression events on arrow keys
     */
    bindDebugKeyboard() {
        /* Fake emit events for the app to still proceed */
        EVENTBUS.emit('onHasDetection', true);
        EVENTBUS.emit('onDetection', true);

        document.onkeydown = (e) => {
            let exp = {expressions: USERATTR.getExpressions()};
            switch(e.keyCode) {
                /* LEFT ARROW: Happy */
                case 37: exp.expressions.happy = 1; break;
                /* UP ARROW: Neutral */
                case 38: exp.expressions.neutral = 1; break;
                /* RIGHT ARROW: Angry */
                case 39: exp.expressions.angry = 1; break;
                /* DOWN ARROW: Surprise */
                case 40: exp.expressions.surprised = 1; break;
            }

            EVENTBUS.emit('onFaceDetect', exp);
        };
    }

    /**
     * Create debug canvas for `Faceapi` markers
     */
    createDebugCanvas() {
        this.debugCanvas = faceapi.createCanvasFromMedia(this.video);
        this.body.append(this.debugCanvas);

        faceapi.matchDimensions(this.debugCanvas, this.getVideoSize());


        this.hasDebugCanvas = true;
    }

    /**
     * Create a `canvas` on top of the video element to show the face detection markers
     * (e.g: Face expressions, face landmarks, etc.)
     * @param {Detections} detections
     */
    showFaceMarkers(detections) {
        if(!this.hasDebugCanvas) {
            this.createDebugCanvas();
        }


        const resizedDetections = faceapi.resizeResults(detections, this.getVideoSize());

        /* Show enabled debugger markers */
        if(GLOBAL.showDetections()) faceapi.draw.drawDetections(this.debugCanvas, resizedDetections);
        if(GLOBAL.showExpressions()) faceapi.draw.drawFaceExpressions(this.debugCanvas, resizedDetections);
    }
}