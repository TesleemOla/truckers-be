import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TrucksModule } from './trucks/trucks.module';
import { ManifestsModule } from './manifests/manifests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/transport-manifest',
    ),
    AuthModule,
    UsersModule,
    TrucksModule,
    ManifestsModule,
  ],
})
export class AppModule {}
