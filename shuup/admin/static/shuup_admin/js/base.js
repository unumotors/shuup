/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Materialize a Mithril.js virtual tree into a DOM node.
 * @param mithrilElement The virtual tree's root (a retval of `m()`)
 * @returns {Node} The materialized root of the virtual tree
 */
"use strict";

window.materialize = function materialize(mithrilElement) {
  // Cache a document fragment for materialization
  var root = window._materializeRoot || (window._materializeRoot = document.createDocumentFragment());

  // Render something into that root
  m.render(root, mithrilElement, true);

  // Then return the first child
  return root.firstChild;
};
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

$(function () {
    "use strict";

    function openMainNav() {
        $(document.body).addClass("menu-open");
    }

    function closeMainNav() {
        $(document.body).removeClass("menu-open");
    }

    function mainNavIsOpen() {
        return $(document.body).hasClass("menu-open");
    }

    $("#menu-button").click(function (event) {
        closeAllSubmenus();
        $("#site-search.mobile").removeClass("open"); // Close search if open on mobile
        event.stopPropagation();
        if (mainNavIsOpen()) {
            closeMainNav();
        } else {
            openMainNav();
        }
    });

    function closeAllSubmenus() {
        $(".category-submenu").each(function (idx, elem) {
            $(elem).removeClass("open");
        });
    }
    $(document).on("click", "#main-menu ul.menu-list > li a", function (e) {
        e.preventDefault();
        e.stopPropagation(); // do not close submenus
        var target_id = $(this).data("target-id");
        $(".category-submenu").each(function (idx, elem) {
            if ($(elem).attr("id") != target_id) {
                $(elem).removeClass("open");
            }
        });
        var $target = $("#" + target_id);
        if (!$target.length) {
            return;
        }
        var isOpen = $target.hasClass("open");
        $target.toggleClass("open", !isOpen);
    });

    $(window).click(function () {
        closeAllSubmenus();
    });

    $('.category-submenu').click(function (event) {
        event.stopPropagation();
        if ($(event.target).hasClass("fa-close")) {
            closeAllSubmenus();
        }
    });

    window.onresize = function () {
        closeAllSubmenus();
        if ($(window).width() < 768) {
            closeMainNav();
        }
    };
    if (window.Masonry) {
        (function () {
            var Masonry = window.Masonry;
            $(".category-menu-content").each(function (idx, elem) {
                var msnry = new Masonry(elem, {
                    itemSelector: '.submenu-container',
                    columnWidth: '.submenu-container',
                    percentPosition: true
                });
            });
        })();
    }
});
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

