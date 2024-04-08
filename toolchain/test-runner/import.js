import { register } from "node:module";

process.setSourceMapsEnabled(true);
register("@swc-node/register/esm", import.meta.url);
