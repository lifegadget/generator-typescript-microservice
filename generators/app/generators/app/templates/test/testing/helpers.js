"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const fs = require("fs");
const yaml = require("js-yaml");
const process = require("process");
require("./test-console"); // TS declaration
const test_console_1 = require("test-console");
const Handlebars = require("handlebars");
const scripts_1 = require("../../scripts");
const path = require("path");
const ENV_FILE = path.join(scripts_1.SLS_CONFIG_DIRECTORY, "env.yml");
function restoreStdoutAndStderr() {
    console._restored = true;
}
exports.restoreStdoutAndStderr = restoreStdoutAndStderr;
async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.timeout = timeout;
function setupEnv() {
    if (!process.env.AWS_STAGE) {
        process.env.AWS_STAGE = "test";
    }
    const current = process.env;
    const yamlConfig = yaml.safeLoad(fs.readFileSync(ENV_FILE, "utf8"));
    const combined = Object.assign({}, yamlConfig[process.env.AWS_STAGE], process.env);
    console.log(`Loading ENV for "${process.env.AWS_STAGE}"`);
    Object.keys(combined).forEach(key => (process.env[key] = combined[key]));
    return combined;
}
exports.setupEnv = setupEnv;
function ignoreStdout() {
    const rStdout = test_console_1.stdout.ignore();
    const restore = () => {
        rStdout();
        console._restored = true;
    };
    return restore;
}
exports.ignoreStdout = ignoreStdout;
function captureStdout() {
    const rStdout = test_console_1.stdout.inspect();
    const restore = () => {
        rStdout.restore();
        console._restored = true;
        return rStdout.output;
    };
    return restore;
}
exports.captureStdout = captureStdout;
function captureStderr() {
    const rStderr = test_console_1.stderr.inspect();
    const restore = () => {
        rStderr.restore();
        console._restored = true;
        return rStderr.output;
    };
    return restore;
}
exports.captureStderr = captureStderr;
function ignoreStderr() {
    const rStdErr = test_console_1.stderr.ignore();
    const restore = () => {
        rStdErr();
        console._restored = true;
    };
    return restore;
}
exports.ignoreStderr = ignoreStderr;
function ignoreBoth() {
    const rStdOut = test_console_1.stdout.ignore();
    const rStdErr = test_console_1.stderr.ignore();
    const restore = () => {
        rStdOut();
        rStdErr();
        console._restored = true;
    };
    return restore;
}
exports.ignoreBoth = ignoreBoth;
/**
 * The first key in a Hash/Dictionary
 */
function firstKey(dictionary) {
    return lodash_1.first(Object.keys(dictionary));
}
exports.firstKey = firstKey;
/**
 * The first record in a Hash/Dictionary of records
 */
function firstRecord(dictionary) {
    return dictionary[this.firstKey(dictionary)];
}
exports.firstRecord = firstRecord;
/**
 * The last key in a Hash/Dictionary
 */
function lastKey(listOf) {
    return lodash_1.last(Object.keys(listOf));
}
exports.lastKey = lastKey;
/**
 * The last record in a Hash/Dictionary of records
 */
function lastRecord(dictionary) {
    return dictionary[this.lastKey(dictionary)];
}
exports.lastRecord = lastRecord;
function valuesOf(listOf, property) {
    const keys = Object.keys(listOf);
    return keys.map((key) => {
        const item = listOf[key];
        return item[property];
    });
}
exports.valuesOf = valuesOf;
function length(listOf) {
    return listOf ? Object.keys(listOf).length : 0;
}
exports.length = length;
async function loadData(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(process.cwd() + "/test/data/" + file, "utf8", (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
exports.loadData = loadData;
async function loadTemplate(file, replacements = {}) {
    const text = await loadData(file);
    const template = Handlebars.compile(text);
    return template(replacements);
}
exports.loadTemplate = loadTemplate;
//# sourceMappingURL=helpers.js.map