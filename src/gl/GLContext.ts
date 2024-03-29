import EventEmitter, {AbstractEventMap} from "../utils/EventEmmiter";
import IValidatedEventMap from "../IValidatedEventMap";

/**
 *
 */
export default class GLContext extends EventEmitter<IValidatedEventMap>{
    /**
     *
     * @private
     */
    private gl : WebGL2RenderingContext | null = null;

    /**
     *
     * @private
     */
    private canvas : HTMLCanvasElement | null;

    /**
     *
     * @private
     */
    private webGLContextAttributes ?: WebGLContextAttributes;

    /**
     *
     * @private
     */
    private valid = false;

    /**
     *
     * @private
     */
    private destroyed = false;

    /**
     *
     * @private
     */
    public constructor(canvas : HTMLCanvasElement,
                       webGLContextAttributes ?: WebGLContextAttributes) {
        super();

        this.canvas = canvas;
        this.webGLContextAttributes = webGLContextAttributes;
        this.validate();
    }

    /**
     *
     */
    public destroy() {
        this.canvas = null;
        this.gl = null;
        this.destroyed = true;

        this.removeAllEventListeners("valid");
        this.removeAllEventListeners("invalid");
    }

    /**
     *
     */
    public getContext() {
        return this.gl;
    }

    /**
     *
     */
    public getCanvas() {
        return this.canvas;
    }

    /**
     *
     */
    public getWebGLContextAttributes() {
        return this.webGLContextAttributes;
    }

    /**
     *
     */
    public getContextProtected() : WebGL2RenderingContext {
        if (this.gl === null) {
            throw new Error("Context is null!");
        }

        return this.gl;
    }

    /**
     *
     * @param canvas
     */
    public setCanvas(canvas : HTMLCanvasElement) {
        this.canvas = canvas;
        this.valid = false;

        this.validate();
    }

    /**
     *
     * @param attrs
     */
    public setWebGLContextAttributes(attrs ?: WebGLContextAttributes) {
        this.webGLContextAttributes = attrs;
        this.valid = false;

        this.validate();
    }

    /**
     *
     */
    public isValid() { return this.valid; }

    /**
     *
     */
    public validate() {
        if (this.valid) return;

        if (this.canvas === null) {
            this.valid = false;
            this.emitEvent("invalid", {});
            return;
        }

        this.gl = this.canvas.getContext("webgl2", this.webGLContextAttributes);

        if (!this.gl) {
            console.warn("Webgl2 get context error!");
            this.valid = false;
            return this.emitEvent("invalid", {});
        }

        this.emitEvent("valid", {});
        this.valid = true;
    }
}
