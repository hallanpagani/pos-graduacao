import { RmqModule } from "@app/comum";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "@app/comum";
import { AuthController } from "./auth.controller";
import { SERVICO_AUTH } from "./contantes/servico";

@Module({
    imports: [
      ConfigModule.forRoot({
        //isGlobal: true,
        envFilePath: './apps/auth/.env',
      }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('JWT_KEY'),
              signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES') },
            }),
            inject: [ConfigService],
          }),
        RmqModule.register({
            name : SERVICO_AUTH,
        })
    ],
    providers : [JwtStrategy],
    controllers : [AuthController],
    exports: [JwtStrategy]
})
export class AuthModule {}