$(function () {
    "use strict";
    var searchResultController = null;

    function getShortcutFinder() {
        var usedShortcuts = { "s": true };
        var firstChoices = "123456789";
        var lastChoices = "abcdefghijklmnopqrstuvwxyz";
        return function (text) {
            var keys = (firstChoices + text.toLowerCase().replace(/[^a-z0-9]+/g, "") + lastChoices).split("");
            var key = _.detect(keys, function (possibleKey) {
                return !usedShortcuts[possibleKey];
            });
            if (key !== null) {
                usedShortcuts[key] = true;
            }
            return key;
        };
    }

    function resultView(ctrl) {
        var results = ctrl.results();
        if (results !== null && results.length === 0) {
            return m("div", gettext("No results."));
        }
        var showShortcuts = !!ctrl.showShortcuts();

        var _$partition = _.partition(results, "isAction");

        var _$partition2 = _slicedToArray(_$partition, 2);

        var actionResults = _$partition2[0];
        var standardResults = _$partition2[1];

        var getShortcut = getShortcutFinder();

        var singleResultLi = function singleResultLi(result, linkClass) {
            var key = showShortcuts ? getShortcut(result.text) : null;
            var attrs = { href: result.url, accesskey: key };
            if (result.target) {
                attrs["target"] = result.target;
            }
            return m("li", { key: result.url }, m(linkClass, attrs, [result.icon ? m("i." + result.icon) : null, result.text, key ? m("span.key", key.toUpperCase()) : null]));
        };

        var standardResultContents = m("div", _(standardResults).groupBy("category").map(function (groupResults, category) {
            return m("div.result-category", [m("h3.divider", ["" + category]), m("ul", _.map(groupResults, function (result) {
                return singleResultLi(result, "a.result");
            }))]);
        }).value());

        var actionResultContents = m("div", m("ul", _.map(actionResults, function (result) {
            return singleResultLi(result, "a.btn.btn-gray");
        })));

        return m("div.container-fluid", m("div.results", { id: "site-search-standard-results" }, standardResultContents), m("div.additional", { id: "site-search-action-results" }, actionResultContents));
    }

    function searchCtrl() {
        var ctrl = this;
        ctrl.results = m.prop(null);
        ctrl.showShortcuts = m.prop(false);
        this.doSearch = function (query) {
            if (!query) {
                ctrl.results([]);
                m.redraw();
                return;
            }
            $.ajax({
                url: window.ShuupAdminConfig.searchUrl,
                data: { "q": query }
            }).done(function (data) {
                ctrl.results(data.results);
                m.redraw();
            });
        };
        var setShowShortcuts = function setShowShortcuts(event) {
            if (event.keyCode === 18) {
                // 18 = alt
                ctrl.showShortcuts(event.type === "keydown");
                m.redraw();
            }
        };
        document.addEventListener("keydown", setShowShortcuts, false);
        document.addEventListener("keyup", setShowShortcuts, false);
    }

    var doSearch = function doSearch(query) {
        if (!searchResultController) {
            var container = document.getElementById("site-search-results");
            searchResultController = m.mount(container, { controller: searchCtrl, view: resultView });
        }
        searchResultController.doSearch(query);
    };

    var doSearchDebounced = _.debounce(doSearch, 500);

    $(document).click(function (e) {
        if (!$(e.target).closest("#site-search").length) {
            $("#site-search-results").slideUp(400, "easeOutCubic");
        }
    });

    // Disable default behaviour on mobile for the search dropdown.
    // The dropdown now stays open if clicked into the input field
    $(".mobile-search-dropdown").click(function (e) {
        e.stopPropagation();
    });

    // Hide search results if results are open and search parent element is clicked
    $("#site-search").find(".mobile").click(function () {
        if ($(this).hasClass("open")) {
            $("#site-search-results").slideUp(400, "easeOutCubic");
        }
    });

    function closeMobileSearchResults() {
        var windowWidth = $(window).outerWidth(true);
        var $siteSearchResults = $("#site-search-results");
        if ($siteSearchResults.is(":visible") && windowWidth < 768) {
            $siteSearchResults.slideUp(400, "easeOutCubic");
        }
    }

    $(window).resize(_.debounce(closeMobileSearchResults, 100));

    var $searchInputs = $("#site-search-input, #site-search-input-mobile");

    $searchInputs.on("keyup", function () {
        var query = $(this).val();
        if (query.length > 0) {
            $("#site-search-results").slideDown(300, "easeInSine");
            doSearchDebounced(query);
        } else {
            $("#site-search-results").slideUp(400, "easeOutSine");
        }
    });
    $searchInputs.on("focus", function () {
        if ($(this).val().length > 0) {
            $("#site-search-results").slideDown(300, "easeInSine");
        }
    });
});
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

$((function () {
  "use strict";
  $("[data-toggle='popover']").popover();
})());
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

$((function () {
    "use strict";
    $("[data-toggle=\"tooltip\"]").tooltip({
        delay: { "show": 750, "hide": 100 }
    });
    $("#dropdownMenu").tooltip({
        delay: { "show": 750, "hide": 100 }
    });
})());
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

$(function () {
    "use strict";
    function update() {
        $(".timesince").each(function () {
            var $el = $(this);
            var ts = $el.data("ts");
            if (!ts) {
                return;
            }
            var time = moment(ts);
            if (!time.isValid()) {
                return;
            }
            $el.text(time.fromNow());
        });
    }
    update();
    setInterval(update, 60000);
});
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

