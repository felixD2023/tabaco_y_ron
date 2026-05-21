class RepositoryError(Exception):
    """Error base de la capa de repositorios."""


class NotFoundError(RepositoryError):
    """La entidad solicitada no existe en la BD."""

    def __init__(self, entity: str, identifier: object) -> None:
        super().__init__(f"{entity} con identificador {identifier!r} no encontrado")
        self.entity = entity
        self.identifier = identifier


class AlreadyExistsError(RepositoryError):
    """Violación de unicidad al crear/actualizar una entidad."""

    def __init__(self, entity: str, field: str, value: object) -> None:
        super().__init__(f"Ya existe {entity} con {field}={value!r}")
        self.entity = entity
        self.field = field
        self.value = value
