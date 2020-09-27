const methods = require('methods');

/**
 * Response
 */
function RouterResponse() {
    this.statusCode = 200;
    this.body;
}

/**
 * Set response status code
 *
 * @param code
 * @returns {RouterResponse}
 */
RouterResponse.prototype.status = function(code) {
    this.statusCode = code;

    return this;
}

/**
 * Set response body
 *
 * @param data
 * @returns {RouterResponse}
 */
RouterResponse.prototype.send = function(data) {
    this.body = data;

    return this;
}

/**
 * Get response
 *
 * @returns {Response}
 */
RouterResponse.prototype.end = function() {
    return new Response(JSON.stringify(this.body), {
        status: this.statusCode,
    });
}

/**
 * Router
 **/
function Router() {
    this.stack = [];
    this.notfound = (req, res) => {  };
}

/**
 * Handle request
 *
 * @param req
 */
Router.prototype.handle = async function (req) {
    let res = new RouterResponse();

    if(!(req instanceof Request)){
        return;
    }

    let url = new URL(req.url);

    let found = false;
    for (let route of this.stack) {
        if(
            route.endpoint !== url.pathname ||
            req.method.toLowerCase() !== route.method.toLowerCase()
        ){
            continue;
        }

        found = true;
        await route.callback(req, res);
        break;
    }

    if(!found){
        this.notfound(req, res);
    }

    return res.end();
}

/**
 * Route
 */
function Route(endpoint, method, callback) {
    this.endpoint = endpoint;
    this.method = method;
    this.callback = callback;
}

methods.forEach(method => {
    /**
     * Route
     *
     * @param endpoint
     * @param callback
     */
    Router.prototype[method] = function (endpoint, callback) {
        let route = new Route(endpoint, method, callback);

        this.stack.push(route);
    };
});

/**
 * If no route matches
 *
 * @param callback
 */
Router.prototype.notFound = function (callback) {
    if(callback instanceof Function){
        this.notfound = callback;
    }else{
        throw new Error("The argument you supplied to notFound is not a function.");
    }
}

module.exports = Router;