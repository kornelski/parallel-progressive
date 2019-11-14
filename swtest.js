self.addEventListener('fetch', event => {
    return event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
    const res = await fetch(event.request.url + '?' + Math.random());
    return new Response(res.body, {
        status: res.status,
        headers: res.headers,
    });
}
