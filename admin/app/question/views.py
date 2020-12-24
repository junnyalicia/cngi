from flask import Blueprint, jsonify, request

from .forms import QuestionForm, QuestionAlternativeForm
from .. import db
from ..auth import jwt_required
from ..models import Question, QuestionAlternativeAsking

question_blueprint = Blueprint('question', __name__)


@question_blueprint.route('/', methods=['GET'])
@jwt_required()
def list_questions():
    q = Question.query.all()
    return jsonify({
        'status': 'SUCCESS',
        'data': list(map(
            lambda x: {k: v for k, v in x.__dict__.items() if not k.startswith('_')},
            q
        ))})


@question_blueprint.route('/list_by_categories/<int:cid>', methods=['GET'])
@jwt_required()
def list_questions_by_category(cid: int):
    q = Question.query.filter_by(category_id=cid).all()
    return jsonify({
        'status': 'SUCCESS',
        'data': list(map(
            lambda x: {k: v for k, v in x.__dict__.items() if not k.startswith('_')},
            q
        ))})


@question_blueprint.route('/', methods=['PUT'])
@jwt_required()
def new_question():
    form = QuestionForm.from_json(request.json)
    # if form.validate(extra_validators={x: DataRequired() for x in form._fields.keys()}):
    if form.validate():
        q = Question()
        form.populate_obj(q)
        db.session.add(q)
        db.session.commit()
        return jsonify({'status': 'SUCCESS'})
    else:
        return jsonify({'status': 'E_FORM_INVALID'}), 400


@question_blueprint.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_question(id: int):
    q = Question.query.get(id)
    if q:
        return jsonify({'status': 'SUCCESS', 'data': {k: v for k, v in q.__dict__.items() if not k.startswith('_')}})
    else:
        return jsonify({'status': 'E_NOT_FOUND'}), 404


@question_blueprint.route('/<int:id>', methods=['POST'])
@jwt_required()
def update_question(id: int):
    q = Question.query.get(id)
    form = QuestionForm.from_json(request.json)
    if not q:
        return jsonify({'status': 'E_NOT_FOUND'}), 404
    if not form.category_id.data:
        form.category_id.data = q.category_id
    if form.validate():
        for field_name, value in form.data.items():
            if value:
                setattr(q, field_name, value)
        db.session.commit()
        return jsonify({'status': 'SUCCESS'})
    else:
        return jsonify({'status': 'E_FORM_INVALID'}), 400


@question_blueprint.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_question(id: int):
    q = Question.query.get(id)
    if not q:
        return jsonify({'status': 'E_NOT_FOUND'}), 404
    if QuestionAlternativeAsking.query.filter_by(question_id=q.id).count() != 0:
        return jsonify({'status': 'E_QUESTION_HAS_CHILDREN'}), 400
    db.session.delete(q)
    db.session.commit()
    return jsonify({'status': 'SUCCESS'})


@question_blueprint.route('/<int:id>/alternatives', methods=['GET'])
@jwt_required()
def list_alternatives(id: int):
    q = Question.query.get(id)
    if not q:
        return jsonify({'status': 'E_NOT_FOUND'}), 404
    alt = QuestionAlternativeAsking.query.filter_by(question_id=q.id).all()
    return jsonify({'status': 'SUCCESS', 'data': list(map(
        lambda x: {k: v for k, v in x.__dict__.items() if not k.startswith('_')},
        alt
    ))})


@question_blueprint.route('/<int:id>/alternatives', methods=['PUT'])
@jwt_required()
def new_alternative(id: int):
    q = Question.query.get(id)
    if not q:
        return jsonify({'status': 'E_NOT_FOUND'}), 404
    form = QuestionAlternativeForm.from_json(request.json)
    form.question_id.data = q.id
    # if form.validate(extra_validators={x: DataRequired() for x in form._fields.keys()}):
    if form.validate():
        alt = QuestionAlternativeAsking()
        form.populate_obj(alt)
        db.session.add(alt)
        db.session.commit()
        return jsonify({'status': 'SUCCESS'})
    else:
        print(form.errors)
        return jsonify({'status': 'E_FORM_INVALID'}), 400


@question_blueprint.route('/<int:qid>/alternatives/<int:aid>', methods=['GET'])
@jwt_required()
def get_alternative(qid: int, aid: int):
    q = Question.query.get(qid)
    a = QuestionAlternativeAsking.query.get(aid)
    if not q or not a or q.id != a.question_id:
        return jsonify({'status': 'E_NOT_FOUND'}), 404
    return jsonify({'status': 'SUCCESS', 'data': {k: v for k, v in a.__dict__.items() if not k.startswith('_')}})


@question_blueprint.route('/<int:qid>/alternatives/<int:aid>', methods=['POST'])
@jwt_required()
def update_alternative(qid: int, aid: int):
    q = Question.query.get(qid)
    a = QuestionAlternativeAsking.query.get(aid)
    if not q or not a or q.id != a.question_id:
        return jsonify({'status': 'E_NOT_FOUND'}), 404
    form = QuestionAlternativeForm.from_json(request.json)
    form.question_id.data = q.id
    # if form.validate(extra_validators={x: DataRequired() for x in form._fields.keys()}):
    if form.validate():
        for field_name, value in form.data.items():
            if value:
                setattr(a, field_name, value)
        db.session.commit()
        return jsonify({'status': 'SUCCESS'})
    else:
        return jsonify({'status': 'E_FORM_INVALID'}), 400


@question_blueprint.route('/<int:qid>/alternatives/<int:aid>', methods=['DELETE'])
@jwt_required()
def delete_alternative(qid: int, aid: int):
    q = Question.query.get(qid)
    a = QuestionAlternativeAsking.query.get(aid)
    if not q or not a or q.id != a.question_id:
        return jsonify({'status': 'E_NOT_FOUND'}), 404
    db.session.delete(a)
    db.session.commit()
    return jsonify({'status': 'SUCCESS'})
