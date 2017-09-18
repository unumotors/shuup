var MediaBrowser =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	"use strict";

	exports.__esModule = true;
	exports.init = init;
	exports.openFolderContextMenu = openFolderContextMenu;
	exports.setupUploadButton = setupUploadButton;
	var _ = __webpack_require__(1);
	var m = __webpack_require__(2);
	var BrowserView = __webpack_require__(3);
	var dragDrop = __webpack_require__(5);
	var FileUpload = __webpack_require__(6);
	var menuManager = __webpack_require__(23);
	var folderContextMenu = __webpack_require__(30);

	var controller = null;

	function init() {
	    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    if (controller !== null) {
	        return;
	    }
	    controller = m.mount(document.getElementById("BrowserView"), {
	        view: BrowserView.view,
	        controller: _.partial(BrowserView.controller, config)
	    });
	    controller.navigateByHash();
	    controller.reloadFolderTree();

	    dragDrop.disableIntraPageDragDrop();
	}

	function openFolderContextMenu(event) {
	    var button = event.target;
	    menuManager.open(button, folderContextMenu(controller));
	}

	function setupUploadButton(element) {
	    var input = document.createElement("input");
	    input.type = "file";
	    input.multiple = true;
	    input.style.display = "none";
	    input.addEventListener("change", function (event) {
	        FileUpload.enqueueMultiple(controller.getUploadUrl(), event.target.files);
	        FileUpload.addQueueCompletionCallback(function () {
	            controller.reloadFolderContentsSoon();
	        });
	        FileUpload.processQueue();
	    });
	    document.body.appendChild(input);
	    element.addEventListener("click", function (event) {
	        input.click();
	        event.preventDefault();
	    }, false);
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = window._;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = window.m;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	/* eslint-disable no-bitwise */

	"use strict";

	exports.__esModule = true;
	exports.view = view;
	exports.controller = controller;
	var m = __webpack_require__(2);
	var _ = __webpack_require__(1);

	var folderTree = __webpack_require__(4);
	var folderBreadcrumbs = __webpack_require__(11);
	var folderView = __webpack_require__(12);
	var findPathToFolder = __webpack_require__(29);
	var remote = __webpack_require__(7);

	function view(ctrl) {
	    return m("div.container-fluid", [m("div.row", [m("div.col-md-3.page-inner-navigation.folder-tree", folderTree(ctrl)), m("div.col-md-9.page-content", m("div.content-block", [m("div.title", folderBreadcrumbs(ctrl)), m("div.content", folderView(ctrl))]))])]);
	}

	function controller() {
	    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    var ctrl = this;
	    ctrl.currentFolderId = m.prop(null);
	    ctrl.currentFolderPath = m.prop([]);
	    ctrl.rootFolder = m.prop({});
	    ctrl.folderData = m.prop({});
	    ctrl.viewMode = m.prop("grid");
	    ctrl.sortMode = m.prop("+name");

	    ctrl.isMenuDisabled = function (action) {
	        return (config.disabledMenus || []).indexOf(action) >= 0;
	    };
	    ctrl.setFolder = function (newFolderId) {
	        newFolderId = 0 | newFolderId;
	        if (ctrl.currentFolderId() === newFolderId) {
	            return; // Nothing to do, don't cause trouble
	        }
	        ctrl.currentFolderId(0 | newFolderId);
	        ctrl._refreshCurrentFolderPath();
	        ctrl.reloadFolderContents();
	        location.hash = "#!id=" + newFolderId;
	    };
	    ctrl._refreshCurrentFolderPath = function () {
	        var currentFolderId = ctrl.currentFolderId();
	        if (currentFolderId === null) {
	            return; // Nothing loaded yet; defer to later
	        }
	        ctrl.currentFolderPath(findPathToFolder(ctrl.rootFolder(), currentFolderId));
	    };
	    ctrl.reloadFolderTree = function () {
	        remote.get({ "action": "folders" }).then(function (response) {
	            ctrl.rootFolder(response.rootFolder);
	            ctrl._refreshCurrentFolderPath();
	        });
	    };
	    ctrl.reloadFolderContents = function () {
	        var id = 0 | ctrl.currentFolderId();
	        remote.get({ "action": "folder", id: id, filter: config.filter }).then(function (response) {
	            remote.handleResponseMessages(response);
	            ctrl.folderData(response.folder || {});
	        });
	    };

	    ctrl.getUploadUrl = function (folderId) {
	        var uploadUrl = window.location.pathname;
	        folderId = folderId === undefined ? ctrl.currentFolderId() : folderId;
	        return uploadUrl + "?action=upload&folder_id=" + folderId;
	    };
	    ctrl.reloadFolderContentsSoon = _.debounce(ctrl.reloadFolderContents, 1000);

	    ctrl.navigateByHash = function () {
	        var currentIdMatch = /#!id=(\d+)/.exec(location.hash);
	        var newFolderId = currentIdMatch ? currentIdMatch[1] : 0;
	        ctrl.setFolder(newFolderId);
	    };

	    window.addEventListener("hashchange", function () {
	        ctrl.navigateByHash();
	    }, false);
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	var m = __webpack_require__(2);
	var _ = __webpack_require__(1);

	var _require = __webpack_require__(5);

	var dropzoneConfig = _require.dropzoneConfig;

	var folderActions = __webpack_require__(9);
	var folderClick = __webpack_require__(10);

	exports["default"] = function (ctrl) {
	    var currentFolderId = ctrl.currentFolderId();
	    var folderPath = ctrl.currentFolderPath();
	    var idsToCurrent = _.pluck(folderPath, "id");

	    function walk(folder) {
	        if (folder.id === undefined) {
	            return;
	        }
	        var inPath = idsToCurrent.indexOf(folder.id) > -1;
	        var isCurrent = currentFolderId === folder.id;
	        var nameLink = m("a", { href: "#", onclick: folderClick(ctrl, folder) }, [inPath ? m("i.caret-icon.fa.fa-caret-down") : m("i.caret-icon.fa.fa-caret-right"), isCurrent ? m("i.folder-icon.fa.fa-folder-open") : m("i.folder-icon.fa.fa-folder"), m("span.name", folder.name)]);
	        var childLis = inPath ? _.map(folder.children, walk) : [];
	        if (isCurrent) {
	            childLis.push(m("li.new-folder-item", { key: "new-folder" }, m("a", {
	                href: "#",
	                onclick: _.bind(folderActions.promptCreateFolder, null, ctrl, folder.id)
	            }, m("i.fa.fa-plus"), " " + gettext("New folder"))));
	        }
	        var className = _({
	            "current": isCurrent,
	            "in-path": inPath,
	            "has-children": folder.children.length > 0,
	            "fd-zone": true
	        }).pick(_.identity).keys().join(" ");
	        return m("li", {
	            "key": folder.id,
	            "className": className,
	            "data-folder-id": folder.id,
	            "config": dropzoneConfig(ctrl)
	        }, [nameLink, childLis && childLis.length ? m("ul", childLis) : null]);
	    }

	    return m("ul", walk(ctrl.rootFolder()));
	};

	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	exports.dropzoneConfig = dropzoneConfig;
	exports.disableIntraPageDragDrop = disableIntraPageDragDrop;
	var m = __webpack_require__(2);
	var FileUpload = __webpack_require__(6);
	var fileActions = __webpack_require__(8);

	var supportsDnD = window.File && window.FileList && window.FormData;

	exports.supportsDnD = supportsDnD;
	function ignoreEvent(e) {
	    e = e || event;
	    e.stopPropagation();
	    e.preventDefault();
	}

	function dropzoneConfig(ctrl) {
	    if (!ctrl) {
	        throw new Error("ctrl required");
	    }
	    return function (element, isInitialized) {
	        if (isInitialized) {
	            return;
	        }
	        element.addEventListener("dragover", function (e) {
	            var folderId = element.dataset.folderId;
	            if (!folderId) {
	                return;
	            }
	            ignoreEvent(e);
	            e.dataTransfer.dropEffect = "copy";
	            element.classList.add("over");
	            m.redraw.strategy("none");
	        }, false);
	        element.addEventListener("dragenter", function (e) {
	            ignoreEvent(e);
	            m.redraw.strategy("none");
	        }, false);
	        element.addEventListener("dragleave", function (e) {
	            ignoreEvent(e);
	            element.classList.remove("over");
	        }, false);
	        element.addEventListener("drop", function (e) {
	            var folderId = element.dataset.folderId;
	            ignoreEvent(e);
	            element.classList.remove("over");
	            var data = null;
	            try {
	                data = JSON.parse(e.dataTransfer.getData("text"));
	            } catch (exc) {
	                // not JSON, I guess
	            }
	            if (data !== null) {
	                if (data.fileId) {
	                    fileActions.moveFile(ctrl, data.fileId, folderId);
	                    return;
	                }
	            } else {
	                var files = e.dataTransfer.files;
	                if (files.length > 0) {
	                    FileUpload.enqueueMultiple(ctrl.getUploadUrl(folderId), files);
	                    FileUpload.addQueueCompletionCallback(function () {
	                        ctrl.reloadFolderContentsSoon();
	                    });
	                    FileUpload.processQueue();
	                    return;
	                }
	            }
	            alert("Sorry! You can only drop files here (from your computer or within the file manager).");
	        });
	    };
	}

	function disableIntraPageDragDrop() {
	    document.addEventListener("dragstart", ignoreEvent, false);
	    document.addEventListener("dragover", function (e) {
	        e.dataTransfer.dropEffect = "none";
	        ignoreEvent(e);
	    }, false);
	    document.addEventListener("drop", ignoreEvent, false);
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	"use strict";

	exports.__esModule = true;
	exports.enqueue = enqueue;
	exports.enqueueMultiple = enqueueMultiple;
	exports.addQueueCompletionCallback = addQueueCompletionCallback;
	exports.processQueue = processQueue;
	var m = __webpack_require__(2);
	var _ = __webpack_require__(1);
	var remote = __webpack_require__(7);

	var queue = [];
	var queueCompleteCallbacks = [];
	var queueStatusDiv = null;

	function queueView() {
	    var className = "empty";
	    if (queue.length >= 0) {
	        className = _.all(queue, function (file) {
	            return file.status === "done" || file.status === "error";
	        }) ? "done" : "busy";
	    }

	    return m("div.queue-view." + className, _.map(queue, function (file) {
	        return m("div.queue-file." + file.status, [m("div.qf-name", file.name), m("div.qf-progress", { style: "width: " + (file.progress || 0) + "%" })]);
	    }));
	}

	function updateQueueView() {
	    if (queueStatusDiv === null) {
	        if (queue.length === 0) {
	            return; // Don't bother setting up the div if we're not doing anything actually
	        }
	        queueStatusDiv = document.createElement("div");
	        queueStatusDiv.id = "queue-status-ctr";
	        document.body.appendChild(queueStatusDiv);

	        // Yes, we're throwing away the ctrl instance; we don't need it
	        // and eslint would kvetch about it otherwise :)
	        m.mount(queueStatusDiv, { view: queueView, controller: _.noop });
	    }
	    m.redraw(); // XXX: It would be nice if we could redraw only one Mithril view...
	}

	var updateQueueViewSoon = _.debounce(updateQueueView, 50);

	function handleFileXhrComplete(xhr, file, error) {
	    if (xhr.status >= 400) {
	        error = true;
	    }
	    if (error) {
	        file.status = "error";
	    } else {
	        file.status = "done";
	        file.progress = 100;
	    }
	    setTimeout(processQueue, 50); // Continue soon.
	    var messageText = null;
	    try {
	        var responseJson = JSON.parse(xhr.responseText);
	        if (responseJson && responseJson.message) {
	            messageText = responseJson.message;
	        }
	    } catch (e) {
	        // invalid JSON? pffff.
	        console.log(e); // eslint-disable-line
	    }
	    if (window.Messages) {
	        if (error && !messageText) {
	            messageText = gettext("Unexpected error while uploading files.");
	        }
	        var response = {
	            error: error ? gettext("Error:") + " " + file.name + ": " + messageText : null,
	            message: !error ? messageText || gettext("Uploaded:") + " " + file.name : null
	        };
	        remote.handleResponseMessages(response);
	    }
	}

	function beginUpload(file) {
	    if (file.status !== "new") {
	        // Already uploaded? Huh.
	        return false;
	    }
	    file.progress = 0;
	    file.status = "uploading";

	    var formData = new FormData();
	    formData.append("file", file.nativeFile);
	    var xhr = new XMLHttpRequest();
	    xhr.open("POST", file.url);
	    xhr.setRequestHeader("X-CSRFToken", window.ShuupAdminConfig.csrf);
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState !== 4) {
	            // Ready state 4:
	            // .. The data transfer has been completed or something went
	            // .. wrong during the transfer (e.g. infinite redirects).
	            // That's the only case we want to handle, so return otherwise.
	            return;
	        }
	        handleFileXhrComplete(xhr, file, false);
	        updateQueueViewSoon();
	    };
	    xhr.onerror = function () {
	        handleFileXhrComplete(xhr, file, true);
	        updateQueueViewSoon();
	    };
	    xhr.upload.onprogress = function (event) {
	        if (event.lengthComputable) {
	            file.progress = event.loaded / event.total;
	        } else {
	            file.progress = file.progress + (100 - file.progress) / 2;
	        }
	        updateQueueViewSoon();
	    };
	    xhr.send(formData);
	}

	function enqueue(uploadUrl, file) {
	    queue.push({
	        url: uploadUrl,
	        name: file.name,
	        nativeFile: file,
	        status: "new", // "new"/"uploading"/"error"/"done"
	        progress: 0
	    });
	}

	function enqueueMultiple(uploadUrl, files) {
	    _.each(files, function (file) {
	        enqueue(uploadUrl, file);
	    });
	}

	function addQueueCompletionCallback(callback) {
	    queueCompleteCallbacks.push(callback);
	}

	function processQueue() {
	    if (_.any(queue, function (file) {
	        return file.status === "uploading";
	    })) {
	        return; // Don't allow uploading multiple files simultaneously though...
	    }
	    var nextFile = _.detect(queue, function (file) {
	        return file.status === "new";
	    });
	    updateQueueViewSoon();
	    if (nextFile) {
	        beginUpload(nextFile);
	    } else {
	        while (queueCompleteCallbacks.length) {
	            var cb = queueCompleteCallbacks.shift();
	            cb();
	        }
	    }
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	exports.post = post;
	exports.get = get;
	exports.handleResponseMessages = handleResponseMessages;
	var m = __webpack_require__(2);

	function post(data) {
	    return m.request({
	        method: "POST",
	        url: location.pathname,
	        data: data,
	        config: function config(xhr) {
	            xhr.setRequestHeader("X-CSRFToken", window.ShuupAdminConfig.csrf);
	        }
	    });
	}

	function get(data) {
	    return m.request({
	        method: "GET",
	        url: location.pathname,
	        data: data
	    });
	}

	function handleResponseMessages(response) {
	    var Messages = window.Messages;
	    if (!Messages) {
	        // Messages module not available for whichever reason
	        return;
	    }
	    var message = response.message;
	    var error = response.error;
	    if (error) {
	        Messages.enqueue({ tags: "error", text: error });
	    }
	    if (message) {
	        Messages.enqueue({ tags: "info", text: message });
	    }
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	exports.promptRenameFile = promptRenameFile;
	exports.promptDeleteFile = promptDeleteFile;
	exports.moveFile = moveFile;
	var _ = __webpack_require__(1);
	var remote = __webpack_require__(7);

	function promptRenameFile(controller, file) {
	    var id = file.id;
	    var name = file.name;

	    var newName = _.trim(prompt(gettext("New file name?"), name) || "");
	    if (newName && name !== newName) {
	        remote.post({ action: "rename_file", id: id, name: newName }).then(function (response) {
	            remote.handleResponseMessages(response);
	            controller.reloadFolderContents();
	        });
	    }
	}

	function promptDeleteFile(controller, file) {
	    var id = file.id;
	    var name = file.name;

	    if (confirm(interpolate(gettext("Are you sure you want to delete the file %s?"), [name]))) {
	        remote.post({ action: "delete_file", id: id }).then(function (response) {
	            remote.handleResponseMessages(response);
	            controller.reloadFolderContents();
	        });
	    }
	}

	function moveFile(controller, fileId, newFolderId) {
	    remote.post({ action: "move_file", "file_id": fileId, "folder_id": newFolderId }).then(function (response) {
	        remote.handleResponseMessages(response);
	        controller.reloadFolderContents();
	    });
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	exports.promptCreateFolder = promptCreateFolder;
	exports.promptCreateFolderHere = promptCreateFolderHere;
	exports.promptRenameCurrentFolder = promptRenameCurrentFolder;
	exports.promptDeleteCurrentFolder = promptDeleteCurrentFolder;
	var _ = __webpack_require__(1);
	var remote = __webpack_require__(7);

	function promptCreateFolder(controller, parentFolderId) {
	    var name = prompt(gettext("New folder name?"));
	    if (!name) {
	        // Cancelled? :(
	        return;
	    }
	    remote.post({ action: "new_folder", parent: parentFolderId, name: name }).then(function (response) {
	        remote.handleResponseMessages(response);
	        var newCurrentFolder = 0 | response.folder.id; // eslint-disable-line no-bitwise
	        controller.setFolder(newCurrentFolder);
	        controller.reloadFolderTree();
	        controller.reloadFolderContents();
	    });
	}

	function promptCreateFolderHere(controller) {
	    return promptCreateFolder(controller, controller.currentFolderId());
	}

	function promptRenameCurrentFolder(controller) {
	    var _controller$folderData = controller.folderData();

	    var id = _controller$folderData.id;
	    var name = _controller$folderData.name;

	    var newName = _.trim(prompt(gettext("New folder name?"), name) || "");
	    if (newName && name !== newName) {
	        remote.post({ action: "rename_folder", id: id, name: newName }).then(function (response) {
	            remote.handleResponseMessages(response);
	            controller.reloadFolderTree();
	            controller.reloadFolderContents();
	        });
	    }
	}

	function promptDeleteCurrentFolder(controller) {
	    var _controller$folderData2 = controller.folderData();

	    var id = _controller$folderData2.id;
	    var name = _controller$folderData2.name;

	    if (confirm(interpolate(gettext("Are you sure you want to delete the %s folder?"), [name]))) {
	        remote.post({ action: "delete_folder", id: id }).then(function (response) {
	            remote.handleResponseMessages(response);
	            var newCurrentFolder = 0 | response.newFolderId; // eslint-disable-line no-bitwise
	            controller.setFolder(newCurrentFolder);
	            controller.reloadFolderTree();
	            controller.reloadFolderContents();
	        });
	    }
	}

/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;

	exports["default"] = function (ctrl, folder) {
	    return function clickFolder(event) {
	        ctrl.setFolder(folder.id);
	        event.preventDefault();
	        return false;
	    };
	};

	module.exports = exports["default"];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	var m = __webpack_require__(2);
	var _ = __webpack_require__(1);
	var folderClick = __webpack_require__(10);

	exports["default"] = function (ctrl) {
	    var items = [];
	    var folderPath = ctrl.currentFolderPath();
	    _.each(folderPath, function (folder, index) {
	        items.push(m("a.breadcrumb-link" + (index === folderPath.length - 1 ? ".current" : ""), {
	            href: "#",
	            key: folder.id,
	            onclick: folderClick(ctrl, folder)
	        }, folder.name));
	        items.push(m("i.fa.fa-angle-right"));
	    });
	    items.pop(); // pop last chevron
	    items.unshift(m("i.fa.fa-folder-open.folder-icon"));
	    return items;
	};

	module.exports = exports["default"];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	exports["default"] = folderView;
	var m = __webpack_require__(2);
	var button = __webpack_require__(13);
	var _ = __webpack_require__(1);
	var emptyFolderView = __webpack_require__(14);
	var gridFileView = __webpack_require__(17);
	var listFileView = __webpack_require__(27);
	var responsiveUploadHint = __webpack_require__(15);

	var _require = __webpack_require__(5);

	var dropzoneConfig = _require.dropzoneConfig;

	var images = __webpack_require__(21);

	function sortBySpec(data, sortString) {
	    sortString = /^([+-])(.+)$/.exec(sortString || "+name");
	    data = _.sortBy(data || [], sortString[2]);
	    if (sortString[1] === "-") {
	        data = data.reverse();
	    }
	    return data;
	}

	function folderView(ctrl) {
	    var folderData = ctrl.folderData();
	    var viewModeGroup = m("div.btn-group.btn-group-sm.icons", [button(ctrl.viewMode, "grid", m("i.fa.fa-th"), "Grid"), button(ctrl.viewMode, "list", m("i.fa.fa-th-list"), "List")]);
	    var sortGroup = m("div.btn-group.btn-group-sm", [button(ctrl.sortMode, "+name", "A-Z"), button(ctrl.sortMode, "-name", "Z-A"), button(ctrl.sortMode, "+date", gettext("Oldest first")), button(ctrl.sortMode, "-date", gettext("Newest first")), button(ctrl.sortMode, "+size", gettext("Smallest first")), button(ctrl.sortMode, "-size", gettext("Largest first"))]);
	    var toolbar = m("div.btn-toolbar", [viewModeGroup, sortGroup]);
	    var files = sortBySpec(folderData.files || [], ctrl.sortMode());
	    var folders = sortBySpec(folderData.folders || [], ctrl.sortMode());
	    var contents = null,
	        uploadHint = null;
	    if (folders.length === 0 && files.length === 0) {
	        contents = emptyFolderView(ctrl, folderData);
	        toolbar = null;
	    } else {
	        switch (ctrl.viewMode()) {
	            case "grid":
	                contents = gridFileView(ctrl, folders, files);
	                break;
	            case "list":
	                contents = listFileView(ctrl, folders, files);
	                break;
	        }
	        uploadHint = m("div.upload-hint", responsiveUploadHint);
	    }
	    var container = m("div.folder-contents.fd-zone", {
	        "data-folder-id": folderData.id,
	        config: dropzoneConfig(ctrl)
	    }, [contents, uploadHint, m("div.upload-indicator", [m("div.image", m("img", { src: images.uploadIndicator })), m("div.text", [m.trust(gettext("Drop your files here"))])])]);

	    return m("div.folder-view", [toolbar, container]);
	}

	module.exports = exports["default"];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	var m = __webpack_require__(2);
	var _ = __webpack_require__(1);

	exports["default"] = function (prop, value, label, title) {
	    var active = prop() == value; // eslint-disable-line eqeqeq
	    return m("button.btn.btn-default" + (active ? ".active" : ""), {
	        type: "button",
	        onclick: _.bind(prop, null, value),
	        title: title
	    }, label);
	};

	module.exports = exports["default"];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	var m = __webpack_require__(2);
	var responsiveUploadHint = __webpack_require__(15);

	exports["default"] = function (ctrl, folder) {
	    // eslint-disable-line no-unused-vars
	    return m("div.empty-folder", [m("div.empty-image", m("img", { src: __webpack_require__(16) })), m("div.empty-text", responsiveUploadHint)]);
	};

	module.exports = exports["default"];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	var m = __webpack_require__(2);

	var _require = __webpack_require__(5);

	var supportsDnD = _require.supportsDnD;

	var NO_DND_UPLOAD_HINT = gettext("Click the <strong>Upload</strong> button to upload files.");
	var DND_UPLOAD_HINT = supportsDnD ? gettext("<span>Drag and drop</span> files here<br> or click the <span>Upload</span> button.") : NO_DND_UPLOAD_HINT;

	var responsiveUploadHint = [m("div.visible-sm.visible-xs", m.trust(NO_DND_UPLOAD_HINT)), m("div.visible-md.visible-lg", m.trust(DND_UPLOAD_HINT))];

	exports["default"] = responsiveUploadHint;
	module.exports = exports["default"];

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MDAgNDAwIj48cGF0aCBmaWxsPSIjREREIiBkPSJNNTYxLjUgMTY2LjRjLTEuMS0yLjYtMi40LTQuNi0zLjktNi4xTDUzMi40IDEzNWMtMS41LTEuNS0zLjYtMi44LTYuMS0zLjktMi42LTEuMS01LTEuNi03LjEtMS42aC03Mi41Yy0yLjIgMC00IC44LTUuNSAyLjMtMS41IDEuNS0yLjMgMy4zLTIuMyA1LjV2MTI5LjNjMCAyLjIuOCA0IDIuMyA1LjUgMS41IDEuNSAzLjMgMi4zIDUuNSAyLjNoMTA4LjdjMi4yIDAgNC0uOCA1LjUtMi4zIDEuNS0xLjUgMi4zLTMuMyAyLjMtNS41di05My4xYy0uMS0yLjItLjYtNC41LTEuNy03LjF6bS0zOS44LTI1LjljMS42LjUgMi43IDEuMSAzLjMgMS44bDI1LjMgMjUuM2MuNi42IDEuMiAxLjggMS44IDMuM2gtMzAuNHYtMzAuNHpNNTUyLjggMjY0SDQ0OS4yVjEzOS45aDYyLjF2MzMuNmMwIDIuMi44IDQgMi4zIDUuNSAxLjUgMS41IDMuMyAyLjMgNS41IDIuM2gzMy43VjI2NHptLTgyLjEtNzEuN2MtLjUuNS0uNyAxLjEtLjcgMS45djUuMmMwIC44LjIgMS40LjcgMS45czEuMS43IDEuOS43aDU3Yy44IDAgMS40LS4yIDEuOS0uN3MuNy0xLjEuNy0xLjl2LTUuMmMwLS44LS4yLTEuNC0uNy0xLjlzLTEuMS0uNy0xLjktLjdoLTU3Yy0uOCAwLTEuNS4yLTEuOS43em01OC44IDQwLjdoLTU3Yy0uOCAwLTEuNC4yLTEuOS43LS41LjUtLjcgMS4xLS43IDEuOXY1LjJjMCAuOC4yIDEuNC43IDEuOXMxLjEuNyAxLjkuN2g1N2MuOCAwIDEuNC0uMiAxLjktLjdzLjctMS4xLjctMS45di01LjJjMC0uOC0uMi0xLjQtLjctMS45LS41LS41LTEuMi0uNy0xLjktLjd6bTAtMjAuN2gtNTdjLS44IDAtMS40LjItMS45LjdzLS43IDEuMS0uNyAxLjl2NS4yYzAgLjguMiAxLjQuNyAxLjlzMS4xLjcgMS45LjdoNTdjLjggMCAxLjQtLjIgMS45LS43cy43LTEuMS43LTEuOXYtNS4yYzAtLjgtLjItMS40LS43LTEuOXMtMS4yLS43LTEuOS0uN3pNMTA5LjMgMjE2LjFjLTQuOS00LTguOC0xMC40LTExLjgtMTkuMi42LTMuNyAxLTguOSAxLjEtMTUuNVYxNzljMC0uMyAwLS41LS4xLS42LjEtLjEuMi0uMy4zLS42LjUtMi41LjItNC40LS43LTUuNS0uNi0uOC0xLjYtMS4yLTIuOC0xLjJoLTEuOGMtMS43IDAtMi44IDEuMS0zLjQgMy4yLS43IDIuNy0uOSA2LjEtLjUgMTAuMy40IDQuMiAxLjIgOC41IDIuNSAxMi45LTEuOSA2LjgtNC43IDEzLjgtOC40IDIxLjItMyA2LTUuOSAxMS4zLTguNyAxNS45IDAtLjEtLjEtLjItLjItLjMtLjUtLjgtMS4xLTEtMS45LS41LTQuNiAyLjQtOC4xIDUtMTAuNyA3LjgtMi41IDIuOC00IDUuMi00LjUgNy40LS4yIDEuNC0uMSAyLjQuNSAyLjkuMy4yLjQuNC41LjRsMS45IDFjLjcuNCAxLjUuNiAyLjMuNiA0LjggMCAxMS4zLTcuMSAxOS42LTIxLjIgOS4yLTMuMiAxOS44LTUuNCAzMS43LTYuNyAzLjQgMS44IDYuOSAzLjIgMTAuNSA0LjMgMy42IDEuMSA2LjcgMS42IDkuMyAxLjYgMy41IDAgNS40LTEgNS43LTMuMXYtLjFsLjItLjJjLjEtLjEuMS0uMS4xLS4yLjgtMS42LjctMy0uMi00LjItMS42LTIuNi02LjQtNC0xNC4zLTQtMy4xIDAtNi4zLjItOS41LjYtMi42LTEuNy00LjktMy4yLTYuNy00LjZ6bS00Ni42IDMzLjJjLjctMS42IDItMy42IDQtNnM0LjMtNC42IDcuMS02LjhjLTQuNiA3LjItOC4zIDExLjUtMTEuMSAxMi44em0zMi4yLTc0LjR2LS4yYy4xLS4xLjEtLjEuMS0uMi42LjggMSAxLjcgMS4xIDIuOXYuMmMwIC4xIDAgLjEuMS4yLS4yLjItLjMuNC0uMy42LS40IDIuMi0uNiAzLjMtLjYgMy41LS4zIDItLjUgMy4yLS42IDMuNi0uNi00LjgtLjYtOC4zLjItMTAuNnptLTEwIDUzLjRjLjgtMS41IDItMy43IDMuNi02LjcgMy02IDUuMy0xMS4zIDYuNy0xNS45IDIuOCA1LjkgNi4yIDEwLjYgMTAuMyAxNC4yLjMuMy43LjYgMS4zIDEuMS42LjUuOS43IDEuMS44LTguMSAxLjUtMTUuNyAzLjYtMjMgNi41em01Mi4zLTEuMmwuMi4yYy0uMi4xLS43LjEtMS41LjEtMi42IDAtNS45LS44LTEwLTIuMyA2LjIgMCAxMCAuNyAxMS4zIDJ6bTIyLjQtNjAuN2MtMS4xLTIuNi0yLjQtNC42LTMuOS02LjFMMTMwLjUgMTM1Yy0xLjUtMS41LTMuNi0yLjgtNi4xLTMuOS0yLjYtMS4xLTUtMS42LTcuMS0xLjZINDQuOGMtMi4yIDAtNCAuOC01LjUgMi4zLTEuNSAxLjUtMi4zIDMuMy0yLjMgNS41djEyOS4zYzAgMi4yLjggNCAyLjMgNS41IDEuNSAxLjUgMy4zIDIuMyA1LjUgMi4zaDEwOC43YzIuMiAwIDQtLjggNS41LTIuMyAxLjUtMS41IDIuMy0zLjMgMi4zLTUuNXYtOTMuMWMwLTIuMi0uNi00LjUtMS43LTcuMXptLTM5LjgtMjUuOWMxLjYuNSAyLjcgMS4xIDMuMyAxLjhsMjUuMyAyNS4zYy42LjYgMS4yIDEuOCAxLjggMy4zaC0zMC40di0zMC40ek0xNTAuOSAyNjRINDcuNFYxMzkuOWg2Mi4xdjMzLjZjMCAyLjIuOCA0IDIuMyA1LjUgMS41IDEuNSAzLjMgMi4zIDUuNSAyLjNIMTUxVjI2NHpNMjUwLjcgMjIwLjdjOC4yIDAgMTUuMi0yLjkgMjEtOC42IDUuOC01LjcgOC42LTEyLjcgOC42LTIwLjlzLTIuOS0xNS4yLTguNi0yMC45Yy01LjgtNS43LTEyLjctOC42LTIxLTguNi04LjIgMC0xNS4yIDIuOS0yMSA4LjYtNS44IDUuOC04LjYgMTIuNy04LjYgMjAuOXMyLjkgMTUuMiA4LjYgMjAuOWM1LjggNS43IDEyLjggOC42IDIxIDguNnptMTkuOCAzOS40bC0xOS43LTE5LjctMjkuNyAyOS42djI5LjZIMzc5di00OS4zTDMyOS43IDIwMWwtNTkuMiA1OS4xem0xNDQuOS0xMjYuOWMtMi4xLTQuOS00LjUtOC44LTcuNC0xMS43bC00OC4xLTQ4LjFjLTIuOS0yLjktNi44LTUuMy0xMS43LTcuNC00LjktMi4xLTkuNS0zLjEtMTMuNi0zLjFIMTk2LjRjLTQuMSAwLTcuNiAxLjQtMTAuNSA0LjMtMi45IDIuOS00LjMgNi40LTQuMyAxMC41djI0Ni40YzAgNC4xIDEuNCA3LjYgNC4zIDEwLjUgMi45IDIuOSA2LjQgNC4zIDEwLjUgNC4zaDIwNy4yYzQuMSAwIDcuNi0xLjQgMTAuNS00LjMgMi45LTIuOSA0LjMtNi40IDQuMy0xMC41VjE0Ni44Yy4xLTQuMS0uOS04LjYtMy0xMy42em0tNzUuOS00OS4zYzMgMSA1LjEgMi4yIDYuMyAzLjRsNDguMyA0OC4yYzEuMiAxLjIgMi40IDMuMyAzLjQgNi4zaC01OFY4My45em01OS4yIDIzNS40SDIwMS40VjgyLjdoMTE4LjR2NjQuMWMwIDQuMSAxLjQgNy42IDQuMyAxMC41IDIuOSAyLjkgNi40IDQuMyAxMC41IDQuM2g2NC4xdjE1Ny43eiIvPjwvc3ZnPg=="

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	var m = __webpack_require__(2);
	var _ = __webpack_require__(1);
	var wrapFileLink = __webpack_require__(18);
	var folderLink = __webpack_require__(20);

	var _require = __webpack_require__(5);

	var dropzoneConfig = _require.dropzoneConfig;

	var images = __webpack_require__(21);
	var menuManager = __webpack_require__(23);
	var fileContextMenu = __webpack_require__(25);

	exports["default"] = function (ctrl, folders, files) {
	    var folderItems = _.map(folders, function (folder) {
	        return m("div.col-xs-6.col-md-4.col-lg-3.grid-folder.fd-zone", {
	            key: "folder-" + folder.id,
	            "data-folder-id": folder.id,
	            config: dropzoneConfig(ctrl)
	        }, [m("a.file-preview", {
	            onclick: function onclick() {
	                ctrl.setFolder(folder.id);
	                return false;
	            },
	            href: "#"
	        }, m("i.fa.fa-folder-open.folder-icon")), m("div.file-name", folderLink(ctrl, folder))]);
	    });
	    var fileItems = _.map(files, function (file) {
	        return m("div.col-xs-6.col-md-4.col-lg-3.grid-file", {
	            key: file.id,
	            draggable: true,
	            ondragstart: function ondragstart(event) {
	                event.stopPropagation();
	                event.dataTransfer.effectAllowed = "copyMove";
	                event.dataTransfer.setData("text", JSON.stringify({ "fileId": file.id }));
	                try {
	                    var dragIcon = document.createElement("img");
	                    dragIcon.src = file.thumbnail || images.defaultThumbnail;
	                    dragIcon.width = 100;
	                    event.dataTransfer.setDragImage(dragIcon, 0, 0);
	                } catch (e) {
	                    // This isn't a problem
	                }
	            }
	        }, m("button.file-cog-btn.btn.btn-xs.btn-default", {
	            key: "filecog",
	            onclick: function onclick(event) {
	                menuManager.open(event.currentTarget, fileContextMenu(ctrl, file));
	                event.preventDefault();
	            }
	        }, m("i.fa.fa-cog")), wrapFileLink(file, "a.file-preview", [m("img.img-responsive", { src: file.thumbnail || images.defaultThumbnail }), m("div.file-name", file.name)]));
	    });
	    return m("div.row", folderItems.concat(fileItems));
	};

	module.exports = exports["default"];

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	var m = __webpack_require__(2);
	var getPickId = __webpack_require__(19);

	exports["default"] = function (file) {
	    var tag = arguments.length <= 1 || arguments[1] === undefined ? "a" : arguments[1];
	    var content = arguments.length <= 2 || arguments[2] === undefined ? file.name : arguments[2];
	    return (function () {
	        var attrs = { href: file.url, target: "_blank" };
	        var pickId = getPickId();
	        if (pickId) {
	            attrs.onclick = function (event) {
	                window.opener.postMessage({
	                    "pick": {
	                        "id": pickId,
	                        "object": {
	                            "id": file.id,
	                            "text": file.name,
	                            "url": file.url,
	                            "thumbnail": file.thumbnail
	                        }
	                    }
	                }, "*");
	                event.preventDefault();
	                return false;
	            };
	        }
	        return m(tag, attrs, content);
	    })();
	};

	module.exports = exports["default"];

/***/ },
/* 19 */
/***/ function(module, exports) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;

	exports["default"] = function () {
	  var pickMatch = /pick=([^&]+)/.exec(window.location.search);
	  return pickMatch ? pickMatch[1] : null;
	};

	module.exports = exports["default"];

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	var m = __webpack_require__(2);

	exports["default"] = function (ctrl, folder) {
	    return m("a", {
	        href: "#", onclick: function onclick() {
	            ctrl.setFolder(folder.id);
	            return false;
	        }
	    }, folder.name);
	};

	module.exports = exports["default"];

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	var uploadIndicator = __webpack_require__(16);
	exports.uploadIndicator = uploadIndicator;
	var defaultThumbnail = __webpack_require__(22);
	exports.defaultThumbnail = defaultThumbnail;

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDUgMTQ1IiBoZWlnaHQ9IjE0NSIgd2lkdGg9IjE0NSI+PHBhdGggZD0iTTEyNC41IDEzNC45NjhoLTEwNHYtMTI0aDYyYy4wOTUgMTEuMTM4LS4xOTIgMjIuODkyLjE0OCAzNC42MDggMS4xMzcgNS40MDcgNi43MjIgNi45MjMgMTEuMjg3IDYuMzkySDEyNC41djgyLjU5M3pNOTMuMSAxMC45NzVjNC40MzggMS42OCA3LjA0NyA2LjA3IDEwLjU2NCA5LjA5NiA2LjEyIDYuMjEyIDEyLjM5IDEyLjI4NyAxOC40MTYgMTguNTgyIDMuNjIgNC42NjMtMi4yODcgMi45OS00Ljc0OCAzLjMxNkg5My41VjEwLjk3NXptMzkuNzA0IDI1LjkxOGMtMi44MTgtNi41NDctOC45NDYtMTAuNjYtMTMuNTY3LTE1Ljg1LTUuODM0LTUuNjgyLTExLjI5OC0xMS43OC0xNy4zODgtMTcuMTc2LTYuNTQyLTUuMTYtMTQuOTg0LTMuNjk0LTIyLjY3LTMuOS0yMC41NjguMDI2LTQxLjEzOC0uMDUtNjEuNzAzLjAzOC01LjQzMi4zODctNy42MiA2LjA5LTYuOTc3IDEwLjgyNS4wMjUgNDIuMzgtLjA1IDg0Ljc2LjAzNyAxMjcuMTQuMzg2IDUuNDQ4IDYuMDcgNy42NDMgMTAuNzkgNi45OTggMzUuNC0uMDI1IDcwLjguMDUgMTA2LjE5Ni0uMDM4IDUuNDMyLS4zODYgNy42Mi02LjA5IDYuOTc3LTEwLjgyNC0uMDM4LTMwLjMxMi4wNzUtNjAuNjMtLjA1Ny05MC45NC0uMTkyLTIuMTY0LS43OTQtNC4yNzYtMS42NC02LjI3M3oiIGZpbGw9IiNkZGQiLz48L3N2Zz4="

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	exports.isMenuVisible = isMenuVisible;
	exports.open = open;
	exports.close = close;
	var m = __webpack_require__(2);
	var _ = __webpack_require__(1);
	var offset = __webpack_require__(24);

	var currentMenuParent = null;
	var currentMenuComponent = null;
	var fallbackParentCoords = null;
	var menuContainer = null;
	var currentMenuOpenTs = 0;
	var widthMargin = 20;

	function isMenuVisible() {
	    return currentMenuParent !== null && menuContainer !== null;
	}

	function reattachNow() {
	    if (!isMenuVisible()) {
	        return;
	    }
	    var parentCoords = offset(currentMenuParent) || fallbackParentCoords;
	    if (parentCoords === null) {
	        return;
	    }
	    var viewWidth = window.innerWidth;
	    var x = parentCoords.left;
	    var y = parentCoords.top + parentCoords.height + 5;
	    var menuOffset = offset(menuContainer);
	    var menuWidth = menuOffset ? menuOffset.width : 0; // ah well
	    if (viewWidth && x + menuWidth > viewWidth - widthMargin) {
	        x = x + parentCoords.width - menuWidth;
	    }

	    _.assign(menuContainer.style, {
	        "display": "block",
	        "left": x + "px",
	        "top": y + "px",
	        "position": "absolute",
	        "zIndex": 9000
	    });
	}

	var reattachSoon = _.debounce(reattachNow, 20);

	function menuView(view) {
	    return function () {
	        var items = null;
	        if (_.isArray(view)) {
	            // It's already an array of items, fine
	            items = view;
	        }
	        if (_.isFunction(view)) {
	            // It's a function returning something..?
	            items = view();
	        }
	        if (_.isArray(items)) {
	            // If it was items, wrap them.
	            return m("ul.dropdown-menu", { style: "display: block; float: none; position: static; top: 0" }, items);
	        }
	        return items;
	    };
	}

	function initializeMenuContainer() {
	    if (menuContainer === null) {
	        menuContainer = document.createElement("div");
	        document.body.appendChild(menuContainer);
	        window.addEventListener("resize", reattachSoon, false);
	        window.addEventListener("scroll", reattachSoon, false);
	        document.body.addEventListener("click", function (event) {
	            if (!isMenuVisible()) {
	                return;
	            }
	            if (+new Date() - currentMenuOpenTs < 200) {
	                return; // Ignore mis-taps within a short time of the opening click
	            }
	            var node = event.target;
	            do {
	                if (node === menuContainer) {
	                    return false;
	                }
	            } while (node = node.parentElement);
	            close();
	        }, false);

	        //setInterval(reattachSoon, 100);
	    }
	    return menuContainer;
	}

	function open(parent, view) {
	    if (currentMenuParent === parent) {
	        close();
	        return;
	    }
	    if (parent) {
	        initializeMenuContainer();
	    }
	    currentMenuParent = parent;
	    currentMenuComponent = view ? { view: menuView(view), controller: _.noop } : null;
	    currentMenuOpenTs = +new Date();
	    if (menuContainer) {
	        m.mount(menuContainer, currentMenuComponent);
	        fallbackParentCoords = parent ? offset(parent) : null;
	        if (view) {
	            reattachNow();
	            setTimeout(reattachSoon, 100);
	        }
	    }
	}

	function close() {
	    open(null, null);
	}

/***/ },
/* 24 */
/***/ function(module, exports) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	// adapted from
	"use strict";

	exports.__esModule = true;

	exports["default"] = function (elem) {
	    if (!elem.getClientRects().length) {
	        return null;
	    }

	    var rect = elem.getBoundingClientRect();

	    if (!(rect.width || rect.height)) {
	        return null;
	    }
	    var doc = elem.ownerDocument;
	    var win = doc.defaultView || window;
	    var docElem = doc.documentElement;

	    return {
	        top: rect.top + win.pageYOffset - docElem.clientTop,
	        left: rect.left + win.pageXOffset - docElem.clientLeft,
	        width: rect.width,
	        height: rect.height
	    };
	};

	module.exports = exports["default"];
	// https://github.com/jquery/jquery/blob/250a1990baa571de60325ab2c52eabb399c4cf9e/src/offset.js#L76-L116

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	var fileActions = __webpack_require__(8);
	var menuItem = __webpack_require__(26);

	exports["default"] = function (controller, file) {
	    return function () {
	        return [menuItem(gettext("Rename file"), function () {
	            fileActions.promptRenameFile(controller, file);
	        }, { disabled: controller.isMenuDisabled("rename") }), menuItem(gettext("Delete file"), function () {
	            fileActions.promptDeleteFile(controller, file);
	        }, { disabled: controller.isMenuDisabled("delete") })];
	    };
	};

	module.exports = exports["default"];

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	exports["default"] = item;
	var _ = __webpack_require__(1);
	var m = __webpack_require__(2);
	var menuManager = __webpack_require__(23);

	function item(label, action) {
	    var attrs = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	    var tagBits = ["li"];
	    if (attrs.disabled) {
	        action = _.noop;
	        tagBits.push("disabled");
	    }
	    return m(tagBits.join("."), m("a", {
	        href: "#", onclick: function onclick(event) {
	            event.preventDefault();
	            action();
	            menuManager.close();
	        }
	    }, label));
	}

	module.exports = exports["default"];

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	"use strict";

	exports.__esModule = true;
	var _ = __webpack_require__(1);
	var m = __webpack_require__(2);
	var moment = __webpack_require__(28);
	var wrapFileLink = __webpack_require__(18);
	var folderLink = __webpack_require__(20);
	var menuManager = __webpack_require__(23);
	var fileContextMenu = __webpack_require__(25);

	exports["default"] = function (ctrl, folders, files) {
	    var folderItems = _.map(folders, function (folder) {
	        return m("tr", { key: "folder-" + folder.id }, [m("td", { colspan: 4 }, [m("i.fa.fa-folder.folder-icon"), " ", folderLink(ctrl, folder)])]);
	    });
	    var fileItems = _.map(files, function (file) {
	        return m("tr", { key: file.id }, [m("td", wrapFileLink(file)), m("td.text-right", file.size), m("td.text-right", moment(file.date).format()), m("td", { key: "filecog",
	            onclick: function onclick(event) {
	                menuManager.open(event.currentTarget, fileContextMenu(ctrl, file));
	                event.preventDefault();
	            }
	        }, m("i.fa.fa-cog"))]);
	    });
	    return m("div.table-responsive", [m("table.table.table-condensed.table-striped.table-bordered", [m("thead", m("tr", _.map([gettext("Name"), gettext("Size"), gettext("Date"), gettext("Edit")], function (title) {
	        return m("th", title);
	    }))), m("tbody", folderItems.concat(fileItems))])]);
	};

	module.exports = exports["default"];

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = window.moment;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	/* eslint-disable no-shadow,eqeqeq */
	"use strict";

	exports.__esModule = true;
	var _ = __webpack_require__(1);

	exports["default"] = function (rootFolder, folderId) {
	    var pathToFolder = null;

	    function walk(folder, folderPath) {
	        if (folder.id == folderId) {
	            pathToFolder = folderPath.concat([folder]);
	            return;
	        }
	        folderPath = [].concat(folderPath).concat([folder]);
	        _.each(folder.children, function (folder) {
	            if (!pathToFolder) {
	                walk(folder, folderPath);
	            }
	        });
	    }

	    walk(rootFolder, []);
	    return pathToFolder || [];
	};

	module.exports = exports["default"];

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * This file is part of Shuup.
	 *
	 * Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
	 *
	 * This source code is licensed under the OSL-3.0 license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	/* eslint-disable no-bitwise */
	"use strict";

	exports.__esModule = true;
	var folderActions = __webpack_require__(9);
	var menuItem = __webpack_require__(26);

	exports["default"] = function (controller) {
	    return function () {
	        var isRoot = (0 | controller.currentFolderId()) === 0;
	        return [menuItem(gettext("New folder"), function () {
	            folderActions.promptCreateFolderHere(controller);
	        }, { disabled: controller.isMenuDisabled("new") }), menuItem(gettext("Rename folder"), function () {
	            folderActions.promptRenameCurrentFolder(controller);
	        }, { disabled: isRoot || controller.isMenuDisabled("rename") }), menuItem(gettext("Delete folder"), function () {
	            folderActions.promptDeleteCurrentFolder(controller);
	        }, { disabled: isRoot || controller.isMenuDisabled("delete") })];
	    };
	};

	module.exports = exports["default"];

/***/ }
/******/ ]);
//# sourceMappingURL=media-browser.js.map