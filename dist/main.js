"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core = require("@actions/core");
const tar = require("tar");
const fs = require("fs");
/**
 * Compress a list of files using tar and output to the provided file path.
 */
function compress(cwd, files, outPath) {
    tar
        .c({ cwd: cwd, gzip: true, sync: true }, files)
        .pipe(fs.createWriteStream(outPath));
}
/**
 * Extract a tar file to the provided directory.
 */
function extract(cwd, file, outPath) {
    tar
        .x({ cwd: cwd, sync: true, file: file })
        .pipe(fs.createWriteStream(outPath));
}
/**
 * Run the action, detecting the tar operation and sanitizing inputs.
 */
async function run() {
    const cwd = core.getInput("cwd");
    const files = core.getInput("files", { required: true })
        .split("\n")
        .filter(x => x !== "");
    const outPath = core.getInput("outPath");
    const operation = core.getInput("operation", { required: true });
    switch (operation) {
        case "compress":
        case "c":
            if (outPath === "") {
                throw new Error("Output path is required for compression");
            }
            await compress(cwd, files, outPath);
            break;
        case "extract":
        case "x":
            if (files.length !== 1) {
                throw new Error("Extracting multiple files is not supported");
            }
            await extract(cwd, files[0], outPath);
            break;
        default:
            throw new Error(`Unknown operation: ${operation}`);
    }
}
exports.run = run;
;
(async () => {
    await run();
})().catch(core.setFailed);
