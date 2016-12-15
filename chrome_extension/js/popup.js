/**
 * Created by abhikmitra on 12/15/16.
 */
(function () {

    function initialize() {
        $(".saved-show").hide();
        $(".saved-hide").hide();
        $(".saving-show").show();
        $(".saving-hide").hide();
        $('select').niceSelect();
        $('.collapse').collapse()
    }



    chrome.tabs.query({active:true},function(tabs){
        initialize();
        if (tabs.length > 0) {
            var url = tabs[0].url;
            console.log("this url is ", url);
            url = "http://www.firstpost.com/business/demonetisation-day-37-new-notes-far-more-secure-says-ea-secy-shaktikanta-das-3155700.html";
            bookmarkUrl(url).then(function (data) {
                if(data.success) {
                    parseResultForTags(data.data);
                }
            });
        }
    });


    function bookmarkUrl(url) {
        return $.post("http://localhost:3000/postURL",{
            url:url
        })
    }
    function onFinishLoadingTags(tags) {
        debugger;
        $("#container").removeClass("loading");
        $("#container").addClass("loaded");
        $(".saved-show").show();
        $(".saved-hide").hide();
        $(".saving-show").hide();
        $(".saving-hide").hide();

        tags.forEach(function (tag) {
            $("#tagDisplay").append(
                "<span class='tags'>" +
                    tag +
                "</span>"
            )
        });
        setTimeout(function () {
            $('#tagDisplay').masonry({
                columnWidth: 1,
                itemSelector: '.tags'
            });
        });
    }
    function parseResultForTags(data) {
        var tags = [] ;
        parseAuthors(data.authors.names, tags);
        parseConcepts(data.concepts, tags);
        parseKeywords(data.keywords, tags);
        parseTaxonomy(data.taxonomy, tags);
        onFinishLoadingTags(tags);
        console.log(tags);
    }
    function parseAuthors(authors, tags) {
        authors.forEach(function (author) {
            if(checkForAuthor(author)) {
                tags.push("#author-" + replaceSpaceWithUnderscore(author));
            }
        })
    }
    function checkForAuthor(author) {

        if (author.toLowerCase().indexOf(" staff")) {
            return false;
        }

        if (author.toLowerCase().indexOf(" times")) {
            return false;
        }

        if (author.toLowerCase().indexOf(" correspondent")) {
            return false;
        }

        if (author.toLowerCase().indexOf(" reporter")) {
            return false;
        }

        if (author.toLowerCase().indexOf(" reuters")) {
            return false;
        }

        return true;
    }

    function parseConcepts(concepts, tags) {
        concepts.forEach(function (concept) {
            if(parseFloat(concept.relevance) > 0.5) {
                tags.push("#topic-" + replaceSpaceWithUnderscore(concept.text));
            }
        })
    }

    function replaceSpaceWithUnderscore(key){
        return key.replace(/ /g,"_");
    }

    function parseKeywords(keywords, tags) {
        keywords.forEach(function (keyword) {
            if(parseFloat(keyword.relevance) > 0.5) {
                tags.push("#keyword-" + replaceSpaceWithUnderscore(keyword.text));
            }
        })
    }
    
    function parseTaxonomy(taxonomy, tags) {
        taxonomy.forEach(function (tax) {
            if(parseFloat(tax.score) > 0.4) {
                var categories =  tax.label.split("/");
                categories.forEach(function (category) {
                    if(category.trim()) {
                        tags.push("#category-" + replaceSpaceWithUnderscore(category));
                    }
                });
            }
        })
    }

}());