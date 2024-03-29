# For Front-end Developers

## How to use this repo:

**PLEASE WORK ON YOUR OWN BRANCH**

*If your branch doesn't exist please create your own as a branch off of main. (Please name it after yourself)*

First when opening this folder, there will be a `static` and `templates` folder. These are used to hold all the html, css and js files. When creating a new html doc, instead of using the standard format, refer to the `base.html` file.

`base.html` has a few things that you will need to know about.
1. Firstly, `{% block name %}` and `{% endblock %}` are used to contain stuff that would eventually replace where it exists in `base.html`
2. `{{var_name}}`, this is used when you want to add a variable to the html. If you do use this, please add a comment at the top of the doc saying which are needed. I do need to add it to the backend.
3. `{{var_name | filter}}`, this is the same as #2 but use this if you want `var_name` to be altered in some way. Please name the filter accordingly and also say what it needs to do for in the comment as well.

If you want to test your code, run the file named `app.py`.

When creating a new html document, in the file `app.py`, add the following lines of code:
```python
@app.route('/name')
def name():
    return render_template('name.html')
```
Where `name` would be then name of your html document.
Go to the link `127.0.0.1:5000/name` and your document should pop up.

If you want to add a styling sheet, instead of putting the direct path (i.e. `static/css/stylesheet.css`), use `{{url_for('static', 'css/stylesheet.css')}}` instead.

Currently working pages:
1. `127.0.0.1:5000/comments`
2. `127.0.0.1:5000/register`
3. `127.0.0.1:5000/login`

Lastly, if you have any other questions about some implementation or something else, either email me at *1jiangjer3@hdsb.ca* or add me on discord (paidvbux_).

# How to GitHub

## Using GitHub:

1. Signup for a GitHub account.
2. Download GitHub Desktop.
3. Sign in to your account on GitHub Desktop

## How to fork this repository (How to get the code):

1. Click `Clone a Repository from the Internet...`.
5. Select `URL`.
6. Paste this URL, `https://github.com/paidvbux/Stock-XChange-Website`.
7. Click `Clone`.
8. Click "Fetch origin" at the top.

## How to use after forking this repository:      

1. Click "Fetch origin" to update the code to the latest version.

# How to run the code

## If you do not have flask installed:

1. Using either IDLE or Visual Studio Code, create a terminal.
2. Type in `pip install flask` and hit enter. If this does not work, try `pip3` or `py3` instead of `pip`.
3. Repeat with `pip install flask flask-sqlalchemy`, `pip install flask_sqlalchemy` and `pip install flask_mail`.
4. Run the `app.py` file then open the website at [`127.0.0.1:5000/comments`](http://127.0.0.1:5000/comments)



## If it still does not work (vs code solution)

1. Hit `CTRL + SHIFT + P` or `⌘ + ⇧ + P`
2. Type in `python interpreter`, click on the search result called `Python: Select Interpreter`.
3. After you click the search result, there should be $1$ or $2$ listings shown there.
4. On the right side there should be either `Recommended` or `Global`. Click on the one that isn’t currently selected.
5. Close and reopen vs code.
6. Run it.
7. If it still doesn’t work email me at [1jiangjer3@hdsb.ca](mailto:1jiangjer3@hdsb.ca) or just text me if you have my number.