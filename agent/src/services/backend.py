from src.schemas.agent import Initiative
from src.config import env

import requests

EMBEDDING_THRESHOLD = env.AGENT_EMBEDDING_THRESHOLD


def find_similar_embeddings(initiative: Initiative, limit=10) -> list[dict]:
    """
    Find similar initiatives using embeddings.
    """
    url = f"{env.BACKEND_URL}/api/embeddings/similar"

    payload = {"text": initiative.__str__(), "limit": limit}
    headers = {"accept": "*/*", "Content-Type": "application/json"}

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 201:
        found_initiatives = response.json()
        similar_initiatives = []

        for item in found_initiatives:
            if item.get("distance", 0) <= EMBEDDING_THRESHOLD:
                similar_initiatives.append(item)

        return similar_initiatives
    else:
        response.raise_for_status()
