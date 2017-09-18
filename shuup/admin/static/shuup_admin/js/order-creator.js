var OrderCreator =
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
	exports.debugSaveState = debugSaveState;
	exports.debugLoadState = debugLoadState;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _lodash = __webpack_require__(1);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _view = __webpack_require__(3);

	var _view2 = _interopRequireDefault(_view);

	var _reduxPersist = __webpack_require__(36);

	var _store = __webpack_require__(25);

	var _store2 = _interopRequireDefault(_store);

	var _actions = __webpack_require__(5);

	var controller = null;

	function init() {
	    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    if (controller !== null) {
	        return;
	    }
	    var countryDefault = config.countryDefault;
	    if (!countryDefault && config.countries.length > 0) {
	        countryDefault = config.countries[0].id;
	    }
	    _store2["default"].dispatch(_actions.setShopChoices(config.shops || []));
	    _store2["default"].dispatch(_actions.setShop(config.shops[0] || []));
	    _store2["default"].dispatch(_actions.setCountries(config.countries || []));
	    _store2["default"].dispatch(_actions.setAddressProperty("billing", "country", countryDefault));
	    _store2["default"].dispatch(_actions.setAddressProperty("shipping", "country", countryDefault));
	    _store2["default"].dispatch(_actions.setShippingMethodChoices(config.shippingMethods || []));
	    _store2["default"].dispatch(_actions.setPaymentMethodChoices(config.paymentMethods || []));
	    var orderId = config.orderId;
	    _store2["default"].dispatch(_actions.setOrderId(orderId));
	    var customerData = config.customerData;

	    var persistor = _reduxPersist.persistStore(_store2["default"]);
	    persistor.purge(["customerDetails", "quickAdd"]);
	    var resetOrder = window.localStorage.getItem("resetSavedOrder") || "false";
	    var savedOrder = { id: null };
	    if (resetOrder === "true") {
	        persistor.purgeAll();
	        window.localStorage.setItem("resetSavedOrder", "false");
	    } else {
	        var savedOrderStr = window.localStorage.getItem("reduxPersist:order");
	        if (savedOrderStr) {
	            savedOrder = JSON.parse(savedOrderStr);
	        }
	    }

	    if (customerData) {
	        // contact -> New Order
	        persistor.purgeAll();
	        _store2["default"].dispatch(_actions.setCustomer(customerData));
	    }

	    if (orderId) {
	        // Edit mode
	        if (!savedOrder.id || savedOrder.id !== orderId) {
	            // Saved order id does not match with current order
	            // Purge the wrong saved state and initialize from orderData
	            persistor.purgeAll();
	            _store2["default"].dispatch(_actions.setShop(config.orderData.shop));
	            _store2["default"].dispatch(_actions.setCustomer(config.orderData.customer));
	            _store2["default"].dispatch(_actions.setShippingMethod(config.orderData.shippingMethodId));
	            _store2["default"].dispatch(_actions.setPaymentMethod(config.orderData.paymentMethodId));
	            _store2["default"].dispatch(_actions.setLines(config.orderData.lines));
	            _store2["default"].dispatch(_actions.updateTotals(_store2["default"].getState));
	        }
	    } else {
	        // New mode
	        if (savedOrder.id) {
	            // Purge the old saved state for existing order
	            persistor.purgeAll();
	        }
	    }

	    controller = _mithril2["default"].mount(document.getElementById("order-tool-container"), {
	        view: _view2["default"],
	        controller: _lodash2["default"].noop
	    });
	    _store2["default"].subscribe(function () {
	        _mithril2["default"].redraw();
	    });
	}

	function debugSaveState() {
	    window.localStorage.setItem("_OrderCreatorState", JSON.stringify(_store2["default"].getState()));
	    console.log("Saved."); // eslint-disable-line no-console
	}

	function debugLoadState() {
	    var state = JSON.parse(window.localStorage.getItem("_OrderCreatorState"));
	    _store2["default"].dispatch({ "type": "_replaceState", "payload": state });
	    console.log("Loaded."); // eslint-disable-line no-console
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
	"use strict";

	exports.__esModule = true;
	exports["default"] = view;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _shops = __webpack_require__(4);

	var _lines = __webpack_require__(20);

	var _customers = __webpack_require__(22);

	var _methods = __webpack_require__(23);

	var _confirm = __webpack_require__(24);

	var _utils = __webpack_require__(19);

	var _actions = __webpack_require__(5);

	var _store = __webpack_require__(25);

	var _store2 = _interopRequireDefault(_store);

	function view() {
	    var _store$getState$order = _store2["default"].getState().order;

	    var creating = _store$getState$order.creating;
	    var source = _store$getState$order.source;
	    var total = _store$getState$order.total;

	    var _store$getState$shop = _store2["default"].getState().shop;

	    var choices = _store$getState$shop.choices;
	    var selected = _store$getState$shop.selected;

	    var _store$getState = _store2["default"].getState();

	    var customerDetails = _store$getState.customerDetails;

	    var viewObj;
	    if (source) {
	        viewObj = _mithril2["default"]("div.container-fluid", _confirm.confirmView(source), _mithril2["default"]("div", [_mithril2["default"]("button.btn.btn-danger.btn-lg" + (creating ? ".disabled" : ""), {
	            disabled: creating,
	            onclick: function onclick() {
	                _store2["default"].dispatch(_actions.clearOrderSourceData());
	            }
	        }, _mithril2["default"]("i.fa.fa-close"), " " + gettext("Back")), _mithril2["default"]("button.btn.btn-success.btn-lg.pull-right" + (creating ? ".disabled" : ""), {
	            disabled: creating,
	            onclick: function onclick() {
	                _store2["default"].dispatch(_actions.beginFinalizingOrder());
	            }
	        }, _mithril2["default"]("i.fa.fa-check"), " " + gettext("Confirm"))]));
	    } else {
	        viewObj = [_mithril2["default"]("div.container-fluid", _mithril2["default"]("button.btn.btn-gray.btn-inverse.pull-right", {
	            onclick: function onclick() {
	                window.localStorage.setItem("resetSavedOrder", "true");
	                window.location.reload();
	            }
	        }, _mithril2["default"]("i.fa.fa-undo"), " " + gettext("Discard Changes"))), _mithril2["default"]("div.container-fluid", choices.length > 1 ? _utils.contentBlock("i.fa.fa-building", gettext("Select Shop"), _shops.shopSelectView(_store2["default"])) : null, _utils.contentBlock("i.fa.fa-user", gettext("Customer Details"), _customers.customerSelectView(_store2["default"])), _utils.contentBlock("i.fa.fa-cubes", gettext("Order Contents"), _lines.orderLinesView(_store2["default"], creating)), _utils.contentBlock("i.fa.fa-truck", gettext("Shipping Method"), _methods.shipmentMethodSelectView(_store2["default"])), _utils.contentBlock("i.fa.fa-credit-card", gettext("Payment Method"), _methods.paymentMethodSelectView(_store2["default"])), customerDetails ? _customers.renderCustomerDetailModal(_store2["default"]) : null, _mithril2["default"]("div.order-footer", _mithril2["default"]("div.text", _mithril2["default"]("small", gettext("Method rules, taxes and possible extra discounts are calculated after proceeding."))), _mithril2["default"]("div.text", _mithril2["default"]("h2", _mithril2["default"]("small", gettext("Total") + ": "), total + " " + selected.currency)), _mithril2["default"]("div.proceed-button", [_mithril2["default"]("button.btn.btn-success.btn-block" + (creating ? ".disabled" : ""), {
	            disabled: creating,
	            onclick: function onclick() {
	                if (!source) {
	                    _store2["default"].dispatch(_actions.retrieveOrderSourceData());
	                }
	            }
	        }, _mithril2["default"]("i.fa.fa-check"), " " + gettext("Proceed"))])))];
	    }
	    return viewObj;
	}

	module.exports = exports["default"];

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
	exports.shopSelectView = shopSelectView;

	var _actions = __webpack_require__(5);

	var _utils = __webpack_require__(19);

	function shopSelectView(store) {
	    var _store$getState = store.getState();

	    var shop = _store$getState.shop;

	    return m("div.form-group", [m("label.control-label", gettext("Shop")), _utils.selectBox(shop.selected.id, function () {
	        var newShop = _.find(shop.choices, { "id": parseInt(this.value) });
	        store.dispatch(_actions.setShop(newShop));
	        store.dispatch(_actions.updateLines());
	    }, shop.choices)]);
		}

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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _reduxActions = __webpack_require__(6);

	var _api = __webpack_require__(18);

	var _lodash = __webpack_require__(1);

	var _lodash2 = _interopRequireDefault(_lodash);

	// Shops actions
	var setShop = _reduxActions.createAction("setShop");
	exports.setShop = setShop;
	var setShopChoices = _reduxActions.createAction("setShopChoices");
	exports.setShopChoices = setShopChoices;
	var setCountries = _reduxActions.createAction("setCountries");
	exports.setCountries = setCountries;
	// Lines actions
	var addLine = _reduxActions.createAction("addLine");
	exports.addLine = addLine;
	var deleteLine = _reduxActions.createAction("deleteLine");
	exports.deleteLine = deleteLine;
	var updateLineFromProduct = _reduxActions.createAction("updateLineFromProduct");
	exports.updateLineFromProduct = updateLineFromProduct;
	var setLineProperty = _reduxActions.createAction("setLineProperty", function (id, property, value) {
	    return { id: id, property: property, value: value };
	});
	exports.setLineProperty = setLineProperty;
	var setLines = _reduxActions.createAction("setLines");
	exports.setLines = setLines;
	// Customers actions
	var clearExistingCustomer = _reduxActions.createAction("clearExistingCustomer");
	exports.clearExistingCustomer = clearExistingCustomer;
	var setAddressProperty = _reduxActions.createAction("setAddressProperty", function (type, field, value) {
	    return { type: type, field: field, value: value };
	});
	exports.setAddressProperty = setAddressProperty;
	var setAddressSavingOption = _reduxActions.createAction("setAddressSavingOption");
	exports.setAddressSavingOption = setAddressSavingOption;
	var setShipToBillingAddress = _reduxActions.createAction("setShipToBillingAddress");
	exports.setShipToBillingAddress = setShipToBillingAddress;
	var setIsCompany = _reduxActions.createAction("setIsCompany");
	exports.setIsCompany = setIsCompany;
	var setCustomer = _reduxActions.createAction("setCustomer");
	exports.setCustomer = setCustomer;
	var showCustomerModal = _reduxActions.createAction("showCustomerModal");
	exports.showCustomerModal = showCustomerModal;
	// Methods actions
	var setShippingMethodChoices = _reduxActions.createAction("setShippingMethodChoices");
	exports.setShippingMethodChoices = setShippingMethodChoices;
	var setShippingMethod = _reduxActions.createAction("setShippingMethod");
	exports.setShippingMethod = setShippingMethod;
	var setPaymentMethodChoices = _reduxActions.createAction("setPaymentMethodChoices");
	exports.setPaymentMethodChoices = setPaymentMethodChoices;
	var setPaymentMethod = _reduxActions.createAction("setPaymentMethod");
	exports.setPaymentMethod = setPaymentMethod;
	// Orders actions
	var updateTotals = _reduxActions.createAction("updateTotals");
	exports.updateTotals = updateTotals;
	var setOrderSource = _reduxActions.createAction("setOrderSource");
	exports.setOrderSource = setOrderSource;
	var clearOrderSourceData = _reduxActions.createAction("clearOrderSourceData");
	exports.clearOrderSourceData = clearOrderSourceData;
	var setOrderId = _reduxActions.createAction("setOrderId");
	exports.setOrderId = setOrderId;
	var beginCreatingOrder = _reduxActions.createAction("beginCreatingOrder");
	var endCreatingOrder = _reduxActions.createAction("endCreatingOrder");
	// Comment action
	var setComment = _reduxActions.createAction("setComment");
	exports.setComment = setComment;
	// Quick add actions
	var setAutoAdd = _reduxActions.createAction("setAutoAdd");
	exports.setAutoAdd = setAutoAdd;
	var clearQuickAddProduct = _reduxActions.createAction("clearQuickAddProduct");
	exports.clearQuickAddProduct = clearQuickAddProduct;
	var setQuickAddProduct = _reduxActions.createAction("setQuickAddProduct");

	exports.setQuickAddProduct = setQuickAddProduct;
	var retrieveProductData = function retrieveProductData(_ref) {
	    var id = _ref.id;
	    var forLine = _ref.forLine;
	    var quantity = _ref.quantity;

	    return function (dispatch, getState) {
	        var _getState = getState();

	        var customer = _getState.customer;
	        var lines = _getState.lines;
	        var shop = _getState.shop;

	        var prodsAlreadyInLinesQty = _lodash2["default"].reduce(lines, function (sum, line) {
	            if (line.id !== forLine && line.product && line.product.id === id) {
	                return sum + parseFloat(line.quantity);
	            }
	            return sum;
	        }, 0);
	        _api.get("product_data", {
	            id: id,
	            "shop_id": shop.selected.id,
	            "customer_id": _lodash2["default"].get(customer, "id"),
	            "quantity": quantity,
	            "already_in_lines_qty": prodsAlreadyInLinesQty
	        }).then(function (data) {
	            if (data.error) {
	                alert(data.error);
	                return;
	            }
	            dispatch(receiveProductData({ id: id, data: data }));
	            if (forLine) {
	                dispatch(updateLineFromProduct({ id: forLine, product: data }));
	                dispatch(updateTotals(getState));
	            }
	        });
	    };
	};

	exports.retrieveProductData = retrieveProductData;
	var retrieveCustomerData = function retrieveCustomerData(_ref2) {
	    var id = _ref2.id;

	    return function (dispatch) {
	        _api.get("customer_data", {
	            id: id
	        }).then(function (data) {
	            if (data.error) {
	                alert(data.error);
	                return;
	            }
	            dispatch(receiveCustomerData({ id: id, data: data }));
	            dispatch(setCustomer(data));
	            dispatch(updateLines());
	        });
	    };
	};

	exports.retrieveCustomerData = retrieveCustomerData;
	var retrieveCustomerDetails = function retrieveCustomerDetails(_ref3) {
	    var id = _ref3.id;

	    return function (dispatch) {
	        return _api.get("customer_details", {
	            id: id
	        }).then(function (data) {
	            if (data.error) {
	                alert(data.error);
	                return;
	            }
	            dispatch(receiveCustomerDetails({ id: id, data: data }));
	        });
	    };
	};

	exports.retrieveCustomerDetails = retrieveCustomerDetails;
	var retrieveOrderSourceData = function retrieveOrderSourceData() {
	    return function (dispatch, getState) {
	        dispatch(beginCreatingOrder());
	        var state = getState();
	        _api.post("source_data", { state: state }).then(function (data) {
	            dispatch(receiveOrderSourceData({ data: data }));
	            dispatch(setOrderSource(data));
	            dispatch(endCreatingOrder());
	        }, function (data) {
	            // error handler
	            dispatch(endCreatingOrder());
	            var Messages = window.Messages;

	            if (Messages) {
	                Messages.enqueue({ type: "error", text: data.errorMessage });
	            } else {
	                alert(data.errorMessage);
	            }
	        });
	    };
	};

	exports.retrieveOrderSourceData = retrieveOrderSourceData;
	var updateLines = function updateLines() {
	    return function (dispatch, getState) {
	        getState().lines.forEach(function (line) {
	            if (line.product) {
	                dispatch(retrieveProductData({ id: line.product.id, forLine: line.id, quantity: line.quantity }));
	            }
	        });
	    };
	};

	exports.updateLines = updateLines;
	var receiveProductData = _reduxActions.createAction("receiveProductData");
	exports.receiveProductData = receiveProductData;
	var receiveCustomerData = _reduxActions.createAction("receiveCustomerData");
	exports.receiveCustomerData = receiveCustomerData;
	var receiveCustomerDetails = _reduxActions.createAction("receiveCustomerDetails");
	exports.receiveCustomerDetails = receiveCustomerDetails;
	var receiveOrderSourceData = _reduxActions.createAction("receiveOrderSourceData");
	exports.receiveOrderSourceData = receiveOrderSourceData;
	var endFinalizingOrder = _reduxActions.createAction("endFinalizingOrder");

	exports.endFinalizingOrder = endFinalizingOrder;
	function handleFinalizeResponse(dispatch, data) {
	    var success = data.success;
	    var errorMessage = data.errorMessage;
	    var orderIdentifier = data.orderIdentifier;
	    var url = data.url;

	    if (success) {
	        window.localStorage.setItem("resetSavedOrder", "true");
	        if (url) {
	            location.href = url;
	        } else {
	            // Very, very unlikely that we'd ever get here
	            alert(interpolate(gettext("Order %s created."), [orderIdentifier]));
	        }
	        return;
	    }
	    dispatch(endCreatingOrder());
	    dispatch(endFinalizingOrder()); // Only flag end if something went awry
	    if (errorMessage) {
	        var Messages = window.Messages;

	        if (Messages) {
	            Messages.enqueue({ type: "error", text: errorMessage });
	        } else {
	            alert(errorMessage);
	        }
	        return;
	    }
	    alert(gettext("An unspecified error occurred.\n") + data);
	}

	var beginFinalizingOrder = function beginFinalizingOrder() {
	    return function (dispatch, getState) {
	        dispatch(beginCreatingOrder());
	        var state = _lodash2["default"].assign({}, getState(), { productData: null, order: null, quickAdd: null }); // We don't care about that substate
	        _api.post("finalize", { state: state }).then(function (data) {
	            handleFinalizeResponse(dispatch, data);
	        }, function (data) {
	            // error handler
	            handleFinalizeResponse(dispatch, data);
	        });
	        dispatch(_reduxActions.createAction("beginFinalizingOrder")());
	    };
	};

	exports.beginFinalizingOrder = beginFinalizingOrder;
	var addProduct = function addProduct(product) {
	    return function (dispatch, getState) {
	        var _getState2 = getState();

	        var lines = _getState2.lines;

	        var line = _lodash2["default"].find(lines, function (o) {
	            return o.product && o.product.id === parseInt(product.id);
	        });
	        if (line === undefined) {
	            dispatch(addLine());
	            dispatch(retrieveProductData({ id: product.id, forLine: _lodash2["default"].last(getState().lines).id }));
	        } else {
	            dispatch(setLineProperty(line.id, "quantity", parseFloat(line.quantity) + 1));
	        }
	    };
	};
	exports.addProduct = addProduct;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _createAction = __webpack_require__(7);

	var _createAction2 = _interopRequireDefault(_createAction);

	var _handleAction = __webpack_require__(8);

	var _handleAction2 = _interopRequireDefault(_handleAction);

	var _handleActions = __webpack_require__(15);

	var _handleActions2 = _interopRequireDefault(_handleActions);

	exports.createAction = _createAction2['default'];
	exports.handleAction = _handleAction2['default'];
	exports.handleActions = _handleActions2['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = createAction;
	function identity(t) {
	  return t;
	}

	function createAction(type, actionCreator, metaCreator) {
	  var finalActionCreator = typeof actionCreator === 'function' ? actionCreator : identity;

	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    var action = {
	      type: type,
	      payload: finalActionCreator.apply(undefined, args)
	    };

	    if (args.length === 1 && args[0] instanceof Error) {
	      // Handle FSA errors where the payload is an Error object. Set error.
	      action.error = true;
	    }

	    if (typeof metaCreator === 'function') {
	      action.meta = metaCreator.apply(undefined, args);
	    }

	    return action;
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = handleAction;

	var _fluxStandardAction = __webpack_require__(9);

	function isFunction(val) {
	  return typeof val === 'function';
	}

	function handleAction(type, reducers) {
	  return function (state, action) {
	    // If action type does not match, return previous state
	    if (action.type !== type) return state;

	    var handlerKey = _fluxStandardAction.isError(action) ? 'throw' : 'next';

	    // If function is passed instead of map, use as reducer
	    if (isFunction(reducers)) {
	      reducers.next = reducers['throw'] = reducers;
	    }

	    // Otherwise, assume an action map was passed
	    var reducer = reducers[handlerKey];

	    return isFunction(reducer) ? reducer(state, action) : state;
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.isFSA = isFSA;
	exports.isError = isError;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _lodashIsplainobject = __webpack_require__(10);

	var _lodashIsplainobject2 = _interopRequireDefault(_lodashIsplainobject);

	var validKeys = ['type', 'payload', 'error', 'meta'];

	function isValidKey(key) {
	  return validKeys.indexOf(key) > -1;
	}

	function isFSA(action) {
	  return _lodashIsplainobject2['default'](action) && typeof action.type !== 'undefined' && Object.keys(action).every(isValidKey);
	}

	function isError(action) {
	  return action.error === true;
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var baseFor = __webpack_require__(11),
	    isArguments = __webpack_require__(12),
	    keysIn = __webpack_require__(13);

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/**
	 * The base implementation of `_.forIn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForIn(object, iteratee) {
	  return baseFor(object, iteratee, keysIn);
	}

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * **Note:** This method assumes objects created by the `Object` constructor
	 * have no inherited enumerable properties.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  var Ctor;

	  // Exit early for non `Object` objects.
	  if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
	      (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
	    return false;
	  }
	  // IE < 9 iterates inherited properties before own properties. If the first
	  // iterated property is an object's own property then there are no inherited
	  // enumerable properties.
	  var result;
	  // In most environments an object's own properties are iterated before
	  // its inherited properties. If the last iterated property is an object's
	  // own property then there are no inherited enumerable properties.
	  baseForIn(value, function(subValue, key) {
	    result = key;
	  });
	  return result === undefined || hasOwnProperty.call(value, result);
	}

	module.exports = isPlainObject;


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iteratee functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();

	/**
	 * Creates a base function for methods like `_.forIn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;

	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	module.exports = baseFor;


/***/ },
/* 12 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * lodash 3.0.5 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]';

	/** Used for built-in method references. */
	var objectProto = global.Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @type Function
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null &&
	    !(typeof value == 'function' && isFunction(value)) && isLength(getLength(value));
	}

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @type Function
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object, else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array constructors, and
	  // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is loosely based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isArguments;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.0.8 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var isArguments = __webpack_require__(12),
	    isArray = __webpack_require__(14);

	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || isArguments(object)) && length) || 0;

	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;

	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = keysIn;


/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/** `Object#toString` result references. */
	var arrayTag = '[object Array]',
	    funcTag = '[object Function]';

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = getNative(Array, 'isArray');

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}

	module.exports = isArray;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = handleActions;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _handleAction = __webpack_require__(8);

	var _handleAction2 = _interopRequireDefault(_handleAction);

	var _ownKeys = __webpack_require__(16);

	var _ownKeys2 = _interopRequireDefault(_ownKeys);

	var _reduceReducers = __webpack_require__(17);

	var _reduceReducers2 = _interopRequireDefault(_reduceReducers);

	function handleActions(handlers, defaultState) {
	  var reducers = _ownKeys2['default'](handlers).map(function (type) {
	    return _handleAction2['default'](type, handlers[type]);
	  });

	  return typeof defaultState !== 'undefined' ? function (state, action) {
	    if (state === undefined) state = defaultState;
	    return _reduceReducers2['default'].apply(undefined, reducers)(state, action);
	  } : _reduceReducers2['default'].apply(undefined, reducers);
	}

	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = ownKeys;

	function ownKeys(object) {
	  if (typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function') {
	    return Reflect.ownKeys(object);
	  }

	  var keys = Object.getOwnPropertyNames(object);

	  if (typeof Object.getOwnPropertySymbols === 'function') {
	    keys = keys.concat(Object.getOwnPropertySymbols(object));
	  }

	  return keys;
	}

	module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = reduceReducers;

	function reduceReducers() {
	  for (var _len = arguments.length, reducers = Array(_len), _key = 0; _key < _len; _key++) {
	    reducers[_key] = arguments[_key];
	  }

	  return function (previous, current) {
	    return reducers.reduce(function (p, r) {
	      return r(p, current);
	    }, previous);
	  };
	}

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
	exports.get = get;
	exports.post = post;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _lodash = __webpack_require__(1);

	var _lodash2 = _interopRequireDefault(_lodash);

	function getUrl(params) {
	    return location.pathname + "?" + _mithril2["default"].route.buildQueryString(params);
	}

	function get(command, params) {
	    var url = getUrl(_lodash2["default"].assign({ command: command }, params));
	    return _mithril2["default"].request({ method: "GET", url: url });
	}

	function post(command, data) {
	    var url = getUrl({ command: command });
	    return _mithril2["default"].request({
	        method: "POST", url: url, data: data,
	        config: function config(xhr) {
	            xhr.setRequestHeader("X-CSRFToken", window.ShuupAdminConfig.csrf);
	        }
	    });
	}

/***/ },
/* 19 */
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
	exports.selectBox = selectBox;
	exports.contentBlock = contentBlock;
	exports.infoRow = infoRow;
	exports.table = table;
	exports.modal = modal;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _mithril = __webpack_require__(2);

	var _mithril2 = _interopRequireDefault(_mithril);

	var _lodash = __webpack_require__(1);

	var _lodash2 = _interopRequireDefault(_lodash);

	var LINE_TYPES = [{ id: "product", name: gettext("Product") }, { id: "other", name: gettext("Other") }, { id: "text", name: gettext("Text/Comment") }];

	exports.LINE_TYPES = LINE_TYPES;
	// ensure address types are translated
	gettext("billing");
	gettext("shipping");

	var ADDRESS_FIELDS = [{ key: "name", label: gettext("Name"), "required": true, helpText: gettext("Enter the name for the %s address.") }, { key: "tax_number", label: gettext("Tax number"), "required": false, helpText: gettext("Enter the company tax (ID) number.") }, { key: "phone", label: gettext("Phone"), "required": false, helpText: gettext("Enter the best %s contact phone number.") }, { key: "email", label: gettext("Email"), "required": false, helpText: gettext("Enter the %s email address for transaction receipts and communications.") }, { key: "street", label: gettext("Street"), "required": true, helpText: gettext("Enter the %s street address.") }, { key: "street2", label: gettext("Street (2)"), "required": false, helpText: gettext("Enter the %s street address (2).") }, { key: "postal_code", label: gettext("ZIP / Postal code"), "required": false, helpText: gettext("Enter the zip or postal code of the %s address.") }, { key: "city", label: gettext("City"), "required": true, helpText: gettext("Enter the city of the %s address.") }, { key: "region", label: gettext("Region"), "required": false, helpText: gettext("Enter the region, state, or province of the %s address.") }, { key: "region_code", label: gettext("Region"), "required": false, helpText: gettext("Enter the region, state, or province of the %s address.") }, { key: "country", label: gettext("Country"), "required": true, helpText: gettext("Enter the country of the %s address.") }];

	exports.ADDRESS_FIELDS = ADDRESS_FIELDS;

	function selectBox(value, onchange, choices) {
	    var valueGetter = arguments.length <= 3 || arguments[3] === undefined ? "id" : arguments[3];
	    var nameGetter = arguments.length <= 4 || arguments[4] === undefined ? "name" : arguments[4];
	    var name = arguments.length <= 5 || arguments[5] === undefined ? "" : arguments[5];
	    var emptyValue = arguments.length <= 6 || arguments[6] === undefined ? null : arguments[6];

	    if (_lodash2["default"].isString(valueGetter)) {
	        valueGetter = _lodash2["default"].partialRight(_lodash2["default"].get, valueGetter);
	    }
	    if (_lodash2["default"].isString(nameGetter)) {
	        nameGetter = _lodash2["default"].partialRight(_lodash2["default"].get, nameGetter);
	    }
	    return _mithril2["default"]("select.form-control.no-select2", { value: value, onchange: onchange, name: name }, [emptyValue ? _mithril2["default"]("option", { value: valueGetter(emptyValue) }, nameGetter(emptyValue)) : null, choices.map(function (obj) {
	        return _mithril2["default"]("option", { value: valueGetter(obj) }, nameGetter(obj));
	    })]);
	}

	function contentBlock(icon, title, view) {
	    var header = arguments.length <= 3 || arguments[3] === undefined ? "h2" : arguments[3];

	    return _mithril2["default"]("div.content-block", _mithril2["default"]("div.title", _mithril2["default"](header + ".block-title", _mithril2["default"](icon), " " + title), _mithril2["default"]("a.toggle-contents", _mithril2["default"]("i.fa.fa-chevron-right"))), _mithril2["default"]("div.content-wrap.collapse", _mithril2["default"]("div.content", view)));
	}

	function infoRow(header, value, klass) {
	    if (value && value !== "") {
	        return _mithril2["default"]("div", [_mithril2["default"]("dt", header), _mithril2["default"]("dd" + (klass ? klass : ""), value)]);
	    }
	}

	function table(_ref) {
	    var columns = _ref.columns;
	    var _ref$data = _ref.data;
	    var data = _ref$data === undefined ? [] : _ref$data;
	    var _ref$tableClass = _ref.tableClass;
	    var tableClass = _ref$tableClass === undefined ? "" : _ref$tableClass;
	    var _ref$emptyMsg = _ref.emptyMsg;
	    var emptyMsg = _ref$emptyMsg === undefined ? gettext("No records found.") : _ref$emptyMsg;

	    return _mithril2["default"]("table", { "class": "table " + tableClass }, _mithril2["default"]("thead", _mithril2["default"]("tr", columns.map(function (col) {
	        return _mithril2["default"]("th", col.label);
	    }))), _mithril2["default"]("tbody", data.length > 0 ? data.map(function (row) {
	        return _mithril2["default"]("tr", columns.map(function (col) {
	            return _mithril2["default"]("td", row[col.key]);
	        }));
	    }) : _mithril2["default"]("tr", _mithril2["default"]("td[colspan='" + columns.length + "'].text-center", _mithril2["default"]("i", emptyMsg)))));
	}

	function modal(_ref2) {
	    var _ref2$show = _ref2.show;
	    var show = _ref2$show === undefined ? false : _ref2$show;
	    var _ref2$sizeClass = _ref2.sizeClass;
	    var sizeClass = _ref2$sizeClass === undefined ? "" : _ref2$sizeClass;
	    var title = _ref2.title;
	    var body = _ref2.body;
	    var footer = _ref2.footer;
	    var close = _ref2.close;

	    if (show) {
	        $("body").append("<div class='modal-backdrop in'></div>").addClass("modal-open");
	    } else {
	        $("body").removeClass("modal-open").find(".modal-backdrop").remove();
	    }

	    return _mithril2["default"]("div.modal" + (show ? " show" : " hidden"), _mithril2["default"]("div.modal-dialog", { "class": sizeClass }, _mithril2["default"]("div.modal-content", _mithril2["default"]("div.modal-header", _mithril2["default"]("button.close", _mithril2["default"]("span", {
	        onclick: function onclick() {
	            return close();
	        }
	    }, _mithril2["default"].trust("&times;"))), title), _mithril2["default"]("div.modal-body", body), _mithril2["default"]("div.modal-footer", footer))));
	}

	var Select2 = {
	    view: function view(ctrl, attrs) {
	        return _mithril2["default"]("select", {
	            name: attrs.name,
	            config: Select2.config(attrs)
	        });
	    },
	    config: function config(ctrl) {
	        return function (element, isInitialized) {
	            if (typeof jQuery !== "undefined" && typeof jQuery.fn.select2 !== "undefined") {
	                (function () {
	                    var $el = $(element);
	                    if (!isInitialized) {
	                        activateSelect($el, ctrl.model, ctrl.attrs).on("change", function () {
	                            // note: data is only populated when an element is actually clicked or enter is pressed
	                            var data = $el.select2("data");
	                            ctrl.onchange(data);
	                            if (ctrl.focus && ctrl.focus()) {
	                                // close it first to clear the search box...
	                                $el.select2("close");
	                                $el.select2("open");
	                            }
	                        });
	                    } else {
	                        // this doesn't actually set the value for ajax autoadd
	                        if (ctrl.value) {
	                            $el.val(ctrl.value().id).trigger("change");
	                        }

	                        if (ctrl.clear) {
	                            $el.select2("val", "");
	                        }

	                        // trigger select2 dropdown repositioning
	                        $(window).scroll();
	                    }
	                })();
	            } else {
	                alert(gettext("Missing JavaScript dependencies detected"));
	            }
	        };
	    }
	};

	exports.Select2 = Select2;
	var HelpPopover = {
	    view: function view(ctrl, attrs) {
	        return _mithril2["default"]("span.help-popover-btn", [_mithril2["default"]("a.btn", {
	            role: "button",
	            config: HelpPopover.config(attrs),
	            // tabindex is required for popover to work but we don't want to actually tab the popover
	            tabindex: 50000
	        }, [_mithril2["default"]("i.fa.fa-question-circle")])]);
	    },
	    config: function config(attrs) {
	        return function (element, isInitialized) {
	            var $el = $(element);
	            if (!isInitialized) {
	                var defaults = {
	                    "placement": "bottom",
	                    "container": "body",
	                    "trigger": "focus"
	                };

	                $el.popover($.extend({}, defaults, attrs));
	            }
	        };
	    }
	};
	exports.HelpPopover = HelpPopover;

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
	exports.renderOrderLines = renderOrderLines;
	exports.orderLinesView = orderLinesView;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _actions = __webpack_require__(5);

	var _utils = __webpack_require__(19);

	var _BrowseAPI = __webpack_require__(21);

	var _BrowseAPI2 = _interopRequireDefault(_BrowseAPI);

	function renderNumberCell(store, line, value, fieldId, canEditPrice) {
	    var min = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

	    return m("input.form-control", {
	        name: fieldId,
	        type: "number",
	        step: line.step,
	        min: min != null ? min : "",
	        value: value,
	        disabled: !canEditPrice,
	        onchange: function onchange() {
	            store.dispatch(_actions.setLineProperty(line.id, fieldId, this.value));
	            if (fieldId === "quantity" && line.product) {
	                store.dispatch(_actions.retrieveProductData({ id: line.product.id, forLine: line.id, quantity: this.value }));
	            }
	            store.dispatch(_actions.updateTotals(store.getState));
	        }
	    });
	}

	function renderOrderLines(store, shop, lines) {
	    return _(lines).map(function (line) {
	        var text = line.text,
	            canEditPrice = true;
	        var editCell = null;
	        var showPrice = line.type !== "text";
	        if (line.type === "product") {
	            text = m("a", {
	                href: "#",
	                onclick: function onclick(e) {
	                    e.preventDefault();
	                    _BrowseAPI2["default"].openBrowseWindow({
	                        kind: "product",
	                        filter: { "shop": shop.id },
	                        onSelect: function onSelect(obj) {
	                            store.dispatch(_actions.setLineProperty(line.id, "product", obj));
	                            store.dispatch(_actions.retrieveProductData({ id: obj.id, forLine: line.id, quantity: line.quantity }));
	                        }
	                    });
	                }
	            }, line.product ? [line.product.text, m("br"), m("small", "(" + line.sku + ")"), m("br"), m("small", gettext("Logical Count") + ": " + line.logicalCount), m("br"), m("small", gettext("Physical Count") + ": " + line.physicalCount)] : gettext("Select product"));
	            canEditPrice = line.product && line.product.id;
	        } else {
	            text = [m("label", gettext("Text/Comment")), m("input.form-control", {
	                type: "text",
	                value: line.text,
	                maxlength: 256,
	                onchange: function onchange() {
	                    store.dispatch(_actions.setLineProperty(line.id, "text", this.value));
	                }
	            }), m.component(_utils.HelpPopover, {
	                title: gettext("Text/Comment"),
	                content: gettext("Enter a comment or text note about the order. This could be anything from special order requests to special shipping needs.")
	            })];
	        }
	        var priceCells = [m("div.line-cell", [m("label", gettext("Qty")), renderNumberCell(store, line, line.quantity, "quantity", canEditPrice, 0), m.component(_utils.HelpPopover, {
	            title: "Quantity",
	            content: gettext("Enter the number of units of the product ordered.")
	        })]), m("div.line-cell", [m("label", gettext("Unit Price")), renderNumberCell(store, line, line.unitPrice, "unitPrice", canEditPrice), m.component(_utils.HelpPopover, {
	            title: "Unit Price",
	            content: gettext("Enter the regular base price for a single unit of the product. If an existing product is selected, the price is already determined in product settings. Total price will be automatically calculated.")
	        })]), m("div.line-cell", [m("label", gettext("Total Price")), renderNumberCell(store, line, line.total, "total", canEditPrice), m.component(_utils.HelpPopover, {
	            title: "Total Price",
	            content: gettext("Enter the total amount for the line item. Unit price will be automatically calculated.")
	        })])];
	        var productPriceCells = [m("div.line-cell", [m("label", gettext("Qty")), renderNumberCell(store, line, line.quantity, "quantity", canEditPrice, 0), m.component(_utils.HelpPopover, {
	            title: "Quantity",
	            content: gettext("Enter the number of units of the product ordered.")
	        })]), m("div.line-cell", [m("label", gettext("Base Unit Price")), renderNumberCell(store, line, line.baseUnitPrice, "baseUnitPrice", false), m.component(_utils.HelpPopover, {
	            title: "Base Unit Price",
	            content: gettext("Enter the regular base price for a single unit of the product. If an existing product is selected, the price is already determined in product settings.")
	        })]), m("div.line-cell", [m("label", gettext("Discounted Unit Price")), renderNumberCell(store, line, line.unitPrice, "unitPrice", canEditPrice), m.component(_utils.HelpPopover, {
	            title: "Discounted Unit Price",
	            content: gettext("Enter the total discounted price for a single product unit in the order. Discount percent, Total Discount Amount, and Line Total will be automatically calculated.")
	        })]), m("div.line-cell", [m("label", gettext("Discount Percent")), renderNumberCell(store, line, line.discountPercent, "discountPercent", canEditPrice), m.component(_utils.HelpPopover, {
	            title: "Discount Percent",
	            content: gettext("Enter the discount percentage (%) for the line item. Discounted Unit Price, Total Discount Amount, and Line Total will be automatically.")
	        })]), m("div.line-cell", [m("label", gettext("Total Discount Amount")), renderNumberCell(store, line, line.discountAmount, "discountAmount", canEditPrice), m.component(_utils.HelpPopover, {
	            title: "Total Discount Amount",
	            content: gettext("Enter the total discount amount for the line item. Discounted Unit Price, Discount percent, and Line Total will be automatically calculated.")
	        })]), m("div.line-cell", [m("label", gettext("Line Total")), renderNumberCell(store, line, line.total, "total", canEditPrice), m.component(_utils.HelpPopover, {
	            title: "Line Total",
	            content: gettext("Enter the total amount for the line item. Discounted Unit Price, Discount percent, and Total Discount Amount will be automatically calculated.")
	        })])];
	        if (line.type === "product" && line.product) {
	            editCell = m("div.line-cell.edit", m("button.btn.btn-sm.text-info", {
	                onclick: function onclick(e) {
	                    e.preventDefault();
	                    window.open(line.product.url, "_blank");
	                }
	            }, m("i.fa.fa-edit")));
	        }
	        return m("div.list-group-item", [m("div.cells", [m("div.line-cell.line-type-select", [m("label", gettext("Orderline type")), _utils.selectBox(line.type, function () {
	            store.dispatch(_actions.setLineProperty(line.id, "type", this.value));
	            store.dispatch(_actions.updateTotals(store.getState));
	        }, _utils.LINE_TYPES)]), m("div.line-cell", text), editCell, showPrice ? line.type === "product" ? productPriceCells : priceCells : null, m("div.line-cell.delete", m("button.btn.btn-sm.text-danger", {
	            onclick: function onclick() {
	                store.dispatch(_actions.deleteLine(line.id));
	                store.dispatch(_actions.updateTotals(store.getState));
	            }
	        }, m("i.fa.fa-trash")))]), line.errors ? m("p.text-danger", line.errors) : null]);
	    }).compact().value();
	}

	var ProductQuickSelect = {
	    view: function view(ctrl, attrs) {
	        var store = attrs.store;

	        return m.component(_utils.Select2, {
	            name: "product-quick-select",
	            model: "shuup.product",
	            attrs: {
	                placeholder: gettext("Search product by name, SKU, or barcode"),
	                ajax: {
	                    processResults: function processResults(data) {
	                        var _store$getState = store.getState();

	                        var quickAdd = _store$getState.quickAdd;

	                        var results = {
	                            results: $.map(data.results, function (item) {
	                                return { text: item.name, id: item.id };
	                            })
	                        };
	                        if (quickAdd.autoAdd && results.results.length === 1) {
	                            store.dispatch(_actions.setQuickAddProduct(results.results[0]));
	                            store.dispatch(_actions.addProduct(results.results[0]));
	                            store.dispatch(_actions.clearQuickAddProduct());
	                            return { results: [] };
	                        }
	                        return results;
	                    }
	                }
	            },
	            value: function value() {
	                return store.getState().quickAdd.product;
	            },
	            focus: function focus() {
	                return store.getState().quickAdd.autoAdd && store.getState().quickAdd.product.id;
	            },
	            onchange: function onchange(product) {
	                var _store$getState2 = store.getState();

	                var quickAdd = _store$getState2.quickAdd;

	                if (product && product.length && !quickAdd.product.id) {
	                    store.dispatch(_actions.addProduct(product[0]));
	                }
	            }
	        });
	    }
	};

	function orderLinesView(store, isCreating) {
	    var _store$getState3 = store.getState();

	    var lines = _store$getState3.lines;
	    var shop = _store$getState3.shop;
	    var quickAdd = _store$getState3.quickAdd;

	    var infoText = gettext("If your product prices vary based on customer, you might want to select customer first.");
	    if (shop.selected.pricesIncludeTaxes) {
	        infoText += " " + interpolate(gettext("All prices are in %s and include taxes."), [shop.selected.currency]);
	    } else {
	        infoText += " " + interpolate(gettext("All prices are in %s. Taxes not included"), [shop.selected.currency]);
	    }
	    return m("div", [m("p", [m("i.fa.fa-info-circle"), m("span", " " + infoText)]), m("br"), m("br"), m("div.list-group", { id: "lines" }, renderOrderLines(store, shop.selected, lines)), m("hr"), m("div.row", [m("div.col-sm-6", { id: "quick-add" }, [m.component(ProductQuickSelect, { store: store }), m("button.btn.text-success", {
	        href: "#",
	        onclick: function onclick(e) {
	            e.preventDefault();
	            _BrowseAPI2["default"].openBrowseWindow({
	                kind: "product",
	                filter: { "shop": shop.id },
	                onSelect: function onSelect(obj) {
	                    store.dispatch(_actions.addProduct(obj));
	                }
	            });
	        }
	    }, m("i.fa.fa-search")), m.component(_utils.HelpPopover, {
	        title: gettext("Product Quick Adder"),
	        content: gettext("Search for products to add to the order by searching by name, SKU, or barcode or click the magnifying glass for more fine-grained filtering.")
	    }, m("i.fa.fa-search")), m("p.mt-1", [m("input", {
	        name: "auto-add",
	        type: "checkbox",
	        checked: quickAdd.autoAdd,
	        onchange: function onchange() {
	            store.dispatch(_actions.clearQuickAddProduct());
	            store.dispatch(_actions.setAutoAdd(this.checked));
	        }
	    }), m("span.quick-add-check-text", " " + gettext("Automatically add selected product"))])]), m("div.col-sm-6", m("button.btn.text-success.pull-right" + (isCreating ? ".disabled" : ""), {
	        id: "add-line",
	        disabled: isCreating,
	        onclick: function onclick() {
	            store.dispatch(_actions.addLine());
	            if (quickAdd.product.id) {
	                store.dispatch(_actions.retrieveProductData({ id: quickAdd.product.id, forLine: _.last(store.getState().lines).id }));
	            }
	        }
	    }, m("i.fa.fa-plus"), " " + gettext("Add new line")))])]);
		}

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = window.BrowseAPI;

