import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MoviesModule } from './movies/movies.module';

@Module({
    imports: [
        UserModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MoviesModule,
    ],
})
export class AppModule {}
