import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { MoviesModule } from '../src/movies/movies.module';
import { INestApplication } from '@nestjs/common';
import { MoviesService } from '../src/movies/movies.service';
import * as dotenv from 'dotenv';
dotenv.config();

describe('MoviesController (e2e)', () => {
    let app: INestApplication;
    let service: MoviesService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [MoviesModule],
        }).compile();

        app = module.createNestApplication();
        service = module.get<MoviesService>(MoviesService);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /movies - should return all movies', async () => {
        const mockMovies = { results: [{ movieId: 1, title: 'Test Movie' }] };
        jest.spyOn(service, 'getAllMovies').mockResolvedValue(mockMovies);

        const response = await request(app.getHttpServer())
            .get('/movies')
            .query({ title: 'Test', page: 1, sort: 'popularity.desc' })
            .expect(200);

        expect(response.body).toEqual(mockMovies);
        expect(service.getAllMovies).toHaveBeenCalled();
    });

    it('GET /movie/:movieId - should return movie by ID', async () => {
        const movieId = 970450;

        const mockMovie = {
            adult: false,
            id: 970450,
            original_language: 'en',
            overview:
                'A year after a supermoon’s light activated a dormant gene, transforming humans into bloodthirsty werewolves and causing nearly a billion deaths, the nightmare resurfaces as the supermoon rises again. Two scientists attempt to stop the mutation but fail and must now struggle to reach one of their family homes.',
            poster_path: '/cRTctVlwvMdXVsaYbX5qfkittDP.jpg',
            release_date: '2024-12-04',
            title: 'Werewolves',
            video: false,
            vote_average: 6.2,
        };

        const getMovieByIdSpy = jest
            .spyOn(service, 'getMovieById')
            .mockResolvedValue(mockMovie);

        const response = await request(app.getHttpServer())
            .get(`/movie/${movieId}`)
            .set('Authorization', `Bearer ${process.env.JWT_API}`)
            .expect(200);

        const { id, ...movieWithoutId } = response.body;
        const { id: mockId, ...mockMovieWithoutId } = mockMovie;

        expect(movieWithoutId).toEqual(mockMovieWithoutId);
        expect(getMovieByIdSpy).toHaveBeenCalledWith(movieId);
    });

    it('GET /movies/filtered - should return filtered results', async () => {
        const mockFilteredMovies = {
            results: [{ id: 1, title: 'Filtered Movie' }],
        };
        jest.spyOn(service, 'getFilteredMovies').mockResolvedValue(
            mockFilteredMovies,
        );

        const response = await request(app.getHttpServer())
            .get('/discover/movie')
            .query({ sort: 'popularity.desc' })
            .expect(200);

        expect(response.body).toEqual(mockFilteredMovies);
        expect(service.getFilteredMovies).toHaveBeenCalledWith({
            sort: 'popularity.desc',
        });
    });
});
