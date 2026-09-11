import sqlalchemy
from .db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import orm


class Answer(SqlAlchemyBase, SerializerMixin):
    __tablename__ = 'answers'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    task_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('tasks.id'))
    right = sqlalchemy.Column(sqlalchemy.Integer)
    answer = sqlalchemy.Column(sqlalchemy.String)
    task = orm.relationship('Task', back_populates="answers")
