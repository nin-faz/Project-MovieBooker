import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

@Injectable()
export class MoviesService {
    async getAllMovies({
        title,
        page,
        sort,
    }: {
        title: string;
        page: number;
        sort: string;
    }) {
        if (title) {
            return this.getMovie({ title, page });
        }
        if (sort) {
            return this.getFilteredMovies({ sort });
        }

        const url = 'https://api.themoviedb.org/3/movie/popular';
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.JWT_API}`,
            },
        };

        const response = await fetch(url, options)
            .then((res) => res.json())
            .catch((err) => console.error(err));

        if (response.total_results === 0) {
            throw new NotFoundException('No movies found');
        }

        return response;
    }

    async getMovieById(movieId: number): Promise<any> {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.JWT_API}`,
            },
        };

        if (!url) {
            throw new NotFoundException('Page not found');
        }

        const response = await fetch(url, options)
            .then((res) => res.json())
            .catch((err) => {
                console.error(err);
            });

        if (!response) {
            throw new BadRequestException('Invalid Movie ID');
        }

        return {
            title: response.title,
            poster: response.poster_path,
            description: response.overview,
            vote_average: response.vote_average,
            video: response.video,
            release_date: response.release_date,
            original_language: response.original_language,
            adult: response.adult,
        };
    }

    async getMovie({
        title,
        page,
    }: {
        title?: string;
        page?: number;
    }): Promise<any> {
        let url = `https://api.themoviedb.org/3/search/movie?query=${title}`;
        if (page) {
            url += `&page=${page}`;
        }

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.JWT_API}`,
            },
        };

        const response = await fetch(url, options)
            .then((res) => res.json())
            .catch((err) => console.error(err));

        console.log('API Response:', response);

        const totalPage = response.total_pages;
        if (page != null && page > totalPage) {
            throw new NotFoundException('Invalid page number');
        }

        if (response.results.length === 0) {
            throw new NotFoundException('No movie found');
        }

        return response;
    }

    async getFilteredMovies({ sort }: { sort: string }) {
        const filter = [
            'original_title.asc',
            'original_title.desc',
            'popularity.asc',
            'popularity.desc',
            'revenue.asc',
            'revenue.desc',
            'primary_release_date.asc',
            'primary_release_date.desc',
            'title.asc',
            'title.desc',
            'vote_average.asc',
            'vote_average.desc',
            'vote_count.asc',
            'vote_count.desc',
        ];

        if (!filter.includes(sort)) {
            throw new BadRequestException('Invalid sort parameter');
        }

        const url = `https://api.themoviedb.org/3/discover/movie?sort_by=${sort}&language=en-US`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.JWT_API}`,
            },
        };

        const response = fetch(url, options)
            .then((res) => res.json())
            .catch((err) => console.error(err));

        return response;
    }
}
