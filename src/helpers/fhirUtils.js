const zlib = require("zlib");
// import { KEYSTORE } from "./constants";
import { getPrivateKeyValue } from "../helpers/awsUtils";
const jose = require('node-jose');
module.exports = {
    /**
    * minified json return remove all white space
    */
    minifiedJson: (healthCard) => {
        return new Promise(async (resolve, reject) => {
            try {
                // remove all whitespace
                const minifiedCard = JSON.stringify(healthCard);
                // compress using "raw" DEFLATE compression (no zlib or gz headers)
                const compressedCard = zlib.deflateRawSync(minifiedCard);
                resolve(compressedCard);
            } catch (error) {
                reject(null);
            }
        })
    },

    /**
    * createSign json return remove all white space
    */
    createSign: (minifiedJson) => {
        return new Promise(async (resolve, reject) => {
            try {
                const private_key_value = await getPrivateKeyValue('saguaroKeystore');
                // console.log("private_key_value=============>"+JSON.stringify(private_key_value));
                // let keyStoreValue = JSON.parse(private_key_value.saguaroKeystore);
                // console.log("keyStoreValue=============>"+JSON.stringify(keyStoreValue));
                let keyStoreValue = private_key_value;
                const key_store = await jose.JWK.asKeyStore(keyStoreValue);
                const rawKey = key_store.get(keyStoreValue.keys[0].kid);
                const key = await jose.JWK.asKey(rawKey);
                const token = await jose.JWS.createSign({ alg: 'ES256', fields: { zip: 'DEF' }, format: 'compact' }, key).update(minifiedJson).final();
                //console.log(`Token ==> ${token}\n`)
                resolve(token);
            } catch (error) {
                reject(null);
            }
        })
    },

    createSmartCard: (token) => {
        return new Promise(async (resolve, reject) => {
            try {
                const byteSegment = 'shc:/'; 
                const numericSegment = token.split('')  
                        .map(c => c.charCodeAt(0) - 45)  
                        .flatMap(c => [Math.floor(c / 10), c % 10])  
                        .join(''); 
                const segs = [  
                    { data: byteSegment, mode: 'byte' },  
                    { data: numericSegment, mode: 'numeric' }
                ];
            
                // console.log(`Going to create smart health card png file ${JSON.stringify(segs)}`);
                // QRCode.toFile('smart-health-card.png', segs, { version: 17 });
                // The chosen QR Code version cannot contain this amount of data.
                // Minimum version required to store current data is: 20.
                //QRCode.toFile('smart-health-card.png', segs);
                // let base64 = await QRCode.toDataURL(segs)
                //   console.log("base64========>"+base64)
                
                resolve(segs);
            } catch (error) {
                reject(null);
            }
        })
    }
}