#region Imports
from flask import Flask, url_for, render_template, request, redirect, jsonify, json
from sqlalchemy import case, select, text
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
#endregion

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

#region Comments
MAX_USERNAME_LENGTH = 20
MAX_COMMENT_LENGTH = 200

class Comment(db.Model):
    __tablename__ = 'Comments'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(MAX_USERNAME_LENGTH), nullable=False)
    content = db.Column(db.String(MAX_COMMENT_LENGTH), nullable=False)
    time_posted = db.Column(db.DateTime)

    def __repr__(self):
        return f'<Comment {self.id}>'

def Sort(request, replies):
    sort_filter = request.form['sort-by']
    sort_value = request.form['sort-username']
    sort_value = '' if sort_value == None else sort_value
    if sort_filter == 'user':
        comments = Comment.query.filter_by(username=sort_value).order_by(Comment.time_posted).all()
    elif sort_filter == 'date':
        comments = Comment.query.order_by(Comment.time_posted).all()
    return render_template('comments.html', replies=replies, comments=reversed(comments), sort=sort_filter, s_user=sort_value)
        
@app.route('/comments', methods=['POST', 'GET'])
def index():
    print(request.form.keys());
    replies = Reply.query.order_by(Reply.time_posted).all()
    if request.method == 'POST':
        if 'sort-by' in request.form.keys():
            return Sort(request, replies)
        elif 'content' in request.form.keys():
            new_comment = Comment(username=request.form['username'], 
                content=request.form['content'],
                time_posted=datetime.now())

            try:
                db.session.add(new_comment)
                db.session.commit()
                return redirect('/comments')
            except:
                return 'There was an issue posting your comment.'
        elif 'reply-content' in request.form.keys():
            return 'received return!'
    else:
        comments = Comment.query.order_by(Comment.time_posted).all()
        return render_template('comments.html', replies=replies, comments=reversed(comments), sort='date', s_user='')

@app.template_filter()
def calculate_time(time):
    time_delta = datetime.now() - time
    days = time_delta.days
    years = days // 365
    hours, remainder = divmod(time_delta.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)

    _dict = {'years' : years,
     'days' : days, 
     'hours' : hours, 
     'minutes' : minutes, 
     'seconds' : seconds}
    for i in _dict.keys():
        if _dict[i] != 0:
            time_passed = f'{_dict[i]} {i}'
            return time_passed if _dict[i] != 1 else time_passed[:-1]
    return '0 seconds'

#endregion

#region Replies
class Reply(db.Model):
    __tablename__ = 'Replies'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(MAX_USERNAME_LENGTH), nullable=False)
    content = db.Column(db.String(MAX_COMMENT_LENGTH), nullable=False)
    time_posted = db.Column(db.DateTime)
    
    parent_id = db.Column(db.Integer, db.ForeignKey('Comments.id'), nullable=False)

    def __repr__(self):
        return f'<Reply {self.id}>'
    
@app.route('/reply', methods=['POST'])
def reply():
    form_data = json.loads(request.data)
    
    new_reply = Reply(username=form_data['username'],
                      content=form_data['reply-content'],
                      time_posted=datetime.now(),
                      parent_id=form_data['reply-to'])
    try:
        db.session.add(new_reply)
        db.session.commit()
        return jsonify({ 'result': 'success',
                         'username': form_data['username'],
                         'content': form_data['reply-content'],
                         'timePosted': '0 seconds',
                         'parentId': form_data['reply-to'] })
    except:
        return jsonify({'result':'database error'})
#endregion

#region Users
MAX_EMAIL_LENGTH = 50
MAX_PASSWORD_LENGTH = 50
class User(db.Model):
    __tablename__ = 'Users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(MAX_EMAIL_LENGTH), nullable=False)
    password = db.Column(db.String(MAX_PASSWORD_LENGTH), nullable=False)
    account_type = db.Column(db.String(10), default='user')
    creation_date = db.Column(db.DateTime)

    def __repr__(self):
        return f'<User {self.id}>'

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        pass
    else:
        return render_template('register.html')
#endregion

if __name__ == '__main__':
    app.run(debug=True)