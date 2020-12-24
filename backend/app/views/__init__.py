from . import bert, feedback

blueprints = {
    '/api/v2/bert': bert.bp,
    '/api/v2/feedback': feedback.bp,
}
