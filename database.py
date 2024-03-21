from flask import Flask, url_for, render_template, request, redirect, jsonify, json
from sqlalchemy import case, select, text
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

class Comment(db.Model):
    __tablename__ = 'Comments'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    content = db.Column(db.String, nullable=False)
    time_posted = db.Column(db.DateTime)
    channel_posted = db.Column(db.Integer, db.ForeignKey('Channel.id'), nullable=False)

    def __repr__(self):
        return f'<Comment {self.id}>'
    
class Reply(db.Model):
    __tablename__ = 'Replies'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    content = db.Column(db.String, nullable=False)
    time_posted = db.Column(db.DateTime)
    
    parent_id = db.Column(db.Integer, db.ForeignKey('Comments.id'), nullable=False)

    def __repr__(self):
        return f'<Reply {self.id}>'

class User(db.Model):
    __tablename__ = 'Users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    account_type = db.Column(db.String, default='user')
    creation_date = db.Column(db.DateTime)

    def __repr__(self):
        return f'<User {self.id}>'
    
class Channel(db.Model):
    __tablename__ = 'Channels'

    id = db.Column(db.Integer, primary_key=True)
    channel_name = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'<{self.channel_name} Channel>'