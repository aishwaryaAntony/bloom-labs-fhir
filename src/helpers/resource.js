import { IMMUNIZATION, OBSERVATION, LAB_NAME, ISS, ANTIGEN, RTPCR, RESULT_VALUE, HEALTH_CARD } from "./constants";
module.exports = {
    /**
    * create patient resource based on patient data
    */
    patientResource: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let resourceObj = {};
                let passport = []
                if (data.passportNumber !== null) {
                    passport.push({
                        type: {
                            coding: [
                                {
                                    system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                                    code: "PPN",
                                }
                            ]
                        },
                        system: "http://standardhealthrecord.org/fhir/StructureDefinition/passportNumber",
                        value: data.passportNumber
                    });

                    resourceObj.identifier = passport;
                }

                resourceObj.resourceType = "Patient";
                resourceObj.name = [
                    {
                        family: data.lastName,
                        given: [data.firstName]
                    }
                ];
                // resourceObj.identifier = passport;
                resourceObj.gender = data.gender !== null ? data.gender.toLowerCase() : data.gender;
                resourceObj.birthDate = data.birthDate !== null ? data.birthDate : '';
                resolve(resourceObj);
            } catch (error) {
                reject(null);
            }
        })
    },
    /**
   * create immunization resource based on immunization data
   */
    immunizationResource: (immunizationData) => {
        return new Promise(async (resolve, reject) => {
            try {
                let resourceData = []
                for (let data of immunizationData) {
                    let resourceObj = {};
                    resourceObj.resourceType = "Immunization";
                    resourceObj.status = "completed";
                    resourceObj.vaccineCode = {
                        coding: [
                            {
                                system: "http://hl7.org/fhir/sid/cvx",
                                code: data.vaccine_code
                            }
                        ]
                    };
                    resourceObj.patient = {
                        reference: "resource:0"
                    };
                    resourceObj.occurrenceDateTime = data.occurrence_date_time;
                    resourceObj.performer = [
                        {
                            actor: {
                                display: LAB_NAME
                            }
                        }
                    ];
                    resourceObj.lotNumber = data.lot_number;

                    resourceData.push(resourceObj)
                }

                resolve(resourceData);
            } catch (error) {
                reject(null);
            }
        })
    },
    /**
  * create observation resource based on observation data
  */
    observationResource: (data) => {
        return new Promise(async (resolve, reject) => {
            try {

                let { code, system, result_system } = data.test.includes("PCR") || data.test.includes("NAAT") ? RTPCR : ANTIGEN;
                let resultValue = data.result !== null ? data.result.toLowerCase() : data.result;
                // console.log(`resultValue========>${JSON.stringify(data)}`)
                let resourceObj = {};
                resourceObj.resourceType = "Observation";
                resourceObj.meta = {
                    security: [
                        {
                            system: "https://smarthealth.cards/ial",
                            code: "IAL1"
                        }
                    ]
                };
                resourceObj.status = "final";
                resourceObj.code = {
                    coding: [
                        {
                            system: system,
                            code: code
                        }
                    ]
                };
                resourceObj.subject = {
                    // reference: `resource:${data.patientRef}`
                    reference: "resource:0"
                };
                resourceObj.effectiveDateTime = data.effectiveDateTime;
                resourceObj.performer = [
                    {
                        display: LAB_NAME
                    }
                ];
                resourceObj.valueCodeableConcept = {
                    coding: [
                        {
                            system: result_system,
                            code: RESULT_VALUE[resultValue]
                        }
                    ]
                }

                // console.log(`Resource ==> ${JSON.stringify(resourceObj)}`)
                resolve(resourceObj);
            } catch (error) {
                console.log("error========>" + error)
                reject(null);
            }
        })
    },
    /**
     * create Resource Bundle
     */
    createBundleResource: (patientData, observationData, patientRef) => {
        return new Promise(async (resolve, reject) => {
            // console.log("observationData===========>"+JSON.stringify(observationData))
            // console.log("patientData===========>"+JSON.stringify(patientData))
            // console.log("patientRef===========>"+patientRef)
            try {
                let entryData = [];
                if (patientData !== null) {
                    entryData.push({
                        // "fullUrl": `resource:${patientRef}`,
                        "fullUrl": `resource:0`,
                        "resource": patientData
                    });
                }

                if (observationData.length > 0) {
                    for (const [index, data] of observationData.entries()) {
                        entryData.push({
                            "fullUrl": `resource:${index + 1}`,
                            "resource": data
                        });
                    }
                }
                console.log("ISS===========>" + ISS)
                let resourceObj = {};
                resourceObj.iss = ISS;
                resourceObj.nbf = Math.floor(Date.now() / 1000);
                resourceObj.vc = {
                    type: observationData.length > 0 ? OBSERVATION : HEALTH_CARD,
                    credentialSubject: {
                        fhirVersion: "4.0.1",
                        fhirBundle: {
                            resourceType: "Bundle",
                            type: "collection",
                            entry: entryData
                        }
                    }
                }

                resolve(resourceObj);
            } catch (error) {
                console.log("error========>" + error)
                reject(null);
            }
        })
    }
}