/***/ },
/* 22 */
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
	exports.renderCustomerDetailModal = renderCustomerDetailModal;
	exports.customerSelectView = customerSelectView;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _api = __webpack_require__(18);

	var _actions = __webpack_require__(5);

	var _utils = __webpack_require__(19);

	var _BrowseAPI = __webpack_require__(21);

	var _BrowseAPI2 = _interopRequireDefault(_BrowseAPI);

	function removeWarningBlocks(parentElement) {
	    var previousWarnings = parentElement.getElementsByClassName("duplicate-warning");

	    while (previousWarnings[0]) {
	        previousWarnings[0].parentNode.removeChild(previousWarnings[0]);
	    }
	}

	function buildWarningBlock(store, parentElement, fieldName, customerName, customerId) {
	    var warningBlock = document.createElement("div");
	    warningBlock.className = "duplicate-warning help-block";

	    var warning = document.createElement("div");
	    warning.innerHTML = interpolate(gettext("Customer with same %s already exists."), [fieldName]);
	    warningBlock.appendChild(warning);

	    var link = document.createElement("a");
	    link.href = "#";
	    link.onclick = function () {
	        store.dispatch(_actions.retrieveCustomerData({ id: customerId }));
	        removeWarningBlocks(document);
	    };
	    link.innerHTML = interpolate(gettext("Click to select user %s."), [customerName]);
	    warningBlock.appendChild(link);

	    parentElement.appendChild(warningBlock);
	}

	function renderAddress(store, shop, customer, address, addressType) {
	    return _(_utils.ADDRESS_FIELDS).map(function (field) {
	        var isRequired = field.key === "tax_number" && customer.isCompany ? true : field.required;
	        var helpText = field.helpText.replace("%s", gettext(addressType));
	        if (field.key === "country") {
	            return m("div.form-group" + (isRequired ? " required-field" : ""), [m("label.control-label", field.label), _utils.selectBox(_.get(address, field.key, ""), function () {
	                store.dispatch(_actions.setAddressProperty(addressType, field.key, this.value));
	            }, shop.countries, "id", "name", addressType + "-" + field.key), m.component(_utils.HelpPopover, {
	                title: field.label,
	                content: helpText
	            })]);
	        }
	        var onchange = function onchange() {
	            store.dispatch(_actions.setAddressProperty(addressType, field.key, this.value));
	        };
	        if (field.key === "tax_number" || field.key === "email") {
	            onchange = function () {
	                var _this = this;

	                store.dispatch(_actions.setAddressProperty(addressType, field.key, this.value));
	                _api.get("customer_exists", {
	                    "field": field.key, "value": this.value
	                }).then(function (data) {
	                    removeWarningBlocks(_this.parentElement);
	                    if (data.id && data.id !== customer.id) {
	                        buildWarningBlock(store, _this.parentElement, field.label.toLowerCase(), data.name, data.id);
	                    }
	                });
	            };
	        }
	        if (window.REGIONS) {
	            var country = _.get(address, "country", "");
	            var regionsData = window.REGIONS[country];
	            if (regionsData) {
	                if (field.key === "region_code") {
	                    return m("div.form-group" + (isRequired ? " required-field" : ""), [m("label.control-label", field.label), _utils.selectBox(_.get(address, field.key, ""), onchange, regionsData, "code", "name", addressType + "-" + field.key, { code: "", name: "---------" }), m.component(_utils.HelpPopover, {
	                        title: field.label,
	                        content: helpText
	                    })]);
	                }
	                if (field.key === "region") {
	                    return null;
	                }
	            } else {
	                if (field.key === "region_code") {
	                    return null;
	                }
	            }
	        } else {
	            if (field.key === "region_code") {
	                return null;
	            }
	        }

	        return m("div.form-group" + (isRequired ? " required-field" : ""), [m("label.control-label", field.label), m("input.form-control", {
	            type: "text",
	            name: addressType + "-" + field.key,
	            placeholder: field.label,
	            required: isRequired,
	            value: _.get(address, field.key, ""),
	            onchange: onchange
	        }), m.component(_utils.HelpPopover, {
	            title: field.label,
	            content: helpText
	        })]);
	    }).value();
	}

	function renderCustomerAddressView(store, shop, customer) {
	    return [m("hr"), m("div.form-group", [m("div.inline-checkbox", [m("label", [m("input", {
	        name: "save-address",
	        type: "checkbox",
	        checked: customer.saveAddress,
	        onchange: function onchange() {
	            store.dispatch(_actions.setAddressSavingOption(this.checked));
	        }
	    }), " " + gettext("Save customer details while creating order")]), m.component(_utils.HelpPopover, {
	        content: gettext("Checking this box will save entered customer data to your contacts list.")
	    })]), m("div.inline-checkbox", [m("label", [m("input", {
	        name: "ship-to-billing-address",
	        type: "checkbox",
	        checked: customer.shipToBillingAddress,
	        onchange: function onchange() {
	            store.dispatch(_actions.setShipToBillingAddress(this.checked));
	        }
	    }), " " + gettext("Ship to billing address")]), m.component(_utils.HelpPopover, {
	        content: gettext("Checking this will make the shipping address the same as the billing address.")
	    })]), m("div.inline-checkbox", [m("label", [m("input", {
	        name: "order-for-company",
	        type: "checkbox",
	        checked: customer.isCompany,
	        onchange: function onchange() {
	            store.dispatch(_actions.setIsCompany(this.checked));
	        }
	    }), " " + gettext("Order for company")]), m.component(_utils.HelpPopover, {
	        content: gettext("Check this if the order is for a company or business with a tax ID.")
	    })])]), m("hr"), m("br"), m("br"), m("div.row", [m("div.col-sm-6", m("fieldset", [m("legend", gettext("Billing Address")), m("br"), renderAddress(store, shop, customer, customer.billingAddress, "billing")])), !customer.shipToBillingAddress ? m("div.col-sm-6", m("fieldset", [m("legend", gettext("Shipping Address")), m("br"), renderAddress(store, shop, customer, customer.shippingAddress, "shipping")])) : null])];
	}

	function customerDetailView(customerInfo) {
	    var groups = customerInfo.groups || [];
	    var companies = customerInfo.companies || [];

	    return m("div.row", m("div.col-md-6", m("dl.dl-horizontal", [_utils.infoRow(gettext("Full Name"), customerInfo.name), _utils.infoRow(gettext("Phone"), customerInfo.phone_no), _utils.infoRow(gettext("Email"), customerInfo.email), _utils.infoRow(gettext("Tax Number"), customerInfo.tax_number)])), m("div.col-md-6", m("dl.dl-horizontal", [_utils.infoRow(gettext("Groups"), groups.join(", ")), _utils.infoRow(gettext("Companies"), companies.join(", ")), _utils.infoRow(gettext("Merchant Notes"), customerInfo.merchant_notes)])));
	}

	function orderSummaryView(orderSummary) {
	    var columns = [{ key: "year", label: gettext("Year") }, { key: "total", label: gettext("Total Sales") }];

	    return m("div.table-responsive", _utils.table({
	        tableClass: "table-condensed table-striped",
	        columns: columns,
	        data: orderSummary
	    }));
	}

	function recentOrderView(recentOrders) {
	    var columns = [{ key: "order_date", label: gettext("Date") }, { key: "shipment_status", label: gettext("Shipment Status") }, { key: "payment_status", label: gettext("Payment Status") }, { key: "status", label: gettext("Order Status") }, { key: "total", label: gettext("Total") }];

	    return m("div.table-responsive", _utils.table({
	        tableClass: "table-condensed table-striped",
	        columns: columns,
	        data: recentOrders
	    }));
	}

	function renderCustomerSelectionView(store, customer) {
	    return [m("div.row", [m("div.col-lg-6.col-md-12", { id: "customer-search" }, [m.component(_utils.Select2, {
	        name: "customer-search",
	        model: "shuup.contact",
	        onchange: function onchange(obj) {
	            if (obj.length > 0) {
	                store.dispatch(_actions.retrieveCustomerData({ id: obj[0].id }));
	            }
	        },
	        clear: true,
	        attrs: {
	            placeholder: gettext("Search by name or email")
	        }
	    }), m("a.btn.text-success", {
	        id: "select-existing-customer",
	        onclick: function onclick() {
	            _BrowseAPI2["default"].openBrowseWindow({
	                kind: "contact",
	                clearable: true,
	                onSelect: function onSelect(obj) {
	                    store.dispatch(_actions.retrieveCustomerData({ id: obj.id }));
	                }
	            });
	        }
	    }, m("i.fa.fa-search")), m("button.btn.text-success" + (!customer.id ? ".disabled" : ""), {
	        id: "clear-customer",
	        disabled: !customer.id,
	        onclick: function onclick() {
	            store.dispatch(_actions.clearExistingCustomer());
	        }
	    }, m("i.fa.fa-trash")), m.component(_utils.HelpPopover, {
	        title: gettext("Customer Search"),
	        content: gettext("Search for existing customers by searching by name or email or click the magnifying glass for more fine-grained filtering. Clear the search filter to create an order for a new customer.")
	    })])]), m("div.row", [m("div.col-lg-6.col-md-12.mt-1", { id: "customer-description" }, [customer.id ? m("p.view-details-link", [m("div", gettext("Customer") + ": " + customer.name), m("a[href='#customer-detail-view']", {
	        onclick: function onclick(e) {
	            e.preventDefault();
	            store.dispatch(_actions.retrieveCustomerDetails({ id: customer.id })).then(function () {
	                store.dispatch(_actions.showCustomerModal(true));
	            });
	        }
	    }, gettext("View Details"))]) : m("p", gettext("A new customer will be created based on billing address."))])]), m("br")];
	}

	function renderCustomerDetailModal(store) {
	    var _store$getState = store.getState();

	    var customerDetails = _store$getState.customerDetails;

	    var customerInfo = customerDetails.customerInfo || {};
	    var orderSummary = customerDetails.orderSummary || [];
	    var recentOrders = customerDetails.recentOrders || [];

	    return _utils.modal({
	        show: customerDetails.showCustomerModal,
	        sizeClass: "modal-lg",
	        close: function close() {
	            return store.dispatch(_actions.showCustomerModal(false));
	        },
	        title: m("h3.modal-title", customerInfo.name),
	        body: [_utils.contentBlock("i.fa.fa-info-circle", gettext("Customer Information"), customerDetailView(customerInfo), "h3"), _utils.contentBlock("i.fa.fa-inbox", gettext("Order Summary"), orderSummaryView(orderSummary), "h3"), _utils.contentBlock("i.fa.fa-cubes", gettext("Recent Orders"), recentOrderView(recentOrders), "h3")],
	        footer: [m("button.btn.btn-default", {
	            onclick: function onclick() {
	                return store.dispatch(_actions.showCustomerModal(false));
	            }
	        }, gettext("Close"))]
	    });
	}

	function customerSelectView(store) {
	    var _store$getState2 = store.getState();

	    var customer = _store$getState2.customer;
	    var order = _store$getState2.order;
	    var shop = _store$getState2.shop;

	    return m("div", [!customer.id && order.id !== null ? m("p.text-danger", gettext("Warning: No customer account is currently associated with this order.")) : null, renderCustomerSelectionView(store, customer), renderCustomerAddressView(store, shop, customer, order)]);
		}

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
	exports.shipmentMethodSelectView = shipmentMethodSelectView;
	exports.paymentMethodSelectView = paymentMethodSelectView;

	var _actions = __webpack_require__(5);

	var _utils = __webpack_require__(19);

	function renderMethod(store, mode, title, selectedMethod, choices, emptyChoice, helpText) {
	    return [m("div.form-group", [m("label.control-label", title), _utils.selectBox(selectedMethod ? selectedMethod.id : 0, function () {
	        var newMethod = _.find(choices, { "id": parseInt(this.value) });
	        mode === "shipping" ? store.dispatch(_actions.setShippingMethod(newMethod)) : store.dispatch(_actions.setPaymentMethod(newMethod));
	        store.dispatch(_actions.updateTotals(store.getState));
	    }, [].concat({ id: 0, name: emptyChoice }, choices || []), "id", "name", mode), m.component(_utils.HelpPopover, {
	        title: title,
	        content: helpText
	    })])];
	}

	function shipmentMethodSelectView(store) {
	    var _store$getState = store.getState();

	    var methods = _store$getState.methods;

	    return renderMethod(store, "shipping", gettext("Shipping Method"), methods.shippingMethod, methods.shippingMethodChoices, gettext("No shipping method"), gettext("Select a shipping method for the order. These methods are defined in shipping settings."));
	}

	function paymentMethodSelectView(store) {
	    var _store$getState2 = store.getState();

	    var methods = _store$getState2.methods;

	    return renderMethod(store, "payment", gettext("Payment Method"), methods.paymentMethod, methods.paymentMethodChoices, gettext("No payment method"), gettext("Select a payment method for the order. These methods are defined in payment settings."));
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

	"use strict";

	exports.__esModule = true;
	exports.confirmView = confirmView;
	function renderHeaders() {
	    return m("tr", [m("th", gettext("SKU")), m("th", gettext("Text")), m("th.text-right", gettext("Quantity")), m("th.text-right", gettext("Unit Price")), m("th.text-right", gettext("Discounted Unit Price")), m("th.text-right", gettext("Discount amount")), m("th.text-right", gettext("Discount percent")), m("th.text-right", gettext("Total (excluding taxes)")), m("th.text-right", gettext("Tax percent")), m("th.text-right", gettext("Total"))]);
	}

	function renderLines(lines) {
	    return _(lines).map(function (line) {
	        return m("tr", [m("td", line.sku), m("td", line.text), m("td.text-right", line.quantity), m("td.text-right", line.unitPrice), m("td.text-right", line.discountedUnitPrice), m("td.text-right", line.discountAmount), m("td.text-right", line.discountPercent), m("td.text-right", line.taxlessTotal), m("td.text-right", line.taxPercentage), m("td.text-right", line.taxfulTotal)]);
	    }).value();
	}

	function renderTotals(source) {
	    return m("tr", [m("td", ""), m("td", ""), m("td", ""), m("td", ""), m("td", ""), m("td.text-right", source.totalDiscountAmount), m("td", ""), m("td.text-right", source.taxlessTotal), m("td", ""), m("td.text-right", source.taxfulTotal)]);
	}

	function renderAddress(address) {
	    return _(address).map(function (line, index) {
	        if (index === 0) {
	            return [m("strong", line), m("br")];
	        } else {
	            return [line, m("br")];
	        }
	    }).flatten().value();
	}

	function renderAddressBlock(title, address) {
	    return m("div", m("dl.dl-horizontal", [m("dt", title), m("dd", [m("address", renderAddress(address))])]));
	}

	function confirmView(source) {
	    return [m("div.table-responsive", m("table.table.table-striped", [m("thead", renderHeaders()), m("tbody", [renderLines(source.orderLines), renderTotals(source)])])), m("div.row", [m("div.col-md-6", renderAddressBlock(gettext("Billing address"), source.billingAddress)), m("div.col-md-6", renderAddressBlock(gettext("Shipping address"), source.shippingAddress))])];
		}

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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _redux = __webpack_require__(26);

	var _reduxPersist = __webpack_require__(36);

	var _reducers = __webpack_require__(157);

	var _reducers2 = _interopRequireDefault(_reducers);

	var logger = function logger(_ref) {
	    var getState = _ref.getState;
	    return function (next) {
	        return function (action) {
	            // h/t redux-logger :)
	            var console = window.console;
	            next(action);
	            if (console !== undefined) {
	                console.log("%c Action", "color: #995EEA", action); // eslint-disable-line no-console
	                console.log("%c State", "color: #995EEA", getState()); // eslint-disable-line no-console
	            }
	        };
	    };
	};

	var thunk = function thunk(_ref2) {
	    var dispatch = _ref2.dispatch;
	    var getState = _ref2.getState;

	    // h/t redux-thunk :)
	    return function (next) {
	        return function (action) {
	            return typeof action === "function" ? action(dispatch, getState) : next(action);
	        };
	    };
	};

	var createLoggedStore = _redux.compose(_reduxPersist.autoRehydrate(), _redux.applyMiddleware(thunk, logger))(_redux.createStore);
	var store = createLoggedStore(_reducers2["default"]);

	exports["default"] = store;
	module.exports = exports["default"];

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _createStore = __webpack_require__(27);

	var _createStore2 = _interopRequireDefault(_createStore);

	var _utilsCombineReducers = __webpack_require__(29);

	var _utilsCombineReducers2 = _interopRequireDefault(_utilsCombineReducers);

	var _utilsBindActionCreators = __webpack_require__(33);

	var _utilsBindActionCreators2 = _interopRequireDefault(_utilsBindActionCreators);

	var _utilsApplyMiddleware = __webpack_require__(34);

	var _utilsApplyMiddleware2 = _interopRequireDefault(_utilsApplyMiddleware);

	var _utilsCompose = __webpack_require__(35);

	var _utilsCompose2 = _interopRequireDefault(_utilsCompose);

	exports.createStore = _createStore2['default'];
	exports.combineReducers = _utilsCombineReducers2['default'];
	exports.bindActionCreators = _utilsBindActionCreators2['default'];
	exports.applyMiddleware = _utilsApplyMiddleware2['default'];
	exports.compose = _utilsCompose2['default'];

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = createStore;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utilsIsPlainObject = __webpack_require__(28);

	var _utilsIsPlainObject2 = _interopRequireDefault(_utilsIsPlainObject);

	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = {
	  INIT: '@@redux/INIT'
	};

	exports.ActionTypes = ActionTypes;
	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [initialState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */

	function createStore(reducer, initialState) {
	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }

	  var currentReducer = reducer;
	  var currentState = initialState;
	  var listeners = [];
	  var isDispatching = false;

	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    return currentState;
	  }

	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    listeners.push(listener);
	    var isSubscribed = true;

	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }

	      isSubscribed = false;
	      var index = listeners.indexOf(listener);
	      listeners.splice(index, 1);
	    };
	  }

	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!_utilsIsPlainObject2['default'](action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }

	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }

	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }

	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }

	    listeners.slice().forEach(function (listener) {
	      return listener();
	    });
	    return action;
	  }

	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.INIT });
	  }

	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });

	  return {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  };
	}

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = isPlainObject;
	var fnToString = function fnToString(fn) {
	  return Function.prototype.toString.call(fn);
	};
	var objStringValue = fnToString(Object);

	/**
	 * @param {any} obj The object to inspect.
	 * @returns {boolean} True if the argument appears to be a plain object.
	 */

	function isPlainObject(obj) {
	  if (!obj || typeof obj !== 'object') {
	    return false;
	  }

	  var proto = typeof obj.constructor === 'function' ? Object.getPrototypeOf(obj) : Object.prototype;

	  if (proto === null) {
	    return true;
	  }

	  var constructor = proto.constructor;

	  return typeof constructor === 'function' && constructor instanceof constructor && fnToString(constructor) === objStringValue;
	}

	module.exports = exports['default'];

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	exports.__esModule = true;
	exports['default'] = combineReducers;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _createStore = __webpack_require__(27);

	var _isPlainObject = __webpack_require__(28);

	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

	var _mapValues = __webpack_require__(31);

	var _mapValues2 = _interopRequireDefault(_mapValues);

	var _pick = __webpack_require__(32);

	var _pick2 = _interopRequireDefault(_pick);

	/* eslint-disable no-console */

	function getUndefinedStateErrorMessage(key, action) {
	  var actionType = action && action.type;
	  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

	  return 'Reducer "' + key + '" returned undefined handling ' + actionName + '. ' + 'To ignore an action, you must explicitly return the previous state.';
	}

	function getUnexpectedStateKeyWarningMessage(inputState, outputState, action) {
	  var reducerKeys = Object.keys(outputState);
	  var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

	  if (reducerKeys.length === 0) {
	    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
	  }

	  if (!_isPlainObject2['default'](inputState)) {
	    return 'The ' + argumentName + ' has unexpected type of "' + ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
	  }

	  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	    return reducerKeys.indexOf(key) < 0;
	  });

	  if (unexpectedKeys.length > 0) {
	    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
	  }
	}

	function assertReducerSanity(reducers) {
	  Object.keys(reducers).forEach(function (key) {
	    var reducer = reducers[key];
	    var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

	    if (typeof initialState === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
	    }

	    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
	    if (typeof reducer(undefined, { type: type }) === 'undefined') {
	      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
	    }
	  });
	}

	/**
	 * Turns an object whose values are different reducer functions, into a single
	 * reducer function. It will call every child reducer, and gather their results
	 * into a single state object, whose keys correspond to the keys of the passed
	 * reducer functions.
	 *
	 * @param {Object} reducers An object whose values correspond to different
	 * reducer functions that need to be combined into one. One handy way to obtain
	 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
	 * undefined for any action. Instead, they should return their initial state
	 * if the state passed to them was undefined, and the current state for any
	 * unrecognized action.
	 *
	 * @returns {Function} A reducer function that invokes every reducer inside the
	 * passed object, and builds a state object with the same shape.
	 */

	function combineReducers(reducers) {
	  var finalReducers = _pick2['default'](reducers, function (val) {
	    return typeof val === 'function';
	  });
	  var sanityError;

	  try {
	    assertReducerSanity(finalReducers);
	  } catch (e) {
	    sanityError = e;
	  }

	  var defaultState = _mapValues2['default'](finalReducers, function () {
	    return undefined;
	  });

	  return function combination(state, action) {
	    if (state === undefined) state = defaultState;

	    if (sanityError) {
	      throw sanityError;
	    }

	    var hasChanged = false;
	    var finalState = _mapValues2['default'](finalReducers, function (reducer, key) {
	      var previousStateForKey = state[key];
	      var nextStateForKey = reducer(previousStateForKey, action);
	      if (typeof nextStateForKey === 'undefined') {
	        var errorMessage = getUndefinedStateErrorMessage(key, action);
	        throw new Error(errorMessage);
	      }
	      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
	      return nextStateForKey;
	    });

	    if (process.env.NODE_ENV !== 'production') {
	      var warningMessage = getUnexpectedStateKeyWarningMessage(state, finalState, action);
	      if (warningMessage) {
	        console.error(warningMessage);
	      }
	    }

	    return hasChanged ? finalState : state;
	  };
	}

	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(30)))

