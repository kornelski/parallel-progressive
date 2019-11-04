self.addEventListener('install', event => {
    self.skipWaiting();
});

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

        // The loop runs async after the response has been returned to the page.
        // It reports detailed download progress to the page.
        Promise.all([reader.read(), clients.get(clientId)])
        .then(async ([chunk, client]) => {
            while(client && !chunk.done) {
                const len = chunk.value.length;
                const now = Date.now();
                // large chunks are probably due to buffering. This makes the graph "chunky" as well,
                // so interpolate the data a bit.
                const chunkFragments = Math.min(5, Math.round(len / 3600));
                for(let i=1; i < (chunkFragments-1); i++) {
                    client.postMessage([url, prevTime + (now - prevTime)*i/chunkFragments, readSoFar + len*i/chunkFragments]);
                }
                prevTime = now;

                readSoFar += len;
                // Let the client know about download progress
                client.postMessage([url, now, readSoFar]);
                chunk = await reader.read();
            }
        });

        return new Response(body1, {
            status: res.status,
            headers: res.headers,
        });
    }().catch(e => {
        console.error("sw", url, e);
        throw e;
    }));
});
