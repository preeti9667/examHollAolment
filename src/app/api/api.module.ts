import { Module } from "@nestjs/common";
import { ApiController } from "./api.controller";
import { ApiService } from "./api.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./users/user.module";

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