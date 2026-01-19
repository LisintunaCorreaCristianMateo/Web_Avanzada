from typing import List, Optional
from .models import Client, ClientCreate, ClientUpdate
import threading

_lock = threading.Lock()
_db: List[Client] = []
_next_id = 1


def _get_next_id() -> int:
    global _next_id
    with _lock:
        nid = _next_id
        _next_id += 1
    return nid


def _create_client_data(name: str, email: str, age: Optional[int] = None) -> ClientCreate:
    return ClientCreate(name=name, email=email, age=age)


def create_client(data: ClientCreate) -> Client:
    client = Client(id=_get_next_id(), **data.dict())
    _db.append(client)
    return client


def get_client(client_id: int) -> Optional[Client]:
    for c in _db:
        if c.id == client_id:
            return c
    return None


def list_clients(skip: int = 0, limit: int = 100) -> List[Client]:
    return _db[skip: skip + limit]


def update_client(client_id: int, data: ClientUpdate) -> Optional[Client]:
    client = get_client(client_id)
    if not client:
        return None
    update_data = data.dict(exclude_unset=True)
    for k, v in update_data.items():
        setattr(client, k, v)
    return client


def delete_client(client_id: int) -> bool:
    global _db
    for i, c in enumerate(_db):
        if c.id == client_id:
            _db.pop(i)
            return True
    return False


def search_clients(q: str) -> List[Client]:
    qlow = q.lower()
    return [c for c in _db if qlow in c.name.lower() or qlow in c.email.lower()]
