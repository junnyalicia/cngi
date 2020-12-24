from flask import Blueprint, jsonify, request

from .forms import CategoryForm
from .models import Category
from .. import db
from ..auth import jwt_required
from ..question.models import Question

category_blueprint = Blueprint('category', __name__)


@category_blueprint.route('/', methods=['GET'])
@jwt_required()
def list_categories():
    cat = Category.query.all()
    return jsonify({'status': 'SUCCESS',
                    'data': list(map(
                        lambda x: {k: v for k, v in x.__dict__.items() if not k.startswith('_')},
                        cat
                    ))})


@category_blueprint.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_category(id):
    cat = Category.query.get(id)
    if cat:
        return jsonify({'status': 'SUCCESS', 'data': {k: v for k, v in cat.__dict__.items() if not k.startswith('_')}})
    else:
        return jsonify({'status': 'E_NOT_FOUND'}), 404


@category_blueprint.route('/', methods=['PUT'])
@jwt_required()
def new_category():
    form = CategoryForm.from_json(request.json)
    if form.validate():
        cat = Category()
        form.populate_obj(cat)
        db.session.add(cat)
        db.session.commit()
        return jsonify({'status': 'SUCCESS'})
    else:
        return jsonify({'status': 'E_FORM_INVALID'}), 400


@category_blueprint.route('/<int:id>', methods=['POST'])
@jwt_required()
def update_category(id):
    cat = Category.query.get(id)
    if not cat:
        return jsonify({'status': 'E_NOT_FOUND'}), 404
    form = CategoryForm.from_json(request.json)
    if form.validate():
        for field_name, value in form.data.items():
            setattr(cat, field_name, value)
        db.session.commit()
        return jsonify({'status': 'SUCCESS'})
    else:
        return jsonify({'status': 'E_FORM_INVALID'}), 400


@category_blueprint.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_category(id):
    cat = Category.query.get(id)
    if not cat:
        return jsonify({'status': 'E_NOT_FOUND'}), 404
    if Category.query.filter_by(parent=cat.id).count() != 0:
        return jsonify({'status': 'E_CATEGORY_HAS_CHILDREN'}), 400
    if Question.query.filter_by(category_id=cat.id).count() != 0:
        return jsonify({'status': 'E_CATEGORY_HAS_CHILDREN'}), 400
    db.session.delete(cat)
    db.session.commit()
    return jsonify({'status': 'SUCCESS'})
