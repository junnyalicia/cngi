from flask import Blueprint, request

from app.models import db, QuestionAlternativeAsking

bp = Blueprint('feedback', __name__)


@bp.route('/resolved')
def associate_resolved_question():
    user_question = request.json.get('user_question')
    question_id = request.json.get('question_id')
    if QuestionAlternativeAsking.query.filter_by(question=user_question).count() == 0:
        alt = QuestionAlternativeAsking(question=user_question, question_id=question_id)
        db.session.add(alt)
        db.commit()
        return '', 201  # Created
    else:
        return '', 202  # Accepted


@bp.route('/unresolved')
def add_unresolved_question():
    user_question = request.json.get('user_question')
    # TODO: add into admin's todo list
    return '', 201