/***/ },
/* 30 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 31 */
/***/ function(module, exports) {

	/**
	 * Applies a function to every key-value pair inside an object.
	 *
	 * @param {Object} obj The source object.
	 * @param {Function} fn The mapper function that receives the value and the key.
	 * @returns {Object} A new object that contains the mapped values for the keys.
	 */
	"use strict";

	exports.__esModule = true;
	exports["default"] = mapValues;

	function mapValues(obj, fn) {
	  return Object.keys(obj).reduce(function (result, key) {
	    result[key] = fn(obj[key], key);
	    return result;
	  }, {});
	}

	module.exports = exports["default"];

/***/ },
/* 32 */
/***/ function(module, exports) {

	/**
	 * Picks key-value pairs from an object where values satisfy a predicate.
	 *
	 * @param {Object} obj The object to pick from.
	 * @param {Function} fn The predicate the values must satisfy to be copied.
	 * @returns {Object} The object with the values that satisfied the predicate.
	 */
	"use strict";

	exports.__esModule = true;
	exports["default"] = pick;

	function pick(obj, fn) {
	  return Object.keys(obj).reduce(function (result, key) {
	    if (fn(obj[key])) {
	      result[key] = obj[key];
	    }
	    return result;
	  }, {});
	}

	module.exports = exports["default"];

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = bindActionCreators;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _mapValues = __webpack_require__(31);

	var _mapValues2 = _interopRequireDefault(_mapValues);

	function bindActionCreator(actionCreator, dispatch) {
	  return function () {
	    return dispatch(actionCreator.apply(undefined, arguments));
	  };
	}

	/**
	 * Turns an object whose values are action creators, into an object with the
	 * same keys, but with every function wrapped into a `dispatch` call so they
	 * may be invoked directly. This is just a convenience method, as you can call
	 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
	 *
	 * For convenience, you can also pass a single function as the first argument,
	 * and get a function in return.
	 *
	 * @param {Function|Object} actionCreators An object whose values are action
	 * creator functions. One handy way to obtain it is to use ES6 `import * as`
	 * syntax. You may also pass a single function.
	 *
	 * @param {Function} dispatch The `dispatch` function available on your Redux
	 * store.
	 *
	 * @returns {Function|Object} The object mimicking the original object, but with
	 * every action creator wrapped into the `dispatch` call. If you passed a
	 * function as `actionCreators`, the return value will also be a single
	 * function.
	 */

	function bindActionCreators(actionCreators, dispatch) {
	  if (typeof actionCreators === 'function') {
	    return bindActionCreator(actionCreators, dispatch);
	  }

	  if (typeof actionCreators !== 'object' || actionCreators === null || actionCreators === undefined) {
	    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
	  }

	  return _mapValues2['default'](actionCreators, function (actionCreator) {
	    return bindActionCreator(actionCreator, dispatch);
	  });
	}

	module.exports = exports['default'];

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports['default'] = applyMiddleware;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _compose = __webpack_require__(35);

	var _compose2 = _interopRequireDefault(_compose);

	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */

	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }

	  return function (next) {
	    return function (reducer, initialState) {
	      var store = next(reducer, initialState);
	      var _dispatch = store.dispatch;
	      var chain = [];

	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch(action) {
	          return _dispatch(action);
	        }
	      };
	      chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = _compose2['default'].apply(undefined, chain)(store.dispatch);

	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 35 */
/***/ function(module, exports) {

	/**
	 * Composes single-argument functions from right to left.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing functions from right to
	 * left. For example, compose(f, g, h) is identical to arg => f(g(h(arg))).
	 */
	"use strict";

	exports.__esModule = true;
	exports["default"] = compose;

	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }

	  return function (arg) {
	    return funcs.reduceRight(function (composed, f) {
	      return f(composed);
	    }, arg);
	  };
	}

	module.exports = exports["default"];

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.storages = exports.persistStore = exports.getStoredState = exports.createTransform = exports.createPersistor = exports.autoRehydrate = undefined;

	var _autoRehydrate = __webpack_require__(37);

	var _autoRehydrate2 = _interopRequireDefault(_autoRehydrate);

	var _createPersistor = __webpack_require__(43);

	var _createPersistor2 = _interopRequireDefault(_createPersistor);

	var _createTransform = __webpack_require__(154);

	var _createTransform2 = _interopRequireDefault(_createTransform);

	var _getStoredState = __webpack_require__(155);

	var _getStoredState2 = _interopRequireDefault(_getStoredState);

	var _persistStore = __webpack_require__(156);

	var _persistStore2 = _interopRequireDefault(_persistStore);

	var _asyncLocalStorage = __webpack_require__(151);

	var _asyncLocalStorage2 = _interopRequireDefault(_asyncLocalStorage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var storages = {
	  asyncLocalStorage: (0, _asyncLocalStorage2.default)('local'),
	  asyncSessionStorage: (0, _asyncLocalStorage2.default)('session')
	};

	exports.autoRehydrate = _autoRehydrate2.default;
	exports.createPersistor = _createPersistor2.default;
	exports.createTransform = _createTransform2.default;
	exports.getStoredState = _getStoredState2.default;
	exports.persistStore = _persistStore2.default;
	exports.storages = storages;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _isPlainObject2 = __webpack_require__(38);

	var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.default = autoRehydrate;

	var _constants = __webpack_require__(42);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function autoRehydrate() {
	  var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  return function (next) {
	    return function (reducer, initialState, enhancer) {
	      return next(createRehydrationReducer(reducer), initialState, enhancer);
	    };
	  };

	  function createRehydrationReducer(reducer) {
	    var rehydrated = false;
	    var preRehydrateActions = [];
	    return function (state, action) {
	      if (action.type !== _constants.REHYDRATE) {
	        if (config.log && !rehydrated) preRehydrateActions.push(action); // store pre-rehydrate actions for debugging
	        return reducer(state, action);
	      } else {
	        var _ret = function () {
	          if (config.log && !rehydrated) logPreRehydrate(preRehydrateActions);
	          rehydrated = true;

	          var inboundState = action.payload;
	          var reducedState = reducer(state, action);
	          var newState = _extends({}, reducedState);

	          Object.keys(inboundState).forEach(function (key) {
	            // if initialState does not have key, skip auto rehydration
	            if (!state.hasOwnProperty(key)) return;

	            // if reducer modifies substate, skip auto rehydration
	            if (state[key] !== reducedState[key]) {
	              if (config.log) console.log('redux-persist/autoRehydrate: sub state for key `%s` modified, skipping autoRehydrate.', key);
	              newState[key] = reducedState[key];
	              return;
	            }

	            // otherwise take the inboundState
	            if (checkIfPlain(inboundState[key], reducedState[key])) newState[key] = _extends({}, state[key], inboundState[key]); // shallow merge
	            else newState[key] = inboundState[key]; // hard set

	            if (config.log) console.log('redux-persist/autoRehydrate: key `%s`, rehydrated to ', key, newState[key]);
	          });
	          return {
	            v: newState
	          };
	        }();

	        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	      }
	    };
	  }
	}

	function checkIfPlain(a, b) {
	  // isPlainObject + duck type not immutable
	  if (!a || !b) return false;
	  if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== 'object' || (typeof b === 'undefined' ? 'undefined' : _typeof(b)) !== 'object') return false;
	  if (typeof a.mergeDeep === 'function' || typeof b.mergeDeep === 'function') return false;
	  if (!(0, _isPlainObject3.default)(a) || !(0, _isPlainObject3.default)(b)) return false;
	  return true;
	}

	function logPreRehydrate(preRehydrateActions) {
	  if (preRehydrateActions.length > 0) {
	    console.log('\n      redux-persist/autoRehydrate: %d actions were fired before rehydration completed. This can be a symptom of a race\n      condition where the rehydrate action may overwrite the previously affected state. Consider running these actions\n      after rehydration:\n    ', preRehydrateActions);
	  }
	}

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var getPrototype = __webpack_require__(39),
	    isHostObject = __webpack_require__(40),
	    isObjectLike = __webpack_require__(41);

	/** `Object#toString` result references. */
	var objectTag = '[object Object]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object,
	 *  else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) ||
	      objectToString.call(value) != objectTag || isHostObject(value)) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return (typeof Ctor == 'function' &&
	    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
	}

	module.exports = isPlainObject;


