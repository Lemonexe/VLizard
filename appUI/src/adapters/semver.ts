// Display only major.minor version, exclude patch
export const trimPatchVersion = (version: string): string => version.split('.').slice(0, 2).join('.');
