/* jshint unused: false */
/* global showdown*/
function Aerophane() {
    "use strict";

    var classname, menuWidth = '240px';

    function forEachElement(els, func) {
        var ii, len = els.length;

        for (ii = 0; ii < len; ii += 1) {
            func(els[ii], ii);
        }
    }
    this.forEachElement = forEachElement;

    function manipulateClassNames(addOrRemove, el, class_name) {
        var classString = el.className, classArray;

        classArray = classString.split(" ");

        if (classArray.indexOf(class_name) > -1) {
            if (addOrRemove === "remove") {
                classArray.splice(classArray.indexOf(class_name), 1);
            }
        } else {
            if (addOrRemove === "add") {
                classArray.push(class_name);
            }
        }

        el.className = classArray.join(" ");
    }

    classname = {
        "add": function (el, class_name) {
            manipulateClassNames("add", el, class_name);
        },
        "remove": function (el, class_name) {
            manipulateClassNames("remove", el, class_name);
        }
    };
    this.classname = classname;

    function showDialog(el) {
        document.activeElement.blur();
        document.getElementById("matte").style.display = "block";
        classname.add(document.body, "stop-scrolling");
        el.style.display = "block";
    }
    this.showDialog = showDialog;

    function closeMenu(e) {
        var menus = document.querySelectorAll("body > menu"),
            nodeName = "",
            parentNodeName = "";

        if (e) {
            nodeName = e.target.nodeName;
            if (e.target.parentElement) {
                parentNodeName = e.target.parentElement.nodeName;
            }
        }

        if (nodeName !== "LI" && parentNodeName != "MENU") {
            forEachElement(menus, function (menu) {
                menu.style.display = "none";
            });
            document.body.removeEventListener("click", closeMenu);
            classname.remove(document.body, "stop-scrolling");
        }
    }
    this.closeMenu = closeMenu;

    function createMenu(button) {
        button.addEventListener("click", function () {
            var menuId = this.getAttribute("data-menu-id");
            var menu = document.getElementById(menuId);
            if (menu.style.display !== "block") {
                document.activeElement.blur();
                menu.style.display = "block";
                classname.add(document.body, "stop-scrolling");
                window.setTimeout(function () {
                    document.body.addEventListener("click", closeMenu);
                }, 10);
            }
        });
    }
    this.createMenu = createMenu;

    function clearDialogs() {
        var mainNav = document.querySelector("nav#main");
        if (mainNav && mainNav.hasAttribute("style")) {
            mainNav.removeAttribute("style");
        }
        forEachElement(document.querySelectorAll("div.dialog"), function (el) {
            el.style.display = "none";
        });
        document.getElementById("matte").style.display = "none";
        if (document.getElementById("aeroDialogSelect")) {
            document.body.removeChild(document.getElementById("aeroDialogSelect"));
        }
        manipulateClassNames("remove", document.body, "stop-scrolling");
    }
    this.clearDialogs = clearDialogs;

    function createMatte() {
        var navMatte = document.createElement("div");
        navMatte.id = "matte";
        document.body.appendChild(navMatte);

        navMatte.addEventListener("click", clearDialogs);
    }

    function showNav() {
        var mainNav = document.querySelector("body > nav#main");
        if (mainNav.style.width === menuWidth) {
            clearDialogs();
        } else {
            mainNav.style.width = menuWidth;
            document.getElementById("matte").style.display = "block";
            manipulateClassNames("add", document.body, "stop-scrolling");
        }
    }
    this.showNav = showNav;

    createMatte();
}
var aero = new Aerophane();
var converter = new showdown.Converter({"noHeaderId": true, "simpleLineBreaks": true});
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function gigTimes(date, startTime, durationH, durationM) {
    var gigStart = new Date(date + "T" + startTime + ":00");
    var hourStart = gigStart.getHours();
    var minuteStart = gigStart.getMinutes();
    var durationHms = parseInt(durationH, 10) * 60 * 60 * 1000;
    var durationMms = parseInt(durationM, 10) * 60 * 1000;

    var gigEnd = new Date(+gigStart + durationHms + durationMms);
    var hourEnd = gigEnd.getHours();
    var minuteEnd = gigEnd.getMinutes();

    var amPmStart = "AM";
    if (hourStart >= 12) {
        amPmStart = "PM";
    }
    if (hourStart > 12) {
        hourStart = hourStart - 12;
    }

    if (minuteStart) {
        if (minuteStart < 10) {
            minuteStart = ":0" + minuteStart;
        } else {
            minuteStart = ":" + minuteStart;
        }
    } else {
        minuteStart = "";
    }

    var amPmEnd = "AM";
    if (hourEnd >= 12) {
        amPmEnd = "PM";
    }
    if (hourEnd > 12) {
        hourEnd = hourEnd - 12;
    }
    if (minuteEnd) {
        if (minuteEnd < 10) {
            minuteEnd = ":0" + minuteEnd;
        } else {
            minuteEnd = ":" + minuteEnd;
        }
    } else {
        minuteEnd = "";
    }
    if (amPmStart === amPmEnd) {
        return `${hourStart}${minuteStart} - ${hourEnd}${minuteEnd} ${amPmEnd}`;
    }
    return `${hourStart}${minuteStart} ${amPmStart} - ${hourEnd}${minuteEnd} ${amPmEnd}`;
}