window.Messages = (function Messages(document) {
    var queue = [];
    var container = null;
    function createContainer() {
        if (!container) {
            container = document.createElement("div");
            container.id = "message-container";
            document.body.appendChild(container);
            document.addEventListener("click", hideOnClickOut, false);
        }
    }
    function show() {
        if (container) {
            container.classList.remove("clear");
            container.classList.add("visible");
        }
    }
    function hide() {
        if (container) {
            container.classList.remove("visible");
            container.classList.add("clear");
            setTimeout(clear, 2000);
        }
    }
    function clear() {
        container.classList.remove("clear");
        while (container && container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
    function hideOnClickOut(event) {
        var node = event.target;
        while (node) {
            if (node.id === "message-container") {
                return;
            }
            node = node.parentNode;
        }
        hide();
    }
    function renderMessage(message) {
        var messageDiv = document.createElement("div");
        var tags = message.tags || [];
        if (_.isString(tags)) {
            tags = tags.split(" ");
        }
        messageDiv.className = "message " + tags.join(" ");
        var textSpan = document.createElement("span");
        var textNode = document.createTextNode(message.text || "no text");
        textSpan.appendChild(textNode);
        messageDiv.appendChild(textSpan);
        return messageDiv;
    }
    function flush() {
        if (!queue.length) {
            return;
        }
        if (!document.body) {
            // Try again soon
            return setTimeout(flush, 50);
        }
        createContainer();
        while (queue.length > 0) {
            container.appendChild(renderMessage(queue.shift()));
        }
        _.defer(show);
    }
    var deferredFlush = _.debounce(flush, 50);
    function enqueue(message) {
        queue.push(message);
        deferredFlush();
    }

    return {
        enqueue: enqueue,
        hide: hide
    };
})(window.document);
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Support for media browsing widgets.
 * Currently opens a real, actual, true-to-1998
 * popup window (just like the Django admin, mind)
 * but could just as well use an <iframe> modal.
 */

"use strict";

window.BrowseAPI = (function () {
    var browseData = {};

    window.addEventListener("message", function (event) {
        var data = event.data;
        if (!data.pick) {
            return;
        }
        var info = browseData[data.pick.id];
        if (!info) {
            return;
        }
        info.popup.close();
        var obj = data.pick.object;
        if (!obj) {
            return;
        }
        if (_.isFunction(info.onSelect)) {
            info.onSelect.call(this, obj);
        }
        delete browseData[data.pick.id];
    }, false);

    /**
     * Open a browsing window with the given options.
     *
     * Currently supported options are:
     * * `kind`: kind string (e.g. "product")
     * * `filter`: filter string (kind-dependent)
     * * `onSelect`: a function invoked when an object is selected
     * @return {Object}
     */
    function openBrowseWindow(options) {
        var filter = options.filter;
        var disabledMenus = options.disabledMenus;
        var kind = options.kind;
        var browserUrl = window.ShuupAdminConfig.browserUrls[kind];
        if (!browserUrl) {
            throw new Error(gettext("No browser URL for kind:") + " " + kind);
        }
        if (typeof filter !== "string") {
            filter = JSON.stringify(filter);
        }
        var id = "m-" + +new Date();
        var qs = _.compact(["popup=1", "kind=" + kind, "pick=" + id, filter ? "filter=" + filter : null, disabledMenus ? "disabledMenus=" + disabledMenus.join(",") : null]).join("&");
        var popup = window.open(browserUrl + (browserUrl.indexOf("?") > -1 ? "&" : "?") + qs, "browser_popup_" + id, "resizable,menubar=no,location=no,scrollbars=yes");
        return browseData[id] = _.extend({ popup: popup, $container: null, onSelect: null }, options);
    }

    return {
        openBrowseWindow: openBrowseWindow
    };
})();

$(function () {
    $(document).on("click", ".browse-widget .browse-btn", function () {
        var $container = $(this).closest(".browse-widget");
        if (!$container.length) {
            return;
        }
        var kind = $container.data("browse-kind");
        var filter = $container.data("filter");
        try {
            return window.BrowseAPI.openBrowseWindow({ kind: kind, filter: filter, onSelect: function onSelect(obj) {
                    $container.find("input").val(obj.id);
                    var $text = $container.find(".browse-text");
                    $text.text(obj.text);
                    $text.prop("href", obj.url || "#");
                } });
        } catch (e) {
            alert(e);
            return false;
        }
    });

    $(document).on("click", ".browse-widget .clear-btn", function () {
        var $container = $(this).closest(".browse-widget");
        if (!$container.length) {
            return;
        }
        var emptyText = $container.data("empty-text") || "";
        $container.find("input").val("");
        var $text = $container.find(".browse-text");
        $text.text(emptyText);
        $text.prop("href", "#");
    });

    $(document).on("click", ".browse-widget .browse-text", function (event) {
        var href = $(this).prop("href");
        if (/#$/.test(href)) {
            // Looks empty, so prevent clicks
            event.preventDefault();
            return false;
        }
    });
});
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

$(function () {
    "use strict";
    /**
     * Return a Mithril module to create a navigator for the given navigatee form (jQuery object)
     */
    function getSectionNavigatorModule($navigateeForm) {
        var $sections = $navigateeForm.find(".content-block");

        var navigationListItems = _.compact(_.map($sections, function (section) {
            var $section = $(section);
            var $blockTitle = $section.find(".block-title");
            var titleText = $blockTitle.text();
            if (!titleText) {
                return;
            }
            if (!section.id) {
                section.id = _.kebabCase(titleText) + "-section";
            }

            return {
                el: section,
                id: section.id,
                title: titleText,
                iconClass: $blockTitle.find(".fa").attr("class"),
                errorClass: $section.find(".has-error").length ? "normal" : null
            };
        }));

        if (!navigationListItems.length) {
            return null;
        }

        return {
            view: function view(ctrl) {
                var currentId = ctrl.currentItemId();
                return m("div.sidebar-list", ctrl.navigationListItems().map(function (item) {
                    var classes = (item.id === currentId ? ".active" : "") + (item.errorClass ? ".errors" : "");
                    return m("a.sidebar-list-item" + classes, {
                        key: item.id,
                        href: "#" + item.id,
                        onclick: function onclick() {
                            ctrl.showSection(item);
                            return false;
                        }
                    }, [item.iconClass ? m("i", { className: item.iconClass }) : null, item.title, item.errorClass ? m("div.error-indicator." + item.errorClass, m("i.fa.fa-exclamation-circle")) : null]);
                }));
            },
            controller: function controller() {
                var ctrl = this;
                ctrl.showSection = function (section) {
                    $sections.hide();
                    if (section.errorClass) {
                        section.errorClass = "dismissed";
                    }
                    var $visibleSection = $("#" + section.id);
                    $visibleSection.show();
                    ctrl.currentItemId(section.id);
                };
                ctrl.currentItemId = m.prop(null);
                ctrl.navigationListItems = m.prop(navigationListItems);
                ctrl.showSection(navigationListItems[0]);
            }
        };
    }
    function activateSectionNavigation($sectionNavigation) {
        if (!$sectionNavigation.length) {
            return;
        }
        var navigateeId = $sectionNavigation.data("navigatee");
        var $navigateeForm = $("#" + navigateeId);
        if (!$navigateeForm.length) {
            return;
        }
        m.mount($sectionNavigation[0], getSectionNavigatorModule($navigateeForm));
    }
    $(".section-navigation, #section-navigation").each(function () {
        activateSectionNavigation($(this));
    });

    if (location.hash) {
        var $section = $("a[href='" + location.hash + "']");
        if ($section.length) {
            $section.trigger("click");
        } else {
            location.hash = "";
        }
    }
});
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

$(function () {
    var $contentBlocks = $(".content-block");
    var $contentWraps = $contentBlocks.find(".content-wrap");

    $(".toggle-contents").click(function (event) {
        var $collapseElement = $(this).closest(".content-block").find(".content-wrap");
        event.preventDefault();

        // Checks if the bootstrap collapse animation is not ongoing
        if (!$collapseElement.hasClass("collapsing")) {
            $collapseElement.collapse("toggle");
            $(this).closest(".title").toggleClass("open");
        }
    });
    $contentBlocks.each(function () {
        if ($(this).find(".has-error").length) {
            $(this).find(".block-title").addClass("mobile-error-indicator");
        }
    });

    // Activate first sidebar-list-item with errors
    $("a.sidebar-list-item.errors").first().trigger("click");

    // clear inline height: 0 on resize since we want blocks to be expanded on medium screens
    // this circumvents the need for !important in our css
    $(window).resize(_.debounce(function () {
        $contentWraps.css("height", "");
        $("#main-content").css("margin-top", $(".support-nav-wrap").height() + 15);
    }, 100));

    $(window).ready(function () {
        $("#main-content").css("margin-top", $(".support-nav-wrap").height() + 15);
    });
});
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

window.setNextActionAndSubmit = function (formId, nextAction) {
    var $form = $("#" + formId);
    if (!$form.length) {
        return;
    }
    var $nextAction = $form.find("input[name=__next]");
    if (!$nextAction.length) {
        $nextAction = $("<input>", {
            type: "hidden",
            name: "__next"
        });
        $form.append($nextAction);
    }
    $nextAction.val(nextAction);
    $form.submit();
};

function serializeForm($form) {
    var arrayData = $form.serializeArray();
    var objectData = {};
    for (var i = 0; i < arrayData.length; i++) {
        var obj = arrayData[i];
        var value;
        if (obj.value !== null) {
            value = obj.value;
        } else {
            value = "";
        }

        if (typeof objectData[obj.name] !== "undefined") {
            if (!$.isArray(objectData[obj.name])) {
                objectData[obj.name] = [objectData[obj.name]];
            }
            objectData[obj.name].push(value);
        } else {
            objectData[obj.name] = value;
        }
    }
    return objectData;
}

function renderFormErrors($form, errors) {
    for (var formName in errors) {
        var formErrors = errors[formName];
        for (var fieldName in formErrors) {
            var fieldErrors = formErrors[fieldName].join(" ");
            if (fieldName === "__all__") {
                $form.parent().find(".errors").append('<div class="alert alert-danger">' + fieldErrors + '</div>');
            } else {
                var $field = $form.find(":input[name='" + formName + "-" + fieldName + "']").parent(".form-group");
                $field.append("<span class='help-block error-block'>" + fieldErrors + "</span>").addClass("has-error");
            }
        }
    }
}

function clearErrors($form) {
    $form.find(".has-error").removeClass("has-error");
    $form.find(".error-block").remove();
    $form.parent().find(".errors").empty();
}

$((function () {
    $(".language-dependent-content").each(function () {
        var $ctr = $(this);
        var firstTabWithErrorsOpened = false;
        $ctr.find(".nav-tabs li").each(function () {
            var $tab = $(this);
            var lang = $tab.data("lang");
            if (!lang) {
                return;
            }
            var $tabPane = $ctr.find(".tab-pane[data-lang=" + lang + "]");
            if (!$tabPane) {
                return;
            }
            var tabHasErrors = $tabPane.find(".has-error").length > 0;
            if (tabHasErrors) {
                var $tabLink = $tab.find("a");
                $tabLink.append($(" <div class=error-indicator><i class=\"fa fa-exclamation-circle\"></i></div>"));
                if (!firstTabWithErrorsOpened) {
                    $tabLink.tab("show");
                    firstTabWithErrorsOpened = true;
                }
            }
        });
    });
})());
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

(function ($) {
    "use strict";

    var allowedButtons = "input[type=\"submit\"], input[type=\"image\"], button:not([type]), button[type=\"submit\"]";
    var formAttributes = ["action", "method", "enctype", "target", "novalidate"];

    $.fn.formSubmissionAttributes = function () {
        //based on https://github.com/mattberkowitz/Form-Submission-Attributes-Polyfill

        this.each(function () {
            var $form = $(this);
            var $inputs = $form.find(allowedButtons);
            var formId = $form.attr("id");

            if (formId) {
                // find buttons that are tied to this form and add them to $inputs
                var buttons = $("input[form=\"" + formId + "\"],button[form=\"" + formId + "\"]");
                buttons = buttons.filter(allowedButtons);
                $inputs = $inputs.add(buttons);
            }

            //backup originals
            $.each(formAttributes, function (idx, attr) {
                $form.data("o" + attr, $form.attr(attr));
            });

            $inputs.on("click", function () {
                var $this = $(this);
                $.each(formAttributes, function (idx, attr) {
                    var value = $this.is("[form" + attr + "]") ? $this.attr("form" + attr) : $form.data("o" + attr);
                    $form.attr(attr, value);
                });
            });
        });
    };

    if (window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        $(document).on("click", "[type=submit][form]", function (event) {
            event.preventDefault();
            var formId = $(this).attr("form");
            var $f = $("#" + formId);
            $f.formSubmissionAttributes();
            $f.submit();
        });
    }
})(jQuery);
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

$(function () {
    $(".form-control.datetime").datetimepicker({
        format: "yyyy-mm-dd hh:ii",
        autoclose: true,
        todayBtn: true,
        todayHighlight: true,
        fontAwesome: true
    });
    $(".form-control.date").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayBtn: true,
        todayHighlight: true,
        fontAwesome: true,
        minView: 2
    });
});
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

