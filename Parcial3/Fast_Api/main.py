from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from clients.router import router as clients_router
from clients import crud

app = FastAPI(title="API Clientes", version="0.1")

app.include_router(clients_router, prefix="/clients", tags=["clients"])


@app.on_event("startup")
def startup_event():
    # Añadir algunos clientes de ejemplo si la base está vacía
    if not crud.list_clients():
        crud.create_client(crud._create_client_data("Juan Perez", "juan@example.com", 30))
        crud.create_client(crud._create_client_data("Ana Gómez", "ana@example.com", 25))


@app.get("/")
def read_root():
    return {"mensaje": "Instalación correcta de FastAPI - API Clientes"}


# ------------------ Ejemplo: base de datos simulada de países ------------------
class Pais(BaseModel):
    nombre: str
    capital: str
    poblacion: int


PAISES_DB = [
    {"nombre": "Ecuador", "capital": "Quito", "poblacion": 17643060},
    {"nombre": "Argentina", "capital": "Buenos Aires", "poblacion": 45780000},
    {"nombre": "España", "capital": "Madrid", "poblacion": 47350000},
    {"nombre": "México", "capital": "Ciudad de México", "poblacion": 126190000},
    {"nombre": "Chile", "capital": "Santiago", "poblacion": 19116000},
]


@app.get("/paises", response_model=list[Pais])
def listar_paises():
    """Devuelve la lista completa de países (base simulada)."""
    return PAISES_DB


@app.get("/pais/{nombre}", response_model=Pais)
def obtener_pais(nombre: str):
    """Busca un país por nombre (case-insensitive). Devuelve 404 si no existe."""
    nombre_l = nombre.strip().lower()
    for p in PAISES_DB:
        if p["nombre"].lower() == nombre_l:
            return p
    raise HTTPException(status_code=404, detail="País no encontrado")



# Para desarrollo:
# .venv\Scripts\python.exe -m uvicorn main:app --reload
# o activar el venv y ejecutar: uvicorn main:app --reload