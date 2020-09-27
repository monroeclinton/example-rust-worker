const Router = require('./router');
const wasm = import('../pkg');

const router = new Router();

router.get('/api/multiply', async (req, res) => {
    const wasm_fn = await wasm;
    const { multiply } = wasm_fn;

    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);

    let first = Number(params.get('first'));
    let second = Number(params.get('second'));

    if(
        isNaN(first) || isNaN(second) ||
        first > 255 || second > 255 ||
        first < 0 || second < 0
    ){
        res.status(400).send(
            createJson(
                {}, {},
                "Numbers must be between 0 and 255.",
                400
            )
        );

        return;
    }

    try{
        const calculate = multiply(first, second)
        res.send(createJson({ result: calculate }, {}));
    }catch(e) {
        res.status(500).send(
            createJson(
                {}, {},
                "Something went wrong calculating the result.",
                500
            )
        );
    }
});

router.notFound((req, res) => {
    res.status(404).send(
        createJson(
            {}, {},
            "Route not found.",
            404
        )
    )
})

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

/**
 * Respond to the request
 *
 * @param {Request} req
 */
async function handleRequest(req) {
    return router.handle(req);
}

/**
 * Format JSON response for router
 *
 * @param data
 * @param errors
 * @param message
 * @param status
 * @returns {{data: *, message: null, errors: *, status: number}}
 */
function createJson(data, errors, message = null, status = 200) {
    return {
        data: data,
        errors: errors,
        message: message,
        status: status,
    }
}