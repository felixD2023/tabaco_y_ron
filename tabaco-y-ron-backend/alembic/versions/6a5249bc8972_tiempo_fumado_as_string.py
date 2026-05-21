"""tiempo_fumado as string

Revision ID: 6a5249bc8972
Revises: c70eb5a2a893
Create Date: 2026-05-18 20:29:52.084947

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6a5249bc8972'
down_revision: Union[str, None] = 'c70eb5a2a893'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('productos', sa.Column('tiempo_fumado', sa.String(length=60), nullable=True))
    op.drop_constraint('ck_producto_tiempo_range', 'productos', type_='check')
    op.drop_column('productos', 'tiempo_fumado_max')
    op.drop_column('productos', 'tiempo_fumado_min')


def downgrade() -> None:
    op.add_column('productos', sa.Column('tiempo_fumado_min', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('productos', sa.Column('tiempo_fumado_max', sa.INTEGER(), autoincrement=False, nullable=True))
    op.create_check_constraint(
        'ck_producto_tiempo_range',
        'productos',
        'tiempo_fumado_min IS NULL OR tiempo_fumado_max IS NULL '
        'OR tiempo_fumado_min <= tiempo_fumado_max',
    )
    op.drop_column('productos', 'tiempo_fumado')