function ord(num) {
    var sup = document.createElement("sup");
    var ordText = "th";
    num = num.toString(10);
    if (num.slice(-1) === "1") {
        ordText = "st";
    }
    if (num.slice(-1) === "2") {
        ordText = "nd";
    }
    if (num.slice(-1) === "3") {
        ordText = "rd";
    }
    sup.textContent = ordText;
    return sup;
}

function gigInfoDiv(gig) {
    var div = document.createElement("div");
    var h3;
    var p;
    var a;
    var date = new Date(gig.date + "T00:00:01");

    if (gig.title) {
        h3 = document.createElement("h3");
        h3.textContent = gig.title;
        div.appendChild(h3);
    }

    h3 = document.createElement("h4");
    h3.textContent = `${months[date.getMonth()]} ${date.getDate()}`;
    h3.appendChild(ord(date.getDate()));
    // NB: removed comma because the Good Vibes demo doesn't have one
    h3.appendChild(document.createTextNode(` ${date.getFullYear()}`));
    div.appendChild(h3);

    h3 = document.createElement("h3");
    if (gig.venueData.desc || gig.venueData.link) {
        a = document.createElement("a");
        a.href = `/venue?id=${gig.venue}`;
        a.textContent = gig.venueData.name;
        h3.appendChild(a);
    } else {
        h3.textContent = gig.venueData.name;
    }
    div.appendChild(h3);

    p = document.createElement("p");
    p.textContent = daysOfTheWeek[date.getDay()] + ", " + gigTimes(gig.date, gig.startTime, gig.durationH, gig.durationM);
    div.appendChild(p);

    p = document.createElement("p");
    p.textContent = `${gig.venueData.city}, ${gig.venueData.state}`;
    div.appendChild(p);

    var markdown;
    if (gig.desc) {
        markdown = document.createElement("div");
        markdown.innerHTML = converter.makeHtml(gig.desc);
        div.appendChild(markdown);
    }
    if (gig.fbEvent) {
        p = document.createElement("p");
        a = document.createElement("a");
        a.textContent = "Facebook Event";
        a.href = gig.fbEvent;
        a.target = "_facebook";
        p.appendChild(a);
        div.appendChild(p);
    }
    return div;
}

