const Crypto = require('crypto');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Generate secret signature in Azure Functions
    const hmac = Crypto.createHmac("sha1", "hmXkVFHI7fSCcjAZpskJ/jc4hjata14i7dKtMKDHbUveki1pCyaAiA==");
    const signature = hmac.update(JSON.stringify(req.body)).digest('hex');
    const shaSignature = `sha1=${signature}`;

    // Extract secret signature from GitHub Webhooks Request Header
    const gitHubSignature = req.headers['x-hub-signature'];

    // Compare secret signatures, if the same process request
    if (!shaSignature.localeCompare(gitHubSignature)) {
        // If request contains title, continue, else return error message
        if (req.body.pages[0].title) {
        context.res = {
            body: "Page is " + req.body.pages[0].title + ", Action is " + req.body.pages[0].action + ", Event Type is " + req.headers['x-github-event']
            };
        }
        else {
        context.res = {
            status: 400,
            body: ("Invalid payload for Wiki event")
                }
            }
    }
    // If secret signatures different, return error message
    else {
    context.res = {
        status: 401,
        body: "Signatures don't match"
        };
    }    
}