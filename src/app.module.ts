import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { McpModule } from './mcp';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GoogleDriveModule,
    // GoogleapisModule,
    AuthModule,
    PrismaModule,
    UserModule,
    McpModule.forRoot({
      name: 'mpc-test',
      version: '0.0.1',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
