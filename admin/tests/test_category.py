import json
from unittest import TestCase, main

from app import db, create_app

app = create_app(environment='testing')


class TestCategory(TestCase):

    def setUp(self):
        self.client = app.test_client()
        self.app_ctx = app.app_context()
        self.app_ctx.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_ctx.pop()

    def create_category(self, data, *args, **kwargs):
        return self.client.put('/categories/', data=json.dumps(data), content_type='application/json', *args, **kwargs)

    def update_category(self, cid, data, *args, **kwargs):
        return self.client.post('/categories/%d' % cid, data=json.dumps(data), content_type='application/json',
                                *args, **kwargs)

    def delete_category(self, cid, *args, **kwargs):
        return self.client.delete('/categories/%d' % cid, *args, **kwargs)

    def get_category(self, cid, *args, **kwargs):
        return self.client.get('/categories/%d' % cid, *args, **kwargs)

    def test_normal(self):
        resp = self.client.get('/categories/')
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data.decode())
        self.assertEqual(len(data['data']), 0)

        resp = self.create_category({'parent': None, 'name': 'Test Cat 1'})
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data.decode())
        self.assertEqual(data['status'], 'SUCCESS')
        resp = self.create_category({'parent': 1, 'name': 'Test Cat 22'})
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data.decode())
        self.assertEqual(data['status'], 'SUCCESS')
        resp = self.update_category(2, {'parent': None, 'name': 'Test Cat 2'})
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data.decode())
        self.assertEqual(data['status'], 'SUCCESS')
        resp = self.delete_category(2)
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data.decode())
        self.assertEqual(data['status'], 'SUCCESS')
        resp = self.get_category(1)
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data.decode())
        self.assertEqual(data['status'], 'SUCCESS')

        resp = self.client.get('/categories/')
        self.assertEqual(resp.status_code, 200)
        data = json.loads(resp.data.decode())
        self.assertEqual(len(data['data']), 1)


if __name__ == "__main__":
    main()
