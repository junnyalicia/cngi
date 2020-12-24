from bert_serving.client import BertClient
from elasticsearch import Elasticsearch
from flask import Blueprint, current_app, request, jsonify

from app.models import Question, Category

bp = Blueprint('bert', __name__)


@bp.route('/query')
def query_answer():
    index_name = current_app.config['ES_INDEX_NAME']
    ec = Elasticsearch(current_app.config['ES_SERVERS'])
    bc = BertClient(ip=current_app.config['BERT_SERVER'], timeout=30000)
    text = request.args.get('question', '').strip()
    if len(text) < 4:
        return jsonify({'code': 'E_QUESTION_TOO_SHORT', 'message': '问题过短'})
    tqv = bc.encode([text])
    response = ec.search(index=index_name, body={
        'query': {
            'script_score': {
                'query': {'match_all': {}},
                'script': {
                    'source': 'cosineSimilarity(params.query_vector, doc[\'question_vector\']) + 1.0',
                    'params': {'query_vector': tqv[0].tolist()}
                }
            }
        },
        '_source': {'includes': ['question_id']}
    })
    res = []
    handled_ids = set()
    for hit in response['hits']['hits']:
        if hit['_source']['question_id'] not in handled_ids:
            q = Question.query.get(hit['_source']['question_id'])
            c = Category.query.get(q.category_id)
            cn = c.name
            while c.parent is not None:
                c = Category.query.get(c.parent)
                cn = c.name + ' / ' + cn
            if q:
                res.append({
                    'question_id': q.id,
                    'category_id': q.category_id,
                    'category_path': cn,
                    'question': q.question,
                    'answer': q.answer,
                    'possibility': hit['_score'],
                })
                handled_ids.add(q.id)
        if len(handled_ids) > 5:
            break
    if len(res) == 0:
        return jsonify({'code': 'E_NO_HIT', 'message': '数据库中未检索到问题'})
    return jsonify({'code': 'SUCCESS', 'data': {'user_question': text, 'results': res}})
