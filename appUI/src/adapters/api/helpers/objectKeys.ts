// helper that casts object keys as strings
export const objectKeys = <T extends object>(obj: T) => Object.keys(obj) as Array<keyof T>;
