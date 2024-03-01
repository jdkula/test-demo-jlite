"use strict";
(self["webpackChunkrockset_jupyterlite"] = self["webpackChunkrockset_jupyterlite"] || []).push([["lib_index_js"],{

/***/ "./lib/api.js":
/*!********************!*\
  !*** ./lib/api.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ApiMessenger: () => (/* binding */ ApiMessenger),
/* harmony export */   JupyterResponseHandler: () => (/* binding */ JupyterResponseHandler)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./lib/util.js");

class ApiMessenger {
    constructor(iam, responseHandler) {
        this.ready_ = false;
        this.shuttingDown_ = false;
        this.onFinish_ = null;
        this.nonce_ = 0;
        this.iam_ = iam;
        this.responseHandler_ = responseHandler !== null && responseHandler !== void 0 ? responseHandler : null;
        this.destination_ = iam === 'child' ? 'host' : 'child';
        this.window_ = iam === 'child' ? window.parent : window.frames[0];
        this.handler_ = this.handler_.bind(this);
        this.waiting_ = [];
        this.resolutions_ = new Map();
        window.addEventListener('message', this.handler_);
        this.doSend_({ type: 'rs-ping', destination: this.destination_ });
    }
    get ready() {
        return this.ready_;
    }
    destroy() {
        this.shuttingDown_ = true;
        if (this.resolutions_.size == 0) {
            window.removeEventListener('message', this.handler_);
        }
        else {
            this.onFinish_ = () => window.removeEventListener('message', this.handler_);
        }
    }
    onReady() {
        this.ready_ = true;
        for (const req of this.waiting_) {
            this.doSend_(req);
        }
        this.waiting_.splice(0, this.waiting_.length);
    }
    async handler_(e) {
        var _a, _b;
        if (((_a = e.data) === null || _a === void 0 ? void 0 : _a.destination) !== this.iam_) {
            return;
        }
        console.log(this.iam_, 'HANDLED', e);
        switch (e.data.type) {
            case 'rs-res':
                const resolution = this.resolutions_.get(e.data.nonce);
                if (!resolution)
                    break;
                if (e.data.error) {
                    resolution.reject(e.data.data);
                }
                else {
                    resolution.resolve(e.data.data);
                }
                this.resolutions_.delete(e.data.nonce);
                break;
            case 'rs-pong':
                this.onReady();
                break;
            case 'rs-ping':
                this.doSend_({ type: 'rs-pong', destination: this.destination_ });
                break;
            case 'rs-req':
                try {
                    const result = await ((_b = this.responseHandler_) === null || _b === void 0 ? void 0 : _b.call(this, e.data.fn, ...e.data.args));
                    this.doSend_({
                        type: 'rs-res',
                        data: result,
                        destination: this.destination_,
                        error: false,
                        nonce: e.data.nonce
                    });
                }
                catch (ex) {
                    this.doSend_({
                        type: 'rs-res',
                        data: String(ex),
                        destination: this.destination_,
                        error: true,
                        nonce: e.data.nonce
                    });
                }
                break;
        }
        if (this.resolutions_.size === 0 && this.onFinish_ !== null) {
            this.onFinish_();
        }
    }
    doSend_(msg) {
        var _a;
        console.log(this.iam_, 'SENDING', msg);
        (_a = this.window_) === null || _a === void 0 ? void 0 : _a.postMessage(msg, '*');
    }
    sendPing() {
        this.doSend_({ type: 'rs-ping', destination: this.destination_ });
    }
    async send(msg) {
        if (this.shuttingDown_) {
            throw new Error('Messenger is shutting down...');
        }
        const full = {
            ...msg,
            nonce: this.nonce_++,
            type: 'rs-req',
            destination: this.destination_
        };
        const prom = new Promise((resolve, reject) => {
            this.resolutions_.set(full.nonce, { resolve, reject });
        });
        if (!this.ready) {
            this.waiting_.push(full);
        }
        else {
            this.doSend_(full);
        }
        return prom;
    }
}
class JupyterResponseHandler {
    constructor(contents_, docs_, lab_) {
        this.contents_ = contents_;
        this.docs_ = docs_;
        this.lab_ = lab_;
        this.handler = async (fn, ...args) => {
            if (!(fn in this)) {
                throw new Error(`${fn} is not a valid function.`);
            }
            return await this[fn](...args);
        };
    }
    async getAllNotebooks() {
        return await (0,_util__WEBPACK_IMPORTED_MODULE_0__.getAllNotebooks)(this.contents_);
    }
    async setupNotebook(nb) {
        await (0,_util__WEBPACK_IMPORTED_MODULE_0__.saveAndCloseAll)(this.lab_, this.docs_);
        if (Array.isArray(nb)) {
            await (0,_util__WEBPACK_IMPORTED_MODULE_0__.createSkeleton)(this.docs_, nb);
        }
        else {
            await (0,_util__WEBPACK_IMPORTED_MODULE_0__.setDocument)(this.docs_, nb);
        }
    }
}


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ButtonExtension: () => (/* binding */ ButtonExtension),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/application */ "webpack/sharing/consume/default/@jupyterlab/application");
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/docmanager */ "webpack/sharing/consume/default/@jupyterlab/docmanager");
/* harmony import */ var _jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/launcher */ "webpack/sharing/consume/default/@jupyterlab/launcher");
/* harmony import */ var _jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./api */ "./lib/api.js");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_3__);





