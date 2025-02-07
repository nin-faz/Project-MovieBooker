import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../movies.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
    let service: MoviesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MoviesService],
        }).compile();

        service = module.get<MoviesService>(MoviesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getMovieById', () => {
        it('should return movie data if movie_id is valid', async () => {
            jest.spyOn(global, 'fetch').mockResolvedValue({
                json: jest.fn().mockResolvedValue({
                    id: 123,
                    title: 'Test Movie',
                    vote_average: 8.5,
                    video: false,
                    release_date: '2024-02-01',
                    original_language: 'en',
                    adult: false,
                    overview: 'Test description',
                    poster_path: 'test_poster.jpg',
                }),
            } as any);

            await expect(service.getMovieById(123)).resolves.toEqual({
                title: 'Test Movie',
                poster: 'test_poster.jpg',
                description: 'Test description',
                vote_average: 8.5,
                video: false,
                release_date: '2024-02-01',
                original_language: 'en',
                adult: false,
            });
        });

        it('should throw BadRequestException if movie_id is invalid', async () => {
            jest.spyOn(global, 'fetch').mockResolvedValue({
                json: jest.fn().mockResolvedValue(null),
            } as any);

            await expect(service.getMovieById(999)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('getMovie', () => {
        it('should return movie results if title exists', async () => {
            jest.spyOn(global, 'fetch').mockResolvedValue({
                json: jest.fn().mockResolvedValue({
                    total_pages: 1,
                    results: [{ id: 1, title: 'Movie' }],
                }),
            } as any);

            await expect(
                service.getMovie({ title: 'Movie', page: 1 }),
            ).resolves.toEqual({
                total_pages: 1,
                results: [{ id: 1, title: 'Movie' }],
            });
        });

        it('should throw NotFoundException if no movies found', async () => {
            jest.spyOn(global, 'fetch').mockResolvedValue({
                json: jest
                    .fn()
                    .mockResolvedValue({ total_pages: 1, results: [] }),
            } as any);

            await expect(
                service.getMovie({ title: 'Unknown', page: 1 }),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('getFilteredMovies', () => {
        it('should return filtered movie results if sort is valid', async () => {
            jest.spyOn(global, 'fetch').mockResolvedValue({
                json: jest.fn().mockResolvedValue({
                    results: [{ id: 1, title: 'Sorted Movie' }],
                }),
            } as any);

            await expect(
                service.getFilteredMovies({ sort: 'popularity.desc' }),
            ).resolves.toEqual({ results: [{ id: 1, title: 'Sorted Movie' }] });
        });

        it('should throw BadRequestException if sort parameter is invalid', async () => {
            await expect(
                service.getFilteredMovies({ sort: 'invalid.sort' }),
            ).rejects.toThrow(BadRequestException);
        });
    });
});
