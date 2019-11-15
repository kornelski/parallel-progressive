
self.addEventListener('fetch', event => {
    const url = event.request.url;
    return event.respondWith(async function(){
        const res = await fetch(event.request);
        return res;
        // return new Response(res.body, {
        //     status: res.status,
        //     headers: res.headers,
        // });
    }().catch(e => {
        console.error("sw", url, e);
        throw e;
    }));
});
