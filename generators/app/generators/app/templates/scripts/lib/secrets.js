"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const util_1 = require("./util");
const serverless_1 = require("./serverless");
const fs = require("fs");
function getSSM() {
    let ssm;
    if (!serverless_1.isLambda()) {
        const config = util_1.getServerlessConfig();
        const profile = config.provider.profile || process.env.AWS_PROFILE || "default";
        const region = config.provider.region || "us-east-1" || process.env.AWS_REGION;
        const credentials = getAwsCredentials(profile);
        ssm = new aws_sdk_1.SSM({ region, apiVersion: "2014-11-06", credentials });
    }
    else {
        ssm = new aws_sdk_1.SSM({ apiVersion: "2014-11-06" });
    }
    return ssm;
}
exports.getSSM = getSSM;
function getAwsCredentials(profile) {
    const homedir = require("os").homedir();
    let credentials = fs
        .readFileSync(`${homedir}/.aws/credentials`, { encoding: "utf-8" })
        .split("[")
        .map(i => i.split("\n"))
        .filter(i => i[0].includes(profile))
        .pop()
        .slice(1, 3);
    const credentialsObj = {
        accessKeyId: "",
        secretAccessKey: ""
    };
    credentials.map(i => {
        if (i.includes("aws_access_key_id")) {
            credentialsObj.accessKeyId = i.replace(/.*aws_access_key_id\s*=\s*/, "");
        }
        if (i.includes("aws_secret_access_key")) {
            credentialsObj.secretAccessKey = i.replace(/.*aws_secret_access_key\s*=\s*/, "");
        }
    });
    return credentialsObj;
}
exports.getAwsCredentials = getAwsCredentials;
async function getParameter(Name) {
    const ssm = getSSM();
    return new Promise((resolve, reject) => {
        ssm.getParameter({ Name, WithDecryption: true }, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.Parameter);
            }
        });
    });
}
exports.getParameter = getParameter;
async function setParameter(Name, Value, options = { Type: "SecureString", Overwrite: false }) {
    const ssm = getSSM();
    return new Promise((resolve, reject) => {
        ssm.putParameter(Object.assign({ Name, Value }, options), (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.Version);
            }
        });
    });
}
exports.setParameter = setParameter;
async function listParameters(options = {}) {
    const ssm = getSSM();
    return new Promise((resolve, reject) => {
        const options = {};
        ssm.describeParameters(options, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                const list = data.Parameters;
                resolve(list);
            }
        });
    });
}
exports.listParameters = listParameters;
async function removeParameter(Name, options = {}) {
    const ssm = getSSM();
    const request = Object.assign({ Name }, options);
    return new Promise((resolve, reject) => {
        ssm.deleteParameter(request, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
exports.removeParameter = removeParameter;
//# sourceMappingURL=secrets.js.map