//#region Constants
const commentUsernameInput = document.getElementById('username-input'),
      commentForm = document.getElementById('comment-form');

const sortUsernameInput = document.getElementById('sort-username'),
    sortDropdown = document.getElementById('sort-by'),
    sortForm = document.getElementById('sort-form'),
    sortInput = document.getElementById('sort-by-input'),
    sortDisplay = document.getElementById('sort-by-display');

const offset = '(3rem)';

const posts = document.getElementById('comments'),
      replies = document.querySelectorAll('.replies');

const specialCharacters = { space: '\u00A0', doubleSpace: '\u00A0 \u00A0' };

const usernameInput = document.getElementById('username-input');
//Variables
let currentOpenReplyIndex = -1,
    addReplyInputOpen = false,
    animating = { replyInput: false };
//#endregion

//#region Initialization
posts.style.opacity = '0';

replies.forEach((reply) => {
    reply.firstElementChild.style.margin = `calc(-${reply.firstElementChild.clientHeight}px - ${offset}) 0 0 0`;
});

setTimeout(() => posts.style.opacity = '1', 300)
//#endregion

//#region Animations
function ToggleReplies(id) {
    if (currentOpenReplyIndex != -1 && currentOpenReplyIndex != id) {
        ToggleReplies(currentOpenReplyIndex);
    }

    const reply = document.getElementById(`replies-${id}`),
        showButton = document.getElementById(`show-${id}`),
        arrow = document.getElementById(`arrow-${id}`),
        postFooter = document.getElementById(`post-footer-${id}`);

    if (reply.dataset.displayed == 'no'){
        currentOpenReplyIndex = id;
        reply.dataset.displayed = 'yes'
        showButton.value = 'Hide Replies';
        arrow.animate({ rotate: '90deg' }, { duration: 300, fill: 'forwards', easing: 'ease' });
        postFooter.animate({ backgroundColor: '#292929' }, { duration: 300, fill: 'forwards', easing: 'ease' });
        reply.firstElementChild.style.margin = '0';
        if (reply.dataset.repliesLoaded == 'no')
            InstantiateReplies(id);
    }
    else {
        if (addReplyInputOpen)
            ToggleReplyInput(id);
        currentOpenReplyIndex = -1;
        addReplyInputOpen = false;
        reply.dataset.displayed = 'no'
        showButton.value = 'View Replies';
        arrow.animate({ rotate: '0deg' }, { duration: 300, fill: 'forwards', easing: 'ease' });
        postFooter.animate({ backgroundColor: '#2f2f2f' }, { duration: 300, fill: 'forwards', easing: 'ease' });
        reply.firstElementChild.style.margin = `calc(-${reply.firstElementChild.clientHeight}px - ${offset}) 0 0 0`;
    }
}

const keyframes = [{width:'0', height:'0', padding:'0', border:'solid 1px transparent', offset: 0},
        {width:'22.5vw', height:'0', padding:'0', border:'solid 1px transparent', offset: 0.75},
        {width:'22.5vw', height:'1rem', padding:'10px 0 10px 10px', border:'solid 1px transparent'},
        {width:'22.5vw', height:'1rem', padding:'10px 0 10px 10px', border:'solid 1px white', offset: 1}],
      reversedKeyframes = [{width:'22.5vw', height:'1rem', padding:'10px 0 10px 10px', border:'solid 1px white', offset: 0},
        {width:'22.5vw', height:'1rem', padding:'10px 0 10px 10px', border:'solid 1px transparent'},
        {width:'22.5vw', height:'0', padding:'0', border:'solid 1px transparent', offset: 0.25},
        {width:'0', height:'0', padding:'0', border:'solid 1px transparent', offset: 1}];
