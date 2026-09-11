import sqlalchemy
from .db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import orm


class Task(SqlAlchemyBase, SerializerMixin):
    __tablename__ = 'tasks'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    subtheme_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('subthemes.id'))
    task = sqlalchemy.Column(sqlalchemy.String)
    type_task = sqlalchemy.Column(sqlalchemy.Integer)
    subtheme = orm.relationship('Subtheme', back_populates="tasks")
    answers = orm.relationship('Answer', back_populates="task")

