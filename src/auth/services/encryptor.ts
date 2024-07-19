import CryptoJS from "crypto-js";
import { config } from "../../core/config/env";

export class Encryptor {
    constructor(private readonly encryptorKey: string = config.auth.encryptoSecretKey) { }

    encrypt = (data: string): string => {
        return CryptoJS.AES.encrypt(data, this.encryptorKey).toString();
    }

    decrypt = (data: string): string => {
        const bytes = CryptoJS.AES.decrypt(data, this.encryptorKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

}


export const encryptor = new Encryptor();