from flask import Flask, url_for, render_template, request, redirect, jsonify, json
from sqlalchemy import case, select, text
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from datetime import datetime, timedelta
import random

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

app.config['SECRET_KEY'] = 'TEST_KEY'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = '1jiangjer3@hdsb.com'
app.config['MAIL_PASSWORD'] = 'urhc qehp cwis gnbb'

mail = Mail(app)

class Comment(db.Model):
    __tablename__ = 'Comments'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    content = db.Column(db.String, nullable=False)
    time_posted = db.Column(db.DateTime)
    channel_posted = db.Column(db.Integer, db.ForeignKey('Channels.id'), nullable=False)

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

    email = db.Column(db.String, primary_key=True, nullable=False)
    display_name = db.Column(db.String, nullable=False)
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
    
class Token(db.Model):
    __tablename__ = 'Tokens'

    email = db.Column(db.String, db.ForeignKey('Users.email'), nullable=False, primary_key=True)
    token = db.Column(db.String(16), nullable=False)

    def __repr__(self):
        return f'<{self.email}\'s Token>'

