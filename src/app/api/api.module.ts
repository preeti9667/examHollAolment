import { Module } from "@nestjs/common";
import { ApiController } from "./api.controller";
import { ApiService } from "./api.service";
import { UserModule } from "./users";
import { AuthModule } from "./auth/auth.module";

@Module({
    imports: [
        UserModule,
        AuthModule
    ],
    exports: [],
    controllers: [ApiController],
    providers: [ApiService]
})
export class ApiModule { }