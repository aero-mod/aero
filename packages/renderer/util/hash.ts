import xxhash from "xxhash-wasm";
const xxhashInstance = xxhash();


const fs = window.aeroNative.fileSystem;

export async function hashFileOrDir(path: string, ignoreDirs?: Set<string>, fileNameValidator?: (name: string) => boolean, recursive = true) {
    if(!fs.exists(path)) throw new Error(`File or directory not found: ${path}`);
    fileNameValidator ??= () => true;
    ignoreDirs ??= new Set();

    const { create64 } = await xxhashInstance;
    const hash = create64();

    if(fs.isFile(path)) {
        hash.update(fs.readFile(path));
    } else {
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
        if(!didHash) throw new Error(`No files found in ${path}`);
    }

    return hash.digest().toString(16);
}

