/*exported Aerophane */
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

    function initNav(button) {
        button = button || document.querySelector("body > header > button:first-child");
        button.addEventListener("click", function () {
            showNav();
        });
    }
    this.initNav = initNav;

    createMatte();
}
