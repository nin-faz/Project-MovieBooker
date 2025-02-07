import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { MoviesModule } from '../movies/movies.module';
import { PrismaService } from '../prisma.service';

@Module({
    imports: [MoviesModule],
    providers: [ReservationService, PrismaService],
    controllers: [ReservationController],
})
export class ReservationModule {}