/***/ },
/* 39 */
/***/ function(module, exports) {

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetPrototype = Object.getPrototypeOf;

	/**
	 * Gets the `[[Prototype]]` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {null|Object} Returns the `[[Prototype]]`.
	 */
	function getPrototype(value) {
	  return nativeGetPrototype(Object(value));
	}

	module.exports = getPrototype;


/***/ },
/* 40 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}

	module.exports = isHostObject;


/***/ },
/* 41 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isObjectLike;


/***/ },
/* 42 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var keyPrefix = exports.keyPrefix = 'reduxPersist:';
	var REHYDRATE = exports.REHYDRATE = 'persist/REHYDRATE';
	var REHYDRATE_ERROR = exports.REHYDRATE_ERROR = 'persist/REHYDRATE_ERROR';

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _forEach2 = __webpack_require__(44);

	var _forEach3 = _interopRequireDefault(_forEach2);

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.default = createPersistor;

	var _constants = __webpack_require__(42);

	var constants = _interopRequireWildcard(_constants);

	var _asyncLocalStorage = __webpack_require__(151);

	var _asyncLocalStorage2 = _interopRequireDefault(_asyncLocalStorage);

	var _jsonStringifySafe = __webpack_require__(153);

	var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function createPersistor(store, config) {
	  // defaults
	  var serialize = config.serialize || defaultSerialize;
	  var deserialize = config.deserialize || defaultDeserialize;
	  var blacklist = config.blacklist || [];
	  var whitelist = config.whitelist || false;
	  var transforms = config.transforms || [];
	  var debounce = config.debounce || false;
	  var storage = config.storage || (0, _asyncLocalStorage2.default)('local');

	  // fallback getAllKeys to `keys` if present (LocalForage compatability)
	  if (storage.keys && !storage.getAllKeys) storage = _extends({}, storage, { getAllKeys: storage.keys });

	  // initialize stateful values
	  var lastState = {};
	  var paused = false;
	  var purgeMode = false;
	  var storesToProcess = [];
	  var timeIterator = null;

	  store.subscribe(function () {
	    if (paused) return;

	    var state = store.getState();
	    (0, _forEach3.default)(state, function (subState, key) {
	      if (whitelistBlacklistCheck(key)) return;
	      if (lastState[key] === state[key]) return;
	      if (storesToProcess.indexOf(key) !== -1) return;
	      storesToProcess.push(key);
	    });

	    // time iterator (read: debounce)
	    if (timeIterator === null) {
	      timeIterator = setInterval(function () {
	        if (storesToProcess.length === 0) {
	          clearInterval(timeIterator);
	          timeIterator = null;
	          return;
	        }

	        var key = storesToProcess[0];
	        var storageKey = createStorageKey(key);
	        var endState = transforms.reduce(function (subState, transformer) {
	          return transformer.in(subState, key);
	        }, store.getState()[storesToProcess[0]]);
	        if (typeof endState !== 'undefined') storage.setItem(storageKey, serialize(endState), warnIfSetError(key));
	        storesToProcess.shift();
	      }, debounce);
	    }

	    lastState = state;
	  });

	  function whitelistBlacklistCheck(key) {
	    if (whitelist && whitelist.indexOf(key) === -1) return true;
	    if (blacklist.indexOf(key) !== -1) return true;
	    return false;
	  }

	  function adhocRehydrate(incoming) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var state = {};
	    if (options.serial) {
	      (0, _forEach3.default)(incoming, function (subState, key) {
	        try {
	          var data = deserialize(subState);
	          state[key] = transforms.reduceRight(function (interState, transformer) {
	            return transformer.out(interState, key);
	          }, data);
	        } catch (err) {
	          if (process.env.NODE_ENV !== 'production') console.warn('Error rehydrating data for key "' + key + '"', subState, err);
	        }
	      });
	    } else state = incoming;

	    store.dispatch(rehydrateAction(state));
	    return state;
	  }

	  function purge(keys) {
	    purgeMode = keys;
	    (0, _forEach3.default)(keys, function (key) {
	      storage.removeItem(createStorageKey(key), warnIfRemoveError(key));
	    });
	  }

	  function purgeAll() {
	    purgeMode = '*';
	    storage.getAllKeys(function (err, allKeys) {
	      if (err && process.env.NODE_ENV !== 'production') {
	        console.warn('Error in storage.getAllKeys');
	      }
	      purge(allKeys.filter(function (key) {
	        return key.indexOf(constants.keyPrefix) === 0;
	      }).map(function (key) {
	        return key.slice(constants.keyPrefix.length);
	      }));
	    });
	  }

	  // return `persistor`
	  return {
	    rehydrate: adhocRehydrate,
	    pause: function pause() {
	      paused = true;
	    },
	    resume: function resume() {
	      paused = false;
	    },
	    purge: purge,
	    purgeAll: purgeAll,
	    _getPurgeMode: function _getPurgeMode() {
	      return purgeMode;
	    }
	  };
	}

	function warnIfRemoveError(key) {
	  return function removeError(err) {
	    if (err && process.env.NODE_ENV !== 'production') {
	      console.warn('Error storing data for key:', key, err);
	    }
	  };
	}

	function warnIfSetError(key) {
	  return function setError(err) {
	    if (err && process.env.NODE_ENV !== 'production') {
	      console.warn('Error storing data for key:', key, err);
	    }
	  };
	}

	function createStorageKey(key) {
	  return constants.keyPrefix + key;
	}

	function defaultSerialize(data) {
	  return (0, _jsonStringifySafe2.default)(data, null, null, function (k, v) {
	    if (process.env.NODE_ENV !== 'production') return null;
	    throw new Error('\n      redux-persist: cannot process cyclical state.\n      Consider changing your state structure to have no cycles.\n      Alternatively blacklist the corresponding reducer key.\n      Cycle encounted at key "' + k + '" with value "' + v + '".\n    ');
	  });
	}

	function defaultDeserialize(serial) {
	  return JSON.parse(serial);
	}

	function rehydrateAction(data) {
	  return {
	    type: constants.REHYDRATE,
	    payload: data
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(30)))

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var arrayEach = __webpack_require__(45),
	    baseEach = __webpack_require__(46),
	    baseIteratee = __webpack_require__(68),
	    isArray = __webpack_require__(63);

	/**
	 * Iterates over elements of `collection` and invokes `iteratee` for each element.
	 * The iteratee is invoked with three arguments: (value, index|key, collection).
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * **Note:** As with other "Collections" methods, objects with a "length"
	 * property are iterated like arrays. To avoid this behavior use `_.forIn`
	 * or `_.forOwn` for object iteration.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @alias each
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @returns {Array|Object} Returns `collection`.
	 * @see _.forEachRight
	 * @example
	 *
	 * _([1, 2]).forEach(function(value) {
	 *   console.log(value);
	 * });
	 * // => Logs `1` then `2`.
	 *
	 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
	 *   console.log(key);
	 * });
	 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
	 */
	function forEach(collection, iteratee) {
	  var func = isArray(collection) ? arrayEach : baseEach;
	  return func(collection, baseIteratee(iteratee, 3));
	}

	module.exports = forEach;


