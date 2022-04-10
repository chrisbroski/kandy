/* jshint unused: false */
/* global showdown*/
var aero = new Aerophane();

// aero.createMenu(document.querySelector("#select-admin"));
// document.querySelector("#style-default"), function () {
//     getStyle("main");
// });

aero.initNav();

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function dateTitleFormat(d) {
    var date = new Date(d + "T00:00:01");
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function gigTimes(date, startTime, durationH, durationM) {
    var gigDate = new Date(date);
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
    if (minuteStart) {
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
    var converter = new showdown.Converter();
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
    h3.appendChild(document.createTextNode(`, ${date.getFullYear()}`));
    div.appendChild(h3);

    h3 = document.createElement("h3");
    a = document.createElement("a");
    a.href = `/venue?id=${gig.venue}`;
    a.textContent = gig.venueData.name;
    h3.appendChild(a);
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
    return div;
}

function gigMapDiv(venueData) {
    var div = document.createElement("div");
    var iframe = document.createElement("iframe");
    iframe.className = "map";

    iframe.loading = "lazy";
    iframe.src = `https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(venueData.name)}%2C+${encodeURIComponent(venueData.city)}+${encodeURIComponent(venueData.state)}&key=${venueData.MAP_KEY}`;
    div.appendChild(iframe);
    return div;
}

function extractSpotifyTrackId(shareLink) {
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
    a.href = href;
    a.appendChild(icon);
    a.appendChild(document.createTextNode(` ${menuName}`));
    p.appendChild(a);
    return p;
}

var social = {
    "fb": {"icon": "facebook.svg", "name": "Facebook"},
    "spotify": {"icon": "spotify.svg", "name": "Spotify"},
    "instagram": {"icon": "instagram.svg", "name": "Instagram"},
    "youtube": {"icon": "youtube.svg", "name": "YouTube"},
    "podcast": {"icon": "podcast.svg", "name": "Podcast"}
};

var bandName;
function setTitle(callback) {
    getJsonData("/api/band/", function (info) {
        document.title = `${document.title} - ${info.name}`;
        bandName = info.name;

        var header = document.createElement("header");
        var button = document.createElement("button");
        var icon = document.createElement("span");
        icon.className = "material-icons";
        icon.textContent = "menu";
        button.appendChild(icon);
        var h1 = document.createElement("header");
        h1.textContent = bandName;
        header.appendChild(button);
        header.appendChild(h1);

        var nav = document.createElement("nav");
        nav.id = "main";
        nav.appendChild(navLink("/", "home", "Home"));
        nav.appendChild(navLink("/shows", "event", "Shows"));
        nav.appendChild(navLink("/music", "album", "New Releases"));
        nav.appendChild(navLink("/songs", "library_music", "All Songs"));
        nav.appendChild(navLink("/about", "menu_book", "About"));

        var p = document.createElement("p");
        p.id = "social";
        Object.keys(info.social).forEach(soc => {
            var a;
            var img;
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

        document.body.insertBefore(nav, document.body.firstChild);
        document.body.insertBefore(header, nav);

        if (callback) {
            callback();
        }
    });
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

function dateFormat(date) {
    var text = document.createDocumentFragment();
    text.appendChild(document.createTextNode(`${months[date.getMonth()]} ${date.getDate()}`));
    text.appendChild(ord(date.getDate()));
    text.appendChild(document.createTextNode(`, ${date.getFullYear()}`));
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
