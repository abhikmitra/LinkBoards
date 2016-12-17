/**
 * Created by abhikmitra on 12/15/16.
 */
(function () {
    var accessToken;
    var groups = [];
    var tags = [];
    var recommendations = [];
    var userEmail = "";
    var title = "";
    var text = "";
    var url = "";
    var useruserPrincipalName= "";
    var image = "";
    var requestURL = "";
    var selectedGroupsForPosting = [];
    function initialize() {
        $(".saved-show").hide();
        $(".saved-hide").hide();
        $(".saving-show").show();
        $(".saving-hide").hide();
        $(".success-show").hide();
        $(".success-hide").hide();
        $('#shareToGroup').click(shareToGroup);
        $('#shareToGroup').show();
        $('#sharing').hide();
        $('#fakeNews').hide();
        $(".recommendation-show").hide();
        $(".recommending-show").show();
        // $('.panel.panel-default').each(function (el) {
        //     $(this).addClass('magictime slideRightReturn');
        // })
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
            }, function () {
                alert("Token expired, please login again to continue");
            });

        }
        setTimeout(function () {
            populateGroups();
            $('.collapse').collapse();
            $("#accordion").show();
            checkIfFakeNews(url).then(function (isFake) {
                if(isFake) {
                    $('#fakeNews').show();

                } else {
                    $('#fakeNews').hide();
                }
            });
        }, 10);

    });
    function shareToGroup() {
        $('#sharing').show();
        $('#shareToGroup').hide();
        var selectedGroups = $('#groupList option:selected').map(function(a, item){return item.value;});
        var selectedGroupsToSend = [];
        $.each(selectedGroups,function(index, groupMailSelected) {
            var selectedGroupJSON = _.find(groups, function (group) {
                return group.mail === groupMailSelected;
            });
            if(selectedGroupJSON) {
                selectedGroupsToSend.push(selectedGroupJSON);
            }

        });

        if (!selectedGroupsToSend.length) {
            return;
        }
        selectedGroupsForPosting = selectedGroupsToSend[0];

        makeBackEndRequest(selectedGroupsToSend[0].id, selectedGroupsToSend[0].mail, tags, $("#additionalContent").val(), userEmail, accessToken, title, text.substr(0, 400) + "...", url,  image, requestURL  ).then(function () {
            onSuccess(selectedGroupsToSend, userEmail);
            // createNotifications(selectedGroupsToSend[0].mail, userEmail, title, url);
        }, function () {
            alert("Token expired, please login again");
        });


    }
    
    function onSuccess(selectedGroupsToSend, userEmail) {
        $(".success-show").show();
        $(".success-hide").hide();
        var domain = userEmail.replace(/.*@/, "");
        selectedGroupsToSend.forEach(function (group) {

            var groupUrl = "https://outlook.office.com/owa/?realm=" + domain + "&path=/group/"+group.mail+"/mail";
            var html = "" +
                "<tr>" +
                    "<td style='vertical-align: middle;'>" + group.mail +
                    "</td>"+
                    "<td style='text-align: right'>" +
                        "<a class='btn btn-default' target='_blank' href='" + groupUrl + "'>" +
                            '<i class="fa fa-eye" aria-hidden="true"></i>&nbsp;View' +
                        "</a>" +
                    "</td>"+
                "</tr>"
            $("#successTable").append(html);
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
                "<span class='tags hvr-grow-shadow'>" +
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
        $('#groupList').multiselect({nonSelectedText: 'Select Group', numberDisplayed: 1});
    }
    function parseResultForTags(data) {
        tags = [] ;
        recommendations = [] ;
        text = data.text;
        title = data.title;
        url = data.url;
        image = data.image;
        requestURL = data.requestURL;
        console.log(data);
        parseAuthors(data.authors.names, tags);
        parseConcepts(data.concepts, tags);
        parseKeywords(data.keywords, tags);
        parseTaxonomy(data.taxonomy, tags);
        onFinishLoadingTags(tags);
        console.log(tags);

        if (data.title) {
            $("#additionalContent").val(data.title);
        }
        getRecommendations(tags,title).then(function (data) {
            if(!data.data && !data.data.length) {
                return;
            }
            recommendations = data.data.map(function (el) {
                return {
                    title:el.title,
                    url:el.url,
                }
            });
            renderRecommendations(recommendations)
        });
    }

    function renderRecommendations(recommendations) {
        $(".recommendation-show").show();
        $(".recommending-show").hide();
        recommendations.forEach(function (el) {
            if (el.title == title) {
                return;
            }

            if (el.url == url) {
                return;
            }

            var html = "" +
                "<tr>" +
                "<td style='vertical-align: middle;'>" + el.title +
                "</td>"+
                "<td style='text-align: right'>" +
                "<a class='btn btn-default hvr-overline-from-center' target='_blank' href='" + el.url + "'>" +
                '<i class="fa fa-eye" aria-hidden="true"></i>&nbsp;View' +
                "</a>" +
                "</td>"+
                "</tr>"
            $("#recommendationsTable").append(html);
        });
    }

    function getRecommendations(tags, title) {
        return $.post("http://localhost:3000/recommendations",{
            tags:tags,
            title:title
        })
    }


    function parseAuthors(authors, tags) {
        authors.forEach(function (author) {
            if(checkForAuthor(author)) {
                tags.push("#author-" + replaceSpaceWithUnderscore(author));
            }
        })
    }
    function checkForAuthor(author) {

        if (author.toLowerCase().indexOf(" staff") !== -1) {
            return false;
        }

        if (author.toLowerCase().indexOf(" times") !== -1) {
            return false;
        }

        if (author.toLowerCase().indexOf(" correspondent")!== -1) {
            return false;
        }

        if (author.toLowerCase().indexOf(" reporter")!== -1) {
            return false;
        }

        if (author.toLowerCase().indexOf(" reuters")!== -1) {
            return false;
        }

        if (author.toLowerCase().indexOf("  bureau")!== -1) {
            return false;
        }

        if (author.toLowerCase().indexOf("  ist")!== -1) {
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
                iconUrl: "small_icon.png",
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
    
    function checkIfFakeNews(url) {
        var hostname = (new URL(url)).hostname;
        hostname = hostname.replace("www","");
        return $.get("https://raw.githubusercontent.com/BigMcLargeHuge/opensources/master/notCredible/notCredible.json")
            .then(function (data) {
                data = JSON.parse(data);
                if (data[hostname.toLowerCase()]) {
                    return true;
                }
                return false;
        });
    }

}());