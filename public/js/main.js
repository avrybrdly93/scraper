
$.ajax({
    type: "GET",
    url: "/articles"
}).then(function(article) {
    let buttonID = 0;
    article.forEach(function(element) {
        let articleTitle = $("<h3>");
        let articleContent = $("<p>");
        let viewFullStory = $("<button>");
        let articleImg = $("<img>");
        let articleFullContent = $("<p>");
        let articleArea = $("#article-area"); 

        articleTitle.text(element.title);
        articleContent.text(element.content);
        articleImg.attr("src", element.imgLink);
        viewFullStory.text("View Full Story");
        viewFullStory.attr("uk-toggle", 'target: #article-modal');
        viewFullStory.attr("class", 'article-click');
        viewFullStory.attr("data-type", buttonID);
        buttonID++;
        articleFullContent.text(element.fullContent);

        articleTitle.appendTo(articleArea);
        articleContent.appendTo(articleArea);
        articleImg.appendTo(articleArea);
        viewFullStory.appendTo(articleArea);
        articleFullContent.appendTo($("#article-body"));
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


$('body').on('click', 'button.article-click', function(event) {
    $(".uk-modal-title").empty();
    $("#article-body").empty();

    let buttonID = $(this).attr("data-type");
    $.ajax({
        type: "GET",
        url: `/article/${buttonID}`
    }).then(function(comment) {
        let articleImage = comment[0].imgLink;
        let imageHolder = $("<img>");
        let commentSection = $("<div>");
        commentForm = $("<form>");
        commentInput = $("<input>");
        userInput = $("<input>");
        commentSubmit = $("<button>");
        imageHolder.attr("src", articleImage);
        $(".uk-modal-title").append(comment[0].title);
        $("#article-body").append(imageHolder);
        $("#article-body").append(comment[0].fullContent);
        commentSection.appendTo($("#article-body"));
        commentForm.appendTo($("#article-body"));
        commentInput.appendTo(commentForm);
        userInput.appendTo(commentForm);
        commentSubmit.appendTo(commentForm);
        commentSubmit.text("Submit");
        commentSubmit.attr("class", "comment-submit");
        commentSubmit.attr("data-type", buttonID);
        getComments(buttonID);
    })
});

$('body').on('click', 'button.comment-submit', function(event) {
    event.preventDefault();
    let commentBody = commentInput.val();
    let username = userInput.val();
    let id = commentSubmit.attr("data-type");
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

})

function getComments(id) {
    $.ajax(`/comment/${id}`, {
        type: "GET",
    }).then(function(comments) {
        comments.forEach(function(comment) {
            commentDiv = $("<div>");
            commentDiv.appendTo(commentForm);
            commentDiv.append(`${comment.body} - ${comment.username}`);
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