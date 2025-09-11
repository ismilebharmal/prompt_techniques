/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.jsx":
/*!************************!*\
  !*** ./pages/_app.jsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n// Toast notification component\nfunction Toast({ message, show, onClose }) {\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        if (show) {\n            const timer = setTimeout(onClose, 3000);\n            return ()=>clearTimeout(timer);\n        }\n    }, [\n        show,\n        onClose\n    ]);\n    if (!show) return null;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in\",\n        children: message\n    }, void 0, false, {\n        fileName: \"/Users/ismile.bharmal/prompt-techniques-hub/pages/_app.jsx\",\n        lineNumber: 16,\n        columnNumber: 5\n    }, this);\n}\nfunction App({ Component, pageProps }) {\n    const [toast, setToast] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)({\n        show: false,\n        message: \"\"\n    });\n    const showToast = (message)=>{\n        setToast({\n            show: true,\n            message\n        });\n    };\n    const hideToast = ()=>{\n        setToast({\n            show: false,\n            message: \"\"\n        });\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps,\n                showToast: showToast\n            }, void 0, false, {\n                fileName: \"/Users/ismile.bharmal/prompt-techniques-hub/pages/_app.jsx\",\n                lineNumber: 35,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Toast, {\n                message: toast.message,\n                show: toast.show,\n                onClose: hideToast\n            }, void 0, false, {\n                fileName: \"/Users/ismile.bharmal/prompt-techniques-hub/pages/_app.jsx\",\n                lineNumber: 36,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUE4QjtBQUNhO0FBRTNDLCtCQUErQjtBQUMvQixTQUFTRSxNQUFNLEVBQUVDLE9BQU8sRUFBRUMsSUFBSSxFQUFFQyxPQUFPLEVBQUU7SUFDdkNKLGdEQUFTQSxDQUFDO1FBQ1IsSUFBSUcsTUFBTTtZQUNSLE1BQU1FLFFBQVFDLFdBQVdGLFNBQVM7WUFDbEMsT0FBTyxJQUFNRyxhQUFhRjtRQUM1QjtJQUNGLEdBQUc7UUFBQ0Y7UUFBTUM7S0FBUTtJQUVsQixJQUFJLENBQUNELE1BQU0sT0FBTztJQUVsQixxQkFDRSw4REFBQ0s7UUFBSUMsV0FBVTtrQkFDWlA7Ozs7OztBQUdQO0FBRWUsU0FBU1EsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNsRCxNQUFNLENBQUNDLE9BQU9DLFNBQVMsR0FBR2YsK0NBQVFBLENBQUM7UUFBRUksTUFBTTtRQUFPRCxTQUFTO0lBQUc7SUFFOUQsTUFBTWEsWUFBWSxDQUFDYjtRQUNqQlksU0FBUztZQUFFWCxNQUFNO1lBQU1EO1FBQVE7SUFDakM7SUFFQSxNQUFNYyxZQUFZO1FBQ2hCRixTQUFTO1lBQUVYLE1BQU07WUFBT0QsU0FBUztRQUFHO0lBQ3RDO0lBRUEscUJBQ0U7OzBCQUNFLDhEQUFDUztnQkFBVyxHQUFHQyxTQUFTO2dCQUFFRyxXQUFXQTs7Ozs7OzBCQUNyQyw4REFBQ2Q7Z0JBQU1DLFNBQVNXLE1BQU1YLE9BQU87Z0JBQUVDLE1BQU1VLE1BQU1WLElBQUk7Z0JBQUVDLFNBQVNZOzs7Ozs7OztBQUdoRSIsInNvdXJjZXMiOlsid2VicGFjazovL3Byb21wdC10ZWNobmlxdWVzLWh1Yi8uL3BhZ2VzL19hcHAuanN4PzRjYjMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnXG5cbi8vIFRvYXN0IG5vdGlmaWNhdGlvbiBjb21wb25lbnRcbmZ1bmN0aW9uIFRvYXN0KHsgbWVzc2FnZSwgc2hvdywgb25DbG9zZSB9KSB7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHNob3cpIHtcbiAgICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dChvbkNsb3NlLCAzMDAwKVxuICAgICAgcmV0dXJuICgpID0+IGNsZWFyVGltZW91dCh0aW1lcilcbiAgICB9XG4gIH0sIFtzaG93LCBvbkNsb3NlXSlcblxuICBpZiAoIXNob3cpIHJldHVybiBudWxsXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIHRvcC00IHJpZ2h0LTQgYmctZ3JlZW4tNTAwIHRleHQtd2hpdGUgcHgtNCBweS0yIHJvdW5kZWQtbGcgc2hhZG93LWxnIHotNTAgYW5pbWF0ZS1mYWRlLWluXCI+XG4gICAgICB7bWVzc2FnZX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XG4gIGNvbnN0IFt0b2FzdCwgc2V0VG9hc3RdID0gdXNlU3RhdGUoeyBzaG93OiBmYWxzZSwgbWVzc2FnZTogJycgfSlcblxuICBjb25zdCBzaG93VG9hc3QgPSAobWVzc2FnZSkgPT4ge1xuICAgIHNldFRvYXN0KHsgc2hvdzogdHJ1ZSwgbWVzc2FnZSB9KVxuICB9XG5cbiAgY29uc3QgaGlkZVRvYXN0ID0gKCkgPT4ge1xuICAgIHNldFRvYXN0KHsgc2hvdzogZmFsc2UsIG1lc3NhZ2U6ICcnIH0pXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IHNob3dUb2FzdD17c2hvd1RvYXN0fSAvPlxuICAgICAgPFRvYXN0IG1lc3NhZ2U9e3RvYXN0Lm1lc3NhZ2V9IHNob3c9e3RvYXN0LnNob3d9IG9uQ2xvc2U9e2hpZGVUb2FzdH0gLz5cbiAgICA8Lz5cbiAgKVxufVxuIl0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlRWZmZWN0IiwiVG9hc3QiLCJtZXNzYWdlIiwic2hvdyIsIm9uQ2xvc2UiLCJ0aW1lciIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJkaXYiLCJjbGFzc05hbWUiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJ0b2FzdCIsInNldFRvYXN0Iiwic2hvd1RvYXN0IiwiaGlkZVRvYXN0Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.jsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.jsx"));
module.exports = __webpack_exports__;

})();