import * as crypto from "crypto";
import axios from "axios";


export const BaseResponse = (
    errCode?: number,
    data?: any,
    message?: string
) => {
    return {
      errorCode: errCode || 200,
      data: data || null,
      message: message || "Success",
      timestamp: new Date().getTime(),
    };
};

export const requestToSever = async (
    serviceUrl: string,
    method: string,
    data: any,
    secret?: {
        secret_key: String;
    },
    params?: any,
    headers?: any,
): Promise<any> => {
    try {
        if ( secret != null ){
            const signature = crypto
                .createHmac("sha256", secret.secret_key as string)
                .update(JSON.stringify(data))
                .digest("hex");
            headers["signature"] = signature
        }
        const response = await axios({
            method: method,
            url: serviceUrl,
            params: params,
            headers: headers,
            data: data,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data;
        } else {
            return BaseResponse(500, null, "System error !");
        }
    }
};