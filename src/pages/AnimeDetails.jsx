import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAnimeDetails = async () => {
    try {
      setLoading(true);

      const query = `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
            }
            episodes
            status
            averageScore
            duration
            genres
            siteUrl
            description
            startDate {
              year
              month
              day
            }
          }
        }
      `;

      const variables = {
        id: parseInt(id)
      };

      const response = await axios.post(
        'https://graphql.anilist.co',
        { query, variables },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setAnime(response.data.data.Media);
    } catch (error) {
      console.error('Error fetching anime details', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimeDetails();
  }, [id]);

  // 💡 Mobile responsive styles
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media (max-width: 768px) {
        .details-container {
          flex-direction: column !important;
        }

        .anime-info {
          padding: 0 !important;
          border: none !important;
        }

        .anime-image {
          width: 100% !important;
          height: auto;
        }

        .anime-synopsis {
          padding: 0 0.5rem;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (loading) return <p style={{ color: 'orange' }}>Loading details...</p>;
  if (!anime) return <p style={{ color: 'red' }}>Anime not found.</p>;

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>← Back to Home</Link>

      <div style={styles.detailsContainer} className="details-container">
        <img
          src={anime.coverImage.large}
          alt={anime.title.english || anime.title.romaji}
          style={styles.image}
          className="anime-image"
        />

        <div style={styles.info} className="anime-info">
          <h1 style={{ marginBottom: '1rem' }}>
            {anime.title.english || anime.title.romaji}
          </h1>
          <p><strong>Episodes:</strong> {anime.episodes || 'N/A'}</p>
          <p><strong>Status:</strong> {anime.status}</p>
          <p><strong>Score:</strong> {anime.averageScore || 'N/A'}</p>
          <p><strong>Duration:</strong> {anime.duration} min/ep</p>
          <p><strong>Aired:</strong> {anime.startDate.year}-{anime.startDate.month}-{anime.startDate.day}</p>
          <p><strong>Genres:</strong> {anime.genres.join(', ')}</p>

          <a href={anime.siteUrl} target="_blank" rel="noreferrer" style={styles.link}>
            📖 View on AniList
          </a>
        </div>
      </div>

      <div style={styles.synopsis} className="anime-synopsis">
        <h2 style={{ marginBottom: '0.5rem' }}>Synopsis:</h2>
        <p dangerouslySetInnerHTML={{ __html: anime.description }}></p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    color: '#fff',
    backgroundColor: '#1c1c2b',
    minHeight: '100vh',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  backLink: {
    color: '#00aced',
    marginBottom: '1rem',
    display: 'inline-block'
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '2rem',
    marginBottom: '2rem',
    alignItems: 'flex-start'
  },
  image: {
    width: '250px',
    borderRadius: '10px'
  },
  info: {
    flex: 1,
    fontSize: '1.05rem',
    lineHeight: '1.5',
    padding: '1rem',
    border: '1px solid #333',
    borderRadius: '8px'
  },
  link: {
    color: '#00aced',
    marginTop: '1rem',
    display: 'inline-block'
  },
  synopsis: {
    marginTop: '2rem'
  }
};

export default AnimeDetails;