function changeLanguage() {
    var form = document.createElement("form");
    form.method = "POST";
    form.action = window.ShuupAdminConfig.browserUrls.setLanguage;
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = "language";
    input.id = "language-field";
    input.value = $(this).data("value");
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}

$(function () {
    "use strict";
    $(".languages li a").click(changeLanguage);
});
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

function activateSelect($select, model) {
    var attrs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    if (model === undefined) {
        return $select.select2($.extend(true, {
            language: "xx"
        }, attrs));
    }
    return $select.select2($.extend(true, {
        language: "xx",
        minimumInputLength: 3,
        ajax: {
            url: "/sa/select",
            dataType: "json",
            data: function data(params) {
                return { model: model, search: params.term };
            },
            processResults: function processResults(data) {
                return {
                    results: $.map(data.results, function (item) {
                        return { text: item.name, id: item.id };
                    })
                };
            }
        }
    }, attrs));
}

function activateSelects() {
    $("select").each(function (idx, object) {
        var select = $(object);
        // only activate selects that aren't already select2 inputs
        if (!select.hasClass("select2-hidden-accessible") && !select.hasClass("no-select2")) {
            var model = select.data("model");
            activateSelect(select, model);
        }
    });
}

$(function () {
    // Handle localization with Django instead of using select2 localization files
    $.fn.select2.amd.define("select2/i18n/xx", [], function () {
        return {
            errorLoading: function errorLoading() {
                return gettext("The results could not be loaded");
            },
            inputTooLong: function inputTooLong(args) {
                var overChars = args.input.length - args.maximum;
                var message = ngettext("Please delete %s character", "Please delete %s characters", overChars);
                return interpolate(message, [overChars]);
            },
            inputTooShort: function inputTooShort(args) {
                var remainingChars = args.minimum - args.input.length;
                return interpolate(gettext("Please enter %s or more characters"), [remainingChars]);
            },
            loadingMore: function loadingMore() {
                return gettext("Loading more results...");
            },
            maximumSelected: function maximumSelected(args) {
                var message = ngettext("You can only select %s item", "You can only select %s items", args.maximum);
                return interpolate(message, [args.maximum]);
            },
            noResults: function noResults() {
                return gettext("No results found");
            },
            searching: function searching() {
                return gettext("Searching...");
            }
        };
    });

    activateSelects();
});
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

