typeof NativeGlobal !== 'undefined' && function (global, NativeGlobal, require, loadScript) {
    global.window = global;

    const {
        touchables,
        setTimeout,
        clearTimeout,
        setInterval,
        requestAnimationFrame,
        Canvas,
        Image,
        Video,
        EventTarget,
    } = NativeGlobal;

    const { Event } = require('event');

    function Noop () { }


    // XMLHttpRequest:
    const $request = Symbol('XHR.request');
    const UNSENT = 0,
        OPENED = 1,
        HEADERS_RECEIVED = 2,
        LOADING = 3,
        DONE = 4;

    class XMLHttpRequest extends EventTarget {
        constructor () {
            super();
            this.$cleanup();
        }

        $cleanup () {
            this.readyState = UNSENT;
            this.timeout = 0;
            this.status = 0;
            this.statusText = '';
            this.responseType = '';
            this[$request] = null;
        }

        open (method, url) {
            if (this.readyState !== UNSENT) return;
            // TODO: 检查 method、url
            this[$request] = { url };
            this.readyState = OPENED;
            this.dispatchEvent(new Event('readystatechange', this));
        }

        abort () {
            if (this.readyState === UNSENT) return;
            this[$cleanup]();
            this.dispatchEvent(new Event('abort', this));
        }

        setRequestHeader (name, value) { }

        getResponseHeader (name) { }

        getAllResponseHeaders () { }

        overrideMimeType (mimeType) { }

        send (sendable) {
            if (this.readyState !== OPENED) return;
            // TODO: 支持 blob
            var xhr = this,
                request = xhr[$request];
            // TODO: auto content type
            // TODO: serialize sendable
            if (xhr.responseType === 'blob') {
                xhr.readyState = DONE;
                xhr.status = 200;
                request.buffer = request.url;
                requestAnimationFrame(next);
                return;
            }
            const scandium = require('scandium');

            var sync = true;
            scandium.loadAsync(request.url, xhr.responseType === 'arraybuffer' ? scandium.LOAD_ARRAYBUFFER : scandium.LOAD_TEXT, function (ret) {
                if (!arguments.length) {
                    return xhr.dispatchEvent(new Event('error'))
                }
                request.buffer = ret;
                xhr.readyState = DONE;
                xhr.status = 200;
                if (sync) {
                    requestAnimationFrame(next);
                } else {
                    next();
                }
            });
            sync = false;

            function next () {
                xhr.dispatchEvent(new Event('readystatechange'));
                xhr.dispatchEvent(new Event('load'));
            }
        }

        get response () {
            if (this.readyState !== DONE) return '';
            var { responseType } = this;
            var { buffer } = this[$request];
            if (responseType === 'json') return JSON.parse(buffer);
            return buffer;
        }

        get responseText () {
            if (this.readyState !== DONE) return '';
            return this[$request].buffer;
        }
    }

    XMLHttpRequest.UNSENT = UNSENT;
    XMLHttpRequest.OPENED = OPENED;
    XMLHttpRequest.HEADERS_RECEIVED = HEADERS_RECEIVED;
    XMLHttpRequest.LOADING = LOADING;
    XMLHttpRequest.DONE = DONE;

    global.HTMLElement = EventTarget;
    global.EventTarget = EventTarget;
    global.XMLHttpRequest = XMLHttpRequest;
    global.Image = Image;
    global.setTimeout = setTimeout;
    global.setInterval = setInterval;
    global.clearTimeout = clearTimeout;
    global.requestAnimationFrame = requestAnimationFrame;
    global.HTMLCanvasElement = Canvas;
    global.HTMLImageElement = Image;
    global.HTMLVideoElement = Video;


    global.innerWidth = 360;
    global.innerHeight = 640;
    global.pageXOffset = global.pageYOffset = 0;

    global.location = {
        protocol: 'http:'
    };

    global.document = {
        documentElement: {
            clientLeft: 0,
            clientTop: 0,
            get clientWidth () {
                return innerWidth;
            },
            get clientHeight () {
                return innerHeight;
            },
        },
        head: {
            appendChild (dom) { },
        },
        body: {
            scrollLeft: 0,
            scrollTop: 0,
        },
        createElement (name) {
            name = name.toLowerCase();
            if (name === 'video') return {
                canPlayType (type) {
                    return false;
                }
            };
            if (name === 'style') return {};
            if (name === 'div') return {
                style: {},
                attributes: {},
                setAttribute (key, val) {
                    this.attributes[key] = val;
                },
                appendChild () {
                }
            }
            if (name === 'canvas') return new Canvas(0, 300, 300);
        },
        getElementsByTagName (tag) {
            if (tag === 'html') return [this.documentElement];
        },
        querySelector (sel) {
            if (sel === 'GameCanvas') return GameCanvas;
        },
    };
    var navigator = global.navigator = {
        language: 'zh-CN',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.1.0; ) Helium/2.1.0.1',
    };

    navigator.appVersion = navigator.userAgent.slice(8);
    const scandium = require('scandium');
    global.devicePixelRatio = scandium.ratio;

    const { AudioContext } = NativeGlobal.Aurum;
    global.cc = {
        sys: {
            MOBILE_BROWSER: 100,
            platform: 100,
            browserType: "unknown",
            language: 'zh',
            languageCode: 'zh',
            os: 'Android',
            osVersion: 'Android',
            isNative: false,
            isBrowser: false,
            capabilities: {
                opengl: true,
                canvas: true,
                touches: true,
            },
            __audioSupport: {
                WEB_AUDIO: true,
                context: new AudioContext(),
                format: ['.mp3'],
            },
            now: Date.now,
        }
    };

    // 加载 cocos 项目
    loadScript('src/settings.js');
    loadScript('main.js');
    loadScript(_CCSettings.debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js');
    cc.loader.downloader.addHandlers({
        js (item, callback, isAsync) {
            if (item.url !== 'src/assets/h5-polyfill.js')
                loadScript(item.url);
            isAsync ? setTimeout(callback, 0) : callback();
        }
    });

    global.onfocus = global.onblur = Noop;
    global.addEventListener = addEventListener;

    function addEventListener (event, cb) {
        this['on' + event] = cb;
    }

    global.performance = { now: NativeGlobal.performanceNow };

    const view_id = helium.createView();
    const canvas = global.GameCanvas = touchables[view_id];
    global.innerWidth = canvas.width;
    global.innerHeight = canvas.height;
    canvas.tagName = canvas.nodeName = "CANVAS";
    canvas.setAttribute = () => { };
    canvas.style = {};

    canvas.focus = Noop;
    canvas.getBoundingClientRect = function () {
        return {
            left: 0, top: 0,
            width: innerWidth,
            height: innerHeight,
        };
    };
    canvas.backing = false;
    // canvas.ontouchstart = canvas.ontouchend = canvas.ontouchmove = canvas.ontouchcancel = function (e) {
    //     const scaleX = innerWidth / this.width, scaleY = innerHeight / this.height;
    //     for (let touch of (e.type === 'touchend' ? e.changedTouches : e.touches)) {
    //         touch.pageX = touch.clientX = touch.screenX * scaleX;
    //         touch.pageY = touch.clientY = touch.screenY * scaleY;
    //     }
    // };
    boot();
}(this, NativeGlobal, require, loadScript);

NativeGlobal = void 0;