/***/ },
/* 45 */
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.forEach` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array.length;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	module.exports = arrayEach;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var baseForOwn = __webpack_require__(47),
	    createBaseEach = __webpack_require__(67);

	/**
	 * The base implementation of `_.forEach` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object} Returns `collection`.
	 */
	var baseEach = createBaseEach(baseForOwn);

	module.exports = baseEach;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(48),
	    keys = __webpack_require__(50);

	/**
	 * The base implementation of `_.forOwn` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return object && baseFor(object, iteratee, keys);
	}

	module.exports = baseForOwn;


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(49);

	/**
	 * The base implementation of `baseForOwn` which iterates over `object`
	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();

	module.exports = baseFor;


/***/ },
/* 49 */
/***/ function(module, exports) {

	/**
	 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;

	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	module.exports = createBaseFor;


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var baseHas = __webpack_require__(51),
	    baseKeys = __webpack_require__(52),
	    indexKeys = __webpack_require__(53),
	    isArrayLike = __webpack_require__(57),
	    isIndex = __webpack_require__(65),
	    isPrototype = __webpack_require__(66);

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  var isProto = isPrototype(object);
	  if (!(isProto || isArrayLike(object))) {
	    return baseKeys(object);
	  }
	  var indexes = indexKeys(object),
	      skipIndexes = !!indexes,
	      result = indexes || [],
	      length = result.length;

	  for (var key in object) {
	    if (baseHas(object, key) &&
	        !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
	        !(isProto && key == 'constructor')) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = keys;


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var getPrototype = __webpack_require__(39);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * The base implementation of `_.has` without support for deep paths.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHas(object, key) {
	  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
	  // that are composed entirely of index properties, return `false` for
	  // `hasOwnProperty` checks of them.
	  return hasOwnProperty.call(object, key) ||
	    (typeof object == 'object' && key in object && getPrototype(object) === null);
	}

	module.exports = baseHas;


/***/ },
/* 52 */
/***/ function(module, exports) {

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = Object.keys;

	/**
	 * The base implementation of `_.keys` which doesn't skip the constructor
	 * property of prototypes or treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  return nativeKeys(Object(object));
	}

	module.exports = baseKeys;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var baseTimes = __webpack_require__(54),
	    isArguments = __webpack_require__(55),
	    isArray = __webpack_require__(63),
	    isLength = __webpack_require__(62),
	    isString = __webpack_require__(64);

	/**
	 * Creates an array of index keys for `object` values of arrays,
	 * `arguments` objects, and strings, otherwise `null` is returned.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array|null} Returns index keys, else `null`.
	 */
	function indexKeys(object) {
	  var length = object ? object.length : undefined;
	  if (isLength(length) &&
	      (isArray(object) || isString(object) || isArguments(object))) {
	    return baseTimes(length, String);
	  }
	  return null;
	}

	module.exports = indexKeys;


/***/ },
/* 54 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	module.exports = baseTimes;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLikeObject = __webpack_require__(56);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}

	module.exports = isArguments;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(57),
	    isObjectLike = __webpack_require__(41);

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}

	module.exports = isArrayLikeObject;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(58),
	    isFunction = __webpack_require__(60),
	    isLength = __webpack_require__(62);

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value)) && !isFunction(value);
	}

	module.exports = isArrayLike;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(59);

	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a
	 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
	 * Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');

	module.exports = getLength;


/***/ },
/* 59 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	module.exports = baseProperty;


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(61);

	/** `Object#toString` result references. */
	var funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array and weak map constructors,
	  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	module.exports = isFunction;


/***/ },
/* 61 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = isObject;


/***/ },
/* 62 */
/***/ function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length,
	 *  else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	module.exports = isLength;


/***/ },
/* 63 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @type {Function}
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	module.exports = isArray;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(63),
	    isObjectLike = __webpack_require__(41);

	/** `Object#toString` result references. */
	var stringTag = '[object String]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' ||
	    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
	}

	module.exports = isString;


/***/ },
/* 65 */
/***/ function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}

	module.exports = isIndex;


/***/ },
/* 66 */
/***/ function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

	  return value === proto;
	}

	module.exports = isPrototype;


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(57);

	/**
	 * Creates a `baseEach` or `baseEachRight` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseEach(eachFunc, fromRight) {
	  return function(collection, iteratee) {
	    if (collection == null) {
	      return collection;
	    }
	    if (!isArrayLike(collection)) {
	      return eachFunc(collection, iteratee);
	    }
	    var length = collection.length,
	        index = fromRight ? length : -1,
	        iterable = Object(collection);

	    while ((fromRight ? index-- : ++index < length)) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  };
	}

	module.exports = createBaseEach;


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var baseMatches = __webpack_require__(69),
	    baseMatchesProperty = __webpack_require__(134),
	    identity = __webpack_require__(148),
	    isArray = __webpack_require__(63),
	    property = __webpack_require__(149);

	/**
	 * The base implementation of `_.iteratee`.
	 *
	 * @private
	 * @param {*} [value=_.identity] The value to convert to an iteratee.
	 * @returns {Function} Returns the iteratee.
	 */
	function baseIteratee(value) {
	  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
	  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
	  if (typeof value == 'function') {
	    return value;
	  }
	  if (value == null) {
	    return identity;
	  }
	  if (typeof value == 'object') {
	    return isArray(value)
	      ? baseMatchesProperty(value[0], value[1])
	      : baseMatches(value);
	  }
	  return property(value);
	}

	module.exports = baseIteratee;


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsMatch = __webpack_require__(70),
	    getMatchData = __webpack_require__(126),
	    matchesStrictComparable = __webpack_require__(133);

	/**
	 * The base implementation of `_.matches` which doesn't clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function baseMatches(source) {
	  var matchData = getMatchData(source);
	  if (matchData.length == 1 && matchData[0][2]) {
	    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
	  }
	  return function(object) {
	    return object === source || baseIsMatch(object, source, matchData);
	  };
	}

	module.exports = baseMatches;


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var Stack = __webpack_require__(71),
	    baseIsEqual = __webpack_require__(107);

	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;

	/**
	 * The base implementation of `_.isMatch` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Object} source The object of property values to match.
	 * @param {Array} matchData The property names, values, and compare flags to match.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, source, matchData, customizer) {
	  var index = matchData.length,
	      length = index,
	      noCustomizer = !customizer;

	  if (object == null) {
	    return !length;
	  }
	  object = Object(object);
	  while (index--) {
	    var data = matchData[index];
	    if ((noCustomizer && data[2])
	          ? data[1] !== object[data[0]]
	          : !(data[0] in object)
	        ) {
	      return false;
	    }
	  }
	  while (++index < length) {
	    data = matchData[index];
	    var key = data[0],
	        objValue = object[key],
	        srcValue = data[1];

	    if (noCustomizer && data[2]) {
	      if (objValue === undefined && !(key in object)) {
	        return false;
	      }
	    } else {
	      var stack = new Stack;
	      if (customizer) {
	        var result = customizer(objValue, srcValue, key, object, source, stack);
	      }
	      if (!(result === undefined
	            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
	            : result
	          )) {
	        return false;
	      }
	    }
	  }
	  return true;
	}

	module.exports = baseIsMatch;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var ListCache = __webpack_require__(72),
	    stackClear = __webpack_require__(80),
	    stackDelete = __webpack_require__(81),
	    stackGet = __webpack_require__(82),
	    stackHas = __webpack_require__(83),
	    stackSet = __webpack_require__(84);

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  this.__data__ = new ListCache(entries);
	}

	// Add methods to `Stack`.
	Stack.prototype.clear = stackClear;
	Stack.prototype['delete'] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;

	module.exports = Stack;


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var listCacheClear = __webpack_require__(73),
	    listCacheDelete = __webpack_require__(74),
	    listCacheGet = __webpack_require__(77),
	    listCacheHas = __webpack_require__(78),
	    listCacheSet = __webpack_require__(79);

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;

	module.exports = ListCache;


/***/ },
/* 73 */
/***/ function(module, exports) {

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	}

	module.exports = listCacheClear;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(75);

	/** Used for built-in method references. */
	var arrayProto = Array.prototype;

	/** Built-in value references. */
	var splice = arrayProto.splice;

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  return true;
	}

	module.exports = listCacheDelete;


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(76);

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	module.exports = assocIndexOf;