(function ($) {
    function getAppChromeSteps(key) {
        if (key !== "home" && typeof key !== "undefined") {
            return [];
        }
        if ($("#main-menu").position().left !== 0) {
            // don't show chrome tour on mobile
            return [];
        }
        var steps = [];
        steps = steps.concat([{
            title: gettext("Quick Links"),
            text: [gettext("Quick Links to your most used features.")],
            attachTo: "li a[data-target-id='quicklinks'] right"
        }, {
            title: gettext("Orders"),
            text: [gettext("Track and filter your customers’ orders here.")],
            attachTo: "li a[data-target-id='category-1'] right"
        }, {
            title: gettext("Products"),
            text: [gettext("All your exciting products and features are located here.")],
            attachTo: "li a[data-target-id='category-2'] right"
        }, {
            title: gettext("Contacts"),
            text: [gettext("All your customer data is located here. Target and organize your clients details your way!")],
            attachTo: "li a[data-target-id='category-3'] right"
        }]);

        if ($("li a[data-target-id='category-5']").length > 0) {
            steps.push({
                title: gettext("Campaigns"),
                text: [gettext("Great loyalty tool for creating marketing, campaigns, special offers and coupons to entice your shoppers!"), gettext("Set offers based on their previous purchase behavior to up- and cross sale your inventory.")],
                attachTo: "li a[data-target-id='category-5'] right"
            });
        }

        if ($("li a[data-target-id='category-9']").length > 0) {
            steps.push({
                title: gettext("Content"),
                text: [gettext("The make-over tool to customize you site themes, add pages and product carousels. Incorporate any media to make your store pop!")],
                attachTo: "li a[data-target-id='category-9'] right"
            });
        }

        if ($("li a[data-target-id='category-4']").length > 0) {
            steps.push({
                title: gettext("Reports"),
                text: [gettext("Your reporting tool to build and analyze your consumer behavior information that can assist with your business decisions.")],
                attachTo: "li a[data-target-id='category-4'] right"
            });
        }

        steps.push({
            title: gettext("Shops"),
            text: [gettext("Place for your Shop specific settings. You can customize taxes, currencies, customer groups, and many other things in this menu.")],
            attachTo: "li a[data-target-id='category-6'] right"
        });

        if ($("li a[data-target-id='category-7']").length > 0) {
            steps.push({
                title: gettext("Addons"),
                text: [gettext("This is your connection interface. Addons and other systems you use can be attached to your store through powerful data connections."), gettext("Supercharge your site and gather crazy amounts of data with integrations to CRMs and ERPs, POS’s and PIM’s, or any other acronym you can think of.")],
                attachTo: "li a[data-target-id='category-7'] right"
            });
        }

        steps = steps.concat([{
            title: gettext("Settings"),
            text: [gettext("The nuts and bolts of your store are found here. From individual country tax-regulations to your contact details.")],
            attachTo: "li a[data-target-id='category-8'] right"
        }, {
            title: gettext("Search"),
            text: [gettext("Lost and cannot find your way? No worries, you can search contacts, settings, add-ons and more features from here.")],
            attachTo: "#site-search bottom"
        }, {
            title: gettext("View your storefront"),
            text: [gettext("Preview your shop and all the cool features you have created!")],
            attachTo: ".shop-btn.visit-store left"
        }, {
            title: gettext("We're done!"),
            text: [gettext("It was nice to show you around!"), gettext("If you need to run it again, fire it up from the menu in the top right.")]
        }]);
        return steps;
    }

    $(document).ready(function () {
        $("#top-header .show-tour-li").on("click", "a", function (e) {
            e.preventDefault();
            $.tour();
        });
    });

    $.tour = function (config, params) {
        if (config === undefined) config = {};

        if (config === "setPageSteps") {
            this.pageSteps = params;
            return;
        }
        var tour = new Shepherd.Tour({
            defaults: {
                classes: "shepherd-theme-arrows",
                scrollTo: true,
                showCancelLink: true
            }
        });

        var steps = [];
        if (this.pageSteps && this.pageSteps.length > 1) {
            steps = this.pageSteps;
        } else {
            steps = (this.pageSteps || []).concat(getAppChromeSteps(config.tourKey));
        }

        $.each(steps, function (idx, step) {
            var buttonType = null;
            if (idx === 0) {
                buttonType = "first";
            }
            if (idx === steps.length - 1) {
                buttonType = "last";
            }
            step = $.extend({}, step, { buttons: getTourButtons(buttonType) });
            var content = "";
            if (step.icon) {
                content += "<div class='clearfix'>";
                content += "<div class='pull-left'>";
                content += "<div class='icon'>";
                content += "<img src='" + step.icon + "' />";
                content += "</div>";
                content += "</div>";
                content += "<div class='step-with-icon'>";
                content += getTextLines(step.text);
                content += getHelpButton(step.helpPage);
                content += "</div>";
                content += "</div>";
            } else if (step.banner) {
                content += "<div>";
                content += "<div class='banner'>";
                content += "<img src='" + step.banner + "' />";
                content += "</div>";
                content += "<div class='step-with-banner'>";
                content += getTextLines(step.text);
                content += getHelpButton(step.helpPage);
                content += "</div>";
                content += "</div>";
            } else {
                content += getTextLines(step.text);
                content += getHelpButton(step.helpPage);
            }
            step.text = content;
            tour.addStep("step-" + idx, step);
        });

        function getTextLines(text) {
            var content = "";
            for (var i = 0; i < text.length; i++) {
                content += "<p class='lead'>" + text[i] + "</p>";
            }
            return content;
        }

        function getHelpButton(page) {
            var content = "";
            if (page) {
                var helpUrl = "http://shuup-guide.readthedocs.io/en/latest/" + page;
                content += "<br>";
                content += "<p class='text-center'>";
                content += "<a href='" + helpUrl + "' class='btn btn-inverse btn-default', target='_blank'>";
                content += "<i class='fa fa-info-circle'></i> " + gettext("Learn more at the Shuup Help Center");
                content += "</a>";
                content += "</p>";
            }
            return content;
        }
        function getTourButtons(type) {
            var buttons = [];
            if (type !== "first" && type !== "last") {
                buttons.push({
                    text: "Previous",
                    classes: "btn shepherd-button-secondary",
                    action: tour.back
                });
            }

            if (type == "last") {
                buttons.push({
                    text: "OK",
                    classes: "btn btn-primary",
                    action: tour.cancel
                });
            } else {
                buttons.push({
                    text: "Next",
                    classes: "btn btn-primary",
                    action: tour.next
                });
            }

            return buttons;
        }

        if (config.tourKey) {
            tour.on("cancel", function () {
                $.post("/sa/tour/", { "csrfmiddlewaretoken": window.ShuupAdminConfig.csrf, "tourKey": config.tourKey });
            });
        }
        tour.start();
        return tour;
    };
})(jQuery);
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

