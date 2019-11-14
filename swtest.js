self.addEventListener('fetch', event => {
    return event.respondWith(fetch(event.request.url + '?' + Math.random()));
});
