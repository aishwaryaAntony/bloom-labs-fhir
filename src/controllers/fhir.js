import { patientResource, observationResource, createBundleResource } from "../../src/helpers/resource"
import { minifiedJson, createSign, createSmartCard } from "../../src/helpers/fhirUtils";
import moment from "moment";
const QRCode = require('qrcode');


exports.update_qr_code = async (req, res, next) => {
    try {
        const { id, name, firstName, lastName, gender, birthDate, passportNumber, effectiveDateTime, patientRef, test, result } = req.body;

        console.log(`Body ==> ${JSON.stringify(req.body)}`);
        // let resultObj = {};
        // resultObj.id = '515754ba-37a6-44be-88f7-15f05bd0fed6';
        // resultObj.name = 'Jeeva R';
        // resultObj.firstName = 'Jeeva';
        // resultObj.lastName = 'R';
        // resultObj.gender = 'Male';
        // resultObj.birthDate = '1991-07-26';
        // resultObj.passportNumber = 'PL12334';

        // let patient = await patientResource(resultObj);
        let patient = await patientResource(req.body);
        // let testObj = {};

        // testObj.effectiveDateTime = `${moment().utc().format('YYYY-MM-DD\THH:mm:ss')}+00:00`;
        // testObj.patientRef = '515754ba-37a6-44be-88f7-15f05bd0fed6';
        // testObj.test = 'PCR Test';
        // testObj.result = 'Negative';

        // let observationData = await observationResource(testObj);
        let observationData = await observationResource(req.body);
        let observationResourceData = [];
        observationResourceData.push(observationData);

        let bundle = await createBundleResource(patient, observationResourceData, id);
        
        let minifiedData = await minifiedJson(bundle);
        
        let createSignWithKey = await createSign(minifiedData);
        let segment = await createSmartCard(createSignWithKey);
        let base64 = await QRCode.toDataURL(segment);

        res.status(200).json({
            status: 'success',
            message: "QR code successfully updated",
            base64: base64
        })
        // QRCode.toFileStream(res, segment);
    } catch (error) {
        res.status(200).json({
            status: "failed",
            payload: error
        })
    }
}