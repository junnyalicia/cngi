from .. import db


class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True, comment='Category ID')
    parent = db.Column(db.Integer, nullable=True, comment='Parent category ID, null for root')
    name = db.Column(db.String(128), nullable=False, comment='Category Name')
