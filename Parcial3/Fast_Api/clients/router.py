from fastapi import APIRouter, HTTPException, Query, Path
from typing import List
from .models import Client, ClientCreate, ClientUpdate
from .crud import create_client, get_client, list_clients, update_client, delete_client, search_clients

router = APIRouter()


@router.post("/", response_model=Client, status_code=201)
def create(c: ClientCreate):
    return create_client(c)


@router.get("/", response_model=List[Client])
def read_all(skip: int = 0, limit: int = 100):
    return list_clients(skip, limit)


@router.get("/search", response_model=List[Client])
def read_search(q: str = Query(..., min_length=1)):
    return search_clients(q)


@router.get("/{client_id}", response_model=Client)
def read_one(client_id: int = Path(..., ge=1)):
    c = get_client(client_id)
    if not c:
        raise HTTPException(status_code=404, detail="Client not found")
    return c


@router.put("/{client_id}", response_model=Client)
def update(client_id: int, data: ClientUpdate):
    c = update_client(client_id, data)
    if not c:
        raise HTTPException(status_code=404, detail="Client not found")
    return c


@router.delete("/{client_id}", status_code=204)
def delete(client_id: int):
    ok = delete_client(client_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Client not found")
    return
