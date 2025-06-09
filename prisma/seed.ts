import { AppModule } from '@/app.module';
import { AuthService } from '@/auth/auth.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import { NestFactory } from '@nestjs/core';

let globalPrismaService: PrismaService;

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const prismaService = app.get<PrismaService>(PrismaService);
  await prismaService.$connect();
  globalPrismaService = prismaService;

  const authService = app.get<AuthService>(AuthService);
  const userService = app.get<UserService>(UserService);

  let userAdmin = await userService.getAdminUser();
  if (!userAdmin) {
    const registerData = await authService.register({
      email: 'admin@gmail.com',
      password: '1',
      fullName: 'Adminitrator',
      isAdmin: true,
    });
    userAdmin = registerData.user;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await globalPrismaService.$disconnect();
  });