(function () {
    $(".lightbox").imageLightbox({
        "button": true,
        "overlay": true
    });
})();
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

window.targetElement = null;
window.sourceElement = null;

function updateOrdering(e) {
    var items = "";
    window.targetElement.find("input[type=checkbox]").each(function (idx, elem) {
        items += $(elem).attr("name") + "|";
    });
    $("#ordering").text(items);
}

function removeFromActive(e) {
    e.preventDefault();

    var label = $(this).data("label");
    var name = $(this).data("name");

    var $source = $("#target-placeholder li");
    var html = $source.html().replace(/NAME/g, name).replace(/LABEL/g, label);
    window.sourceElement.append($("<li>").html(html));
    $(this).closest("li").remove();
    updateOrdering();
}

function addToActive(e) {
    e.preventDefault();

    var label = $(this).data("label");
    var name = $(this).data("name");

    var $source = $("#source-placeholder li");
    var html = $source.html().replace(/NAME/g, name).replace(/LABEL/g, label);
    window.targetElement.append($("<li>").html(html));
    $(this).closest("li").remove();
    updateOrdering();
}

window.activateSortable = function (targetElement, sourceElement) {
    var $target = $("#" + targetElement);
    var $source = $("#" + sourceElement);
    window.targetElement = $target;
    window.sourceElement = $source;

    var el = document.getElementById(targetElement);
    var sortable = Sortable.create(el, {
        handle: ".sorting-handle",
        onEnd: function onEnd( /**Event*/evt) {
            updateOrdering();
        }
    });
    updateOrdering();
    $(document).on("click", ".btn-remove-sortable", removeFromActive);
    $(document).on("click", ".btn-add-sortable", addToActive);
};
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

