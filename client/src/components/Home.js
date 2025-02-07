import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Row, Col } from "react-bootstrap";

function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/movies")
      .then((response) => {
        console.log(response.data); // Ajoute ceci pour observer la structure de la réponse
        setMovies(response.data.results); // Assumes the API returns a "results" array of movies
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  return (
    <div>
      {!movies.length ? (
        <p>Chargement des films...</p>
      ) : (
        <Row xs={1} md={3} lg={4} className="g-4">
          {movies.map((movie) => (
            <Col key={movie.id}>
              <Card>
                <Card.Img
                  variant="top"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                />
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text>{movie.overview}</Card.Text>
                  <Button variant="primary">Réserver</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Home;
