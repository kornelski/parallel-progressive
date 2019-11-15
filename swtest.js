
self.addEventListener('fetch', event => {
    const url = event.request.url;
    return event.respondWith(async function(){
        const res = await fetch(event.request);
        return res;
    }());
});
