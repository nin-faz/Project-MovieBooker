import { Controller, Get, Param, Query } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';

@Controller()
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}
    @Get('/movies')
    @ApiOkResponse({
        description: 'List of all movies',
    })
    getAllMovies(
        @Query() params: { title: string; page: number; sort: string },
    ) {
        return this.moviesService.getAllMovies(params);
    }

    @Get('/movie/:movieId')
    @ApiOkResponse({
        description: 'Get movie by ID',
    })
    @ApiQuery({
        name: 'movie_id',
        type: Number,
        required: true,
        example: 939243,
    })
    @ApiBadRequestResponse({
        description: 'Invalid Movie ID',
    })
    getMovieById(@Query() params: { movie_id: number }) {
        return this.moviesService.getMovieById(params);
    }

    @Get('/search/movie')
    @ApiOkResponse({
        description: 'Get movie by name',
    })
    @ApiNotFoundResponse({
        description: 'No movie found or invalid page number',
    })
    @ApiQuery({
        name: 'title',
        type: 'string',
        example: 'The Avengers',
    })
    @ApiQuery({
        name: 'page',
        type: Number,
        example: 1,
        required: false,
    })
    getMovie(@Query() params: { title: string | null; page: number | null }) {
        return this.moviesService.getMovie(params);
    }

    @Get('/discover/movie')
    @ApiOkResponse({
        description: 'Get movie by filter',
    })
    @ApiBadRequestResponse({
        description: 'Invalid sort parameter ',
    })
    @ApiQuery({
        name: 'sort',
        type: 'string',
        example: 'title.asc',
    })
    getFilteredMovies(@Query() params: { sort: string }) {
        return this.moviesService.getFilteredMovies(params);
    }
}