function ToggleReplyInput(id) {
    if (animating.replyInput)
        return;

    let label = document.getElementById(`add-label-${id}`),
        button = document.getElementById(`add-reply-${id}`),
        form = document.getElementById(`reply-form-${id}`),
        replySubmit = document.getElementById(`reply-submit-${id}`),
        input = document.getElementById(`reply-input-${id}`);

    addReplyInputOpen = !addReplyInputOpen;
    animating.replyInput = true;

    if (addReplyInputOpen) {
        button.value = specialCharacters.doubleSpace + 'Cancel';
        label.animate({ scale: '0' }, { duration: 500, fill: 'forwards', easing: 'ease' }).onfinish 
            = () => {
                label.innerHTML = '-'
                label.animate({ scale: '1' }, { duration: 250, fill: 'forwards', easing: 'ease' }) 
            }
        label.animate({ rotate: '180deg', translate: '1vw 0', margin: '0 1vw' }, 
        { duration: 1000, fill: 'forwards', easing: 'ease' });
        form.animate(keyframes,
        { duration: 1000, fill: 'forwards', easing: 'ease' }).onfinish = 
            () => {
                replySubmit.animate({ opacity: '1' }, 
                { duration: 300, fill: 'forwards', easing: 'ease' });
                animating.replyInput = false;
            };
    }
    else {
        replySubmit.animate({ opacity: '0' }, 
        { duration: 300, fill: 'forwards', easing: 'ease' }).onfinish = () => {
            button.value = specialCharacters.doubleSpace + 'Post Reply';
            label.animate({ scale: '0' }, { duration: 250, fill: 'forwards', easing: 'ease' }).onfinish 
                = () => {
                label.innerHTML = '+'
                label.animate({ scale: '1' }, { duration: 500, fill: 'forwards', easing: 'ease' }) 
            }
            label.animate({ rotate: '0deg', translate: '0', margin: '0' }, 
            { duration: 1000, fill: 'forwards', easing: 'ease' });
            form.animate(reversedKeyframes,
            { duration: 1000, fill: 'forwards', easing: 'ease' }).onfinish =
                () => {
                    animating.replyInput = false; 
                    label.innerHTML = '+';
                    input.value = '';
                };
        }
    }
}
//#endregion

//#region Functions
function ChangeFilter(value) {
    if (value == 'user') {
        sortUsernameInput.style.display = 'inline';
        sortInput.value = 'user';
        sortDisplay.innerHTML = 'User';
    }
    else {
        sortInput.value = 'date';        
        sortForm.submit();
    }
}
//#endregion

//#region Server Messages
function PostComment(event) {
    event.preventDefault();

    let uncutName = getCookie('user-info').split('/')[0];
        username = uncutName.substring(1, uncutName.length);

    usernameInput.value = username;

    commentForm.removeAttribute('onsubmit');
    commentForm.submit();
}

function AddReply(id, event) {
    event.preventDefault();

    const replyInput = document.querySelector(`#reply-input-${id}`);

    $.ajax({
        url: '/reply',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 'username': usernameInput.value,
                               'reply-content': replyInput.value,
                               'reply-to': id }),
        success: function(response) {
            if (response.result == 'database error'){
                console.error('A database error occurred...');
            }
            else {
                let content = response.content,
                    username = response.username,
                    timeElapsed = response.timeElapsed,
                    parentId = response.parentId;

                const newReplyHTML = `
                <div id="post">
                    <p id="post-content">${content}</p>
                    <div class="hright">
                        <p id="post-metadata" class="inline">
                            Posted by <a id="post-username">${username},</a> ${timeElapsed} ago
                        </p>
                    </div>
                </div>`;

                document.getElementById(`add-replies-div-${parentId}`).insertAdjacentHTML('beforebegin', newReplyHTML);
                ToggleReplyInput(parentId);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error: ', error);
        }
    });
}

function InstantiateReplies(id) {
    $.ajax({
        url: '/get-replies',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 'reply-id': id }),
        success: function(response) {
            if (response.result == 'success') {
                const commentReplies = document.getElementById(`replies-${id}`);
    
                for (let i = 0; i < response.replyCount; i++) {
                    let content = response.contents[i],
                        username = response.usernames[i],
                        timeElapsed = response.timeElapsed[i];
                    
                    const replyHTML = `
                    <div class="post">
                        <p class="post-content">
                            ${content}
                        </p>
                        <div class="hright">
                            <p class="post-metadata" class="inline">
                                Posted by
                                <a class="post-username">${username},</a> 
                                ${timeElapsed} ago
                            </p>
                        </div>
                    </div>`
                    commentReplies.firstElementChild.insertAdjacentHTML('afterbegin', replyHTML);
                }
    
                commentReplies.dataset.repliesLoaded = 'yes';
            }
            else {
                console.log('A database error occurred...');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error: ', error);
        }
    });
}
//#endregion