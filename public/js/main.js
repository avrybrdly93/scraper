
$.ajax({
    type: "GET",
    url: "/articles"
}).then(function(article) {
    let formId = 0;
    article.forEach(function(element) {
        let articleTitle = $("<h3>");
        let articleContent = $("<p>");
        let articleLink = $("<p>");
        let articleImg = $("<img>");
        // let articleComments = $("<div>");
        // let articleComment = $("<p>");
        // let commentForm = $("<form>");
        // let commentInput = $("<input>");
        // let commentSubmit = $("<button>");
        
        articleTitle.text(element.title);
        //articleTitle.attr("href", element.link);
        articleContent.text(element.content);
        //articleLink.text(element.link);
        articleImg.attr("src", element.imgLink);
        // articleComment.text(element.comments);

        // commentInput.attr("id", formId);
        // commentInput.attr("type", "text")
        // // commentSubmit.attr("type", "submit");
        // commentSubmit.attr("class", "btn");
        // commentSubmit.attr("id", formId);
        // formId++;
        // commentSubmit.text("Submit");

        articleTitle.appendTo($("#article-area"));
        articleContent.appendTo($("#article-area"));
        articleLink.appendTo($("#article-area"));
        articleImg.appendTo($("#article-area"));
        // articleComments.appendTo($("#article-area"));
        // articleComment.appendTo(articleComments);
        // commentForm.appendTo(articleComments);
        // commentInput.appendTo(commentForm);
        // commentSubmit.appendTo(commentForm);
    })

    console.log(article);
});


// $('body').on('click', 'button', function(event) {
//     let buttonID = $(this).attr("id");
//     $.ajax({
//         type: "POST",
//         url: `/comment/${buttonID}`,
//         data: comment
//     }).then(function() {

//     })
// });

// $.get("/articles", function() {

// })
