self.addEventListener('fetch', event => {
    return event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
    const res = await fetch(event.request.url + '?' + Math.random());
    const [body1, body2] = res.body.tee();
    return new Response(body1, {
        status: res.status,
        headers: res.headers,
    });
}
