const Crypto = require('crypto');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const hmac = Crypto.createHmac("sha1", "hmXkVFHI7fSCcjAZpskJ/jc4hjata14i7dKtMKDHbUveki1pCyaAiA==");
    const signature = hmac.update(JSON.stringify(req.body)).digest('hex');
    const shaSignature = `sha1=${signature}`;

    const gitHubSignature = req.headers['x-hub-signature'];

    if (!shaSignature.localeCompare(gitHubSignature)) {
        // Existing code
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
    else {
    context.res = {
        status: 401,
        body: "Signatures don't match"
        };
    }    
}