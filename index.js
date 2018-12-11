class CommentWidget {
  constructor() {
    this._actualData = []
    this.counter = 0;
    this.addInitialEventListner();
  }
  formatData(data, startFlag, parentId) {
    var d = [];
    d = data
      .filter(v => {
        if (startFlag && v["parent_id"] === null) return v;
        else return v["parent_id"] === parentId;
      })
      .map(v => {
        return {
          id: v["comment_id"],
          name: v["name"],
          comment: v["comment"],
          children: this.formatData(data, false, v["comment_id"])
        };
      });

    return d;
  }

  addInitialEventListner() {
    let _submitBtnElement = document.querySelector(".submit-comment");
    _submitBtnElement.addEventListener("click", () => {
      var _inputValue = document.querySelector(".user-comment-input").value;
      var _ds = {
        comment_id: this.counter++,
        parent_id: null,
        name: "He" + " "+this.counter,
        comment: (_inputValue =='')?'!Oops, You have not Entered Your Comment':_inputValue
      };
      this._actualData.push(_ds);
      this.renderAllcomments();
    });
  }
  addEventListenerOnReply() {
    let _replyBtnElement = document.querySelectorAll(".reply-button");
    _replyBtnElement.forEach((element, index) => {
      element.addEventListener("click", () => {
        var _template = `<div class='white-box'>
                          <div class="row">
                              <div class="col-10">
                                   <input class="user-comment-input" id="individualReply" placeholder="Enter a comment" />
                              </div>
                              <div class="col-2">
                                    <button class="submit-comment btn" id="individualReplySubmit">Comment</button>
                              </div>
                            </div>
                            </div>`;

        var _element = document
          .querySelector(".comment-container")
          .querySelectorAll(".white-box");
        document.querySelectorAll(".replyTemplate").forEach(ele => {
          ele.setAttribute("style", "display:none");
        });

        _element[index].querySelector(".replyTemplate").innerHTML = _template
        _element[index]
          .querySelector(".replyTemplate")
          .setAttribute("style", "display:block");

        var _individualReplySubmit = _element[index].querySelector(
          "#individualReplySubmit"
        );
        _individualReplySubmit.addEventListener("click", () => {
          var _individualCommentEle = _element[index].querySelector(
            "#individualReply"
          ).value;

          var _ds = {
            comment_id: this.counter++,
            parent_id: Number(
              _element[index]
                .querySelector(".replyTemplate[data-id]")
                .getAttribute("data-id")
            ),
            name: "She" + " "+this.counter,
            comment: (_individualCommentEle =='')?'!Oops, You have not Entered Your Comment':_individualCommentEle 
          };

          this._actualData.push(_ds);
          this.renderAllcomments();
        });
      });
    });
  }
  renderSubComments(_subComments) {
    var _template = [];
    _subComments.forEach(element => {
      var _t = `<div class="white-box reply-box">
                    <img class="avatar" src="./images/female.jpg"></img>
                    <label class="comment-user">${element.name}</label>
                    <div class='text-align'>                    
                    <div class="comment-text">${element.comment}</div>
                    <button class="reply-button" data-id=${element.id}>Reply</button>
                    </div>
                    <div class="replyTemplate" data-id=${element.id}></div>
                    ${this.renderSubComments(element.children)}
                    </div>`;
      _template.push(_t.replace(/\n/gm,''));
    });
    return _template.join('');
  }

  renderAllcomments() {
    this.commentsObj = this.formatData(this._actualData, true, null);
    var _templateString = `${this.commentsObj
      .map(
        element => `<div class="white-box">
                        <img class="avatar" src="./images/male.png"></img>
                        <label class="comment-user">${element.name}</label>
                        <div class='text-align'>
                        <div class="comment-text">${element.comment}</div>
                        <button class="reply-button" data-id=${element.id}>Reply</button>
                        </div>
                        <div class="replyTemplate" data-id=${element.id}></div>
                        ${this.renderSubComments(element.children)}
                </div>`
      )
      .join("")}`;
    var _element = document.querySelector(".comment-container");
    _element.innerHTML = (_templateString =='')?'!Oops, You have not Entered Your Comment':_templateString;
    this.addEventListenerOnReply();
  }
}
let user = new CommentWidget();
