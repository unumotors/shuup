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
    $(".product-media-delete").on("click", function (e) {
        e.preventDefault();
        if (confirm(gettext("Are you sure you want to delete this media?"))) {
            $(this).parents(".panel").fadeOut();
            $(this).next(".hide").find("input").prop("checked", true);
        }
    });

    $(document).on("click", ".set-as-primary", function (e) {
        e.preventDefault();
        var $panel = $(this).parents(".panel");
        var prefix = $panel.data("prefix");

        var _prefix$split = prefix.split("-");

        var _prefix$split2 = _slicedToArray(_prefix$split, 2);

        var current = _prefix$split2[1];

        var $imagePanels = $("#product-images-section .panel");

        $imagePanels.removeClass("panel-selected").addClass("panel-default");

        $(".is-primary-image").replaceWith(function () {
            return $("<a>", { "class": "set-as-primary", "href": "#" }).text(gettext("Set as primary image"));
        });

        $imagePanels.each(function (i) {
            $("#id_images-" + i + "-is_primary").prop("checked", false);
        });

        $(this).replaceWith(function () {
            return $("<span>", { "class": "is-primary-image" }).text(gettext("Primary image"));
        });

        $panel.addClass("panel-selected");
        $("#id_images-" + current + "-is_primary").prop("checked", true);
    });

    function addMediaPanel($section, file) {
        var section = $section.attr("id");
        var panelCount = $("#" + section + " .panel").length;
        var $source = $("#" + section + "-placeholder-panel");
        var $html = $($source.html().replace(/__prefix__/g, panelCount - 1).replace(/__prefix_name__/g, panelCount));
        var targetId = "id_images";
        if (section.indexOf("media") > 0) {
            targetId = "id_media";
        }
        if (file) {
            var $contents = $("<a href='" + file.url + "' target='_blank'></a>");
            if (targetId === "id_images") {
                $contents.append("<img src='" + file.url + "'>");
                $html.find(".thumbnail").append($contents);
            } else {
                $contents.append("<br><p>" + file.name + "</p>");
                $html.find(".thumbnail").append($contents);
            }
            $html.find(".file-control").find("input").val(file.id);
        }
        $html.insertBefore($source);
    }

    function onDropzoneQueueComplete(dropzone, kind) {
        if (location.pathname.indexOf("new") > 0) {
            // save product media the traditional way via the save button when creating a new product
            return;
        }
        var productId = $("#product-" + kind + "-section-dropzone").data().product_id;
        var $fileInputs = $("#product-" + kind + "-section").find(".file-control input");
        var fileIds = [];

        for (var i = 0; i < $fileInputs.length; i++) {
            var fileId = parseInt($($fileInputs[i]).val());
            if (!isNaN(fileId)) {
                fileIds.push(parseInt($($fileInputs[i]).val()));
            }
        }
        $.ajax({
            url: "/sa/products/" + productId + "/media/add/",
            method: "POST",
            data: {
                csrfmiddlewaretoken: ShuupAdminConfig.csrf,
                product_id: productId,
                file_ids: fileIds,
                kind: kind
            },
            traditional: true,
            success: function success(data) {
                window.Messages.enqueue({ tags: "success", text: data.message });
            },
            error: function error(data) {
                alert("ERROR");
            }
        });
    }

    function onDropzoneSuccess($section, file) {
        // file selected through dnd
        if (file.xhr) {
            file = JSON.parse(file.xhr.responseText).file;
        }
        addMediaPanel($section, file);
    }

    activateDropzone($("#product-images-section-dropzone"), {
        url: "/sa/media/?action=upload&path=/products/images",
        maxFiles: 10,
        onSuccess: function onSuccess(file) {
            onDropzoneSuccess($("#product-images-section"), file);
        },
        onQueueComplete: function onQueueComplete() {
            onDropzoneQueueComplete(this, "images");
        }
    });

    activateDropzone($("#product-media-section-dropzone"), {
        url: "/sa/media/?action=upload&path=/products/media",
        maxFiles: 10,
        onSuccess: function onSuccess(file) {
            onDropzoneSuccess($("#product-media-section"), file);
        },
        onQueueComplete: function onQueueComplete() {
            onDropzoneQueueComplete(this, "media");
        }
    });
});
//# sourceMappingURL=product.js.map
