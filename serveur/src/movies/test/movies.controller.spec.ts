import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from '../movies.controller';
import { MoviesService } from '../movies.service';
import { BadRequestException } from '@nestjs/common';

describe('MoviesController', () => {
    let controller: MoviesController;
    let service: MoviesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MoviesController],
            providers: [
                {
                    provide: MoviesService,
                    useValue: {
                        getAllMovies: jest.fn(),
                        getMovieById: jest.fn(),
                        getMovie: jest.fn(),
                        getFilteredMovies: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<MoviesController>(MoviesController);
        service = module.get<MoviesService>(MoviesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAllMovies', () => {
        it('should call service.getAllMovies and return the result', async () => {
            const mockResult = { results: [{ id: 1, title: 'Movie' }] };
            jest.spyOn(service, 'getAllMovies').mockResolvedValue(mockResult);

            await expect(
                controller.getAllMovies({
                    title: 'Test',
                    page: 1,
                    sort: 'popularity.desc',
                }),
            ).resolves.toEqual(mockResult);
            expect(service.getAllMovies).toHaveBeenCalledWith({
                title: 'Test',
                page: 1,
                sort: 'popularity.desc',
            });
        });
    });

    describe('getMovieById', () => {
        it('should return movie data for a valid ID', async () => {
            const mockMovie = { id: 123, title: 'Test Movie' };
            jest.spyOn(service, 'getMovieById').mockResolvedValue(mockMovie);

            await expect(
                controller.getMovieById({ movie_id: 123 }),
            ).resolves.toEqual(mockMovie);
            expect(service.getMovieById).toHaveBeenCalledWith({
                movie_id: 123,
            });
        });

        it('should throw BadRequestException for an invalid ID', async () => {
            jest.spyOn(service, 'getMovieById').mockRejectedValue(
                new BadRequestException('Invalid Movie ID'),
            );

            await expect(
                controller.getMovieById({ movie_id: 999 }),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('getMovie', () => {
        it('should return search results', async () => {
            const mockResult = { results: [{ id: 1, title: 'Test' }] };
            jest.spyOn(service, 'getMovie').mockResolvedValue(mockResult);

            await expect(
                controller.getMovie({ title: 'Test', page: 1 }),
            ).resolves.toEqual(mockResult);
        });
    });

    describe('getFilteredMovies', () => {
        it('should return filtered movie results', async () => {
            const mockResult = { results: [{ id: 1, title: 'Sorted Movie' }] };
            jest.spyOn(service, 'getFilteredMovies').mockResolvedValue(
                mockResult,
            );

            await expect(
                controller.getFilteredMovies({ sort: 'popularity.desc' }),
            ).resolves.toEqual(mockResult);
        });
    });
});
