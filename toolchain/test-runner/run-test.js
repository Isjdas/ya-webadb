#!/usr/bin/env node

import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, opendir } from "node:fs/promises";
import { resolve } from "node:path";
import { run } from "node:test";
import { spec } from "node:test/reporters";
import { fileURLToPath } from "node:url";

let tsc = resolve(
    fileURLToPath(import.meta.url),
    "..",
    "node_modules",
    ".bin",
    "tsc",
);
if (process.platform === "win32") {
    tsc += ".cmd";
}

const child = spawn(tsc, ["-p", "tsconfig.test.json", "--noEmit"], {
    shell: true,
    stdio: "inherit",
});

await once(child, "exit");
if (child.exitCode !== 0) {
    process.exit(child.exitCode);
}

/** @type {string[]} */
const tests = [];
/**
 * @param {string} path
 */
async function findTests(path) {
    for await (const entry of await opendir(path)) {
        if (entry.isDirectory()) {
            await findTests(resolve(entry.parentPath, entry.name));
        } else if (entry.name.endsWith(".spec.ts")) {
            tests.push(resolve(entry.parentPath, entry.name));
        }
    }
}
await findTests(resolve(process.cwd(), "src"));

const test = run({
    // concurrency: false,
    files: tests,
});
test.on("test:fail", () => {
    process.exitCode = 1;
});
const coverageFolder = resolve(process.cwd(), "coverage");
await mkdir(coverageFolder, { recursive: true });

// @ts-expect-error
test.pipe(spec()).pipe(process.stdout);
// // @ts-expect-error
// test.pipe(lcov).pipe(createWriteStream(resolve(coverageFolder, "lcov.info")));

// run({
//     concurrency: false,
//     files: tests,
// })
//     // @ts-expect-error
//     .pipe(Lcov)
//     .pipe(createWriteStream(resolve(coverageFolder, "lcov.info")));
