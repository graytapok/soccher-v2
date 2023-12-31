"""empty message

Revision ID: ccc73245ac15
Revises: 035cf8fc0f81
Create Date: 2023-12-12 21:08:34.477297

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ccc73245ac15'
down_revision = '035cf8fc0f81'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('email_confirmed', sa.Boolean(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('email_confirmed')

    # ### end Alembic commands ###
