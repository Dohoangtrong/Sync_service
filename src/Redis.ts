import RedisClient from "./entity/RedisEntity";
import * as crypto from "crypto";
import { toLowerCaseValues } from "./helpers/JsonUtils";

export const redis = RedisClient.getInstance({
    host: process.env.DB_REDIS_HOST,
    port: Number(process.env.DB_REDIS_PORT), 
    password: process.env.DB_REDIS_PASSWORD,
    db: Number(process.env.DB_REDIS_DB),
});


export const isDataLocked = async(
    data: any,
    expire: number = 45,
    secret_key: string = ""
):Promise<any> => {
    const convertData = toLowerCaseValues(data);

    const signature = crypto
      .createHmac("sha256", secret_key as string)
      .update(JSON.stringify(data))
      .digest("hex");

    const isLocked = await redis.get(signature);

    if (isLocked) {
        // data is processing
        return true;
    }
    await redis.set(signature, 'locked', 'EX', expire);
    return false
}

export const delLocked = async(
    data: any,
    secret_key: string = ""
):Promise<void> => {
    const convertData = toLowerCaseValues(data);
    const signature = crypto
      .createHmac("sha256", secret_key as string)
      .update(JSON.stringify(data))
      .digest("hex");

    const ok = await redis.get(signature);

    if (ok) {
        await redis.del(signature);
    }
}



