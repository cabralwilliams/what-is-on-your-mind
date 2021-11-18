
const commentDiv = document.querySelector(".displayed-comments");

const comment = (username,content,date = "3/15/44 BC") => {
    return {
        username: username,
        content: content,
        date: date
    };
};

const comments = [
    comment("Climb_Til","Can't wait to see you JCaes.  We need to discuss bringing your brother back.","3/14/44 BC"),
    comment("JCaesar","Screw that!  #EmperorForLife!","3/14/44 BC"),
    comment("ManTony","Big Caes, I'll see you there, but I have a bad feeling about this.  Maybe you should skip this.  #IdesOfMarch"),
    comment("TreboG","ManTony!  We have not caught up in some time!  Let's meet before the JCaes's address but far enough away so that you can't actually get there for the address, okay?"),
    comment("BrutalM","It's going to be a gut-stabbing great time at the Senate today!"),
    comment("JCaesar","See you today too Brute!  #ILoveBeingADictator")
];

function attackCaesar() {
    for(let i = 0; i < comments.length; i++) {
        let nextDiv = document.createElement("div");
        nextDiv.className = "comment-div";
        let infoDiv = document.createElement("div");
        let nameSpan = document.createElement("span");
        nameSpan.className = "username";
        let dateSpan = document.createElement("span");
        nameSpan.textContent = comments[i].username;
        dateSpan.textContent = ` said on ${comments[i].date}`;
        infoDiv.append(nameSpan,dateSpan);
        let blockquote = document.createElement("blockquote");
        blockquote.className = "comment-text";
        blockquote.textContent = comments[i].content;
        nextDiv.append(infoDiv,blockquote);
        commentDiv.appendChild(nextDiv);
    }
}

attackCaesar();