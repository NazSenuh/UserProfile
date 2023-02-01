import { Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import {User} from "./users/user.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { UsersController } from "./users/users.controller";
import { UsersModule } from "./users/users.module";
import { AuthModule } from './auth/auth.module';
import {AuthController} from "./auth/auth.controller";
import {AuthService} from "./auth/auth.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:'.env'
    }),
    SequelizeModule.forRoot({

      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User],
      autoLoadModels:true,
      synchronize:true
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

