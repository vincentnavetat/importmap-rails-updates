// idiomorph@0.7.4 downloaded from https://ga.jspm.io/npm:idiomorph@0.7.4/dist/idiomorph.esm.js

/**
 * @typedef {object} ConfigHead
 *
 * @property {'merge' | 'append' | 'morph' | 'none'} [style]
 * @property {boolean} [block]
 * @property {boolean} [ignore]
 * @property {function(Element): boolean} [shouldPreserve]
 * @property {function(Element): boolean} [shouldReAppend]
 * @property {function(Element): boolean} [shouldRemove]
 * @property {function(Element, {added: Node[], kept: Element[], removed: Element[]}): void} [afterHeadMorphed]
 */
/**
 * @typedef {object} ConfigCallbacks
 *
 * @property {function(Node): boolean} [beforeNodeAdded]
 * @property {function(Node): void} [afterNodeAdded]
 * @property {function(Element, Node): boolean} [beforeNodeMorphed]
 * @property {function(Element, Node): void} [afterNodeMorphed]
 * @property {function(Element): boolean} [beforeNodeRemoved]
 * @property {function(Element): void} [afterNodeRemoved]
 * @property {function(string, Element, "update" | "remove"): boolean} [beforeAttributeUpdated]
 */
/**
 * @typedef {object} Config
 *
 * @property {'outerHTML' | 'innerHTML'} [morphStyle]
 * @property {boolean} [ignoreActive]
 * @property {boolean} [ignoreActiveValue]
 * @property {boolean} [restoreFocus]
 * @property {ConfigCallbacks} [callbacks]
 * @property {ConfigHead} [head]
 */
/**
 * @typedef {function} NoOp
 *
 * @returns {void}
 */
/**
 * @typedef {object} ConfigHeadInternal
 *
 * @property {'merge' | 'append' | 'morph' | 'none'} style
 * @property {boolean} [block]
 * @property {boolean} [ignore]
 * @property {(function(Element): boolean) | NoOp} shouldPreserve
 * @property {(function(Element): boolean) | NoOp} shouldReAppend
 * @property {(function(Element): boolean) | NoOp} shouldRemove
 * @property {(function(Element, {added: Node[], kept: Element[], removed: Element[]}): void) | NoOp} afterHeadMorphed
 */
/**
 * @typedef {object} ConfigCallbacksInternal
 *
 * @property {(function(Node): boolean) | NoOp} beforeNodeAdded
 * @property {(function(Node): void) | NoOp} afterNodeAdded
 * @property {(function(Node, Node): boolean) | NoOp} beforeNodeMorphed
 * @property {(function(Node, Node): void) | NoOp} afterNodeMorphed
 * @property {(function(Node): boolean) | NoOp} beforeNodeRemoved
 * @property {(function(Node): void) | NoOp} afterNodeRemoved
 * @property {(function(string, Element, "update" | "remove"): boolean) | NoOp} beforeAttributeUpdated
 */
/**
 * @typedef {object} ConfigInternal
 *
 * @property {'outerHTML' | 'innerHTML'} morphStyle
 * @property {boolean} [ignoreActive]
 * @property {boolean} [ignoreActiveValue]
 * @property {boolean} [restoreFocus]
 * @property {ConfigCallbacksInternal} callbacks
 * @property {ConfigHeadInternal} head
 */
/**
 * @typedef {Object} IdSets
 * @property {Set<string>} persistentIds
 * @property {Map<Node, Set<string>>} idMap
 */
/**
 * @typedef {Function} Morph
 *
 * @param {Element | Document} oldNode
 * @param {Element | Node | HTMLCollection | Node[] | string | null} newContent
 * @param {Config} [config]
 * @returns {undefined | Node[]}
 */
/**
 *
 * @type {{defaults: ConfigInternal, morph: Morph}}
 */
