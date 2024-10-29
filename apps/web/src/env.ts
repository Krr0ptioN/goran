import { createEnv } from "@t3-oss/env-nextjs";
import { env as commonEnv } from "@goran/ui-common";
 
export const env = createEnv({
  extends: [commonEnv],
  runtimeEnv: {},
});