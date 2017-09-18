var ScriptEditor =
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
	const style = __webpack_require__(2);  // eslint-disable-line no-unused-vars
	const cx = __webpack_require__(6);
	const Messages = window.Messages;

	var settings = {};
	const names = {};
	const infos = {};
	var controller = null;
	const optionLists = {};

	function showSuccessAndError(data) {
	    if (data.error) {
	        Messages.enqueue({
	            text: _.isString(data.error) ? data.error : gettext("An error occurred."),
	            tags: "error"
	        });
	    }
	    if (data.success) {
	        Messages.enqueue({
	            text: _.isString(data.success) ? data.success : gettext("Success."),
	            tags: "success"
	        });
	    }
	}

	function apiRequest(command, data, options) {
	    const request = _.extend({}, {"command": command}, data || {});
	    const req = m.request(_.extend({
	        method: "POST",
	        url: settings.apiUrl,
	        data: request,
	        config: function(xhr) {
	            xhr.setRequestHeader("X-CSRFToken", window.ShuupAdminConfig.csrf);
	        }
	    }, options));
	    req.then(function(response) {
	        showSuccessAndError(response);
	    }, function() {
	        Messages.enqueue({text: gettext("An unspecified error occurred."), tags: "error"});
	    });
	    return req;
	}

	function Controller() {
	    const ctrl = this;
	    ctrl.steps = m.prop([]);
	    ctrl.currentItem = m.prop(null);
	    ctrl.newStepItemModalInfo = m.prop(null);

	    apiRequest("getData").then(function(data) {
	        ctrl.steps(data.steps);
	    });

	    ctrl.removeStepItem = function(step, itemType, item) {
	        const listName = itemType + "s";
	        step[listName] = _.reject(step[listName], function(i) {
	            return i === item;
	        });
	        if (ctrl.currentItem() === item) {
	            ctrl.activateStepItem(null, null, null);
	        }
	    };

	    ctrl.addStepItem = function(step, itemType, identifier, activateForEdit) {
	        const item = {"identifier": identifier};
	        const listName = itemType + "s";
	        step[listName].push(item);
	        if (activateForEdit) {
	            ctrl.activateStepItem(step, itemType, item);
	        }
	    };
	    ctrl.setStepItemEditorState = function(state) {
	        if (state) {
	            document.getElementById("step-item-wrapper").style.display = "block";
	        } else {
	            document.getElementById("step-item-wrapper").style.display = "none";
	            document.getElementById("step-item-frame").src = "about:blank";
	        }
	    };
	    ctrl.activateStepItem = function(step, itemType, item) {
	        if (step && item) {
	            ctrl.currentItem(item);
	            const frm = _.extend(document.createElement("form"), {
	                target: "step-item-frame",
	                method: "POST",
	                action: settings.itemEditorUrl
	            });
	            frm.appendChild(_.extend(document.createElement("input"), {
	                name: "init_data",
	                type: "hidden",
	                value: JSON.stringify({
	                    eventIdentifier: settings.eventIdentifier,
	                    itemType: itemType,
	                    data: item
	                })
	            }));
	            document.body.appendChild(frm);
	            frm.submit();
	            ctrl.setStepItemEditorState(true);
	        } else {
	            ctrl.currentItem(null);
	            ctrl.setStepItemEditorState(false);
	        }
	    };
	    ctrl.receiveItemEditData = function(data) {
	        const currentItem = ctrl.currentItem();
	        if (!currentItem) {
	            alert(gettext("Unexpected edit data received."));
	            return;
	        }
	        m.startComputation();
	        ctrl.currentItem(_.extend(currentItem, data));
	        m.endComputation();
	    };
	    ctrl.saveState = function() {
	        apiRequest("saveData", {
	            steps: ctrl.steps()
	        });

	        // TODO: Handle errors here?
	    };
	    ctrl.deleteStep = function(step) {
	        ctrl.steps(_.reject(ctrl.steps(), function(s) {
	            return s === step;
	        }));
	    };
	    ctrl.addNewStep = function() {
	        const step = {
	            actions: [],
	            conditions: [],
	            enabled: true,
	            next: "continue",
	            condOp: "and"
	        };
	        const steps = ctrl.steps();
	        steps.push(step);
	        ctrl.steps(steps);
	    };
	    ctrl.moveStep = function(step, delta) {
	        const steps = ctrl.steps();
	        const oldIndex = _.indexOf(steps, step);
	        if (oldIndex === -1) {
	            return false;
	        }
	        const newIndex = oldIndex + delta;
	        steps.splice(newIndex, 0, steps.splice(oldIndex, 1)[0]);
	        ctrl.steps(steps);
	    };
	    ctrl.promptForNewStepItem = function(step, itemType) {
	        ctrl.newStepItemModalInfo({
	            step: step,
	            itemType: itemType,
	            title: gettext("Add new") + " " + itemType
	        });
	    };
	    ctrl.closeNewStepItemModal = function() {
	        ctrl.newStepItemModalInfo(null);
	    };
	    ctrl.createNewStepItemFromModal = function(identifier) {
	        const info = ctrl.newStepItemModalInfo();
	        ctrl.closeNewStepItemModal();
	        if (info === null) {
	            return;
	        }
	        ctrl.addStepItem(info.step, info.itemType, identifier, true);
	    };
	}

	function workflowItemList(ctrl, step, itemType) {
	    const listName = itemType + "s";
	    const nameMap = names[itemType];
	    const items = step[listName];
	    const list = m("ul.action-list", items.map(function(item) {
	        const name = nameMap[item.identifier] || item.identifier;
	        var tag = "li";
	        const current = (ctrl.currentItem() === item);
	        if (current) {
	            tag += ".current";
	        }
	        return m(tag,
	            [
	                m("a", {
	                    href: "#",
	                    onclick: (!current ? _.partial(ctrl.activateStepItem, step, itemType, item) : null)
	                }, name),
	                " ",
	                m("a.delete", {
	                    href: "#", onclick: function() {
	                        if (!confirm(gettext("Delete this item?\nThis can not be undone."))) {
	                            return;
	                        }
	                        ctrl.removeStepItem(step, itemType, item);
	                    }
	                }, m("i.fa.fa-trash"))
	            ]
	        );
	    }));
	    return m("div", [
	        list,
	        m("div.action-new", [m("a.btn.btn-xs.btn-primary", {
	            href: "#",
	            onclick: _.partial(ctrl.promptForNewStepItem, step, itemType)
	        }, m("i.fa.fa-plus"), " " + gettext("New") + " " + itemType)])
	    ]);
	}

	function stepTableRows(ctrl) {
	    return _.map(ctrl.steps(), function(step, index) {
	        const condOpSelect = m("select", {
	            value: step.cond_op,
	            onchange: m.withAttr("value", function(value) {
	                step.cond_op = value;  // eslint-disable-line camelcase
	            })
	        }, optionLists.condOps);
	        const stepNextSelect = m("select", {
	            value: step.next,
	            onchange: m.withAttr("value", function(value) {
	                step.next = value;
	            })
	        }, optionLists.stepNexts);

	        return m("div", {
	            className: cx("step", {disabled: !step.enabled}),
	            key: step.id
	        }, [
	            m("div.step-buttons", [
	                (index > 0 ? m("a", {
	                    href: "#",
	                    title: gettext("Move Up"),
	                    onclick: _.partial(ctrl.moveStep, step, -1)
	                }, m("i.fa.fa-caret-up")) : null),
	                (index < ctrl.steps().length - 1 ? m("a", {
	                    href: "#",
	                    title: gettext("Move Down"),
	                    onclick: _.partial(ctrl.moveStep, step, +1)
	                }, m("i.fa.fa-caret-down")) : null),
	                (step.enabled ?
	                    m("a", {
	                        href: "#", title: gettext("Disable"), onclick: function() {
	                            step.enabled = false;
	                        }
	                    }, m("i.fa.fa-ban")) :
	                    m("a", {
	                        href: "#", title: gettext("Enable"), onclick: function() {
	                            step.enabled = true;
	                        }
	                    }, m("i.fa.fa-check-circle"))
	                ),
	                m("a", {
	                    href: "#", title: gettext("Delete"), onclick: function() {
	                        if (confirm(gettext("Are you sure you wish to delete this step?"))) {
	                            ctrl.deleteStep(step);
	                        }
	                    }
	                }, m("i.fa.fa-trash"))
	            ]),
	            m("div.step-conds", [
	                m("span.hint", interpolate(gettext("If %s of these conditions hold..."), [condOpSelect])),
	                workflowItemList(ctrl, step, "condition")
	            ]),
	            m("div.step-actions", [
	                m("span.hint", gettext("then execute these actions...")),
	                workflowItemList(ctrl, step, "action")
	            ]),
	            m("div.step-next", [
	                m("span.hint", gettext("and then...")),
	                stepNextSelect
	            ])
	        ]);
	    });
	}

	function renderNewStepItemModal(ctrl, modalInfo) {
	    return m("div.new-step-item-modal-overlay", {onclick: ctrl.closeNewStepItemModal}, [
	        m("div.new-step-item-modal", [
	            m("div.title", modalInfo.title),
	            m("div.item-options", _.map(_.sortBy(_.values(infos[modalInfo.itemType]), "name"), function(item) {
	                return m("div.item-option", {onclick: _.partial(ctrl.createNewStepItemFromModal, item.identifier)}, [
	                    m("div.item-name", item.name),
	                    (item.description ? m("div.item-description", item.description) : null)
	                ]);
	            }))
	        ])
	    ]);
	}

	function view(ctrl) {
	    var modal = null, modalInfo = null;
	    if ((modalInfo = ctrl.newStepItemModalInfo()) !== null) {
	        modal = renderNewStepItemModal(ctrl, modalInfo);
	    }
	    return m("div.step-list-wrapper", [
	        m("div.steps", [
	            stepTableRows(ctrl),
	            m("hr.script-separator"),
	            m(
	                "a.new-step-link.btn.btn-info.btn-sm",
	                {href: "#", onclick: ctrl.addNewStep},
	                m("i.fa.fa-plus"), " " + gettext("New step")
	            )
	        ]),
	        modal
	    ]);
	}

	function generateItemOptions(nameMap) {
	    return _.sortBy(_.map(nameMap, function(name, value) {
	        return m("option", {value: value}, name);
	    }), function(o) {
	        return o.children[0].toLowerCase();
	    });
	}

	function itemInfosToNameMap(itemInfos) {
	    return _(itemInfos).map(function (itemInfo, identifier){ return [identifier, itemInfo.name]; }).zipObject().value();
	}

	function init(iSettings) {
	    settings = _.extend({}, iSettings);
	    infos.condition = settings.conditionInfos;
	    infos.action = settings.actionInfos;
	    names.condition = itemInfosToNameMap(infos.condition);
	    names.action = itemInfosToNameMap(infos.action);
	    optionLists.condOps = generateItemOptions(settings.condOps);
	    optionLists.stepNexts = generateItemOptions(settings.stepNexts);

	    controller = m.mount(document.getElementById("step-table-container"), {
	        controller: Controller,
	        view: view
	    });
	    window.addEventListener("message", function(event) {
	        if (event.data.new_data) {
	            controller.receiveItemEditData(event.data.new_data);
	        }
	    }, false);
	}

	function save() {
	    controller.saveState();
	}

	module.exports.init = init;
	module.exports.save = save;
	module.exports.hideEditModal = function() {
	    if (controller) {
	        m.startComputation();
	        controller.setStepItemEditorState(false);
	        controller.activateStepItem(null);  // Deactivate the modal once data is received
	        m.endComputation();
	    }
	};


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/autoprefixer-loader/index.js!./../node_modules/less-loader/index.js!./script-editor.less", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/autoprefixer-loader/index.js!./../node_modules/less-loader/index.js!./script-editor.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".step-list-wrapper {\n  position: relative;\n}\n.step {\n  border: 1px solid rgba(53, 164, 140, 0.75);\n  border-radius: 4px;\n  background: #fff;\n  margin-bottom: 1em;\n}\n@media (min-width: 768px) {\n  .step {\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -ms-flexbox;\n    display: flex;\n  }\n}\n.step > div {\n  padding: 12px 15px;\n}\n@media (max-width: 767px) {\n  .step > div {\n    border: solid #ddd;\n    border-width: 1px 0px 0px 0px;\n  }\n  .step > div:first-child {\n    border-width: 0;\n    padding: 6px 15px;\n  }\n}\n.step.disabled .step-conds,\n.step.disabled .step-actions,\n.step.disabled .step-next {\n  opacity: 0.3;\n  pointer-events: none;\n}\n.step .hint {\n  display: block;\n  margin-bottom: 5px;\n}\n.step .hint select {\n  margin: 0px 5px;\n}\n.step-buttons {\n  background: #35A48C;\n}\n@media (min-width: 768px) {\n  .step-buttons {\n    -webkit-box-flex: 0;\n    -webkit-flex: 0 0 auto;\n        -ms-flex: 0 0 auto;\n            flex: 0 0 auto;\n  }\n}\n.step-buttons a {\n  color: rgba(255, 255, 255, 0.7);\n  display: inline-block;\n  text-align: center;\n  padding: 6px 10px;\n  margin-right: 10px;\n  font-size: 16px;\n  line-height: 16px;\n  text-decoration: none;\n}\n.step-buttons a:hover,\n.step-buttons a:focus {\n  color: #fff;\n}\n@media (min-width: 768px) {\n  .step-buttons a {\n    display: block;\n    float: none;\n    margin: 4px 0px;\n    padding: 3px;\n    width: 20px;\n    height: 20px;\n  }\n}\n@media (min-width: 768px) {\n  .step-conds,\n  .step-actions,\n  .step-next {\n    -webkit-box-flex: 2;\n    -webkit-flex: 2;\n        -ms-flex: 2;\n            flex: 2;\n  }\n}\nul.action-list {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\nul.action-list li {\n  padding: 2px;\n  display: block;\n  width: 100%;\n}\nul.action-list li.current {\n  font-weight: bold;\n}\nul.action-list li .delete {\n  margin-left: 5px;\n  padding: 3px;\n  color: #777777;\n}\nul.action-list li .delete:hover,\nul.action-list li .delete:focus {\n  color: #e74c3c;\n}\nhr.script-separator {\n  border-color: #ddd;\n}\n.action-new {\n  margin-top: 10px;\n}\n@media (min-width: 768px) {\n  .action-new {\n    padding-top: 10px;\n    border-top: 1px solid #ddd;\n  }\n}\n.new-step-item-modal-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(244, 244, 244, 0.75);\n}\n.new-step-item-modal {\n  max-width: 100%;\n  margin: auto;\n  margin-top: 1em;\n  background: #fff;\n  border: 1px solid #35A48C;\n  border-radius: 4px;\n  overflow: hidden;\n}\n@media (min-width: 768px) {\n  .new-step-item-modal {\n    width: 50%;\n  }\n}\n.new-step-item-modal .title {\n  padding: 10px 15px;\n  background: #35A48C;\n  color: #fff;\n  font-size: 1.8rem;\n}\n.new-step-item-modal .item-options {\n  max-height: 300px;\n  overflow-y: scroll;\n  margin: auto;\n  padding: 10px 0px;\n}\n.new-step-item-modal .item-option {\n  padding: 5px 15px;\n  cursor: pointer;\n}\n.new-step-item-modal .item-option:hover {\n  background: #eee;\n}\n.new-step-item-modal .item-option .item-name {\n  font-weight: normal;\n}\n.new-step-item-modal .item-option .item-description {\n  margin: 0.5em;\n  font-size: 90%;\n}\n#step-table-container {\n  margin-bottom: 15px;\n}\n.iframe-container {\n  padding-top: 30px;\n  margin-top: 15px;\n  border-top: 1px solid #ddd;\n}\n#step-item-frame {\n  width: 100%;\n}\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2015 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */

	(function () {
		'use strict';

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = '';

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes += ' ' + arg;
				} else if (Array.isArray(arg)) {
					classes += ' ' + classNames.apply(null, arg);
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes += ' ' + key;
						}
					}
				}
			}

			return classes.substr(1);
		}

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ }
/******/ ]);