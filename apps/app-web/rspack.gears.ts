import fs from "fs";
import path from "path";
import { type Compiler, rspack } from "@rspack/core";

class GearRegistryGenerator {
    apply(compiler: Compiler) {
        const gearsDir = path.resolve(compiler.context, "../gears");
        const gearNames = fs
            .readdirSync(gearsDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory() && fs.existsSync(path.join(gearsDir, dirent.name, "web/src/index.ts")))
            .map((dirent) => dirent.name);

        new rspack.DefinePlugin({
            __GEAR_REGISTRY__: JSON.stringify(gearNames)
        }).apply(compiler);
    }
}

export default GearRegistryGenerator;
