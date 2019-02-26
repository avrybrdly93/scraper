
$.ajax({
    type: "GET",
    url: "/articles"
}).then(function(article) {
    let buttonID = 0;
    article.forEach(function(element) {
        let articleTitle = $("<h3>");
        let articleContent = $("<p>");
        let viewFullStory = $("<button class='article-click uk-button uk-button-secondary uk-button-small'>");
        let articleImg = $("<img>");
        let articleFullContent = $("<p>");
        let allArticles = $("#all-articles")
        let articleArea = $("<div>"); 
        let clearFix = $("<div>");

        // let deleteMe = $("<div>");
        // deleteMe.text(element.id);
        // deleteMe.appendTo(articleArea);

        clearFix.attr("class", "clearfix");
        articleTitle.text(element.title);
        articleContent.text(element.content);
        articleContent.attr("class", "the-partial-class");
        articleImg.attr("src", element.imgLink);
        viewFullStory.text("View Full Story");
        viewFullStory.attr("uk-toggle", 'target: #article-modal');
        // viewFullStory.attr("class", 'article-click');
        viewFullStory.attr("data-id", element._id);
        articleFullContent.text(element.fullContent || element.content);
        articleFullContent.attr("class", "this-full-class");
        articleArea.attr("class", "col-md-4");
        if(buttonID % 3 === 0) {
            clearFix.appendTo(allArticles);
        }
        buttonID++;
        clearFix.css("margin-bottom", "36px");
        articleTitle.appendTo(articleArea);
        articleContent.appendTo(articleArea);
        viewFullStory.appendTo(articleArea);
        articleImg.appendTo(articleArea);
        articleFullContent.appendTo($("#article-body"));
        articleArea.appendTo(allArticles);
    }),
    console.log(article);
});

$(document).ajaxStart(function(){
    $(".spinner-border").css("display", "block");
});
$(document).ajaxComplete(function(){
    $(".spinner-border").css("display", "none");
});

let commentInput;
let userInput;
let commentSubmit;
let commentForm;
let commentSection;

$('body').on('click', 'button.article-click', function(event) {
    $(".uk-modal-title").empty();
    $("#article-body").empty();
    $("#image-section").empty();

    let buttonID = $(this).attr("data-id");
    $.ajax({
        type: "GET",
        url: `/article/${buttonID}`
    }).then(function(comment) {
        let articleImage = comment[0].imgLink;
        let imageHolder = $("<img>");
        let commentHeader = $("<h3>");
        commentSection = $("<div class='comment-section'>");
        commentForm = $("<form>");
        commentInput = $("<input>");
        userInput = $("<input>");
        commentSubmit = $("<button class='comment-submit uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom'>");

        $("#image-section").append(imageHolder);
        $(".uk-modal-title").append(comment[0].title);
        $("#article-body").append(comment[0].fullContent);
        commentSection.appendTo($("#article-body"));
        commentForm.appendTo($("#article-body"));
        commentForm.append("<h3>Insert a comment<h3> <br>");
        commentForm.append("Comment:")
        commentInput.appendTo(commentForm);
        commentForm.append("Name:")
        userInput.appendTo(commentForm);
        commentSubmit.appendTo(commentForm);
        commentHeader.appendTo(commentSection);

        
        commentHeader.text("Comments");
        commentHeader.css("margin-bottom", "24px");
        imageHolder.attr("class", "article-image");
        imageHolder.attr("src", articleImage);
        commentSubmit.text("Submit");
        commentSubmit.attr("data-id", buttonID);
        commentInput.attr("class", "uk-input");
        userInput.attr("class", "uk-input");
        getComments(buttonID);
    })
});

$('body').on('click', 'button.comment-submit', function(event) {
    event.preventDefault();
    let commentBody = commentInput.val();
    let username = userInput.val();
    let id = commentSubmit.attr("data-id");
    userInput.val('');
    commentInput.val('');
    console.log(id);
    let comment = {
        body: commentBody,
        username: username
    }
    $.ajax("/comment/" + id, {
        type: "POST",
        data: comment
    }).then(function(data) {
        console.log(data);
        getComments(id);
    });

});

let commentID;
$('body').on('click', 'button.delete-me', function(event) {
    event.preventDefault();
    commentID = $(this)[0].parentNode.attributes["comment-id"].nodeValue;
    $.ajax({
        type: "DELETE",
        url: `comment/${commentID}`
    }).then(function(result) {
        console.log(result);
        getComments(commentSubmit.attr("data-id"));
    });
})

let commentsDiv = $("<div class='yes'>");
function getComments(id) {
    commentsDiv.appendTo(commentSection);
    commentsDiv.empty();
    $.ajax(`/comment/${id}`, {
        type: "GET",
    }).then(function(comments) {
        comments.forEach(function(comment) {
            commentID = comment._id;
            commentDiv = $("<div>");
            commentDiv.attr("comment-id", commentID);
            commentDiv.appendTo(commentsDiv);
            commentDiv.append(`<h4>${comment.body}</h4> - 
                                <i>${comment.username}</i> 
                                <button class="delete-me btn-danger">Delete</button> <hr>`);
            console.log(comment);
        })
    })
}

// $.get("/articles", function() {

// })

    // let buttonID = $(this).attr("id");
    // $.ajax({
    //     type: "POST",
    //     url: `/comment/${buttonID}`,
    //     data: comment
    // }).then(function() {

    // })