function gigMapDiv(venueData) {
    var div = document.createElement("div");
    var iframe = document.createElement("iframe");
    iframe.className = "map";

    var q = [];
    if (!venueData.add1) {
        q.push(encodeURIComponent(venueData.name));
    }
    if (venueData.add1) {
        q.push(encodeURIComponent(venueData.add1));
    }
    if (venueData.add2) {
        q.push(encodeURIComponent(venueData.add2));
    }
    q.push(encodeURIComponent(venueData.city));
    q.push(encodeURIComponent(venueData.state));
    if (venueData.zip) {
        q.push(encodeURIComponent(venueData.zip));
    }

    iframe.loading = "lazy";
    iframe.src = `https://www.google.com/maps/embed/v1/place?q=${q.join("+")}&key=${venueData.MAP_KEY}`;

    div.appendChild(iframe);
    return div;
}

function extractSpotifyTrackId(shareLink) {
    console.log(shareLink);
    var reQs, val;
    if (!shareLink) {
        return "";
    }
    reQs = new RegExp("[.*]spotify.com/track/([^?#]*)", "i");
    val = reQs.exec(shareLink);
    if (val) {
        return val[1];
    }
    return shareLink;
}

function getJsonData(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.addEventListener("load", function () {
        var jsonData = JSON.parse(this.responseText);
        callback(jsonData);
    });
    xhr.send();
}

function embedSpotifyPlayer(id, type) {
    var iframe = document.createElement("iframe");
    iframe.className = "spotify-player-sm";
    iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.src = `https://open.spotify.com/embed/${type}/${id}`;
    iframe.loading = "lazy";
    return iframe;
}

function moreButton(link, text) {
    var more;
    more = document.createElement("a");
    more.className = "more";
    more.href = link;
    more.textContent = text;
    return more;
}

function navLink(href, iconName, menuName) {
    var p = document.createElement("p");
    var a = document.createElement("a");
    var icon = document.createElement("span");
    icon.className = "material-icons";
    icon.textContent = iconName;
    if (href) {
        a.href = href;
        a.appendChild(icon);
        a.appendChild(document.createTextNode(` ${menuName}`));
        p.appendChild(a);
    } else {
        p.appendChild(icon);
        p.appendChild(document.createTextNode(` ${menuName}`));
    }
    return p;
}

var social = {
    "fb": {"icon": "facebook.svg", "name": "Facebook"},
    "spotify": {"icon": "spotify.svg", "name": "Spotify"},
    "instagram": {"icon": "instagram.svg", "name": "Instagram"},
    "youtube": {"icon": "youtube.svg", "name": "YouTube"},
    "podcast": {"icon": "podcast.svg", "name": "Podcast"},
    "tiktok": {"icon": "tiktok.svg", "name": "Tiktok"}
};

var bandName;
function setTitle(callback, supportLink) {
    getJsonData("/api/band/", function (info) {
        // document.title = `${document.title} - ${info.name}`;
        bandName = info.name;

        var header = document.createElement("header");
        var button = document.createElement("button");
        button.addEventListener("click", function () {
            aero.showNav();
        });
        var icon = document.createElement("span");
        icon.className = "material-icons";
        icon.textContent = "menu";
        button.appendChild(icon);
        var h1 = document.createElement("h1");
        h1.textContent = bandName;
        header.appendChild(button);
        header.appendChild(h1);

        var nav = document.createElement("nav");
        nav.id = "main";
        var a;
        var img;
        var div = document.createElement("div");
        div.id = "accessible-version";
        a = document.createElement("a");
        a.href = "/api/";
        img = document.createElement("span");
        img.className = "material-icons";
        img.textContent = "accessibility_new";
        a.appendChild(img);
        a.appendChild(document.createTextNode("Accessible Version"));
        div.appendChild(a);
        nav.appendChild(div);

        nav.appendChild(navLink("/", "home", "Home"));
        if (info.upcomingGigs) {
            nav.appendChild(navLink("/shows", "event", "Shows"));
        } else {
            if (info.pastGigs) {
                nav.appendChild(navLink("/pas", "event", "Shows"));
            }
        }
        if (info.releases) {
            nav.appendChild(navLink("/music", "album", "New Releases"));
        }
        if (info.songs) {
            nav.appendChild(navLink("/songs", "library_music", "All Songs"));
        }
        if (info.about) {
            nav.appendChild(navLink("/about", "menu_book", "About"));
        }
        if (info.support) {
            nav.appendChild(navLink("/support", "volunteer_activism", "Support"));
        }

        var p = document.createElement("p");
        p.id = "social";
        Object.keys(info.social).forEach(soc => {
            if (info.social[soc]) {
                a = document.createElement("a");
                a.href = info.social[soc];
                img = document.createElement("img");
                img.alt = social[soc].name;
                img.src = `/img/social/${social[soc].icon}`;
                a.appendChild(img);
                p.appendChild(a);
                p.appendChild(document.createTextNode("\n"));
            }
        });
        nav.appendChild(p);

        var supportUs;
        var supportIcon;
        if (supportLink && info.support) {
            supportUs = document.createElement("a");
            supportUs.id = "support-us";
            supportUs.href = "/support";
            supportIcon = document.createElement("span");
            supportIcon.className = "material-icons";
            supportIcon.textContent = "volunteer_activism";
            supportIcon.title = "Support the Music";
            supportUs.appendChild(supportIcon);
            document.body.insertBefore(supportUs, document.querySelector("main"));
        }

        document.body.insertBefore(nav, document.querySelector("main"));
        document.body.insertBefore(header, nav);

        if (callback) {
            callback();
        }
    });
}

