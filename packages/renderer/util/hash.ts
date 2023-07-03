import xxhash from "xxhash-wasm";

const xxhashInstance = xxhash();
let create64: Awaited<typeof xxhashInstance>["create64"];


const fs = window.aeroNative.fileSystem;

export async function hashDir(path: string, ignoreDirs?: Set<string>, fileNameValidator?: (name: string) => boolean, recursive = true) {
    if (!fs.exists(path)) throw new Error(`Directory not found: ${path}`);
    if (fs.isFile(path)) throw new Error(`Path is not a directory: ${path}`);
    fileNameValidator ??= () => true;
    ignoreDirs ??= new Set();

    create64 ??= (await xxhashInstance).create64;
    const hash = create64();

    let didHash = false;
    function hashdir(path: string) {
        for (const file of fs.getFiles(path)) {
            if (!fileNameValidator(file)) continue;
            didHash = true;
            const content = fs.readFile(`${path}/${file}`);
            hash.update(content);
        }

        if (!recursive) return;
        for (const dir of fs.subdirs(path)) {
            if (ignoreDirs.has(dir)) continue;

            hashdir(`${path}/${dir}`);
        }
    }

    hashdir(path);
    if (!didHash) throw new Error(`No files found in ${path}`);

    return hash.digest().toString(16);
}

export async function hashFile(path: string) {
    if (!fs.exists(path)) throw new Error(`File not found: ${path}`);
    if (!fs.isFile(path)) throw new Error(`Path is not a file: ${path}`);

    create64 ??= (await xxhashInstance).create64;

    return create64().update(fs.readFile(path)).digest().toString(16);
}