/***/ },
/* 76 */
/***/ function(module, exports) {

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 * var other = { 'user': 'fred' };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	module.exports = eq;


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(75);

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	module.exports = listCacheGet;


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(75);

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}

	module.exports = listCacheHas;


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(75);

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	module.exports = listCacheSet;


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	var ListCache = __webpack_require__(72);

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new ListCache;
	}

	module.exports = stackClear;


/***/ },
/* 81 */
/***/ function(module, exports) {

	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  return this.__data__['delete'](key);
	}

	module.exports = stackDelete;


/***/ },
/* 82 */
/***/ function(module, exports) {

	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  return this.__data__.get(key);
	}

	module.exports = stackGet;


/***/ },
/* 83 */
/***/ function(module, exports) {

	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  return this.__data__.has(key);
	}

	module.exports = stackHas;


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var ListCache = __webpack_require__(72),
	    MapCache = __webpack_require__(85);

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var cache = this.__data__;
	  if (cache instanceof ListCache && cache.__data__.length == LARGE_ARRAY_SIZE) {
	    cache = this.__data__ = new MapCache(cache.__data__);
	  }
	  cache.set(key, value);
	  return this;
	}

	module.exports = stackSet;


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var mapCacheClear = __webpack_require__(86),
	    mapCacheDelete = __webpack_require__(101),
	    mapCacheGet = __webpack_require__(104),
	    mapCacheHas = __webpack_require__(105),
	    mapCacheSet = __webpack_require__(106);

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;

	module.exports = MapCache;


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var Hash = __webpack_require__(87),
	    ListCache = __webpack_require__(72),
	    Map = __webpack_require__(97);

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}

	module.exports = mapCacheClear;


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var hashClear = __webpack_require__(88),
	    hashDelete = __webpack_require__(93),
	    hashGet = __webpack_require__(94),
	    hashHas = __webpack_require__(95),
	    hashSet = __webpack_require__(96);

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;

	module.exports = Hash;


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(89);

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	}

	module.exports = hashClear;


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(90);

	/* Built-in method references that are verified to be native. */
	var nativeCreate = getNative(Object, 'create');

	module.exports = nativeCreate;


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(91);

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object[key];
	  return isNative(value) ? value : undefined;
	}

	module.exports = getNative;


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(60),
	    isHostObject = __webpack_require__(40),
	    isObject = __webpack_require__(61),
	    toSource = __webpack_require__(92);

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (!isObject(value)) {
	    return false;
	  }
	  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}

	module.exports = isNative;


/***/ },
/* 92 */
/***/ function(module, exports) {

	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to process.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	module.exports = toSource;


/***/ },
/* 93 */
/***/ function(module, exports) {

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  return this.has(key) && delete this.__data__[key];
	}

	module.exports = hashDelete;


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(89);

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}

	module.exports = hashGet;


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(89);

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
	}

	module.exports = hashHas;


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	var nativeCreate = __webpack_require__(89);

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}

	module.exports = hashSet;


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(90),
	    root = __webpack_require__(98);

	/* Built-in method references that are verified to be native. */
	var Map = getNative(root, 'Map');

	module.exports = Map;


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {var checkGlobal = __webpack_require__(100);

	/** Used to determine if values are of the language type `Object`. */
	var objectTypes = {
	  'function': true,
	  'object': true
	};

	/** Detect free variable `exports`. */
	var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
	  ? exports
	  : undefined;

	/** Detect free variable `module`. */
	var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
	  ? module
	  : undefined;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

	/** Detect free variable `self`. */
	var freeSelf = checkGlobal(objectTypes[typeof self] && self);

	/** Detect free variable `window`. */
	var freeWindow = checkGlobal(objectTypes[typeof window] && window);

	/** Detect `this` as the global object. */
	var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

	/**
	 * Used as a reference to the global object.
	 *
	 * The `this` value is used if it's the global object to avoid Greasemonkey's
	 * restricted `window` object, otherwise the `window` object is used.
	 */
	var root = freeGlobal ||
	  ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
	    freeSelf || thisGlobal || Function('return this')();

	module.exports = root;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(99)(module), (function() { return this; }())))

/***/ },
/* 99 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 100 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a global object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
	 */
	function checkGlobal(value) {
	  return (value && value.Object === Object) ? value : null;
	}

	module.exports = checkGlobal;


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(102);

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  return getMapData(this, key)['delete'](key);
	}

	module.exports = mapCacheDelete;


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	var isKeyable = __webpack_require__(103);

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	module.exports = getMapData;


/***/ },
/* 103 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	module.exports = isKeyable;


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(102);

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return getMapData(this, key).get(key);
	}

	module.exports = mapCacheGet;


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(102);

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return getMapData(this, key).has(key);
	}

	module.exports = mapCacheHas;


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	var getMapData = __webpack_require__(102);

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  getMapData(this, key).set(key, value);
	  return this;
	}

	module.exports = mapCacheSet;


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqualDeep = __webpack_require__(108),
	    isObject = __webpack_require__(61),
	    isObjectLike = __webpack_require__(41);

	/**
	 * The base implementation of `_.isEqual` which supports partial comparisons
	 * and tracks traversed objects.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {boolean} [bitmask] The bitmask of comparison flags.
	 *  The bitmask may be composed of the following flags:
	 *     1 - Unordered comparison
	 *     2 - Partial comparison
	 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, bitmask, stack) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
	}

	module.exports = baseIsEqual;


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	var Stack = __webpack_require__(71),
	    equalArrays = __webpack_require__(109),
	    equalByTag = __webpack_require__(114),
	    equalObjects = __webpack_require__(119),
	    getTag = __webpack_require__(120),
	    isArray = __webpack_require__(63),
	    isHostObject = __webpack_require__(40),
	    isTypedArray = __webpack_require__(125);

	/** Used to compose bitmasks for comparison styles. */
	var PARTIAL_COMPARE_FLAG = 2;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    objectTag = '[object Object]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;

	  if (!objIsArr) {
	    objTag = getTag(object);
	    objTag = objTag == argsTag ? objectTag : objTag;
	  }
	  if (!othIsArr) {
	    othTag = getTag(other);
	    othTag = othTag == argsTag ? objectTag : othTag;
	  }
	  var objIsObj = objTag == objectTag && !isHostObject(object),
	      othIsObj = othTag == objectTag && !isHostObject(other),
	      isSameTag = objTag == othTag;

	  if (isSameTag && !objIsObj) {
	    stack || (stack = new Stack);
	    return (objIsArr || isTypedArray(object))
	      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
	      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
	  }
	  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	    if (objIsWrapped || othIsWrapped) {
	      var objUnwrapped = objIsWrapped ? object.value() : object,
	          othUnwrapped = othIsWrapped ? other.value() : other;

	      stack || (stack = new Stack);
	      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  stack || (stack = new Stack);
	  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
	}

	module.exports = baseIsEqualDeep;


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	var SetCache = __webpack_require__(110),
	    arraySome = __webpack_require__(113);

	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} stack Tracks traversed `array` and `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
	  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	      arrLength = array.length,
	      othLength = other.length;

	  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(array);
	  if (stacked) {
	    return stacked == other;
	  }
	  var index = -1,
	      result = true,
	      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

	  stack.set(array, other);

	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, arrValue, index, other, array, stack)
	        : customizer(arrValue, othValue, index, array, other, stack);
	    }
	    if (compared !== undefined) {
	      if (compared) {
	        continue;
	      }
	      result = false;
	      break;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (seen) {
	      if (!arraySome(other, function(othValue, othIndex) {
	            if (!seen.has(othIndex) &&
	                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
	              return seen.add(othIndex);
	            }
	          })) {
	        result = false;
	        break;
	      }
	    } else if (!(
	          arrValue === othValue ||
	            equalFunc(arrValue, othValue, customizer, bitmask, stack)
	        )) {
	      result = false;
	      break;
	    }
	  }
	  stack['delete'](array);
	  return result;
	}

	module.exports = equalArrays;


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	var MapCache = __webpack_require__(85),
	    setCacheAdd = __webpack_require__(111),
	    setCacheHas = __webpack_require__(112);

	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var index = -1,
	      length = values ? values.length : 0;

	  this.__data__ = new MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}

	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;

	module.exports = SetCache;


/***/ },
/* 111 */
/***/ function(module, exports) {

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
	  this.__data__.set(value, HASH_UNDEFINED);
	  return this;
	}

	module.exports = setCacheAdd;


/***/ },
/* 112 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is in the array cache.
	 *
	 * @private
	 * @name has
	 * @memberOf SetCache
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `true` if `value` is found, else `false`.
	 */
	function setCacheHas(value) {
	  return this.__data__.has(value);
	}

	module.exports = setCacheHas;


/***/ },
/* 113 */
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.some` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if any element passes the predicate check,
	 *  else `false`.
	 */
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array.length;

	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}

	module.exports = arraySome;


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(115),
	    Uint8Array = __webpack_require__(116),
	    equalArrays = __webpack_require__(109),
	    mapToArray = __webpack_require__(117),
	    setToArray = __webpack_require__(118);

	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]';

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
	  switch (tag) {
	    case dataViewTag:
	      if ((object.byteLength != other.byteLength) ||
	          (object.byteOffset != other.byteOffset)) {
	        return false;
	      }
	      object = object.buffer;
	      other = other.buffer;

	    case arrayBufferTag:
	      if ((object.byteLength != other.byteLength) ||
	          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
	        return false;
	      }
	      return true;

	    case boolTag:
	    case dateTag:
	      // Coerce dates and booleans to numbers, dates to milliseconds and
	      // booleans to `1` or `0` treating invalid dates coerced to `NaN` as
	      // not equal.
	      return +object == +other;

	    case errorTag:
	      return object.name == other.name && object.message == other.message;

	    case numberTag:
	      // Treat `NaN` vs. `NaN` as equal.
	      return (object != +object) ? other != +other : object == +other;

	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings, primitives and objects,
	      // as equal. See http://www.ecma-international.org/ecma-262/6.0/#sec-regexp.prototype.tostring
	      // for more details.
	      return object == (other + '');

	    case mapTag:
	      var convert = mapToArray;

	    case setTag:
	      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
	      convert || (convert = setToArray);

	      if (object.size != other.size && !isPartial) {
	        return false;
	      }
	      // Assume cyclic values are equal.
	      var stacked = stack.get(object);
	      if (stacked) {
	        return stacked == other;
	      }
	      bitmask |= UNORDERED_COMPARE_FLAG;
	      stack.set(object, other);

	      // Recursively compare objects (susceptible to call stack limits).
	      return equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);

	    case symbolTag:
	      if (symbolValueOf) {
	        return symbolValueOf.call(object) == symbolValueOf.call(other);
	      }
	  }
	  return false;
	}

	module.exports = equalByTag;


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(98);

	/** Built-in value references. */
	var Symbol = root.Symbol;

	module.exports = Symbol;


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(98);

	/** Built-in value references. */
	var Uint8Array = root.Uint8Array;

	module.exports = Uint8Array;


/***/ },
/* 117 */
/***/ function(module, exports) {

	/**
	 * Converts `map` to its key-value pairs.
	 *
	 * @private
	 * @param {Object} map The map to convert.
	 * @returns {Array} Returns the key-value pairs.
	 */
	function mapToArray(map) {
	  var index = -1,
	      result = Array(map.size);

	  map.forEach(function(value, key) {
	    result[++index] = [key, value];
	  });
	  return result;
	}

	module.exports = mapToArray;


/***/ },
/* 118 */
/***/ function(module, exports) {

	/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */
	function setToArray(set) {
	  var index = -1,
	      result = Array(set.size);

	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}

	module.exports = setToArray;


/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	var baseHas = __webpack_require__(51),
	    keys = __webpack_require__(50);

	/** Used to compose bitmasks for comparison styles. */
	var PARTIAL_COMPARE_FLAG = 2;

	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
	 *  for more details.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
	  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
	      objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;

	  if (objLength != othLength && !isPartial) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isPartial ? key in other : baseHas(other, key))) {
	      return false;
	    }
	  }
	  // Assume cyclic values are equal.
	  var stacked = stack.get(object);
	  if (stacked) {
	    return stacked == other;
	  }
	  var result = true;
	  stack.set(object, other);

	  var skipCtor = isPartial;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, objValue, key, other, object, stack)
	        : customizer(objValue, othValue, key, object, other, stack);
	    }
	    // Recursively compare objects (susceptible to call stack limits).
	    if (!(compared === undefined
	          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
	          : compared
	        )) {
	      result = false;
	      break;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (result && !skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      result = false;
	    }
	  }
	  stack['delete'](object);
	  return result;
	}

	module.exports = equalObjects;


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	var DataView = __webpack_require__(121),
	    Map = __webpack_require__(97),
	    Promise = __webpack_require__(122),
	    Set = __webpack_require__(123),
	    WeakMap = __webpack_require__(124),
	    toSource = __webpack_require__(92);

	/** `Object#toString` result references. */
	var mapTag = '[object Map]',
	    objectTag = '[object Object]',
	    promiseTag = '[object Promise]',
	    setTag = '[object Set]',
	    weakMapTag = '[object WeakMap]';

	var dataViewTag = '[object DataView]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView),
	    mapCtorString = toSource(Map),
	    promiseCtorString = toSource(Promise),
	    setCtorString = toSource(Set),
	    weakMapCtorString = toSource(WeakMap);

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function getTag(value) {
	  return objectToString.call(value);
	}

	// Fallback for data views, maps, sets, and weak maps in IE 11,
	// for data views in Edge, and promises in Node.js.
	if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
	    (Map && getTag(new Map) != mapTag) ||
	    (Promise && getTag(Promise.resolve()) != promiseTag) ||
	    (Set && getTag(new Set) != setTag) ||
	    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
	  getTag = function(value) {
	    var result = objectToString.call(value),
	        Ctor = result == objectTag ? value.constructor : undefined,
	        ctorString = Ctor ? toSource(Ctor) : undefined;

	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag;
	        case mapCtorString: return mapTag;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag;
	        case weakMapCtorString: return weakMapTag;
	      }
	    }
	    return result;
	  };
	}

	module.exports = getTag;


/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(90),
	    root = __webpack_require__(98);

	/* Built-in method references that are verified to be native. */
	var DataView = getNative(root, 'DataView');

	module.exports = DataView;


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(90),
	    root = __webpack_require__(98);

	/* Built-in method references that are verified to be native. */
	var Promise = getNative(root, 'Promise');

	module.exports = Promise;


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(90),
	    root = __webpack_require__(98);

	/* Built-in method references that are verified to be native. */
	var Set = getNative(root, 'Set');

	module.exports = Set;


/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(90),
	    root = __webpack_require__(98);

	/* Built-in method references that are verified to be native. */
	var WeakMap = getNative(root, 'WeakMap');

	module.exports = WeakMap;


/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(62),
	    isObjectLike = __webpack_require__(41);

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
	typedArrayTags[errorTag] = typedArrayTags[funcTag] =
	typedArrayTags[mapTag] = typedArrayTags[numberTag] =
	typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
	typedArrayTags[setTag] = typedArrayTags[stringTag] =
	typedArrayTags[weakMapTag] = false;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	function isTypedArray(value) {
	  return isObjectLike(value) &&
	    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
	}

	module.exports = isTypedArray;


/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	var isStrictComparable = __webpack_require__(127),
	    toPairs = __webpack_require__(128);

	/**
	 * Gets the property names, values, and compare flags of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the match data of `object`.
	 */
	function getMatchData(object) {
	  var result = toPairs(object),
	      length = result.length;

	  while (length--) {
	    result[length][2] = isStrictComparable(result[length][1]);
	  }
	  return result;
	}

	module.exports = getMatchData;


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(61);

	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject(value);
	}

	module.exports = isStrictComparable;


/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	var createToPairs = __webpack_require__(129),
	    keys = __webpack_require__(50);

	/**
	 * Creates an array of own enumerable string keyed-value pairs for `object`
	 * which can be consumed by `_.fromPairs`. If `object` is a map or set, its
	 * entries are returned.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @alias entries
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the key-value pairs.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.toPairs(new Foo);
	 * // => [['a', 1], ['b', 2]] (iteration order is not guaranteed)
	 */
	var toPairs = createToPairs(keys);

	module.exports = toPairs;