function dateFormat(date) {
    var text = document.createDocumentFragment();
    if (typeof date === "string") {
        date = date.split("-");
        text.appendChild(document.createTextNode(`${months[parseInt(date[1], 10) - 1]} ${parseInt(date[2], 10)}`));
        text.appendChild(ord(parseInt(date[2], 10)));
        text.appendChild(document.createTextNode(`, ${date[0]}`));
    } else {
        text.appendChild(document.createTextNode(`${months[date.getMonth()]} ${date.getDate()}`));
        text.appendChild(ord(date.getDate()));
        text.appendChild(document.createTextNode(`, ${date.getFullYear()}`));
    }
    return text;
}

function querystring(key) {
    var oRe = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var val = oRe.exec(parent.location.search);
    return (val) ? decodeURIComponent(val[1]) : "";
}

function removeQs(fullUrl) {
    if (!fullUrl) {
        return '';
    }
    if (fullUrl.indexOf('?') === -1) {
        return fullUrl;
    }
    return fullUrl.slice(0, fullUrl.indexOf('?'));
}

function removeHash(fullUrl) {
    if (!fullUrl) {
        return '';
    }
    if (fullUrl.indexOf('#') === -1) {
        return fullUrl;
    }
    return fullUrl.slice(0, fullUrl.indexOf('#'));
}

function extractYouTubeId(url) {
    var reQs, val;
    if (!url) {
        return "";
    }
    // first look for querystring v
    if (url.indexOf("?") > -1) {
        reQs = new RegExp("[\\?&]v=([^&#]*)");
        val = reQs.exec(url.slice(url.indexOf("?")));
        if (val[1]) {
            return decodeURIComponent(val[1]);
        }
    }

    // get rid of any search string or hash
    url = removeQs(url);
    url = removeHash(url);

    reQs = new RegExp("[.*]youtube.com/(embed/|watch\?v=)([^?#]*)", "i");

    val = reQs.exec(url);
    if (val && val[2]) {
        return val[2];
    }

    reQs = new RegExp("https://youtu.be/([^?#]*)", "i");
    val = reQs.exec(url);
    if (val && val[1]) {
        return val[1];
    }
    return url;
}

function embedYtPlayer(url) {
    var iframe = document.createElement("iframe");
    console.log(extractYouTubeId(url));
    iframe.src = `https://www.youtube.com/embed/${extractYouTubeId(url)}`;
    iframe.className = "vid";
    iframe.title = "YouTube video player";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.setAttribute("allowFullScreen", "");
    iframe.loading = "lazy";
    return iframe;
}

