//#region Constants
const sortUsernameInput = document.querySelector('#sort-username'),
    sortDropdown = document.querySelector('#sort-by'),
    sortForm = document.querySelector('#sort-form');

const offset = '(3rem)';

const posts = document.querySelector('#comments');
const replies = document.querySelectorAll('.replies');

const specialCharacters = { space: '\u00A0', doubleSpace: '\u00A0 \u00A0' };

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

function changeFilter() {
    if (sortDropdown.value == 'user')
        sortUsernameInput.style.display = 'inline'; 
    else{
        sortUsernameInput.style.display = 'none';
        sortForm.submit();
    }
}

//#region Animations
function ToggleReplies(id) {
    if (currentOpenReplyIndex != -1 && currentOpenReplyIndex != id) {
        ToggleReplies(currentOpenReplyIndex);
    }

    const reply = document.querySelector(`#replies-${id}`),
        showButton = document.querySelector(`#show-${id}`),
        arrow = document.querySelector(`#arrow-${id}`),
        postFooter = document.querySelector(`#post-footer-${id}`);

    if (reply.dataset.displayed == 'no'){
        currentOpenReplyIndex = id;
        reply.dataset.displayed = 'yes'
        showButton.value = 'Hide Replies';
        arrow.animate({ rotate: '90deg' }, { duration: 300, fill: 'forwards', easing: 'ease' });
        postFooter.animate({ backgroundColor: '#292929' }, { duration: 300, fill: 'forwards', easing: 'ease' });
        reply.firstElementChild.style.margin = '0';
    }
    else {
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

    const label = document.querySelector(`#add-label-${id}`),
          button = document.querySelector(`#add-reply-${id}`),
          input = document.querySelector(`#reply-form-${id}`),
          submit = document.querySelector(`#reply-submit-${id}`);

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
        input.animate(keyframes,
        { duration: 1000, fill: 'forwards', easing: 'ease' }).onfinish = 
            () => {
                submit.animate({ opacity: '1' }, 
                { duration: 300, fill: 'forwards', easing: 'ease' });
                animating.replyInput = false;
            };
    }
    else {
        submit.animate({ opacity: '0' }, 
        { duration: 300, fill: 'forwards', easing: 'ease' }).onfinish = () => {
            button.value = specialCharacters.doubleSpace + 'Post Reply';
            label.animate({ scale: '0' }, { duration: 250, fill: 'forwards', easing: 'ease' }).onfinish 
                = () => {
                label.innerHTML = '+'
                label.animate({ scale: '1' }, { duration: 500, fill: 'forwards', easing: 'ease' }) 
            }
            label.animate({ rotate: '0deg', translate: '0', margin: '0' }, 
            { duration: 1000, fill: 'forwards', easing: 'ease' });
            input.animate(reversedKeyframes,
            { duration: 1000, fill: 'forwards', easing: 'ease' }).onfinish =
                () => {
                    animating.replyInput = false; 
                    label.innerHTML = '+';
                };
        }
    }
}
//#endregion

function AddReply(id) {
    const replyInput = document.querySelector(`#reply-input-${replyInput}`);

    console.log(replyInput);
}