from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, ValidationError

from app.category.models import Category


class CategoryForm(FlaskForm):
    parent = IntegerField()
    name = StringField()

    @staticmethod
    def validate_parent(form, field):
        if field.data is not None and Category.query.get(field.data) is None:
            raise ValidationError('Parent category invalid.')
