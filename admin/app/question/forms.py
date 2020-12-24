from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, ValidationError

from ..category.models import Category
from ..models import Question


class QuestionForm(FlaskForm):
    category_id = IntegerField()
    question = StringField()
    answer = StringField()

    @staticmethod
    def validate_category_id(form, field):
        if Category.query.get(field.data) is None:
            raise ValidationError('Category invalid.')


class QuestionAlternativeForm(FlaskForm):
    question_id = IntegerField()
    question = StringField()

    @staticmethod
    def validate_question_id(form, field):
        if Question.query.get(field.data) is None:
            raise ValidationError('Parent question ID invalid.')
