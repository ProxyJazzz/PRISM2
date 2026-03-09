import os
import psycopg2
from psycopg2.extras import execute_values
from pgvector.psycopg2 import register_vector
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

def get_db_connection():
    """
    Creates and returns a connection to the PostgreSQL database.
    Ensures pgvector is registered on the connection.
    """
    try:
        conn = psycopg2.connect(
            dbname=os.environ.get("DB_NAME", "postgres"),
            user=os.environ.get("DB_USER", "postgres"),
            password=os.environ.get("DB_PASSWORD", "password"),
            host=os.environ.get("DB_HOST", "localhost"),
            port=os.environ.get("DB_PORT", "5432")
        )
        
        # Register pgvector type to enable embedding manipulation
        register_vector(conn)
        
        return conn
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        raise e