import { Controller, Get, Query, Param } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';

@Controller()
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}
    @Get('/movies')
    @ApiOkResponse({
        description:
            'List of all movies without parameters.<br>' +
            'If title and page are provided, it will return the movie with that title and page. ' +
            'Without page it will just return with title.<br>' +
            'If sort is provided, it will return the movies sorted by the provided parameter.',
    })
    @ApiNotFoundResponse({
        description: 'No movie found or invalid page number',
    })
    @ApiBadRequestResponse({
        description: 'Invalid sort parameter ',
    })
    @ApiQuery({
        name: 'title',
        type: 'string',
        example: 'Harry Potter',
        required: false,
    })
    @ApiQuery({
        name: 'page',
        type: Number,
        example: 2,
        required: false,
    })
    @ApiQuery({
        name: 'sort',
        type: 'string',
        example: 'vote_average.asc',
        required: false,
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
    @ApiParam({
        name: 'movieId',
        type: Number,
        required: true,
        example: 939243,
    })
    @ApiNotFoundResponse({
        description: 'Page not found',
    })
    @ApiBadRequestResponse({
        description: 'Invalid Movie ID',
    })
    getMovieById(@Param('movieId') movieId: string) {
        return this.moviesService.getMovieById(Number(movieId));
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
    getMovie(@Query() params: { title?: string; page?: number }) {
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
