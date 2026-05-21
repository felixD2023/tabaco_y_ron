from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings


class DatabaseSessionManager:
    """Singleton que encapsula engine + sessionmaker.

    El engine y el sessionmaker se crean una sola vez por proceso. La sesión
    SQL se entrega como recurso por petición a través de `session()`.
    """

    _instance: "DatabaseSessionManager | None" = None

    def __new__(cls) -> "DatabaseSessionManager":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._init_engine()
        return cls._instance

    def _init_engine(self) -> None:
        self._engine: AsyncEngine = create_async_engine(
            settings.async_database_url,
            echo=False,
            pool_pre_ping=True,
        )
        self._sessionmaker: async_sessionmaker[AsyncSession] = async_sessionmaker(
            bind=self._engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autoflush=False,
        )

    @property
    def engine(self) -> AsyncEngine:
        return self._engine

    async def session(self) -> AsyncIterator[AsyncSession]:
        async with self._sessionmaker() as session:
            yield session

    async def close(self) -> None:
        await self._engine.dispose()


db_manager = DatabaseSessionManager()

# Reexport del sessionmaker para scripts fuera del ciclo HTTP (seeds, jobs).
AsyncSessionLocal = db_manager._sessionmaker


async def get_db() -> AsyncIterator[AsyncSession]:
    async for session in db_manager.session():
        yield session
