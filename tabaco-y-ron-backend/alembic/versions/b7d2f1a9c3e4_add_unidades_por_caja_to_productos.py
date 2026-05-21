"""add unidades_por_caja to productos

Revision ID: b7d2f1a9c3e4
Revises: 4267195879a5
Create Date: 2026-05-20 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7d2f1a9c3e4'
down_revision: Union[str, None] = '4267195879a5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('productos', sa.Column('unidades_por_caja', sa.Integer(), nullable=True))


def downgrade() -> None:
    op.drop_column('productos', 'unidades_por_caja')
