from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField, SubmitField, EmailField, IntegerField
from wtforms.validators import DataRequired, Email, EqualTo, Length


class RegisterForm(FlaskForm):
    surname = StringField('Фамилия', validators=[DataRequired()])
    name = StringField('Имя', validators=[DataRequired()])
    email = EmailField('Почта', validators=[DataRequired(), Email()])
    password = PasswordField(
        'Пароль', validators=[DataRequired(), Length(min=8, message='Минимум 8 символов.')]
    )
    password_again = PasswordField(
        'Повторите пароль',
        validators=[DataRequired(), EqualTo('password', message='Пароли должны совпадать.')]
    )
    submit = SubmitField('Зарегистрироваться')
