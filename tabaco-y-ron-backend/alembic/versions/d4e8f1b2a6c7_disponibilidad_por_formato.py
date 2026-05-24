"""disponibilidad por formato (caja / individual)

Añade dos booleanos a `productos`:
  - disponible_caja: existencia en caja
  - disponible_individual: existencia del tabaco suelto (por unidad)

Las filas existentes se rellenan con TRUE (disponible) para no ocultar precios
ya publicados. El frontend oculta el precio de un formato cuando su flag es False.

Revision ID: d4e8f1b2a6c7
Revises: b7d2f1a9c3e4
Create Date: 2026-05-22 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "d4e8f1b2a6c7"
down_revision: Union[str, None] = "b7d2f1a9c3e4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "productos",
        sa.Column(
            "disponible_caja",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )
    op.add_column(
        "productos",
        sa.Column(
            "disponible_individual",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("true"),
        ),
    )


def downgrade() -> None:
    op.drop_column("productos", "disponible_individual")
    op.drop_column("productos", "disponible_caja")
