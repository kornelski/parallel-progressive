
self.addEventListener('fetch', event => {
    const url = event.request.url;
    return event.respondWith(async function(){
        if (!/\.jpg/.test(url)) {
            return fetch(event.request);
        }
        const clientId = event.clientId;
        const res = await fetch(event.request);
        if (!res.body) { // cross-origin?
            return res;
        }
        // Split the stream, so that the page can get it unmodified without having to wait for
        // the ServiceWorker processing the chunks.
        const [body1, body2] = res.body.tee();
        const reader = body2.getReader();
        let readSoFar = 0;
        let prevTime = Date.now();



        return new Response(body1, {
            status: res.status,
            headers: res.headers,
        });
    }().catch(e => {
        console.error("sw", url, e);
        throw e;
    }));
});