var e=function(){
/**
   * @typedef {object} MorphContext
   *
   * @property {Element} target
   * @property {Element} newContent
   * @property {ConfigInternal} config
   * @property {ConfigInternal['morphStyle']} morphStyle
   * @property {ConfigInternal['ignoreActive']} ignoreActive
   * @property {ConfigInternal['ignoreActiveValue']} ignoreActiveValue
   * @property {ConfigInternal['restoreFocus']} restoreFocus
   * @property {Map<Node, Set<string>>} idMap
   * @property {Set<string>} persistentIds
   * @property {ConfigInternal['callbacks']} callbacks
   * @property {ConfigInternal['head']} head
   * @property {HTMLDivElement} pantry
   * @property {Element[]} activeElementAndParents
   */
const e=()=>{};
/**
   * Default configuration values, updatable by users now
   * @type {ConfigInternal}
   */const t={morphStyle:"outerHTML",callbacks:{beforeNodeAdded:e,afterNodeAdded:e,beforeNodeMorphed:e,afterNodeMorphed:e,beforeNodeRemoved:e,afterNodeRemoved:e,beforeAttributeUpdated:e},head:{style:"merge",shouldPreserve:e=>e.getAttribute("im-preserve")==="true",shouldReAppend:e=>e.getAttribute("im-re-append")==="true",shouldRemove:e,afterHeadMorphed:e},restoreFocus:true};
/**
   * Core idiomorph function for morphing one DOM tree to another
   *
   * @param {Element | Document} oldNode
   * @param {Element | Node | HTMLCollection | Node[] | string | null} newContent
   * @param {Config} [config]
   * @returns {Promise<Node[]> | Node[]}
   */function n(e,t,n={}){e=u(e);const l=d(t);const s=c(e,l,n);const f=o(s,(()=>a(s,e,l,(
/** @param {MorphContext} ctx */t=>{if(t.morphStyle==="innerHTML"){i(t,e,l);return Array.from(e.childNodes)}return r(t,e,l)}))));s.pantry.remove();return f}
/**
   * Morph just the outerHTML of the oldNode to the newContent
   * We have to be careful because the oldNode could have siblings which need to be untouched
   * @param {MorphContext} ctx
   * @param {Element} oldNode
   * @param {Element} newNode
   * @returns {Node[]}
   */function r(e,t,n){const r=d(t);i(e,r,n,t,t.nextSibling);return Array.from(r.childNodes)}
/**
   * @param {MorphContext} ctx
   * @param {Function} fn
   * @returns {Promise<Node[]> | Node[]}
   */function o(e,t){if(!e.config.restoreFocus)return t();let n=
/** @type {HTMLInputElement|HTMLTextAreaElement|null} */document.activeElement;if(!(n instanceof HTMLInputElement||n instanceof HTMLTextAreaElement))return t();const{id:r,selectionStart:o,selectionEnd:i}=n;const l=t();if(r&&r!==document.activeElement?.getAttribute("id")){n=e.target.querySelector(`[id="${r}"]`);n?.focus()}n&&!n.selectionEnd&&i&&n.setSelectionRange(o,i);return l}const i=function(){
/**
     * This is the core algorithm for matching up children.  The idea is to use id sets to try to match up
     * nodes as faithfully as possible.  We greedily match, which allows us to keep the algorithm fast, but
     * by using id sets, we are able to better match up with content deeper in the DOM.
     *
     * Basic algorithm:
     * - for each node in the new content:
     *   - search self and siblings for an id set match, falling back to a soft match
     *   - if match found
     *     - remove any nodes up to the match:
     *       - pantry persistent nodes
     *       - delete the rest
     *     - morph the match
     *   - elsif no match found, and node is persistent
     *     - find its match by querying the old root (future) and pantry (past)
     *     - move it and its children here
     *     - morph it
     *   - else
     *     - create a new node from scratch as a last result
     *
     * @param {MorphContext} ctx the merge context
     * @param {Element} oldParent the old content that we are merging the new content into
     * @param {Element} newParent the parent element of the new content
     * @param {Node|null} [insertionPoint] the point in the DOM we start morphing at (defaults to first child)
     * @param {Node|null} [endPoint] the point in the DOM we stop morphing at (defaults to after last child)
     */
function e(e,a,s,c=null,u=null){if(a instanceof HTMLTemplateElement&&s instanceof HTMLTemplateElement){a=a.content;s=s.content}c||=a.firstChild;for(const r of s.childNodes){if(c&&c!=u){const t=n(e,r,c,u);if(t){t!==c&&o(e,c,t);l(t,r,e);c=t.nextSibling;continue}}if(r instanceof Element){const t=/** @type {String} */r.getAttribute("id");if(e.persistentIds.has(t)){const n=i(a,t,c,e);l(n,r,e);c=n.nextSibling;continue}}const s=t(a,r,c,e);s&&(c=s.nextSibling)}while(c&&c!=u){const t=c;c=c.nextSibling;r(e,t)}}
/**
     * This performs the action of inserting a new node while handling situations where the node contains
     * elements with persistent ids and possible state info we can still preserve by moving in and then morphing
     *
     * @param {Element} oldParent
     * @param {Node} newChild
     * @param {Node|null} insertionPoint
     * @param {MorphContext} ctx
     * @returns {Node|null}
     */function t(e,t,n,r){if(r.callbacks.beforeNodeAdded(t)===false)return null;if(r.idMap.has(t)){const o=document.createElement(
/** @type {Element} */t.tagName);e.insertBefore(o,n);l(o,t,r);r.callbacks.afterNodeAdded(o);return o}{const o=document.importNode(t,true);e.insertBefore(o,n);r.callbacks.afterNodeAdded(o);return o}}const n=function(){
/**
       * Scans forward from the startPoint to the endPoint looking for a match
       * for the node. It looks for an id set match first, then a soft match.
       * We abort softmatching if we find two future soft matches, to reduce churn.
       * @param {Node} node
       * @param {MorphContext} ctx
       * @param {Node | null} startPoint
       * @param {Node | null} endPoint
       * @returns {Node | null}
       */
function e(e,r,o,i){let l=null;let a=r.nextSibling;let s=0;let c=o;while(c&&c!=i){if(n(c,r)){if(t(e,c,r))return c;l===null&&(e.idMap.has(c)||(l=c))}if(l===null&&a&&n(c,a)){s++;a=a.nextSibling;s>=2&&(l=void 0)}if(e.activeElementAndParents.includes(c))break;c=c.nextSibling}return l||null}
/**
       *
       * @param {MorphContext} ctx
       * @param {Node} oldNode
       * @param {Node} newNode
       * @returns {boolean}
       */function t(e,t,n){let r=e.idMap.get(t);let o=e.idMap.get(n);if(!o||!r)return false;for(const e of r)if(o.has(e))return true;return false}
/**
       *
       * @param {Node} oldNode
       * @param {Node} newNode
       * @returns {boolean}
       */function n(e,t){const n=/** @type {Element} */e;const r=/** @type {Element} */t;return n.nodeType===r.nodeType&&n.tagName===r.tagName&&(!n.getAttribute?.("id")||n.getAttribute?.("id")===r.getAttribute?.("id"))}return e}();
/**
     * Gets rid of an unwanted DOM node; strategy depends on nature of its reuse:
     * - Persistent nodes will be moved to the pantry for later reuse
     * - Other nodes will have their hooks called, and then are removed
     * @param {MorphContext} ctx
     * @param {Node} node
     */function r(e,t){if(e.idMap.has(t))s(e.pantry,t,null);else{if(e.callbacks.beforeNodeRemoved(t)===false)return;t.parentNode?.removeChild(t);e.callbacks.afterNodeRemoved(t)}}
/**
     * Remove nodes between the start and end nodes
     * @param {MorphContext} ctx
     * @param {Node} startInclusive
     * @param {Node} endExclusive
     * @returns {Node|null}
     */function o(e,t,n){
/** @type {Node | null} */
let o=t;while(o&&o!==n){let t=/** @type {Node} */o;o=o.nextSibling;r(e,t)}return o}
/**
     * Search for an element by id within the document and pantry, and move it using moveBefore.
     *
     * @param {Element} parentNode - The parent node to which the element will be moved.
     * @param {string} id - The ID of the element to be moved.
     * @param {Node | null} after - The reference node to insert the element before.
     *                              If `null`, the element is appended as the last child.
     * @param {MorphContext} ctx
     * @returns {Element} The found element
     */function i(e,t,n,r){const o=
/** @type {Element} - will always be found */
r.target.getAttribute?.("id")===t&&r.target||r.target.querySelector(`[id="${t}"]`)||r.pantry.querySelector(`[id="${t}"]`);a(o,r);s(e,o,n);return o}
/**
     * Removes an element from its ancestors' id maps. This is needed when an element is moved from the
     * "future" via `moveBeforeId`. Otherwise, its erstwhile ancestors could be mistakenly moved to the
     * pantry rather than being deleted, preventing their removal hooks from being called.
     *
     * @param {Element} element - element to remove from its ancestors' id maps
     * @param {MorphContext} ctx
     */function a(e,t){const n=/** @type {String} */e.getAttribute("id");while(e=e.parentNode){let r=t.idMap.get(e);if(r){r.delete(n);r.size||t.idMap.delete(e)}}}
/**
     * Moves an element before another element within the same parent.
     * Uses the proposed `moveBefore` API if available (and working), otherwise falls back to `insertBefore`.
     * This is essentialy a forward-compat wrapper.
     *
     * @param {Element} parentNode - The parent node containing the after element.
     * @param {Node} element - The element to be moved.
     * @param {Node | null} after - The reference node to insert `element` before.
     *                              If `null`, `element` is appended as the last child.
     */function s(e,t,n){if(e.moveBefore)try{e.moveBefore(t,n)}catch(r){e.insertBefore(t,n)}else e.insertBefore(t,n)}return e}();const l=function(){
/**
     * @param {Node} oldNode root node to merge content into
     * @param {Node} newContent new content to merge
     * @param {MorphContext} ctx the merge context
     * @returns {Node | null} the element that ended up in the DOM
     */
function e(e,n,r){if(r.ignoreActive&&e===document.activeElement)return null;if(r.callbacks.beforeNodeMorphed(e,n)===false)return e;if(e instanceof HTMLHeadElement&&r.head.ignore);else if(e instanceof HTMLHeadElement&&r.head.style!=="morph")s(e,
/** @type {HTMLHeadElement} */n,r);else{t(e,n,r);l(e,r)||i(r,e,n)}r.callbacks.afterNodeMorphed(e,n);return e}
/**
     * syncs the oldNode to the newNode, copying over all attributes and
     * inner element state from the newNode to the oldNode
     *
     * @param {Node} oldNode the node to copy attributes & state to
     * @param {Node} newNode the node to copy attributes & state from
     * @param {MorphContext} ctx the merge context
     */function t(e,t,r){let i=t.nodeType;if(i===1){const i=/** @type {Element} */e;const a=/** @type {Element} */t;const s=i.attributes;const c=a.attributes;for(const e of c)o(e.name,i,"update",r)||i.getAttribute(e.name)!==e.value&&i.setAttribute(e.name,e.value);for(let e=s.length-1;0<=e;e--){const t=s[e];if(t&&!a.hasAttribute(t.name)){if(o(t.name,i,"remove",r))continue;i.removeAttribute(t.name)}}l(i,r)||n(i,a,r)}i!==8&&i!==3||e.nodeValue!==t.nodeValue&&(e.nodeValue=t.nodeValue)}
/**
     * NB: many bothans died to bring us information:
     *
     *  https://github.com/patrick-steele-idem/morphdom/blob/master/src/specialElHandlers.js
     *  https://github.com/choojs/nanomorph/blob/master/lib/morph.jsL113
     *
     * @param {Element} oldElement the element to sync the input value to
     * @param {Element} newElement the element to sync the input value from
     * @param {MorphContext} ctx the merge context
     */function n(e,t,n){if(e instanceof HTMLInputElement&&t instanceof HTMLInputElement&&t.type!=="file"){let i=t.value;let l=e.value;r(e,t,"checked",n);r(e,t,"disabled",n);if(t.hasAttribute("value")){if(l!==i&&!o("value",e,"update",n)){e.setAttribute("value",i);e.value=i}}else if(!o("value",e,"remove",n)){e.value="";e.removeAttribute("value")}}else if(e instanceof HTMLOptionElement&&t instanceof HTMLOptionElement)r(e,t,"selected",n);else if(e instanceof HTMLTextAreaElement&&t instanceof HTMLTextAreaElement){let r=t.value;let i=e.value;if(o("value",e,"update",n))return;r!==i&&(e.value=r);e.firstChild&&e.firstChild.nodeValue!==r&&(e.firstChild.nodeValue=r)}}
/**
     * @param {Element} oldElement element to write the value to
     * @param {Element} newElement element to read the value from
     * @param {string} attributeName the attribute name
     * @param {MorphContext} ctx the merge context
     */function r(e,t,n,r){const i=t[n],l=e[n];if(i!==l){const l=o(n,e,"update",r);l||(e[n]=t[n]);i?l||e.setAttribute(n,""):o(n,e,"remove",r)||e.removeAttribute(n)}}
/**
     * @param {string} attr the attribute to be mutated
     * @param {Element} element the element that is going to be updated
     * @param {"update" | "remove"} updateType
     * @param {MorphContext} ctx the merge context
     * @returns {boolean} true if the attribute should be ignored, false otherwise
     */function o(e,t,n,r){return!(e!=="value"||!r.ignoreActiveValue||t!==document.activeElement)||r.callbacks.beforeAttributeUpdated(e,t,n)===false}
/**
     * @param {Node} possibleActiveElement
     * @param {MorphContext} ctx
     * @returns {boolean}
     */function l(e,t){return!!t.ignoreActiveValue&&e===document.activeElement&&e!==document.body}return e}();
/**
   * @param {MorphContext} ctx
   * @param {Element} oldNode
   * @param {Element} newNode
   * @param {function} callback
   * @returns {Node[] | Promise<Node[]>}
   */function a(e,t,n,r){if(e.head.block){const o=t.querySelector("head");const i=n.querySelector("head");if(o&&i){const t=s(o,i,e);return Promise.all(t).then((()=>{const t=Object.assign(e,{head:{block:false,ignore:true}});return r(t)}))}}return r(e)}
/**
   *  The HEAD tag can be handled specially, either w/ a 'merge' or 'append' style
   *
   * @param {Element} oldHead
   * @param {Element} newHead
   * @param {MorphContext} ctx
   * @returns {Promise<void>[]}
   */function s(e,t,n){let r=[];let o=[];let i=[];let l=[];let a=new Map;for(const e of t.children)a.set(e.outerHTML,e);for(const t of e.children){let e=a.has(t.outerHTML);let r=n.head.shouldReAppend(t);let s=n.head.shouldPreserve(t);if(e||s)if(r)o.push(t);else{a.delete(t.outerHTML);i.push(t)}else if(n.head.style==="append"){if(r){o.push(t);l.push(t)}}else n.head.shouldRemove(t)!==false&&o.push(t)}l.push(...a.values());let s=[];for(const t of l){let o=/** @type {ChildNode} */document.createRange().createContextualFragment(t.outerHTML).firstChild;if(n.callbacks.beforeNodeAdded(o)!==false){if("href"in o&&o.href||"src"in o&&o.src){
/** @type {(result?: any) => void} */let e;let t=new Promise((function(t){e=t}));o.addEventListener("load",(function(){e()}));s.push(t)}e.appendChild(o);n.callbacks.afterNodeAdded(o);r.push(o)}}for(const t of o)if(n.callbacks.beforeNodeRemoved(t)!==false){e.removeChild(t);n.callbacks.afterNodeRemoved(t)}n.head.afterHeadMorphed(e,{added:r,kept:i,removed:o});return s}const c=function(){
/**
     *
     * @param {Element} oldNode
     * @param {Element} newContent
     * @param {Config} config
     * @returns {MorphContext}
     */
function e(e,t,i){const{persistentIds:l,idMap:s}=a(e,t);const c=n(i);const u=c.morphStyle||"outerHTML";if(!["innerHTML","outerHTML"].includes(u))throw`Do not understand how to morph style ${u}`;return{target:e,newContent:t,config:c,morphStyle:u,ignoreActive:c.ignoreActive,ignoreActiveValue:c.ignoreActiveValue,restoreFocus:c.restoreFocus,idMap:s,persistentIds:l,pantry:r(),activeElementAndParents:o(e),callbacks:c.callbacks,head:c.head}}
/**
     * Deep merges the config object and the Idiomorph.defaults object to
     * produce a final configuration object
     * @param {Config} config
     * @returns {ConfigInternal}
     */function n(e){let n=Object.assign({},t);Object.assign(n,e);n.callbacks=Object.assign({},t.callbacks,e.callbacks);n.head=Object.assign({},t.head,e.head);return n}
/**
     * @returns {HTMLDivElement}
     */function r(){const e=document.createElement("div");e.hidden=true;document.body.insertAdjacentElement("afterend",e);return e}
/**
     * @param {Element} oldNode
     * @returns {Element[]}
     */function o(e){
/** @type {Element[]} */
let t=[];let n=document.activeElement;if(n?.tagName!=="BODY"&&e.contains(n))while(n){t.push(n);if(n===e)break;n=n.parentElement}return t}
/**
     * Returns all elements with an ID contained within the root element and its descendants
     *
     * @param {Element} root
     * @returns {Element[]}
     */function i(e){let t=Array.from(e.querySelectorAll("[id]"));e.getAttribute?.("id")&&t.push(e);return t}
/**
     * A bottom-up algorithm that populates a map of Element -> IdSet.
     * The idSet for a given element is the set of all IDs contained within its subtree.
     * As an optimzation, we filter these IDs through the given list of persistent IDs,
     * because we don't need to bother considering IDed elements that won't be in the new content.
     *
     * @param {Map<Node, Set<string>>} idMap
     * @param {Set<string>} persistentIds
     * @param {Element} root
     * @param {Element[]} elements
     */function l(e,t,n,r){for(const o of r){const r=/** @type {String} */o.getAttribute("id");if(t.has(r)){
/** @type {Element|null} */
let t=o;while(t){let o=e.get(t);if(o==null){o=new Set;e.set(t,o)}o.add(r);if(t===n)break;t=t.parentElement}}}}
/**
     * This function computes a map of nodes to all ids contained within that node (inclusive of the
     * node).  This map can be used to ask if two nodes have intersecting sets of ids, which allows
     * for a looser definition of "matching" than tradition id matching, and allows child nodes
     * to contribute to a parent nodes matching.
     *
     * @param {Element} oldContent  the old content that will be morphed
     * @param {Element} newContent  the new content to morph to
     * @returns {IdSets}
     */function a(e,t){const n=i(e);const r=i(t);const o=s(n,r);
/** @type {Map<Node, Set<string>>} */let a=new Map;l(a,o,e,n);const c=t.__idiomorphRoot||t;l(a,o,c,r);return{persistentIds:o,idMap:a}}
/**
     * This function computes the set of ids that persist between the two contents excluding duplicates
     *
     * @param {Element[]} oldIdElements
     * @param {Element[]} newIdElements
     * @returns {Set<string>}
     */function s(e,t){let n=new Set;
/** @type {Map<string, string>} */let r=new Map;for(const{id:t,tagName:o}of e)r.has(t)?n.add(t):r.set(t,o);let o=new Set;for(const{id:e,tagName:i}of t)o.has(e)?n.add(e):r.get(e)===i&&o.add(e);for(const e of n)o.delete(e);return o}return e}();const{normalizeElement:u,normalizeParent:d}=function(){
/** @type {WeakSet<Node>} */
const e=new WeakSet;
/**
     *
     * @param {Element | Document} content
     * @returns {Element}
     */function t(e){return e instanceof Document?e.documentElement:e}
/**
     *
     * @param {null | string | Node | HTMLCollection | Node[] | Document & {generatedByIdiomorph:boolean}} newContent
     * @returns {Element}
     */function n(t){if(t==null)return document.createElement("div");if(typeof t==="string")return n(r(t));if(e.has(/** @type {Element} */t))/** @type {Element} */
return t;if(t instanceof Node){if(t.parentNode)
/** @type {Element} */ /** @type {any} */
return new SlicedParentNode(t);{const e=document.createElement("div");e.append(t);return e}}{const e=document.createElement("div");for(const n of[...t])e.append(n);return e}}class SlicedParentNode{
/** @param {Node} node */
constructor(e){this.originalNode=e;this.realParentNode=/** @type {Element} */e.parentNode;this.previousSibling=e.previousSibling;this.nextSibling=e.nextSibling}
/** @returns {Node[]} */get childNodes(){const e=[];let t=this.previousSibling?this.previousSibling.nextSibling:this.realParentNode.firstChild;while(t&&t!=this.nextSibling){e.push(t);t=t.nextSibling}return e}
/**
       * @param {string} selector
       * @returns {Element[]}
       */querySelectorAll(e){return this.childNodes.reduce(((t,n)=>{if(n instanceof Element){n.matches(e)&&t.push(n);const r=n.querySelectorAll(e);for(let e=0;e<r.length;e++)t.push(r[e])}return t}),/** @type {Element[]} */[])}
/**
       * @param {Node} node
       * @param {Node} referenceNode
       * @returns {Node}
       */insertBefore(e,t){return this.realParentNode.insertBefore(e,t)}
/**
       * @param {Node} node
       * @param {Node} referenceNode
       * @returns {Node}
       */moveBefore(e,t){return this.realParentNode.moveBefore(e,t)}
/**
       * for later use with populateIdMapWithTree to halt upwards iteration
       * @returns {Node}
       */get __idiomorphRoot(){return this.originalNode}}
/**
     *
     * @param {string} newContent
     * @returns {Node | null | DocumentFragment}
     */function r(t){let n=new DOMParser;let r=t.replace(/<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim,"");if(r.match(/<\/html>/)||r.match(/<\/head>/)||r.match(/<\/body>/)){let o=n.parseFromString(t,"text/html");if(r.match(/<\/html>/)){e.add(o);return o}{let t=o.firstChild;t&&e.add(t);return t}}{let r=n.parseFromString("<body><template>"+t+"</template></body>","text/html");let o=/** @type {HTMLTemplateElement} */r.body.querySelector("template").content;e.add(o);return o}}return{normalizeElement:t,normalizeParent:n}}();return{morph:n,defaults:t}}();export{e as Idiomorph};

