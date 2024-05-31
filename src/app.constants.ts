import "dotenv/config";

export const tokenSecret: string = process.env.JWT_SECRET;
export const tokenExpiresInSeconds: number = process.env.JWT_EXPIRES as unknown as number / 144;
export const tokenExpiresInDate: Date = new Date((Math.floor(new Date().getTime() / 1000) + tokenExpiresInSeconds) * 1000);