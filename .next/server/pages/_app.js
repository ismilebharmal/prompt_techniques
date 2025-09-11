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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n// Toast notification component\nfunction Toast({ message, show, onClose }) {\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        if (show) {\n            const timer = setTimeout(onClose, 3000);\n            return ()=>clearTimeout(timer);\n        }\n    }, [\n        show,\n        onClose\n    ]);\n    if (!show) return null;\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in\",\n        children: message\n    }, void 0, false, {\n        fileName: \"/Users/ismile.bharmal/prompt-techniques-hub/pages/_app.jsx\",\n        lineNumber: 16,\n        columnNumber: 5\n    }, this);\n}\nfunction App({ Component, pageProps }) {\n    const [toast, setToast] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)({\n        show: false,\n        message: \"\"\n    });\n    const showToast = (message)=>{\n        setToast({\n            show: true,\n            message\n        });\n    };\n    const hideToast = ()=>{\n        setToast({\n            show: false,\n            message: \"\"\n        });\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps,\n                showToast: showToast\n            }, void 0, false, {\n                fileName: \"/Users/ismile.bharmal/prompt-techniques-hub/pages/_app.jsx\",\n                lineNumber: 35,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Toast, {\n                message: toast.message,\n                show: toast.show,\n                onClose: hideToast\n            }, void 0, false, {\n                fileName: \"/Users/ismile.bharmal/prompt-techniques-hub/pages/_app.jsx\",\n                lineNumber: 36,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUE4QjtBQUNvQjtBQUVsRCwrQkFBK0I7QUFDL0IsU0FBU0csTUFBTSxFQUFFQyxPQUFPLEVBQUVDLElBQUksRUFBRUMsT0FBTyxFQUFFO0lBQ3ZDSixnREFBU0EsQ0FBQztRQUNSLElBQUlHLE1BQU07WUFDUixNQUFNRSxRQUFRQyxXQUFXRixTQUFTO1lBQ2xDLE9BQU8sSUFBTUcsYUFBYUY7UUFDNUI7SUFDRixHQUFHO1FBQUNGO1FBQU1DO0tBQVE7SUFFbEIsSUFBSSxDQUFDRCxNQUFNLE9BQU87SUFFbEIscUJBQ0UsOERBQUNLO1FBQUlDLFdBQVU7a0JBQ1pQOzs7Ozs7QUFHUDtBQUVlLFNBQVNRLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDbEQsTUFBTSxDQUFDQyxPQUFPQyxTQUFTLEdBQUdmLCtDQUFRQSxDQUFDO1FBQUVJLE1BQU07UUFBT0QsU0FBUztJQUFHO0lBRTlELE1BQU1hLFlBQVksQ0FBQ2I7UUFDakJZLFNBQVM7WUFBRVgsTUFBTTtZQUFNRDtRQUFRO0lBQ2pDO0lBRUEsTUFBTWMsWUFBWTtRQUNoQkYsU0FBUztZQUFFWCxNQUFNO1lBQU9ELFNBQVM7UUFBRztJQUN0QztJQUVBLHFCQUNFOzswQkFDRSw4REFBQ1M7Z0JBQVcsR0FBR0MsU0FBUztnQkFBRUcsV0FBV0E7Ozs7OzswQkFDckMsOERBQUNkO2dCQUFNQyxTQUFTVyxNQUFNWCxPQUFPO2dCQUFFQyxNQUFNVSxNQUFNVixJQUFJO2dCQUFFQyxTQUFTWTs7Ozs7Ozs7QUFHaEUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9tcHQtdGVjaG5pcXVlcy1odWIvLi9wYWdlcy9fYXBwLmpzeD80Y2IzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJ1xuaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCdcblxuLy8gVG9hc3Qgbm90aWZpY2F0aW9uIGNvbXBvbmVudFxuZnVuY3Rpb24gVG9hc3QoeyBtZXNzYWdlLCBzaG93LCBvbkNsb3NlIH0pIHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoc2hvdykge1xuICAgICAgY29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KG9uQ2xvc2UsIDMwMDApXG4gICAgICByZXR1cm4gKCkgPT4gY2xlYXJUaW1lb3V0KHRpbWVyKVxuICAgIH1cbiAgfSwgW3Nob3csIG9uQ2xvc2VdKVxuXG4gIGlmICghc2hvdykgcmV0dXJuIG51bGxcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgdG9wLTQgcmlnaHQtNCBiZy1ncmVlbi01MDAgdGV4dC13aGl0ZSBweC00IHB5LTIgcm91bmRlZC1sZyBzaGFkb3ctbGcgei01MCBhbmltYXRlLWZhZGUtaW5cIj5cbiAgICAgIHttZXNzYWdlfVxuICAgIDwvZGl2PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcbiAgY29uc3QgW3RvYXN0LCBzZXRUb2FzdF0gPSB1c2VTdGF0ZSh7IHNob3c6IGZhbHNlLCBtZXNzYWdlOiAnJyB9KVxuXG4gIGNvbnN0IHNob3dUb2FzdCA9IChtZXNzYWdlKSA9PiB7XG4gICAgc2V0VG9hc3QoeyBzaG93OiB0cnVlLCBtZXNzYWdlIH0pXG4gIH1cblxuICBjb25zdCBoaWRlVG9hc3QgPSAoKSA9PiB7XG4gICAgc2V0VG9hc3QoeyBzaG93OiBmYWxzZSwgbWVzc2FnZTogJycgfSlcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gc2hvd1RvYXN0PXtzaG93VG9hc3R9IC8+XG4gICAgICA8VG9hc3QgbWVzc2FnZT17dG9hc3QubWVzc2FnZX0gc2hvdz17dG9hc3Quc2hvd30gb25DbG9zZT17aGlkZVRvYXN0fSAvPlxuICAgIDwvPlxuICApXG59XG4iXSwibmFtZXMiOlsiUmVhY3QiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsIlRvYXN0IiwibWVzc2FnZSIsInNob3ciLCJvbkNsb3NlIiwidGltZXIiLCJzZXRUaW1lb3V0IiwiY2xlYXJUaW1lb3V0IiwiZGl2IiwiY2xhc3NOYW1lIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwidG9hc3QiLCJzZXRUb2FzdCIsInNob3dUb2FzdCIsImhpZGVUb2FzdCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.jsx\n");

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