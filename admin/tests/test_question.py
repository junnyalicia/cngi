import json
from unittest import TestCase, main

from app import db, create_app

app = create_app(environment='testing')


class TestQuestion(TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.app_ctx = app.app_context()
        self.app_ctx.push()
        db.create_all()
        self.create_category({'parent': None, 'name': 'Test'})

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_ctx.pop()

    def create_category(self, data, *args, **kwargs):
        return self.client.put('/categories/', data=json.dumps(data), content_type='application/json', *args, **kwargs)

    def json_post(self, url, data, *args, **kwargs):
        return self.client.post(url, data=json.dumps(data), content_type='application/json', *args, **kwargs)

    def json_put(self, url, data, *args, **kwargs):
        return self.client.put(url, data=json.dumps(data), content_type='application/json', *args, **kwargs)

    def json_delete(self, url, data=None, *args, **kwargs):
        if data:
            return self.client.delete(url, data=json.dumps(data), content_type='application/json', *args, **kwargs)
        else:
            return self.client.delete(url, *args, **kwargs)

    def test_normal(self):
        resp = self.client.get('/questions/')
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data['status'], 'SUCCESS')
        self.assertEqual(len(data['data']), 0)

        resp = self.client.get('/questions/list_by_categories/1')
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data['status'], 'SUCCESS')
        self.assertEqual(len(data['data']), 0)

        resp = self.json_put('/questions/', {'category_id': 1, 'question': 'Q', 'answer': 'A'})
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data['status'], 'SUCCESS')

        resp = self.client.get('/questions/')
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data['status'], 'SUCCESS')
        self.assertEqual(len(data['data']), 1)

        resp = self.client.get('/questions/1')
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data['status'], 'SUCCESS')

        resp = self.json_post('/questions/1', data={'question': 'Question', 'answer': 'Answer'})
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data['status'], 'SUCCESS')

        resp = self.client.get('/questions/1/alternatives')
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data['status'], 'SUCCESS')
        self.assertEqual(len(data['data']), 0)

        resp = self.json_put('/questions/1/alternatives', {'question': 'Q2'})
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data['status'], 'SUCCESS')

        resp = self.client.get('/questions/1/alternatives')
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data['status'], 'SUCCESS')
        self.assertEqual(len(data['data']), 1)

        resp = self.client.get('/questions/1/alternatives/1')
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data['status'], 'SUCCESS')

        resp = self.json_post('/questions/1/alternatives/1', {'question': 'Question 2'})
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data['status'], 'SUCCESS')

        resp = self.json_delete('/questions/1/alternatives/1')
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data['status'], 'SUCCESS')

        resp = self.json_delete('/questions/1')
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data['status'], 'SUCCESS')

        resp = self.client.get('/questions/')
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data)
        self.assertEqual(data['status'], 'SUCCESS')
        self.assertEqual(len(data['data']), 0)


if __name__ == "__main__":
    main()