/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	var baseToPairs = __webpack_require__(130),
	    getTag = __webpack_require__(120),
	    mapToArray = __webpack_require__(117),
	    setToPairs = __webpack_require__(132);

	/** `Object#toString` result references. */
	var mapTag = '[object Map]',
	    setTag = '[object Set]';

	/**
	 * Creates a `_.toPairs` or `_.toPairsIn` function.
	 *
	 * @private
	 * @param {Function} keysFunc The function to get the keys of a given object.
	 * @returns {Function} Returns the new pairs function.
	 */
	function createToPairs(keysFunc) {
	  return function(object) {
	    var tag = getTag(object);
	    if (tag == mapTag) {
	      return mapToArray(object);
	    }
	    if (tag == setTag) {
	      return setToPairs(object);
	    }
	    return baseToPairs(object, keysFunc(object));
	  };
	}

	module.exports = createToPairs;


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	var arrayMap = __webpack_require__(131);

	/**
	 * The base implementation of `_.toPairs` and `_.toPairsIn` which creates an array
	 * of key-value pairs for `object` corresponding to the property names of `props`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} props The property names to get values for.
	 * @returns {Object} Returns the key-value pairs.
	 */
	function baseToPairs(object, props) {
	  return arrayMap(props, function(key) {
	    return [key, object[key]];
	  });
	}

	module.exports = baseToPairs;


/***/ },
/* 131 */
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	module.exports = arrayMap;


/***/ },
/* 132 */
/***/ function(module, exports) {

	/**
	 * Converts `set` to its value-value pairs.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the value-value pairs.
	 */
	function setToPairs(set) {
	  var index = -1,
	      result = Array(set.size);

	  set.forEach(function(value) {
	    result[++index] = [value, value];
	  });
	  return result;
	}

	module.exports = setToPairs;


/***/ },
/* 133 */
/***/ function(module, exports) {

	/**
	 * A specialized version of `matchesProperty` for source values suitable
	 * for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function matchesStrictComparable(key, srcValue) {
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    return object[key] === srcValue &&
	      (srcValue !== undefined || (key in Object(object)));
	  };
	}

	module.exports = matchesStrictComparable;


/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqual = __webpack_require__(107),
	    get = __webpack_require__(135),
	    hasIn = __webpack_require__(145),
	    isKey = __webpack_require__(143),
	    isStrictComparable = __webpack_require__(127),
	    matchesStrictComparable = __webpack_require__(133),
	    toKey = __webpack_require__(144);

	/** Used to compose bitmasks for comparison styles. */
	var UNORDERED_COMPARE_FLAG = 1,
	    PARTIAL_COMPARE_FLAG = 2;

	/**
	 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */
	function baseMatchesProperty(path, srcValue) {
	  if (isKey(path) && isStrictComparable(srcValue)) {
	    return matchesStrictComparable(toKey(path), srcValue);
	  }
	  return function(object) {
	    var objValue = get(object, path);
	    return (objValue === undefined && objValue === srcValue)
	      ? hasIn(object, path)
	      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
	  };
	}

	module.exports = baseMatchesProperty;


/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(136);

	/**
	 * Gets the value at `path` of `object`. If the resolved value is
	 * `undefined`, the `defaultValue` is used in its place.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
	 * @returns {*} Returns the resolved value.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.get(object, 'a[0].b.c');
	 * // => 3
	 *
	 * _.get(object, ['a', '0', 'b', 'c']);
	 * // => 3
	 *
	 * _.get(object, 'a.b.c', 'default');
	 * // => 'default'
	 */
	function get(object, path, defaultValue) {
	  var result = object == null ? undefined : baseGet(object, path);
	  return result === undefined ? defaultValue : result;
	}

	module.exports = get;


/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	var castPath = __webpack_require__(137),
	    isKey = __webpack_require__(143),
	    toKey = __webpack_require__(144);

	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = isKey(path, object) ? [path] : castPath(path);

	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[toKey(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}

	module.exports = baseGet;


/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(63),
	    stringToPath = __webpack_require__(138);

	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath(value) {
	  return isArray(value) ? value : stringToPath(value);
	}

	module.exports = castPath;


/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	var memoize = __webpack_require__(139),
	    toString = __webpack_require__(140);

	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath = memoize(function(string) {
	  var result = [];
	  toString(string).replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});

	module.exports = stringToPath;


/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	var MapCache = __webpack_require__(85);

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided, it determines the cache key for storing the result based on the
	 * arguments provided to the memoized function. By default, the first argument
	 * provided to the memoized function is used as the map cache key. The `func`
	 * is invoked with the `this` binding of the memoized function.
	 *
	 * **Note:** The cache is exposed as the `cache` property on the memoized
	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
	 * constructor with one whose instances implement the
	 * [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
	 * method interface of `delete`, `get`, `has`, and `set`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] The function to resolve the cache key.
	 * @returns {Function} Returns the new memoized function.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': 2 };
	 * var other = { 'c': 3, 'd': 4 };
	 *
	 * var values = _.memoize(_.values);
	 * values(object);
	 * // => [1, 2]
	 *
	 * values(other);
	 * // => [3, 4]
	 *
	 * object.a = 2;
	 * values(object);
	 * // => [1, 2]
	 *
	 * // Modify the result cache.
	 * values.cache.set(object, ['a', 'b']);
	 * values(object);
	 * // => ['a', 'b']
	 *
	 * // Replace `_.memoize.Cache`.
	 * _.memoize.Cache = WeakMap;
	 */
	function memoize(func, resolver) {
	  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  var memoized = function() {
	    var args = arguments,
	        key = resolver ? resolver.apply(this, args) : args[0],
	        cache = memoized.cache;

	    if (cache.has(key)) {
	      return cache.get(key);
	    }
	    var result = func.apply(this, args);
	    memoized.cache = cache.set(key, result);
	    return result;
	  };
	  memoized.cache = new (memoize.Cache || MapCache);
	  return memoized;
	}

	// Assign cache to `_.memoize`.
	memoize.Cache = MapCache;

	module.exports = memoize;


/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(141);

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  return value == null ? '' : baseToString(value);
	}

	module.exports = toString;


/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(115),
	    isSymbol = __webpack_require__(142);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	module.exports = baseToString;


/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	var isObjectLike = __webpack_require__(41);

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}

	module.exports = isSymbol;


/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(63),
	    isSymbol = __webpack_require__(142);

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  if (isArray(value)) {
	    return false;
	  }
	  var type = typeof value;
	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
	      value == null || isSymbol(value)) {
	    return true;
	  }
	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	    (object != null && value in Object(object));
	}

	module.exports = isKey;


/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	var isSymbol = __webpack_require__(142);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey(value) {
	  if (typeof value == 'string' || isSymbol(value)) {
	    return value;
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	module.exports = toKey;


/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	var baseHasIn = __webpack_require__(146),
	    hasPath = __webpack_require__(147);

	/**
	 * Checks if `path` is a direct or inherited property of `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 * @example
	 *
	 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
	 *
	 * _.hasIn(object, 'a');
	 * // => true
	 *
	 * _.hasIn(object, 'a.b');
	 * // => true
	 *
	 * _.hasIn(object, ['a', 'b']);
	 * // => true
	 *
	 * _.hasIn(object, 'b');
	 * // => false
	 */
	function hasIn(object, path) {
	  return object != null && hasPath(object, path, baseHasIn);
	}

	module.exports = hasIn;


/***/ },
/* 146 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.hasIn` without support for deep paths.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHasIn(object, key) {
	  return key in Object(object);
	}

	module.exports = baseHasIn;


/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	var castPath = __webpack_require__(137),
	    isArguments = __webpack_require__(55),
	    isArray = __webpack_require__(63),
	    isIndex = __webpack_require__(65),
	    isKey = __webpack_require__(143),
	    isLength = __webpack_require__(62),
	    isString = __webpack_require__(64),
	    toKey = __webpack_require__(144);

	/**
	 * Checks if `path` exists on `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path to check.
	 * @param {Function} hasFunc The function to check properties.
	 * @returns {boolean} Returns `true` if `path` exists, else `false`.
	 */
	function hasPath(object, path, hasFunc) {
	  path = isKey(path, object) ? [path] : castPath(path);

	  var result,
	      index = -1,
	      length = path.length;

	  while (++index < length) {
	    var key = toKey(path[index]);
	    if (!(result = object != null && hasFunc(object, key))) {
	      break;
	    }
	    object = object[key];
	  }
	  if (result) {
	    return result;
	  }
	  var length = object ? object.length : 0;
	  return !!length && isLength(length) && isIndex(key, length) &&
	    (isArray(object) || isString(object) || isArguments(object));
	}

	module.exports = hasPath;


/***/ },
/* 148 */
/***/ function(module, exports) {

	/**
	 * This method returns the first argument given to it.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	module.exports = identity;


/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(59),
	    basePropertyDeep = __webpack_require__(150),
	    isKey = __webpack_require__(143),
	    toKey = __webpack_require__(144);

	/**
	 * Creates a function that returns the value at `path` of a given object.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': 2 } },
	 *   { 'a': { 'b': 1 } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b'));
	 * // => [2, 1]
	 *
	 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
	 * // => [1, 2]
	 */
	function property(path) {
	  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
	}

	module.exports = property;


/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(136);

	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function basePropertyDeep(path) {
	  return function(object) {
	    return baseGet(object, path);
	  };
	}

	module.exports = basePropertyDeep;


/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, global, process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.default = function (type) {
	  var storage = getStorage(type);
	  return {
	    getItem: function getItem(key, cb) {
	      try {
	        var s = storage.getItem(key);
	        nextTick(function () {
	          cb(null, s);
	        });
	      } catch (e) {
	        cb(e);
	      }
	    },
	    setItem: function setItem(key, string, cb) {
	      try {
	        storage.setItem(key, string);
	        nextTick(function () {
	          cb(null);
	        });
	      } catch (e) {
	        cb(e);
	      }
	    },
	    removeItem: function removeItem(key, cb) {
	      try {
	        storage.removeItem(key);
	        nextTick(function () {
	          cb(null);
	        });
	      } catch (e) {
	        cb(e);
	      }
	    },
	    getAllKeys: function getAllKeys(cb) {
	      try {
	        var keys = [];
	        for (var i = 0; i < storage.length; i++) {
	          keys.push(storage.key(i));
	        }
	        nextTick(function () {
	          cb(null, keys);
	        });
	      } catch (e) {
	        cb(e);
	      }
	    }
	  };
	};

	var genericSetImmediate = typeof setImmediate === 'undefined' ? global.setImmediate : setImmediate;
	var nextTick = process && process.nextTick ? process.nextTick : genericSetImmediate;

	var noStorage = process && process.env && process.env.NODE_ENV === 'production' ? function () {
	  /* noop */return null;
	} : function () {
	  console.error('redux-persist asyncLocalStorage requires a global localStorage object. Either use a different storage backend or if this is a universal redux application you probably should conditionally persist like so: https://gist.github.com/rt2zz/ac9eb396793f95ff3c3b');
	  return null;
	};

	function hasLocalStorage() {
	  try {
	    return (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && typeof window.localStorage !== 'undefined';
	  } catch (e) {
	    return false;
	  }
	}

	function hasSessionStorage() {
	  try {
	    return (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && typeof window.sessionStorage !== 'undefined';
	  } catch (e) {
	    return false;
	  }
	}

	function getStorage(type) {
	  if (type === 'local') {
	    return hasLocalStorage() ? window.localStorage : { getItem: noStorage, setItem: noStorage, removeItem: noStorage, getAllKeys: noStorage };
	  }
	  if (type === 'session') {
	    return hasSessionStorage() ? window.sessionStorage : { getItem: noStorage, setItem: noStorage, removeItem: noStorage, getAllKeys: noStorage };
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(152).setImmediate, (function() { return this; }()), __webpack_require__(30)))

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(30).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(152).setImmediate, __webpack_require__(152).clearImmediate))

/***/ },
/* 153 */
/***/ function(module, exports) {

	exports = module.exports = stringify
	exports.getSerialize = serializer

	function stringify(obj, replacer, spaces, cycleReplacer) {
	  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
	}

	function serializer(replacer, cycleReplacer) {
	  var stack = [], keys = []

	  if (cycleReplacer == null) cycleReplacer = function(key, value) {
	    if (stack[0] === value) return "[Circular ~]"
	    return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
	  }

	  return function(key, value) {
	    if (stack.length > 0) {
	      var thisPos = stack.indexOf(this)
	      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
	      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
	      if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
	    }
	    else stack.push(value)

	    return replacer == null ? value : replacer.call(this, key, value)
	  }
	}


/***/ },
/* 154 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function createTransform(inbound, outbound) {
	  var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  var whitelist = config.whitelist || null;
	  var blacklist = config.blacklist || null;

	  function whitelistBlacklistCheck(key) {
	    if (whitelist && whitelist.indexOf(key) === -1) return true;
	    if (blacklist && blacklist.indexOf(key) !== -1) return true;
	    return false;
	  }

	  return {
	    in: function _in(state, key) {
	      return !whitelistBlacklistCheck(key) ? inbound(state, key) : state;
	    },
	    out: function out(state, key) {
	      return !whitelistBlacklistCheck(key) ? outbound(state, key) : state;
	    }
	  };
	}

	exports.default = createTransform;

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _forEach2 = __webpack_require__(44);

	var _forEach3 = _interopRequireDefault(_forEach2);

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.default = getStoredState;

	var _constants = __webpack_require__(42);

	var constants = _interopRequireWildcard(_constants);

	var _asyncLocalStorage = __webpack_require__(151);

	var _asyncLocalStorage2 = _interopRequireDefault(_asyncLocalStorage);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function getStoredState(config, onComplete) {
	  var storage = config.storage || (0, _asyncLocalStorage2.default)('local');
	  var deserialize = config.deserialize || defaultDeserialize;
	  var transforms = config.transforms || [];
	  var purgeMode = config.purgeMode || false;

	  // fallback getAllKeys to `keys` if present (LocalForage compatability)
	  if (storage.keys && !storage.getAllKeys) storage = _extends({}, storage, { getAllKeys: storage.keys });

	  var restoredState = {};
	  var completionCount = 0;

	  storage.getAllKeys(function (err, allKeys) {
	    if (err && process.env.NODE_ENV !== 'production') {
	      console.warn('Error in storage.getAllKeys');
	    }
	    var persistKeys = allKeys.filter(function (key) {
	      return key.indexOf(constants.keyPrefix) === 0;
	    }).map(function (key) {
	      return key.slice(constants.keyPrefix.length);
	    });
	    var keysToRestore = Array.isArray(purgeMode) ? persistKeys.filter(function (key) {
	      return purgeMode.indexOf(key) === -1;
	    }) : purgeMode === '*' ? [] : persistKeys;

	    var restoreCount = keysToRestore.length;
	    if (restoreCount === 0) complete(null, restoredState);
	    (0, _forEach3.default)(keysToRestore, function (key) {
	      storage.getItem(createStorageKey(key), function (err, serialized) {
	        if (err && process.env.NODE_ENV !== 'production') console.warn('Error restoring data for key:', key, err);else restoredState[key] = rehydrate(key, serialized);
	        completionCount += 1;
	        if (completionCount === restoreCount) complete(null, restoredState);
	      });
	    });
	  });

	  function rehydrate(key, serialized) {
	    var state = null;

	    try {
	      var data = deserialize(serialized);
	      state = transforms.reduceRight(function (subState, transformer) {
	        return transformer.out(subState, key);
	      }, data);
	    } catch (err) {
	      if (process.env.NODE_ENV !== 'production') console.warn('Error restoring data for key:', key, err);
	    }

	    return state;
	  }

	  function complete(err, restoredState) {
	    onComplete(err, restoredState);
	  }

	  if (typeof onComplete !== 'function' && !!Promise) {
	    return new Promise(function (resolve, reject) {
	      onComplete = function onComplete(err, restoredState) {
	        if (err) reject(err);else resolve(restoredState);
	      };
	    });
	  }
	}

	function defaultDeserialize(serial) {
	  return JSON.parse(serial);
	}

	function createStorageKey(key) {
	  return constants.keyPrefix + key;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(30)))

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, global, process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.default = persistStore;

	var _constants = __webpack_require__(42);

	var constants = _interopRequireWildcard(_constants);

	var _getStoredState = __webpack_require__(155);

	var _getStoredState2 = _interopRequireDefault(_getStoredState);

	var _createPersistor = __webpack_require__(43);

	var _createPersistor2 = _interopRequireDefault(_createPersistor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var genericSetImmediate = typeof setImmediate === 'undefined' ? global.setImmediate : setImmediate;

	function persistStore(store) {
	  var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	  var onComplete = arguments[2];

	  // defaults
	  var shouldRestore = !config.skipRestore;
	  if (process.env.NODE_ENV !== 'production' && config.skipRestore) console.warn('redux-persist: config.skipRestore has been deprecated. If you want to skip restoration use `createPersistor` instead');

	  // create and pause persistor
	  var persistor = (0, _createPersistor2.default)(store, config);
	  persistor.pause();

	  // restore
	  if (shouldRestore) {
	    genericSetImmediate(function () {
	      (0, _getStoredState2.default)(_extends({}, config, { purgeMode: persistor._getPurgeMode() }), function (err, restoredState) {
	        if (restoredState) store.dispatch(rehydrateAction(restoredState));
	        if (err) store.dispatch(rehydrateErrorAction(err));
	        complete(err, restoredState);
	      });
	    });
	  } else genericSetImmediate(complete);

	  function complete(err, restoredState) {
	    persistor.resume();
	    onComplete && onComplete(err, restoredState);
	  }

	  return persistor;
	}

	function rehydrateAction(data) {
	  return {
	    type: constants.REHYDRATE,
	    payload: data
	  };
	}

	function rehydrateErrorAction(err) {
	  return {
	    type: constants.REHYDRATE_ERROR,
	    payload: err
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(152).setImmediate, (function() { return this; }()), __webpack_require__(30)))

/***/ },
/* 157 */
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _redux = __webpack_require__(26);

	var _lines = __webpack_require__(158);

	var _lines2 = _interopRequireDefault(_lines);

	var _productData = __webpack_require__(159);

	var _productData2 = _interopRequireDefault(_productData);

	var _shop = __webpack_require__(160);

	var _shop2 = _interopRequireDefault(_shop);

	var _customer = __webpack_require__(161);

	var _customer2 = _interopRequireDefault(_customer);

	var _customerData = __webpack_require__(162);

	var _customerData2 = _interopRequireDefault(_customerData);

	var _customerDetails = __webpack_require__(163);

	var _customerDetails2 = _interopRequireDefault(_customerDetails);

	var _methods = __webpack_require__(164);

	var _methods2 = _interopRequireDefault(_methods);

	var _order = __webpack_require__(165);

	var _order2 = _interopRequireDefault(_order);

	var _comment = __webpack_require__(166);

	var _comment2 = _interopRequireDefault(_comment);

	var _quickAdd = __webpack_require__(167);

	var _quickAdd2 = _interopRequireDefault(_quickAdd);

	var childReducer = _redux.combineReducers({
	    lines: _lines2["default"],
	    productData: _productData2["default"],
	    shop: _shop2["default"],
	    customer: _customer2["default"],
	    customerData: _customerData2["default"],
	    customerDetails: _customerDetails2["default"],
	    methods: _methods2["default"],
	    order: _order2["default"],
	    comment: _comment2["default"],
	    quickAdd: _quickAdd2["default"]
	});

	exports["default"] = function (state, action) {
	    if (action.type === "_replaceState") {
	        // For debugging purposes.
	        return action.payload;
	    }
	    state = childReducer(state, action);
	    return state;
	};

	module.exports = exports["default"];

