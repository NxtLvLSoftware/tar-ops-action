import * as core from "@actions/core"
const tar = require("tar");
const fs = require("fs");
const path = require("path");

/**
 * Compress a list of files using tar and output to the provided file path.
 */
function compress(cwd: string, files: string[], outPath: string): void {
	tar
		.c({cwd: cwd, gzip: true, sync: true}, files)
		.pipe(fs.createWriteStream(outPath));
}

/**
 * Extract a tar file to the provided directory.
 */
function extract(file: string, outPath: string): void {
	tar
		.x({ cwd: outPath, sync: true, file: file });
}

/**
 * Run the action, detecting the tar operation and sanitizing inputs.
 */
export async function run(): Promise<void> {
	const inputCwd = core.getInput("cwd");
	const cwd = (inputCwd === "") ? process.cwd() : inputCwd;

	const files = core.getInput("files", {required: true})
		.split("\n")
		.filter(x => x !== "");
	const inputOutPath = core.getInput("outPath");
	const outPath = (path.isAbsolute(inputOutPath)) ? inputOutPath : cwd + path.sep + inputOutPath;
	const operation = core.getInput("operation", {required: true});

	switch (operation) {
		case "compress":
		case "c":
			if (outPath === "") {
				throw new Error("Output path is required for compression");
			}
			compress(cwd, files, outPath);
			break;
		case "extract":
		case "x":
			if (files.length !== 1) {
				throw new Error("Extracting multiple files is not supported");
			}
			extract(files[0], outPath);
			break;
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}

;(async () => {
	await run();
})().catch(core.setFailed);
