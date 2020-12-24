from bert_serving.client import BertClient
from elasticsearch import Elasticsearch
from flask import Blueprint, current_app, jsonify

from app.auth import jwt_required
from app.question.models import Question

admin_blueprint = Blueprint('admin', __name__)


@admin_blueprint.route('/reconstruct-es-index')
@jwt_required()
def reconstruct_es_index():
    index_name = current_app.config['ES_INDEX_NAME']
    batch_size = current_app.config['BERT_BATCH_SIZE']
    ec = Elasticsearch(current_app.config['ES_SERVERS'])
    bc = BertClient(ip=current_app.config['BERT_SERVER'], timeout=30000)
    ec.indices.delete(index=index_name, ignore=[404])
    ec.indices.create(index=index_name, body={
        "settings": {"number_of_shards": 2, "number_of_replicas": 1},
        "mappings": {
            "dynamic": "true",
            "_source": {"enabled": "true"},
            "properties": {
                "question_id": {"type": "integer"},
                "question": {"type": "keyword"},
                "question_vector": {"type": "dense_vector", "dims": 768},
            }
        }
    })
    questions = Question.query.all()
    q = []
    for question in questions:
        q += [(question.id, question.question)] + list(
            map(lambda x: (question.id, x.question), question.alternative_asking))
    for i in range(0, len(q), batch_size):
        this_batch = q[i:min(i + batch_size, len(q))]
        batch_questions = list(map(lambda x: x[1], this_batch))
        res = bc.encode(batch_questions)
        for (question_id, question), v in zip(this_batch, res):
            ec.index(index=index_name, body={
                'question_id': question_id,
                'question': question,
                'question_vector': v.tolist(),
            })
    return jsonify({'code': 'SUCCESS', 'message': 'Question index are rebuilt.'})
