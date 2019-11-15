
self.addEventListener('fetch', event => {
    return event.respondWith(async function(){
        return await fetch(event.request);
    }());
});
