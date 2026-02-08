import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
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
      process.env.MONGODB_URI!,
      {
        autoIndex: false
      }
    ),
    CacheModule.register({
      isGlobal: true,
      ttl: 5000, // default ttl in milliseconds (5 seconds)
      max: 100, // maximum number of items in cache
    }),
    AuthModule,
    UsersModule,
    TrucksModule,
    ManifestsModule,
  ],
})
export class AppModule { }