/***/ },
/* 158 */
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _reduxActions = __webpack_require__(6);

	var _lodash = __webpack_require__(1);

	var _lodash2 = _interopRequireDefault(_lodash);

	function newLine() {
	    return {
	        id: (+new Date() * 10000).toString(36),
	        type: "product",
	        product: null,
	        sku: null,
	        text: null,
	        errors: null,
	        quantity: 1,
	        step: "",
	        baseUnitPrice: 0,
	        unitPrice: 0,
	        unitPriceIncludesTax: false,
	        discountPercent: 0,
	        discountAmount: 0,
	        total: 0
	    };
	}

	function setLineProperties(linesState, lineId, props) {
	    return _lodash2["default"].map(linesState, function (line) {
	        if (line.id === lineId) {
	            return _lodash2["default"].assign({}, line, props);
	        }

	        return line;
	    });
	}

	function getFormattedStockCounts(line) {
	    var physicalCount = ensureNumericValue(line.physicalCount);
	    var logicalCount = ensureNumericValue(line.logicalCount);

	    return {
	        physicalCount: physicalCount.toFixed(line.salesDecimals) + " " + line.salesUnit,
	        logicalCount: logicalCount.toFixed(line.salesDecimals) + " " + line.salesUnit
	    };
	}

	function getDiscountsAndTotal(quantity, baseUnitPrice, unitPrice) {
	    var updateUnitPrice = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

	    var updates = {};

	    if (updateUnitPrice) {
	        updates.unitPrice = unitPrice;
	    }
	    var totalBeforeDiscount = baseUnitPrice * quantity;
	    var total = +(unitPrice * quantity);
	    updates.total = total;
	    if (baseUnitPrice < unitPrice || unitPrice < 0) {
	        updates.discountPercent = 0;
	        updates.discountAmount = 0;
	        return updates;
	    }
	    var discountAmount = totalBeforeDiscount - total;
	    if (isNaN(discountAmount)) {
	        discountAmount = 0;
	    }
	    updates.discountAmount = discountAmount;
	    updates.discountPercent = (discountAmount / totalBeforeDiscount * 100).toFixed(2);

	    return updates;
	}

	function updateLineFromProduct(state, _ref) {
	    var payload = _ref.payload;
	    var id = payload.id;
	    var product = payload.product;

	    var line = _lodash2["default"].detect(state, function (sLine) {
	        return sLine.id === id;
	    });
	    if (!line) {
	        return state;
	    }
	    var updates = {};
	    if (!product.sku) {
	        // error happened before getting actual product information
	        updates.errors = product.errors;
	        return setLineProperties(state, id, updates);
	    }

	    var baseUnitPrice = ensureNumericValue(product.baseUnitPrice.value);
	    var unitPrice = ensureNumericValue(product.unitPrice.value);
	    updates = getDiscountsAndTotal(ensureNumericValue(product.quantity), baseUnitPrice, unitPrice);
	    updates.baseUnitPrice = baseUnitPrice;
	    updates.unitPrice = unitPrice;
	    updates.unitPriceIncludesTax = product.unitPrice.includesTax;
	    updates.sku = product.sku;
	    updates.text = product.name;
	    updates.quantity = product.quantity;
	    updates.step = product.purchaseMultiple;
	    updates.errors = product.errors;
	    updates.product = product.product;
	    updates = _lodash2["default"].merge(updates, getFormattedStockCounts(product));
	    return setLineProperties(state, id, updates);
	}

	function ensureNumericValue(value) {
	    var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

	    value = parseFloat(value);
	    if (isNaN(value)) {
	        return defaultValue;
	    }
	    return value;
	}

	function setLineProperty(state, _ref2) {
	    var payload = _ref2.payload;
	    var id = payload.id;
	    var property = payload.property;
	    var value = payload.value;

	    var line = _lodash2["default"].detect(state, function (sLine) {
	        return sLine.id === id;
	    });
	    var updates = {};
	    if (line) {
	        switch (property) {
	            case "product":
	                {
	                    var product = value;
	                    updates.product = product;
	                    updates.type = "product";
	                    break;
	                }
	            case "text":
	                {
	                    updates.text = value;
	                    break;
	                }
	            case "type":
	                {
	                    updates.type = value;
	                    updates.errors = null;
	                    if (value === "other" || value === "text") {
	                        updates.product = null;
	                        updates.sku = null;
	                    }
	                    if (value === "text") {
	                        updates = getDiscountsAndTotal(0, line.baseUnitPrice, 0);
	                        updates.unitPrice = 0;
	                        updates.quantity = 0;
	                    }
	                    updates.type = value;
	                    break;
	                }
	            case "quantity":
	                {
	                    var quantity = Math.max(0, ensureNumericValue(value, 1));
	                    updates = getDiscountsAndTotal(quantity, line.baseUnitPrice, line.unitPrice);
	                    updates.quantity = quantity;
	                    break;
	                }
	            case "unitPrice":
	                {
	                    updates = getDiscountsAndTotal(line.quantity, line.baseUnitPrice, ensureNumericValue(value, line.baseUnitPrice), true);
	                    break;
	                }
	            case "discountPercent":
	                {
	                    var discountPercent = Math.min(100, Math.max(0, ensureNumericValue(value)));
	                    updates = getDiscountsAndTotal(line.quantity, line.baseUnitPrice, line.baseUnitPrice * (1 - discountPercent / 100), true);
	                    break;
	                }
	            case "discountAmount":
	                {
	                    var newDiscountAmount = Math.max(0, ensureNumericValue(value));
	                    updates = getDiscountsAndTotal(line.quantity, line.baseUnitPrice, line.baseUnitPrice - newDiscountAmount / line.quantity, true);
	                    updates.discountAmount = newDiscountAmount;
	                    break;
	                }
	            case "total":
	                {
	                    var calculatedTotal = line.quantity * line.baseUnitPrice;
	                    // TODO: change the hardcoded rounding when doing SHUUP-1912
	                    var total = +ensureNumericValue(value, calculatedTotal);
	                    updates = getDiscountsAndTotal(line.quantity, line.baseUnitPrice, total / line.quantity, true);
	                    break;
	                }
	        }
	    }
	    return setLineProperties(state, id, updates);
	}

	function setLines(state, _ref3) {
	    var payload = _ref3.payload;

	    var lines = [];
	    _lodash2["default"].map(payload, function (line) {
	        _lodash2["default"].merge(line, getFormattedStockCounts(line), getDiscountsAndTotal(ensureNumericValue(line.quantity), ensureNumericValue(line.baseUnitPrice), ensureNumericValue(line.unitPrice)));
	        lines.push(line);
	    });
	    return _lodash2["default"].assign([], state, lines);
	}

	exports["default"] = _reduxActions.handleActions({
	    addLine: function addLine(state) {
	        return [].concat(state, newLine());
	    },
	    deleteLine: function deleteLine(state, _ref4) {
	        var payload = _ref4.payload;
	        return _lodash2["default"].reject(state, function (line) {
	            return line.id === payload;
	        });
	    },
	    updateLineFromProduct: updateLineFromProduct,
	    setLineProperty: setLineProperty,
	    setLines: setLines
	}, []);
	module.exports = exports["default"];

/***/ },
/* 159 */
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _reduxActions = __webpack_require__(6);

	var _lodash = __webpack_require__(1);

	var _lodash2 = _interopRequireDefault(_lodash);

	exports["default"] = _reduxActions.handleActions({
	  retrieveProductData: _lodash2["default"].identity, // Could've just omitted this, but Explicit Is Better, etc.
	  receiveProductData: function receiveProductData(state, _ref) {
	    var _$assign;

	    var payload = _ref.payload;
	    return _lodash2["default"].assign(state, (_$assign = {}, _$assign[payload.id] = payload.data, _$assign));
	  }
	}, {});
	module.exports = exports["default"];

/***/ },
/* 160 */
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _reduxActions = __webpack_require__(6);

	var _lodash = __webpack_require__(1);

	var _lodash2 = _interopRequireDefault(_lodash);

	exports["default"] = _reduxActions.handleActions({
	    setShopChoices: function setShopChoices(state, _ref) {
	        var payload = _ref.payload;
	        return _lodash2["default"].assign(state, { choices: payload });
	    },
	    setCountries: function setCountries(state, _ref2) {
	        var payload = _ref2.payload;
	        return _lodash2["default"].assign(state, { countries: payload });
	    },
	    setShop: function setShop(state, _ref3) {
	        var payload = _ref3.payload;
	        return _lodash2["default"].assign(state, { selected: payload });
	    }
	}, {
	    choices: [],
	    countries: [],
	    selected: null
	});
	module.exports = exports["default"];

/***/ },
/* 161 */
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

	var _reduxActions = __webpack_require__(6);

	function clearExistingCustomer(state) {
	    return _.assign({}, state, { id: null, name: null });
	}

	function setAddressProperty(state, _ref) {
	    var payload = _ref.payload;
	    var type = payload.type;
	    var field = payload.field;
	    var value = payload.value;

	    var updates = {};
	    var billingAddress = state.billingAddress;
	    var shippingAddress = state.shippingAddress;
	    var shipToBillingAddress = state.shipToBillingAddress;

	    switch (type) {
	        case "billing":
	            updates.billingAddress = _.set(billingAddress, field, value);
	            if (shipToBillingAddress) {
	                updates.shippingAddress = _.set(shippingAddress, field, value);
	            }
	            break;
	        case "shipping":
	            updates.shippingAddress = _.set(shippingAddress, field, value);
	            break;
	    }
	    return _.assign({}, state, updates);
	}

	exports["default"] = _reduxActions.handleActions({
	    setCustomer: function setCustomer(state, _ref2) {
	        var payload = _ref2.payload;
	        return _.assign(state, payload);
	    },
	    clearExistingCustomer: clearExistingCustomer,
	    setAddressProperty: setAddressProperty,
	    setAddressSavingOption: function setAddressSavingOption(state, _ref3) {
	        var payload = _ref3.payload;
	        return _.assign(state, { saveAddress: payload });
	    },
	    setShipToBillingAddress: function setShipToBillingAddress(state, _ref4) {
	        var payload = _ref4.payload;
	        return _.assign(state, { shipToBillingAddress: payload });
	    },
	    setIsCompany: function setIsCompany(state, _ref5) {
	        var payload = _ref5.payload;
	        return _.assign(state, { isCompany: payload });
	    }
	}, {
	    id: null,
	    name: "",
	    saveAddress: true,
	    shipToBillingAddress: false,
	    isCompany: false,
	    billingAddress: {},
	    shippingAddress: {}
	});
	module.exports = exports["default"];

/***/ },
/* 162 */
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _reduxActions = __webpack_require__(6);

	var _lodash = __webpack_require__(1);

	var _lodash2 = _interopRequireDefault(_lodash);

	exports["default"] = _reduxActions.handleActions({
	  retrieveCustomerData: _lodash2["default"].identity,
	  receiveCustomerData: function receiveCustomerData(state, _ref) {
	    var _$assign;

	    var payload = _ref.payload;
	    return _lodash2["default"].assign(state, (_$assign = {}, _$assign[payload.id] = payload.data, _$assign));
	  }
	}, {});
	module.exports = exports["default"];

/***/ },
/* 163 */
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _reduxActions = __webpack_require__(6);

	var _lodash = __webpack_require__(1);

	var _lodash2 = _interopRequireDefault(_lodash);

	exports["default"] = _reduxActions.handleActions({
	    retrieveCustomerDetails: _lodash2["default"].identity,
	    receiveCustomerDetails: function receiveCustomerDetails(state, _ref) {
	        var payload = _ref.payload;

	        return _lodash2["default"].assign(state, {
	            customerInfo: payload.data.customer_info,
	            orderSummary: payload.data.order_summary,
	            recentOrders: payload.data.recent_orders
	        });
	    },
	    showCustomerModal: function showCustomerModal(state, _ref2) {
	        var payload = _ref2.payload;
	        return _lodash2["default"].assign(state, { showCustomerModal: payload });
	    }
	}, {});
	module.exports = exports["default"];

/***/ },
/* 164 */
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _reduxActions = __webpack_require__(6);

	var _lodash = __webpack_require__(1);

	var _lodash2 = _interopRequireDefault(_lodash);

	exports["default"] = _reduxActions.handleActions({
	    setShippingMethod: function setShippingMethod(state, _ref) {
	        var payload = _ref.payload;
	        return _lodash2["default"].assign(state, { shippingMethod: payload });
	    },
	    setShippingMethodChoices: function setShippingMethodChoices(state, _ref2) {
	        var payload = _ref2.payload;
	        return _lodash2["default"].assign(state, { shippingMethodChoices: payload });
	    },
	    setPaymentMethod: function setPaymentMethod(state, _ref3) {
	        var payload = _ref3.payload;
	        return _lodash2["default"].assign(state, { paymentMethod: payload });
	    },
	    setPaymentMethodChoices: function setPaymentMethodChoices(state, _ref4) {
	        var payload = _ref4.payload;
	        return _lodash2["default"].assign(state, { paymentMethodChoices: payload });
	    }
	}, {
	    shippingMethodChoices: [],
	    shippingMethod: null,
	    paymentMethodChoices: [],
	    paymentMethod: null
	});
	module.exports = exports["default"];

/***/ },
/* 165 */
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _reduxActions = __webpack_require__(6);

	var _lodash = __webpack_require__(1);

	var _lodash2 = _interopRequireDefault(_lodash);

	function updateTotals(state, _ref) {
	    var payload = _ref.payload;

	    var updates = {};

	    var _payload = payload();

	    var lines = _payload.lines;

	    var total = 0;
	    _lodash2["default"].map(lines, function (line) {
	        total += line.total;
	    });
	    updates.total = +total.toFixed(2);
	    return _lodash2["default"].assign({}, state, updates);
	}

	exports["default"] = _reduxActions.handleActions({
	    beginCreatingOrder: function beginCreatingOrder(state) {
	        return _lodash2["default"].assign(state, { creating: true });
	    },
	    endCreatingOrder: function endCreatingOrder(state) {
	        return _lodash2["default"].assign(state, { creating: false });
	    },
	    updateTotals: updateTotals,
	    setOrderId: function setOrderId(state, _ref2) {
	        var payload = _ref2.payload;
	        return _lodash2["default"].assign(state, { id: payload });
	    },
	    setOrderSource: function setOrderSource(state, _ref3) {
	        var payload = _ref3.payload;
	        return _lodash2["default"].assign(state, { source: payload });
	    },
	    clearOrderSourceData: function clearOrderSourceData(state) {
	        return _lodash2["default"].assign(state, { source: null });
	    }
	}, {
	    id: null,
	    creating: false,
	    source: null,
	    total: 0
	});
	module.exports = exports["default"];

/***/ },
/* 166 */
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _reduxActions = __webpack_require__(6);

	var _lodash = __webpack_require__(1);

	var _lodash2 = _interopRequireDefault(_lodash);

	exports["default"] = _reduxActions.handleActions({
	  setComment: function setComment(state, _ref) {
	    var payload = _ref.payload;
	    return _lodash2["default"].trim(payload || "");
	  }
	}, null);
	module.exports = exports["default"];

/***/ },
/* 167 */
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _reduxActions = __webpack_require__(6);

	var _lodash = __webpack_require__(1);

	var _lodash2 = _interopRequireDefault(_lodash);

	exports["default"] = _reduxActions.handleActions({
	    setAutoAdd: function setAutoAdd(state, _ref) {
	        var payload = _ref.payload;
	        return _lodash2["default"].assign(state, { autoAdd: payload });
	    },
	    setQuickAddProduct: function setQuickAddProduct(state, _ref2) {
	        var payload = _ref2.payload;
	        return _lodash2["default"].assign(state, { product: payload });
	    },
	    clearQuickAddProduct: function clearQuickAddProduct(state) {
	        return _lodash2["default"].assign(state, { product: { id: "", text: "" } });
	    },
	    setFocusOnQuickAdd: function setFocusOnQuickAdd(state, _ref3) {
	        var payload = _ref3.payload;
	        return _lodash2["default"].assign(state, { focus: payload });
	    }
	}, {
	    autoAdd: true,
	    focus: false,
	    product: {
	        id: "",
	        text: ""
	    }
	});
	module.exports = exports["default"];

/***/ }
/******/ ]);
//# sourceMappingURL=order-creator.js.map