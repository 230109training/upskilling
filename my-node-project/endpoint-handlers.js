function test(req, res) {
    res.end('Welcome to the GET /test endpoint!');
}

function endpointNotFound(req, res) {
    res.writeHead(404);
    res.end('Endpoint not found');
}

module.exports = {
    test,
    endpointNotFound
}