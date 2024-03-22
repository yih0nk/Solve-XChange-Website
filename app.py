from database import *

#region Functions
def sort(request, channel_id):
    sort_filter = request.form['sort-by']
    sort_value = request.form['sort-username']
    sort_value = '' if sort_value == None else sort_value
    comments = Comment.query
    if sort_filter == 'user':
        comments = comments.filter_by(username=sort_value)
    
    comments = comments.order_by(Comment.time_posted).all()
    
    return render_template('comments.html', 
                           comments=comments.filter_by(channel_posted=channel_id)[::-1],
                           sort=sort_filter, 
                           s_user=sort_value,
                           channel_id=channel_id)
#endregion

#region Comments
@app.route('/comments', methods=['POST', 'GET'])
def index():
    channel_id = 1
    try: 
        channel_id = request.form['channel_id']
    except:
        pass

    if request.method == 'POST':
        if 'sort-by' in request.form.keys():
            return sort(request, channel_id)
        elif 'content' in request.form.keys():
            new_comment = Comment(username=request.form['username'], 
                content=request.form['content'],
                time_posted=datetime.now(),
                channel_posted=channel_id)
            try:
                db.session.add(new_comment)
                db.session.commit()
                return redirect('/comments')
            except:
                return 'There was an issue posting your comment.'
        elif 'reply-content' in request.form.keys():
            return 'received return!'
    else:
        comments = Comment.query.order_by(Comment.time_posted).filter_by(channel_posted=channel_id).all()
        return render_template('comments.html', 
                               comments=comments[::-1], 
                               sort='date', 
                               s_user='',
                               channel_posted=channel_id)
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

#region Users
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
    app.run(debug=True)