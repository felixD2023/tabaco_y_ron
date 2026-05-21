from pathlib import Path

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1 import auth, marcas, productos, subcategorias, uploads, users, valoraciones
from app.core.config import settings

app = FastAPI(title="Tabaco & Ron API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

upload_path = Path(settings.UPLOAD_DIR)
upload_path.mkdir(parents=True, exist_ok=True)
app.mount(
    "/static/uploads",
    StaticFiles(directory=str(upload_path)),
    name="uploads",
)

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(marcas.router)
api_router.include_router(subcategorias.router)
api_router.include_router(productos.router)
api_router.include_router(valoraciones.router)
api_router.include_router(uploads.router)

app.include_router(api_router)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Tabaco & Ron API", "docs": "/docs"}
