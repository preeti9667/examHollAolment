import { PrismaService } from "@app/databases/prisma/prisma.service";
import { LoggerService } from "@app/shared/logger";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    constructor(
        private $prisma: PrismaService,
        private $logger: LoggerService
    ) { }
}