import fs from "fs";
import path from "path";
import { type Compiler, rspack } from "@rspack/core";

class GearRegistryGenerator {
    apply(compiler: Compiler) {
        const gearsDir = path.resolve(compiler.context, "../gears");
        const gearNames = fs
            .readdirSync(gearsDir)
            .filter((name) => fs.existsSync(path.join(gearsDir, name, "web/src/index.ts")));
            
        new rspack.DefinePlugin({
            __GEAR_REGISTRY__: JSON.stringify(gearNames)
        }).apply(compiler);
    }
}

export default GearRegistryGenerator;
