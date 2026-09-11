import sqlalchemy
from .db_session import SqlAlchemyBase
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import orm


class Subtheme(SqlAlchemyBase, SerializerMixin):
    __tablename__ = 'subthemes'
    id = sqlalchemy.Column(sqlalchemy.Integer,
                           primary_key=True, autoincrement=True)
    test_id = sqlalchemy.Column(sqlalchemy.Integer, sqlalchemy.ForeignKey('tests.id'))
    title = sqlalchemy.Column(sqlalchemy.String, unique=True)
    description = sqlalchemy.Column(sqlalchemy.String)
    tasks = orm.relationship('Task', back_populates="subtheme")
    test = orm.relationship('Test', back_populates="subthemes")


