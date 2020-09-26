addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
}

/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
    const { multiply } = wasm_bindgen;
    await wasm_bindgen(wasm)

    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);


    if(url.pathname === "/api/multiply" && request.method === "GET"){
        let first = parseInt(params.get('first'));
        let second = parseInt(params.get('second'));

        if(first > 255 || second > 255 || first < 0 || second < 0){
            return createResponse(
                {}, {},
                "Numbers must be between 0 and 255.",
                400
            );
        }

        try{
            const calculate = multiply(first, second)
            return createResponse({ result: calculate }, {});
        }catch(e) {
            return createResponse(
                {}, {},
                "Something went wrong.",
                500
            );
        }
    }

    return createResponse({}, {}, "Route not found.",404);
}

function createResponse(data, errors, message = null, status = 200) {
    let json = {
        data: data,
        errors: errors,
        message: message,
        status: status,
    }

    return new Response(JSON.stringify(json), {
        status: status,
        headers: headers
    })
}