(function () {
    // https://gist.github.com/mathewbyrne/1280286
    function slugify(text) {
        return text.toString().toLowerCase().replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
    }

    function autoSlugify() {
        var val = $(this).val();
        $(this).parent().next().find(".slugfield").val(slugify(val));
    }
    $(document).on("keyup", ".autoupdate-slug", autoSlugify);
})();
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

function activateDropzone($dropzone) {
    var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var selector = "#" + $dropzone.attr("id");
    var uploadPath = $(selector).data().upload_path;
    var addRemoveLinks = $(selector).data().add_remove_links;
    var params = $.extend(true, {
        url: "/sa/media/?action=upload&path=" + uploadPath,
        params: {
            csrfmiddlewaretoken: window.ShuupAdminConfig.csrf
        },
        addRemoveLinks: addRemoveLinks == "True",
        dictRemoveFile: gettext("Clear"),
        autoProcessQueue: true,
        uploadMultiple: false,
        parallelUploads: 1,
        maxFiles: 1,
        dictDefaultMessage: gettext("Drop files here or click to browse."),
        clickable: false,
        accept: function accept(file, done) {
            if ($(selector).data().kind === "images" && file.type.indexOf("image") < 0) {
                done(gettext("only images can be uploaded!"));
            } else {
                done();
            }
        }
    }, attrs);
    var dropzone = new Dropzone(selector, params);

    dropzone.on("addedfile", attrs.onAddedFile || function (file) {
        if (params.maxFiles === 1 && dropzone.files.length > 1) {
            dropzone.removeFile(dropzone.files[0]);
        }
    });

    dropzone.on("removedfile", attrs.onSuccess || function (data) {
        $(selector).find("input").val("");
    });

    dropzone.on("success", attrs.onSuccess || function (data) {
        // file selected through dnd
        if (data.xhr) {
            data = JSON.parse(data.xhr.responseText).file;
        }
        $(selector).find("input").val(data.id);
    });

    dropzone.on("queuecomplete", attrs.onQueueComplete || $.noop);

    $(selector).on("click", function (e) {
        window.BrowseAPI.openBrowseWindow({
            kind: "media",
            disabledMenus: ["delete", "rename"],
            filter: $(selector).data().kind,
            onSelect: function onSelect(obj) {
                obj.name = obj.text;
                $(selector).find("input").val(obj.id);
                $(selector).find(".dz-preview").remove();
                dropzone.emit("addedfile", obj);
                if (obj.thumbnail) {
                    dropzone.emit("thumbnail", obj, obj.thumbnail);
                }
                dropzone.emit("success", obj);
                dropzone.emit("complete", obj);
            }
        });
    });

    var data = $(selector).data();
    if (data.url) {
        dropzone.files.push(data);
        dropzone.emit("addedfile", data);
        if (data.thumbnail) {
            dropzone.emit("thumbnail", data, data.thumbnail);
        }
        dropzone.emit("complete", data);
    }
}

