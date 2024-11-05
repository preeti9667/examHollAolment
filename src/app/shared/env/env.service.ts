import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "src/config";

@Injectable()
export class EnvService {
    readonly PORT = this.get('PORT');
    readonly BYPASS_OTP = this.get('BYPASS_OTP');
    // readonly ADMIN = this.get('ADMIN');
    // readonly MONGO = this.get('MONGO');
    readonly REDIS = this.get('REDIS');
    // readonly KAFKA = this.get('KAFKA');
    // readonly GRPC = this.get('GRPC');
    // readonly SECRETS = this.get('SECRETS');
    // readonly AEROSPIKE = this.get('AEROSPIKE');
    // readonly NODE_ENV = this.get('NODE_ENV');
    // readonly S3 = this.get('S3');
    // readonly SCHEDULER = this.get('SCHEDULER');
    constructor(private config: ConfigService<EnvConfig, true>) { }
    get<Key extends keyof EnvConfig>(key: Key): EnvConfig[Key] {
        return this.config.get(key);
    }
}