import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(), // use memory storage for having the buffer
    }),
    ConfigModule.forRoot({
       envFilePath: `env.${process.env.NODE_ENV}`,
       isGlobal: true
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    RestaurantsModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
