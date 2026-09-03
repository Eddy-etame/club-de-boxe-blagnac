/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_SITE_INDEXABLE?: string;
  readonly PUBLIC_RELEASE_VALIDATED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