/**
 * Initialization data for the rockset-jupyterlite extension.
 */
const plugin = {
    id: 'rockset-jupyterlite:plugin',
    description: 'A JupyterLab extension.',
    autoStart: true,
    optional: [_jupyterlab_launcher__WEBPACK_IMPORTED_MODULE_2__.ILauncher],
    requires: [_jupyterlab_docmanager__WEBPACK_IMPORTED_MODULE_1__.IDocumentManager, _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__.ILabShell],
    activate: (app, docs, lab, launcher) => {
        let nonce = 1;
        setTimeout(async () => {
            lab.collapseLeft();
            lab.collapseRight();
            const h = new _api__WEBPACK_IMPORTED_MODULE_4__.JupyterResponseHandler(docs.services.contents, docs, lab);
            const msg = new _api__WEBPACK_IMPORTED_MODULE_4__.ApiMessenger('child', h.handler);
            function addLauncherTemplate({ makeCells, name, description }) {
                const cmd = `rockset:open-${nonce++}`;
                app.commands.addCommand(cmd, {
                    caption: description,
                    label: name,
                    execute: async () => {
                        const region = await msg.send({ fn: 'getRegion', args: [] });
                        const key = await msg.send({ fn: 'getApiKey', args: [] });
                        if (!key) {
                            return;
                        }
                        else {
                            await h.setupNotebook(makeCells(region, key));
                        }
                    }
                });
                launcher === null || launcher === void 0 ? void 0 : launcher.add({
                    args: { isLauncher: true, kernelName: 'template' },
                    command: cmd,
                    category: 'Notebook',
                    rank: nonce
                });
            }
            const css = document.createElement('style');
            css.innerHTML = `
      .jp-nb-interface-switcher-button {
        display: none !important;
      }
      div:has(> button[data-command="notebook:restart-run-all"]) {
        display: none !important;
      }
      `;
            document.body.appendChild(css);
            addLauncherTemplate({
                name: 'Notebook with Rockset Client',
                description: 'Initialize new notebook with Rockset API Key',
                makeCells: (region, key) => [
                    `import rockset
import pandas as pd`,
                    `client = rockset.RocksetClient('${region}', '${key}')`,
                    `def query(sql):
    return pd.DataFrame(client.Queries.query(sql={"query": sql})['results'])`,
                    `query("""
SELECT 1 as Column -- Your SQL Here
""")`
                ]
            });
            addLauncherTemplate({
                name: 'Create a bar chart from data with Rockset',
                description: 'Create a bar chart with data from Rockset',
                makeCells: (region, key) => [
                    `import rockset
import pandas as pd
import matplotlib.pyplot as plt`,
                    `client = rockset.RocksetClient('${region}', '${key}')`,
                    `## SET YOUR PARAMETERS HERE ##
QUERY_LAMBDA_WORKSPACE="commons"
QUERY_LAMBDA_NAME="your_ql_name"
QUERY_LAMBDA_TAG="latest"

# If "None", you'll be prompted dynamically using the data in the collection
LABEL_FIELD=None
VALUE_FIELD=None`,
                    `def query_ql(*, name, workspace='commons', tag='latest'):
    return client.QueryLambdas.execute_query_lambda_by_tag(
        query_lambda=name,
        workspace=workspace,
        tag=tag
    )['results']`,
                    `async def choose_label_field(data):
    options = list({
        key
        for datum in data
        for key in datum.keys()
        if type(datum[key]) == str
    })
    if len(options) == 0:
        raise Exception("No valid label fields")
    if len(options) == 1:
        return options[0]
    for i, option in enumerate(options):
        print(f"[{i}] - {option}")
    return options[int(await input("Choose the number of the field you want to use as a label: "))]

async def choose_value_field(data):
    options = list({
        key
        for datum in data
        for key in datum.keys()
        if type(datum[key]) == float or type(datum[key]) == int
    })
    if len(options) == 0:
        raise Exception("No valid label fields")
    if len(options) == 1:
        return options[0]
    for i, option in enumerate(options):
        print(f"[{i}] - {option}")
    return options[int(await input("Choose the number of the field you want to use as a value: "))]`,
                    `def create_bar_chart(data, label_field, value_field):
    pairs = {
        datum[label_field]: datum[value_field]
        for datum in data
        if label_field in datum and
            value_field in datum and
            type(datum[label_field]) == str and
            (type(datum[value_field]) == float or type(datum[value_field]) == int)
    }
    fig = plt.figure()
    plt.bar(list(pairs.keys()), list(pairs.values()))
    plt.xticks(rotation=65)
    plt.xlabel(label_field)
    plt.ylabel(value_field)
    plt.show()`,
                    `data = query_ql(
    name=QUERY_LAMBDA_NAME,
    workspace=QUERY_LAMBDA_WORKSPACE,
    tag=QUERY_LAMBDA_TAG
)`,
                    `label_field = LABEL_FIELD if LABEL_FIELD is not None else await choose_label_field(data)`,
                    `value_field = VALUE_FIELD if VALUE_FIELD is not None else await choose_value_field(data)`,
                    `create_bar_chart(
    data,
    label_field,
    value_field
)`
                ]
            });
            app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension(app));
        }, 0);
    }
};
class ButtonExtension {
    constructor(app_) {
        this.app_ = app_;
    }
    createNew(panel, context) {
        const btn = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_3__.ToolbarButton({
            label: 'Run All Cells',
            onClick: () => this.app_.commands.execute('notebook:run-all-cells')
        });
        panel.toolbar.insertItem(10, 'runAllCells', btn);
        return btn;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);


/***/ }),

