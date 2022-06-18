var express = require('express');
var router = express.Router();
import fhirController from "../../../controllers/fhir";

/* GET home page. */
router.get('/', async (req, res, next) => {
	res.json({
		payload: null
	})
});

router.post('/generate-qr', fhirController.update_qr_code);

module.exports = router;