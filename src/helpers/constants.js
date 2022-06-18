require('dotenv').config();

module.exports = {
    ANTIGEN: {
        code: "94558-4",
        system: "http://loinc.org",
        result_system: "http://snomed.info/sct",
        positive: "10828004",
        negative: "260385009"
    },
    RESULT_VALUE:{
        inconclusive:"419984006",
        positive: "10828004",
        negative: "260385009"
    },
    REGION: process.env.REGION,
    // ISS: process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_ISS_URL : process.env.DEVELOPMENT_ISS_URL,
    ISS: process.env.PRODUCTION_ISS_URL,
    LAB_NAME:"Saguaro Bloom Diagnostics",
    IMMUNIZATION: [
        "https://smarthealth.cards#health-card",
        "https://smarthealth.cards#immunization",
        "https://smarthealth.cards#covid19" 
    ],
    HEALTH_CARD: [
        "https://smarthealth.cards#health-card"
    ],
    OBSERVATION: [
        "https://smarthealth.cards#health-card",
        "https://smarthealth.cards#laboratory",
        "https://smarthealth.cards#covid19"
    ],
    //Reverse transcription polymerase chain reaction
    RTPCR: {
        code: "94500-6",
        system: "http://loinc.org",
        result_system: "http://snomed.info/sct",
        positive: "10828004",
        negative: "260385009"
    }
}
