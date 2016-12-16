/**
 * Created by abhikmitra on 12/15/16.
 */
(function () {
    var accessToken;
    var groups = [];
    var tags = [];
    var userEmail = "";
    var title = "";
    var text = "";
    var url = "";
    var useruserPrincipalName= "";
    var image = "";
    var requestURL = "";
    function initialize() {
        $(".saved-show").hide();
        $(".saved-hide").hide();
        $(".saving-show").show();
        $(".saving-hide").hide();
        $('select').niceSelect();
        $('#shareToGroup').click(shareToGroup);
        $('#shareToGroup').show();
        $('#sharing').hide();
    }



    chrome.tabs.query({active:true},function(tabs){
        initialize();
        console.log("tabs");
        if (tabs.length > 0) {
            var url = tabs[0].url;
            console.log("this url is ", url);
            bookmarkUrl(url).then(function (data) {
                if(data.success) {
                    parseResultForTags(data.data);
                }
            });
        }
        setTimeout(function () {
            populateGroups();
            $('.collapse').collapse();
            $("#accordion").show();
        }, 10);
    });
    function shareToGroup() {
        $('#sharing').show();
        $('#shareToGroup').hide();
        var groupMailSelected = $(".nice-select span.current").text();
        var group = _.find(groups, function (group) {
            return group.mail === groupMailSelected;
        });
        makeBackEndRequest(group.id, group.mail, tags, $("#additionalContent").val(), userEmail, accessToken, title, text.substr(0, 400) + "...", url,  image, requestURL  ).then(function () {

            createNotifications(group.mail, userEmail, title, url);
        });


    }



    function makeBackEndRequest(groupId, groupMail, tags, additionalText, userEmail, accessToken, title, preview , url, image, requestURL) {
        console.log(arguments);
        debugger;
        return $.post("http://localhost:3000/postToGroup",{
            groupId:groupId,
            groupMail:groupMail,
            tags:tags,
            additionalText:additionalText,
            userEmail:userEmail,
            accessToken:accessToken,
            title:title,
            preview:preview,
            url:url,
            image: image,
            requestURL: requestURL
        })

    }

    function bookmarkUrl(url) {
        return $.post("http://localhost:3000/postURL",{
            url:url
        })
    }

    function populateGroups() {
        chrome.storage.sync.get('o365Data', function(info) {
            if (info.o365Data && info.o365Data.ACCESS_TOKEN_CACHE_KEY) {
                accessToken = info.o365Data.ACCESS_TOKEN_CACHE_KEY;
                userEmail = info.o365Data.mail;
                useruserPrincipalName = info.o365Data.userPrincipalName;
                if(info.o365Data.groups) {
                    groups = info.o365Data.groups
                    populateGroupListInUi(_.map(info.o365Data.groups, "mail"));
                }
            }
        });
    }
    function onFinishLoadingTags(tags) {

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

    function populateGroupListInUi(groupMails) {
        groupMails.forEach(function (groupMail) {
            $("#groupList").append("<option value='"
                + groupMail +
                "'>" + groupMail +
                "</option>")
        });
        $('select').niceSelect('update');
    }
    function parseResultForTags(data) {
        tags = [] ;
        text = data.text;
        title = data.title;
        url = data.url;
        image = data.image;
        requestURL = data.requestURL;
        parseAuthors(data.authors.names, tags);
        parseConcepts(data.concepts, tags);
        parseKeywords(data.keywords, tags);
        parseTaxonomy(data.taxonomy, tags);
        onFinishLoadingTags(tags);
        console.log(tags);
        if (data.title) {
            $("#additionalContent").val(data.title);
        }
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

        if (author.toLowerCase().indexOf("  bureau")) {
            return false;
        }

        if (author.toLowerCase().indexOf("  ist")) {
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
    
    function createNotifications(groupEmail, userEmail, title, url) {
        var domain = userEmail.replace(/.*@/, "");
        var groupUrl = "https://outlook.office.com/owa/?realm=" + domain + "&path=/group/"+groupEmail+"/mail";
        chrome.notifications.create(
            'notify2', {
                type : chrome.notifications.TemplateType.BASIC,
                iconUrl: "small_icon.jpg",
                // imageUrl: "icon.png",
                title: "Posted!",
                message: "Your link has been posted to group " + groupEmail,
                contextMessage: title,
                priority: 2,
                buttons: [{
                    title: "See Your Board"
                }
                ]

            }, function (notificationId) {

            })
            chrome.notifications.onButtonClicked.addListener(function callback() {

                window.close();
                chrome.tabs.create({ url: groupUrl });
            });

    }

}());