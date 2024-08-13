import RedisClient from "./entity/RedisEntity";
import * as bcrypt from 'bcrypt';
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
    secret_key?: string | ""
):Promise<any> => {
    const convertData = toLowerCaseValues(data);

    const dataToHash = secret_key ? JSON.stringify(convertData) + secret_key : JSON.stringify(convertData);

    const saltRounds = 10;
    const res = await bcrypt.hash(dataToHash, saltRounds);

    const isLocked = await redis.get(res);

    if (isLocked) {
        // data is processing
        return true;
    }
    await redis.set(res, 'locked', 'EX', expire);
    return false
}

export const delLocked = async(
    data: any,
    secret_key?: string | ""
):Promise<void> => {
    const convertData = toLowerCaseValues(data);

    const dataToHash = secret_key ? JSON.stringify(convertData) + secret_key : JSON.stringify(convertData);

    const saltRounds = 10;
    const res = await bcrypt.hash(dataToHash, saltRounds);

    const ok = await redis.get(res);

    if (ok) {
        await redis.del(res);
    }
}



