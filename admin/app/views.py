from flask import Blueprint

from .admin.views import admin_blueprint
from .category.views import category_blueprint
from .question.views import question_blueprint

main_blueprint = Blueprint('main', __name__)

views = {
    '/': main_blueprint,
    '/admin': admin_blueprint,
    '/categories': category_blueprint,
    '/questions': question_blueprint,
}
