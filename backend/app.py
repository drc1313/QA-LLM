from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
db_file = 'questions.db'

# Set the database URI
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_file}'  # SQLite database URI
# Initialize SQLAlchemy
db = SQLAlchemy(app)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)
    answer = db.Column(db.String(1000), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'answer': self.answer
        }


@app.route('/questions', methods=['POST'])
def add_question():
    data = request.json
    new_question = Question(content=data['content'], answer=data['answer'])
    db.session.add(new_question)
    db.session.commit()
    return jsonify(new_question.to_dict()), 201

@app.route('/questions', methods=['GET'])
def get_questions():
    questions = Question.query.all()
    return jsonify([question.to_dict() for question in questions])

@app.route('/questions/<int:question_id>', methods=['DELETE'])
def delete_question(question_id):
    question = Question.query.get(question_id)
    if question is None:
        return jsonify({'message': 'Question not found'}), 404
    
    db.session.delete(question)
    db.session.commit()
    return jsonify({'message': 'Question deleted'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