function activateDropzones() {
    $("div[data-dropzone='true']").each(function (idx, object) {
        var dropzone = $(object);
        if (!dropzone.attr("id").includes("__prefix__") && dropzone.find(".dz-message").length === 0) {
            activateDropzone(dropzone);
        }
    });
}

$(function () {
    Dropzone.autoDiscover = false;
    activateDropzones();
});
/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";

window.addToSelect2 = function addToSelect2(target, value, name) {
    var newOption = new Option(name, value, true, true);
    $("select[name='" + target + "']").append(newOption).trigger('change');

    // Product update or create
    if (target.includes("primary_category")) {
        var categories = $("select[name*='categories']");
        if (categories.length > 0) {
            var _newOption = new Option(name, value, true, true);
            categories.append(_newOption).trigger('change');
        }
    }

    window.closeQuickAddIFrame();
};

window.closeQuickAddIFrame = function closeQuickAddIFrame(e) {
    if (e !== undefined) {
        e.preventDefault();
    }
    $("#create-object-overlay").remove();
};

$(function () {
    $('.quick-add-btn a.btn').on("click", function (e) {
        e.preventDefault();
        window.closeQuickAddIFrame();
        var url = $(this).data("url");
        var overlay = document.createElement("div");
        overlay.id = "create-object-overlay";

        var contentPane = document.createElement('div');
        contentPane.id = "create-object-content-pane";
        contentPane.className = "content-pane";
        overlay.appendChild(contentPane);

        var closeIcon = document.createElement("i");
        closeIcon.className = "fa fa-times-circle-o fa-3x text-danger";
        var closeButton = document.createElement("a");
        closeButton.className = "close-btn";
        closeButton.href = "#";
        closeButton.onclick = window.closeQuickAddIFrame;
        closeButton.appendChild(closeIcon);
        contentPane.appendChild(closeButton);

        var iframe = document.createElement('iframe');
        iframe.frameBorder = 0;
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.id = "create-object-iframe";

        iframe.onload = function () {
            $("#create-object-content-pane").addClass("open");
        };

        iframe.setAttribute("src", url);
        contentPane.appendChild(iframe);
        $(document.body).append(overlay);
    });
});

/**
 * This file is part of Shuup.
 *
 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
 *
 * This source code is licensed under the OSL-3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

function activateEditor($editor) {
    var attrs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return $editor.summernote($.extend(true, {
        height: 200,
        callbacks: {
            onBlur: function onBlur() {
                $editor.parent().find("textarea.hidden").val($(this).summernote('code'));
            }
        }
    }, attrs));
}

function activateEditors() {
    $(".summernote-editor").each(function (idx, object) {
        var $editor = $(object);
        if ($editor.parent().find(".note-editor").length === 0) {
            activateEditor($editor);
        }
    });
}

$(function () {
    activateEditors();
});
//# sourceMappingURL=base.js.map
