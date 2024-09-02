from database import *
from sqlalchemy import func
from flask_migrate import Migrate
import secrets

migrate = Migrate(app, db)

login_expiration_time = timedelta(days=1, hours=0, minutes=0, seconds=0)
#domain = '127.0.0.1:5000'

#region Redirects
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/forum', methods=['POST', 'GET'])
def forum():
    channel_id = 1

    #try:
        #channel_id = request.form['channel']
    #except:
        #pass



    if request.method == 'POST':
        if 'sort-by' in request.form.keys():
            return sort(request, channel_id)
        elif 'content' in request.form.keys():
            print(request.form['content'], channel_id)
            new_comment = Comment(username=request.form['username'],
                topic=request.form['topic'],
                content=request.form['content'],
                time_posted=datetime.now(),
                channel_posted=channel_id)
            try:
                db.session.add(new_comment)
                db.session.commit()
                return redirect('/forum#discussion-position')
            except:
                return 'There was an issue posting your comment.'
        elif 'reply-content' in request.form.keys():
            return 'received return!'
    else:
        comments = Comment.query.order_by(Comment.time_posted).filter_by(channel_posted=channel_id).all()

        replyCountDict = {}
        for comment in comments:
            replyCount = db.session.query(Reply).filter(comment.id == Reply.parent_id).count()
            replyCountDict[comment.id] = replyCount

        return render_template('forum.html',
                               comments=comments[::-1],
                               sort='date',
                               s_user='',
                               channel_posted=channel_id,
                               replyCountDict=replyCountDict)

@app.route('/getinvolved')
def getinvolved():
    return render_template('getinvolved.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/resources')
def resources():
    return render_template('resources.html')

@app.route('/faq')
def faq():
    return render_template('faq.html')

@app.route('/aboutus')
def aboutus():
    return render_template('aboutus.html')


@app.route('/register')
def register():
    email = request.args.get('email')
    token = request.args.get('token')
    if email and token:
        return render_template('register-verified.html',
                               email=email,
                               token=token)
    else:
        return render_template('register.html')
#endregion

#region Functions
def sort(request, channel_id):
    sort_filter = request.form['sort-by']
    sort_value = request.form['sort-username']
    sort_value = '' if sort_value == None else sort_value
    comments = Comment.query
    if sort_filter == 'user':
        comments = comments.filter_by(username=sort_value)

    comments = comments.order_by(Comment.time_posted)

    html = render_template('forum.html',
                           comments=comments.filter_by(channel_posted=channel_id).all()[::-1],
                           sort=sort_filter,
                           s_user=sort_value,
                           channel_id=channel_id)

    print(html)

    return html

def generate_token():
    token = secrets.token_urlsafe(16)
    while Token.query.filter_by(token=token).first():
        token = secrets.token_urlsafe(16)
    return token
#endregion

#region Replies
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
                         'timeElapsed': '0 seconds',
                         'parentId': form_data['reply-to'] })
    except:
        return jsonify({'result':'database error'})

@app.route('/get-replies', methods=['POST'])
def get_replies():
    comment_id = json.loads(request.data)['reply-id']

    replies = Reply.query.filter_by(parent_id=comment_id).order_by(Reply.time_posted).all()
    replies_json = { 'result': 'success',
                     'replyCount': len(replies),
                    f'id': [],
                    f'usernames': [],
                    f'contents': [],
                    f'timeElapsed': [] }

    for reply in replies[::-1]:
        replies_json['id'].append(reply.id)
        replies_json['usernames'].append(reply.username)
        replies_json['contents'].append(reply.content)
        replies_json['timeElapsed'].append(calculate_time(reply.time_posted))


    return jsonify(replies_json)
#endregion

#region Login
@app.route('/user-login', methods=['POST'])
def user_login():
    data = json.loads(request.data)

    user = User.query.filter_by(email=data['email']).first()

    if not user:
        return jsonify({ 'result' : 'user does not exist' })
    elif user.password == data['password']:
        response = jsonify({ 'result' : 'success' })
        response.set_cookie('user-info',
                            f'{user.display_name}/{data["email"]}',
                            max_age=login_expiration_time.total_seconds(),
                            expires=datetime.now() + login_expiration_time)
        return response
    else:
        return jsonify({ 'result' : 'invalid credentials' })
#endregion

#region Registration
@app.route('/send-verify-email', methods=['POST'])
def send_verification_email():
    data = json.loads(request.data)

    if User.query.filter_by(email=data['email']).first():
        return jsonify({ 'result' : 'user already exists' })

    current_token = Token.query.filter_by(email=data['email']).first()

    token = current_token.token if current_token else generate_token()

    msg = Message('Verify your email', sender='solvexchange@hotmail.com', recipients=[data['email']])
    msg.body = f'click link please\nhttp://www.solvexchange.ca/register?email={data["email"]}&token={token}'
    mail.send(msg)

    if current_token:
        return jsonify({ 'result' : 'success' })

    new_token = Token(email=data['email'],
                      token=token)

    try:
        db.session.add(new_token)
        db.session.commit()
        return jsonify({ 'result' : 'success' })
    except:
        return jsonify({ 'result' : 'database error' })

@app.route('/create-account', methods=['POST'])
def create_account():
    data = json.loads(request.data)

    token = data['token']

    db_token = Token.query.filter_by(email=data['email']).first()

    if token != db_token.token:
        return jsonify({ 'result' : 'token mismatch' })

    new_user = User(email=data['email'],
                    display_name=data['firstname'].title() + ' ' + data['lastname'].title(),
                    password=data['password'],
                    account_type='user',
                    creation_date=datetime.now())
    try:
        db.session.delete(db_token)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({ 'result' : 'success' })
    except:
        return jsonify({ 'result' : 'database error' })
#endregion

@app.route('/addlike', methods=['POST'])
def add_like():
    data = json.loads(request.data)
    id = data['id']
    username = data['username']
    new_like = Like.query.filter_by(parent_id=id, username=username).first()
    if new_like == None:
        c = Comment.query.filter_by(id=id).first()
        c.likecount = c.likecount + 1
        db.session.commit()

        new_like = Like(parent_id=id,
                        username=username)
        db.session.add(new_like)
        db.session.commit()
        return jsonify({ 'result' : 'success' })
    else:
        return jsonify({ 'result' : 'error' })

#region Filters
@app.template_filter()
def capitalize(message):
    return message.capitalize()

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

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
