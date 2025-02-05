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

        return response;
    }

    async getMovieById({ movie_id }: { movie_id: number }): Promise<any> {
        const url = `https://api.themoviedb.org/3/movie/${movie_id}?language=en-US`;
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

        if (!response.id) {
            throw new BadRequestException('Invalid Movie ID');
        }

        return response;
    }

    async getMovie({
        title,
        page,
    }: {
        title: string | null;
        page: number | null;
    }): Promise<any> {
        let url = '';
        if (page) {
            url = `https://api.themoviedb.org/3/search/movie?query=${title}&page=${page}`;
        } else {
            url = `https://api.themoviedb.org/3/search/movie?query=${title}`;
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

        if (!filter.includes(sort)) {
            throw new BadRequestException('Invalid sort parameter');
        }
        return response;
    }
}
