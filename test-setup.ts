import { mock } from "bun:test";

mock.module("next/cache", () => {
  return {
    unstable_cache: (cb: any) => cb,
  };
});
