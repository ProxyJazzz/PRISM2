import logging
from typing import List, Dict, Any
from database import get_db_connection

logger = logging.getLogger(__name__)

def find_similar_proposals(embedding: List[float], limit: int = 5) -> List[Dict[str, Any]]:
    """
    Finds the most similar proposals from the database using pgvector's cosine distance operator (<=>).
    Returns a sorted list of similar proposals excluding the raw_text to save bandwidth.
    """
    conn = None
    cursor = None
    results = []
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Use exact pgvector (<=>) operator for cosine distance. 
        # Similarity = 1 - distance, thus sort by distance ASC (most similar first)
        query = """
        SELECT id, file_name, 1 - (embedding <=> %s::vector) AS similarity
        FROM proposals
        ORDER BY embedding <=> %s::vector
        LIMIT %s;
        """
        
        # Pass the embedding array directly. pgvector handles the conversion.
        cursor.execute(query, (embedding, embedding, limit))
        rows = cursor.fetchall()
        
        for row in rows:
            results.append({
                "proposal_id": row[0],
                "file_name": row[1],
                "similarity": float(row[2])
            })
            
    except Exception as e:
        logger.error(f"Error executing similarity search: {e}")
        # Allow it to fail gracefully, returning empty array
        return []
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
    return results


def check_duplicate_hash(document_hash: str):
    """
    Checks if a document with the given hash already exists in the database.
    Returns a tuple of (id, file_name) if found, otherwise None.
    """
    conn = None
    cursor = None
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
        SELECT id, file_name
        FROM proposals
        WHERE document_hash = %s
        LIMIT 1;
        """
        
        cursor.execute(query, (document_hash,))
        result = cursor.fetchone()
        
        return result
        
    except Exception as e:
        logger.error(f"Error checking duplicate hash: {e}")
        return None
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def store_proposal(file_name: str, pages: int, text_length: int, 
                   structured_data: dict, raw_text: str, embedding: List[float], document_hash: str) -> int:
    """
    Saves the analyzed proposal along with its vector embedding and hash to the database.
    Returns the newly generated proposal ID.
    """
    conn = None
    cursor = None
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
        INSERT INTO proposals (
            file_name, pages, text_length, objectives, methodology, 
            budget_summary, timeline, risk_factors, raw_text, embedding, document_hash
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s::vector, %s)
        RETURNING id;
        """
        
        values = (
            file_name,
            pages,
            text_length,
            structured_data.get("objectives", "Not Found"),
            structured_data.get("methodology", "Not Found"),
            structured_data.get("budget_summary", "Not Found"),
            structured_data.get("timeline", "Not Found"),
            structured_data.get("risk_factors", []),
            raw_text,
            embedding,
            document_hash
        )
        
        cursor.execute(query, values)
        new_id = cursor.fetchone()[0]
        
        # Commit the transaction
        conn.commit()
        return new_id
        
    except Exception as e:
        if conn:
            conn.rollback() # Ensure no partial inserts on failure
        logger.error(f"Failed to store proposal: {e}")
        raise e
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
