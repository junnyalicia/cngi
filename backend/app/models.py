from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True, comment='Category ID')
    parent = db.Column(db.Integer, nullable=True, comment='Parent category ID, null for root')
    name = db.Column(db.String(128), nullable=False, comment='Category Name')


class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True, comment='Question ID')
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False, comment='Category ID')
    question = db.Column(db.String(512), nullable=False, comment='Question')
    answer = db.Column(db.Text, nullable=True, comment='Answer')

    @property
    def alternative_asking(self):
        return QuestionAlternativeAsking.query.filter_by(question_id=self.id).all()


class QuestionAlternativeAsking(db.Model):
    __tablename__ = 'alternative_asking'
    id = db.Column(db.Integer, primary_key=True, comment='Record ID')
    question = db.Column(db.String(512), nullable=False, comment='Question')
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id', onupdate='cascade', ondelete='cascade'),
                            nullable=False, comment='Question ID')