/***/ "./lib/util.js":
/*!*********************!*\
  !*** ./lib/util.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSkeleton: () => (/* binding */ createSkeleton),
/* harmony export */   getAllNotebooks: () => (/* binding */ getAllNotebooks),
/* harmony export */   saveAndCloseAll: () => (/* binding */ saveAndCloseAll),
/* harmony export */   setDocument: () => (/* binding */ setDocument)
/* harmony export */ });
async function getAllNotebooks(contents, folder = '', exploredPaths) {
    exploredPaths = exploredPaths !== null && exploredPaths !== void 0 ? exploredPaths : new Set();
    const data = await contents.get(folder);
    let notebooks = [];
    for (const el of data.content) {
        const path = (folder + '/' + el.name).replace(/^\//, '');
        if (exploredPaths.has(path) || /node_modules/g.test(path)) {
            continue;
        }
        console.log('Explored', exploredPaths.size, 'paths');
        exploredPaths.add(path);
        if (el.type === 'directory') {
            notebooks = notebooks.concat(await getAllNotebooks(contents, path, exploredPaths));
        }
        else if (el.type === 'notebook') {
            const nb = await contents.get(path, { content: true });
            notebooks.push({
                path,
                contents: nb.content
            });
        }
    }
    return notebooks;
}
async function saveAndCloseAll(lab, docs) {
    const promises = [];
    for (const w of lab.widgets('main')) {
        const ctx = docs.contextForWidget(w);
        if (!ctx) {
            continue;
        }
        promises.push(ctx.save().catch(e => /* ignore 😃 */ void e));
    }
    await Promise.all(promises);
    lab.closeAll();
}
async function createSkeleton(docs, starter) {
    var _a;
    try {
        await docs.deleteFile('test.ipynb');
    }
    catch (e) {
        console.log("it probably didn't exist or something", e);
    }
    const doc = await docs.newUntitled({ type: 'notebook', ext: 'ipynb' });
    const widget = await docs.openOrReveal(doc.path, 'notebook');
    if (!widget)
        throw new Error('!!!');
    widget.isUntitled = true;
    await widget.context.ready;
    const nb = widget.content;
    for (let i = 0; i < starter.length; i++) {
        (_a = nb.model) === null || _a === void 0 ? void 0 : _a.sharedModel.insertCell(i, {
            cell_type: 'code',
            source: starter[i].trim()
        });
    }
    await widget.context.ready;
}
async function setDocument(docs, content) {
    var _a, _b;
    try {
        await docs.deleteFile('test.ipynb');
    }
    catch (e) {
        console.log("it probably didn't exist or something", e);
    }
    const nb = (_a = docs.createNew('test.ipynb')) === null || _a === void 0 ? void 0 : _a.content;
    (_b = nb.model) === null || _b === void 0 ? void 0 : _b.sharedModel.fromJSON(content);
}


/***/ })

}]);
//# sourceMappingURL=lib_index_js.8db55c81ebc1e907884a.js.map