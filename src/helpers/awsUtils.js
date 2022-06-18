// const AWS = require('aws-sdk');
// AWS.config.update({
//     region: REGION
// });

module.exports = {    
    getPrivateKeyValue: async (secret_key) => {
        return new Promise((resolve, reject) => {
            // const client = new AWS.SecretsManager();
            // client.getSecretValue({ SecretId: secret_key }, function (err, data) {
            //     if (err) {
            //         reject(err);
            //     }
            //     else {
            //         if ('SecretString' in data) {
            //             resolve(JSON.parse(data.SecretString));
            //         }
            //         else {
            //             let buff = new Buffer(data.SecretBinary, 'base64');
            //             resolve(JSON.parse(buff.toString('ascii')));
            //         }
            //     }
            // });
            let privateKey = { 
                "keys": [
                    { 
                        "kty": "EC", 
                        "kid": "cmgmAsX-mFzinWRH5_HbMc4n1VFeD0UDsCqFdxvip-s", 
                        "use": "sig", 
                        "alg": "ES256", 
                        "crv": "P-256", 
                        "x": "5SOEXwPGgem408CfSJjLcJ4JuiuUe0NLSxifZaHzW0c", 
                        "y": "pfTx0V13cag7o-w2PgvyJMY98pwUag9vudQyrvyyEkQ", 
                        "d": "46rM2zDoIsxYrTI3CVdKCiKGlBCH0VxC73IvzTk4Jfk" 
                    }
                ] 
            }

            resolve(privateKey);
        });
    }
}