function embedFbPlayer(url) {
    var iframe = document.createElement("iframe");
    iframe.src = `https://www.facebook.com/plugins/video.php?height=317&href=${encodeURIComponent(url)}%2F&show_text=false&width=560&t=0`;
    iframe.className = "vid";
    iframe.scrolling = "no";
    iframe.allowfullscreen = "true";
    iframe.allow = "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share";
    iframe.allowFullScreen = "true";
    iframe.loading = "lazy";
    return iframe;
}

function domain(url) {
    if (!url) {
        return "";
    }
    var reUrl = /.*\:\/\/([^\/]*)(\/|\?|$)/;
    var results = reUrl.exec(url);
    if (!results) {
        return "";
    }
    var domain = results[1];
    // remove any sub-domains
    var hasSubDomains = domain.lastIndexOf(".", domain.lastIndexOf(".") - 1);
    if (hasSubDomains > -1) {
        domain = domain.slice(hasSubDomains + 1);
    }
    return domain.charAt(0).toUpperCase() + domain.substr(1);
}

var streamers = [
    {
        "name": "Spotify",
        "id": "spotify",
        "pattern": "open.spotify.com"
    },
    {
        "name": "Apple Music",
        "id": "apple-music",
        "pattern": "music.apple.com"
    },
    {
        "name": "YouTube Music",
        "id": "youtube-music",
        "pattern": "music.youtube.com"
    },
    {
        "name": "Amazon Music",
        "id": "amazon-music",
        "pattern": "music.amazon.com"
    }
];

function getStreamer(url) {
    var ii;
    var len = streamers.length;

    for (ii = 0; ii < len; ii +=1) {
        if (url.indexOf(streamers[ii].pattern) > -1) {
            return streamers[ii];
        }
    }
    return {
        "name": domain(url),
        "id": "play-audio",
        "pattern": ""
    };
}

var videoProviders = [
    {
        "name": "YouTube",
        "id": "youtube",
        "pattern": "youtube.com"
    },
    {
        "name": "YouTube",
        "id": "youtube",
        "pattern": "youtu.be"
    },
    {
        "name": "Facebook",
        "id": "facebook-video",
        "pattern": "facebook.com"
    }
];

function getVideoProvider(url) {
    var ii;
    var len = videoProviders.length;

    for (ii = 0; ii < len; ii +=1) {
        if (url.indexOf(videoProviders[ii].pattern) > -1) {
            return videoProviders[ii];
        }
    }
    return {
        "name": domain(url),
        "id": "play-video",
        "pattern": ""
    };
}

var paymentProviders = [
    {
        "name": "Venmo",
        "id": "venmo",
        "pattern": "venmo.com"
    }
];

function getPayment(url) {
    var ii;
    var len = paymentProviders.length;

    for (ii = 0; ii < len; ii += 1) {
        if (url.indexOf(paymentProviders[ii].pattern) > -1) {
            return paymentProviders[ii];
        }
    }
    return {
        "name": domain(url),
        "id": "pay",
        "pattern": ""
    };
}

var socialMedia = [
    {
        "name": "Facebook",
        "id": "facebook",
        "pattern": "facebook.com"
    },
    {
        "name": "YouTube",
        "id": "youtube",
        "pattern": "youtube.com"
    },
    {
        "name": "Spotify",
        "id": "spotify",
        "pattern": "spotify.com"
    },
    {
        "name": "Podcast",
        "id": "podcast",
        "pattern": "anchor.fm"
    },
    {
        "name": "TikTok",
        "id": "tiktok",
        "pattern": "tiktok.com"
    },
    {
        "name": "Instagram",
        "id": "instagram",
        "pattern": "instagram.com"
    }
];

function getSocialMedium(url) {
    var ii;
    var len = socialMedia.length;

    for (ii = 0; ii < len; ii += 1) {
        if (url.indexOf(socialMedia[ii].pattern) > -1) {
            return socialMedia[ii];
        }
    }
    return {
        "name": domain(url),
        "id": "social",
        "pattern": ""
    };
}
