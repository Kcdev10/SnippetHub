"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const snippet_controller_1 = require("../controllers/snippet.controller");
const router = (0, express_1.Router)();
router.route('/').get(snippet_controller_1.getSnippets);
router.route('/folder/:folderId').get(snippet_controller_1.getSnippets);
router.route('/create').post(snippet_controller_1.createSnippet);
router.route('/update/:snippetId').post(snippet_controller_1.updateSnippet);
router.route('/delete/:snippetId').delete(snippet_controller_1.deleteSnippets);
// router.route('/:id').get(getSnippetById).delete(deleteSnippet);
exports.default = router;
