// idiomorph@0.4.0 downloaded from https://ga.jspm.io/npm:idiomorph@0.4.0/dist/idiomorph.esm.js

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
 * @property {function(Element): boolean} [beforeNodePantried]
 */
/**
 * @typedef {object} Config
 *
 * @property {'outerHTML' | 'innerHTML'} [morphStyle]
 * @property {boolean} [ignoreActive]
 * @property {boolean} [ignoreActiveValue]
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
 * @property {(function(Node): boolean) | NoOp} beforeNodePantried
 */
/**
 * @typedef {object} ConfigInternal
 *
 * @property {'outerHTML' | 'innerHTML'} morphStyle
 * @property {boolean} [ignoreActive]
 * @property {boolean} [ignoreActiveValue]
 * @property {ConfigCallbacksInternal} callbacks
 * @property {ConfigHeadInternal} head
 * @property {boolean} [twoPass]
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
   * @property {Node} target
   * @property {Node} newContent
   * @property {ConfigInternal} config
   * @property {ConfigInternal['morphStyle']} morphStyle
   * @property {ConfigInternal['ignoreActive']} ignoreActive
   * @property {ConfigInternal['ignoreActiveValue']} ignoreActiveValue
   * @property {Map<Node, Set<string>>} idMap
   * @property {Set<string>} persistentIds
   * @property {Set<string>} deadIds
   * @property {ConfigInternal['callbacks']} callbacks
   * @property {ConfigInternal['head']} head
   * @property {HTMLDivElement} pantry
   */
/**
   *
   * @type {Set<string>}
   */
let e=new Set;
/**
   * Default configuration values, updatable by users now
   * @type {ConfigInternal}
   */let t={morphStyle:"outerHTML",callbacks:{beforeNodeAdded:noOp,afterNodeAdded:noOp,beforeNodeMorphed:noOp,afterNodeMorphed:noOp,beforeNodeRemoved:noOp,afterNodeRemoved:noOp,beforeAttributeUpdated:noOp,beforeNodePantried:noOp},head:{style:"merge",shouldPreserve:function(e){return e.getAttribute("im-preserve")==="true"},shouldReAppend:function(e){return e.getAttribute("im-re-append")==="true"},shouldRemove:noOp,afterHeadMorphed:noOp}};
/**
   * =============================================================================
   * Core Morphing Algorithm - morph, morphNormalizedContent, morphOldNodeTo, morphChildren
   * =============================================================================
   *
   * @param {Element | Document} oldNode
   * @param {Element | Node | HTMLCollection | Node[] | string | null} newContent
   * @param {Config} [config]
   * @returns {undefined | Node[]}
   */function morph(e,t,n={}){e instanceof Document&&(e=e.documentElement);typeof t==="string"&&(t=parseContent(t));let o=normalizeContent(t);let r=createMorphContext(e,o,n);return morphNormalizedContent(e,o,r)}
/**
   *
   * @param {Element} oldNode
   * @param {Element} normalizedNewContent
   * @param {MorphContext} ctx
   * @returns {undefined | Node[]}
   */function morphNormalizedContent(e,t,n){if(n.head.block){let o=e.querySelector("head");let r=t.querySelector("head");if(o&&r){let l=handleHeadElement(r,o,n);Promise.all(l).then((function(){morphNormalizedContent(e,t,Object.assign(n,{head:{block:false,ignore:true}}))}));return}}if(n.morphStyle==="innerHTML"){morphChildren(t,e,n);n.config.twoPass&&restoreFromPantry(e,n);return Array.from(e.children)}if(n.morphStyle!=="outerHTML"&&n.morphStyle!=null)throw"Do not understand how to morph style "+n.morphStyle;{let o=findBestNodeMatch(t,e,n);let r=o?.previousSibling??null;let l=o?.nextSibling??null;let i=morphOldNodeTo(e,o,n);if(!o)return[];if(i){const e=insertSiblings(r,i,l);n.config.twoPass&&restoreFromPantry(i.parentNode,n);return e}}}
/**
   * @param {Node} possibleActiveElement
   * @param {MorphContext} ctx
   * @returns {boolean}
   */function ignoreValueOfActiveElement(e,t){return!!t.ignoreActiveValue&&e===document.activeElement&&e!==document.body}
/**
   * @param {Node} oldNode root node to merge content into
   * @param {Node | null} newContent new content to merge
   * @param {MorphContext} ctx the merge context
   * @returns {Node | null} the element that ended up in the DOM
   */function morphOldNodeTo(e,t,n){if(!n.ignoreActive||e!==document.activeElement){if(t==null){if(n.callbacks.beforeNodeRemoved(e)===false)return e;e.parentNode?.removeChild(e);n.callbacks.afterNodeRemoved(e);return null}if(isSoftMatch(e,t)){if(n.callbacks.beforeNodeMorphed(e,t)===false)return e;if(e instanceof HTMLHeadElement&&n.head.ignore);else if(e instanceof HTMLHeadElement&&n.head.style!=="morph")handleHeadElement(
/** @type {HTMLHeadElement} */t,e,n);else{syncNodeFrom(t,e,n);ignoreValueOfActiveElement(e,n)||morphChildren(t,e,n)}n.callbacks.afterNodeMorphed(e,t);return e}if(n.callbacks.beforeNodeRemoved(e)===false)return e;if(n.callbacks.beforeNodeAdded(t)===false)return e;e.parentNode?.replaceChild(t,e);n.callbacks.afterNodeAdded(t);n.callbacks.afterNodeRemoved(e);return t}return null}
/**
   * This is the core algorithm for matching up children.  The idea is to use id sets to try to match up
   * nodes as faithfully as possible.  We greedily match, which allows us to keep the algorithm fast, but
   * by using id sets, we are able to better match up with content deeper in the DOM.
   *
   * Basic algorithm is, for each node in the new content:
   *
   * - if we have reached the end of the old parent, append the new content
   * - if the new content has an id set match with the current insertion point, morph
   * - search for an id set match
   * - if id set match found, morph
   * - otherwise search for a "soft" match
   * - if a soft match is found, morph
   * - otherwise, prepend the new node before the current insertion point
   *
   * The two search algorithms terminate if competing node matches appear to outweigh what can be achieved
   * with the current node.  See findIdSetMatch() and findSoftMatch() for details.
   *
   * @param {Node} newParent the parent element of the new content
   * @param {Node} oldParent the old content that we are merging the new content into
   * @param {MorphContext} ctx the merge context
   * @returns {void}
   */function morphChildren(e,t,n){if(e instanceof HTMLTemplateElement&&t instanceof HTMLTemplateElement){e=e.content;t=t.content}
/**
     *
     * @type {Node | null}
     */let o=e.firstChild;
/**
     *
     * @type {Node | null}
     */let r=t.firstChild;let l;while(o){l=o;o=l.nextSibling;if(r==null){if(n.config.twoPass&&n.persistentIds.has(/** @type {Element} */l.id))t.appendChild(l);else{if(n.callbacks.beforeNodeAdded(l)===false)continue;t.appendChild(l);n.callbacks.afterNodeAdded(l)}removeIdsFromConsideration(n,l);continue}if(isIdSetMatch(l,r,n)){morphOldNodeTo(r,l,n);r=r.nextSibling;removeIdsFromConsideration(n,l);continue}let i=findIdSetMatch(e,t,l,r,n);if(i){r=removeNodesBetween(r,i,n);morphOldNodeTo(i,l,n);removeIdsFromConsideration(n,l);continue}let a=findSoftMatch(e,t,l,r,n);if(a){r=removeNodesBetween(r,a,n);morphOldNodeTo(a,l,n);removeIdsFromConsideration(n,l)}else{if(n.config.twoPass&&n.persistentIds.has(/** @type {Element} */l.id))t.insertBefore(l,r);else{if(n.callbacks.beforeNodeAdded(l)===false)continue;t.insertBefore(l,r);n.callbacks.afterNodeAdded(l)}removeIdsFromConsideration(n,l)}}while(r!==null){let e=r;r=r.nextSibling;removeNode(e,n)}}
/**
   * @param {string} attr the attribute to be mutated
   * @param {Element} to the element that is going to be updated
   * @param {"update" | "remove"} updateType
   * @param {MorphContext} ctx the merge context
   * @returns {boolean} true if the attribute should be ignored, false otherwise
   */function ignoreAttribute(e,t,n,o){return!(e!=="value"||!o.ignoreActiveValue||t!==document.activeElement)||o.callbacks.beforeAttributeUpdated(e,t,n)===false}
/**
   * syncs a given node with another node, copying over all attributes and
   * inner element state from the 'from' node to the 'to' node
   *
   * @param {Node} from the element to copy attributes & state from
   * @param {Node} to the element to copy attributes & state to
   * @param {MorphContext} ctx the merge context
   */function syncNodeFrom(e,t,n){let o=e.nodeType;if(o===1){const o=/** @type {Element} */e;const r=/** @type {Element} */t;const l=o.attributes;const i=r.attributes;for(const e of l)ignoreAttribute(e.name,r,"update",n)||r.getAttribute(e.name)!==e.value&&r.setAttribute(e.name,e.value);for(let e=i.length-1;0<=e;e--){const t=i[e];if(t&&!o.hasAttribute(t.name)){if(ignoreAttribute(t.name,r,"remove",n))continue;r.removeAttribute(t.name)}}}o!==8&&o!==3||t.nodeValue!==e.nodeValue&&(t.nodeValue=e.nodeValue);ignoreValueOfActiveElement(t,n)||syncInputValue(e,t,n)}
/**
   * @param {Element} from element to sync the value from
   * @param {Element} to element to sync the value to
   * @param {string} attributeName the attribute name
   * @param {MorphContext} ctx the merge context
   */function syncBooleanAttribute(e,t,n,o){if(!(e instanceof Element&&t instanceof Element))return;const r=e[n],l=t[n];if(r!==l){let l=ignoreAttribute(n,t,"update",o);l||(t[n]=e[n]);r?l||t.setAttribute(n,r):ignoreAttribute(n,t,"remove",o)||t.removeAttribute(n)}}
/**
   * NB: many bothans died to bring us information:
   *
   *  https://github.com/patrick-steele-idem/morphdom/blob/master/src/specialElHandlers.js
   *  https://github.com/choojs/nanomorph/blob/master/lib/morph.jsL113
   *
   * @param {Node} from the element to sync the input value from
   * @param {Node} to the element to sync the input value to
   * @param {MorphContext} ctx the merge context
   */function syncInputValue(e,t,n){if(e instanceof HTMLInputElement&&t instanceof HTMLInputElement&&e.type!=="file"){let o=e.value;let r=t.value;syncBooleanAttribute(e,t,"checked",n);syncBooleanAttribute(e,t,"disabled",n);if(e.hasAttribute("value")){if(o!==r&&!ignoreAttribute("value",t,"update",n)){t.setAttribute("value",o);t.value=o}}else if(!ignoreAttribute("value",t,"remove",n)){t.value="";t.removeAttribute("value")}}else if(e instanceof HTMLOptionElement&&t instanceof HTMLOptionElement)syncBooleanAttribute(e,t,"selected",n);else if(e instanceof HTMLTextAreaElement&&t instanceof HTMLTextAreaElement){let o=e.value;let r=t.value;if(ignoreAttribute("value",t,"update",n))return;o!==r&&(t.value=o);t.firstChild&&t.firstChild.nodeValue!==o&&(t.firstChild.nodeValue=o)}}
/**
   * =============================================================================
   *  The HEAD tag can be handled specially, either w/ a 'merge' or 'append' style
   * =============================================================================
   * @param {Element} newHeadTag
   * @param {Element} currentHead
   * @param {MorphContext} ctx
   * @returns {Promise<void>[]}
   */function handleHeadElement(e,t,n){
/**
     * @type {Node[]}
     */
let o=[];
/**
     * @type {Element[]}
     */let r=[];
/**
     * @type {Element[]}
     */let l=[];
/**
     * @type {Element[]}
     */let i=[];let a=n.head.style;let d=new Map;for(const t of e.children)d.set(t.outerHTML,t);for(const e of t.children){let t=d.has(e.outerHTML);let o=n.head.shouldReAppend(e);let s=n.head.shouldPreserve(e);if(t||s)if(o)r.push(e);else{d.delete(e.outerHTML);l.push(e)}else if(a==="append"){if(o){r.push(e);i.push(e)}}else n.head.shouldRemove(e)!==false&&r.push(e)}i.push(...d.values());log("to append: ",i);let s=[];for(const e of i){log("adding: ",e);let r=/** @type {ChildNode} */document.createRange().createContextualFragment(e.outerHTML).firstChild;log(r);if(n.callbacks.beforeNodeAdded(r)!==false){if("href"in r&&r.href||"src"in r&&r.src){
/** @type {(result?: any) => void} */let e;let t=new Promise((function(t){e=t}));r.addEventListener("load",(function(){e()}));s.push(t)}t.appendChild(r);n.callbacks.afterNodeAdded(r);o.push(r)}}for(const e of r)if(n.callbacks.beforeNodeRemoved(e)!==false){t.removeChild(e);n.callbacks.afterNodeRemoved(e)}n.head.afterHeadMorphed(t,{added:o,kept:l,removed:r});return s}
/**
   * @param {any[]} _args
   */function log(...e){}function noOp(){}
/**
   * Deep merges the config object and the Idiomoroph.defaults object to
   * produce a final configuration object
   * @param {Config} config
   * @returns {ConfigInternal}
   */function mergeDefaults(e){
/**
     * @type {ConfigInternal}
     */
let n=Object.assign({},t);Object.assign(n,e);n.callbacks=Object.assign({},t.callbacks,e.callbacks);n.head=Object.assign({},t.head,e.head);return n}
/**
   *
   * @param {Element} oldNode
   * @param {Element} newContent
   * @param {Config} config
   * @returns {MorphContext}
   */function createMorphContext(e,t,n){const o=mergeDefaults(n);return{target:e,newContent:t,config:o,morphStyle:o.morphStyle,ignoreActive:o.ignoreActive,ignoreActiveValue:o.ignoreActiveValue,idMap:createIdMap(e,t),deadIds:new Set,persistentIds:o.twoPass?createPersistentIds(e,t):new Set,pantry:o.twoPass?createPantry():document.createElement("div"),callbacks:o.callbacks,head:o.head}}function createPantry(){const e=document.createElement("div");e.hidden=true;document.body.insertAdjacentElement("afterend",e);return e}
/**
   *
   * @param {Node | null} node1
   * @param {Node | null} node2
   * @param {MorphContext} ctx
   * @returns {boolean}
   */function isIdSetMatch(e,t,n){return e!=null&&t!=null&&(e instanceof Element&&t instanceof Element&&e.tagName===t.tagName&&(e.id!==""&&e.id===t.id||getIdIntersectionCount(n,e,t)>0))}
/**
   *
   * @param {Node | null} oldNode
   * @param {Node | null} newNode
   * @returns {boolean}
   */function isSoftMatch(e,t){return e!=null&&t!=null&&((
/** @type {Element} */!e.id||
/** @type {Element} */e.id===
/** @type {Element} */t.id)&&(e.nodeType===t.nodeType&&
/** @type {Element} */e.tagName===
/** @type {Element} */t.tagName))}
/**
   *
   * @param {Node} startInclusive
   * @param {Node} endExclusive
   * @param {MorphContext} ctx
   * @returns {Node | null}
   */function removeNodesBetween(e,t,n){
/** @type {Node | null} */let o=e;while(o!==t){let e=/** @type {Node} */o;o=e.nextSibling;removeNode(e,n)}removeIdsFromConsideration(n,t);return t.nextSibling}
/**
   * =============================================================================
   *  Scans forward from the insertionPoint in the old parent looking for a potential id match
   *  for the newChild.  We stop if we find a potential id match for the new child OR
   *  if the number of potential id matches we are discarding is greater than the
   *  potential id matches for the new child
   * =============================================================================
   * @param {Node} newContent
   * @param {Node} oldParent
   * @param {Node} newChild
   * @param {Node} insertionPoint
   * @param {MorphContext} ctx
   * @returns {null | Node}
   */function findIdSetMatch(e,t,n,o,r){let l=getIdIntersectionCount(r,n,t);
/**
     * @type {Node | null}
     */let i=null;if(l>0){i=o;let t=0;while(i!=null){if(isIdSetMatch(n,i,r))return i;t+=getIdIntersectionCount(r,i,e);if(t>l)return null;i=i.nextSibling}}return i}
/**
   * =============================================================================
   *  Scans forward from the insertionPoint in the old parent looking for a potential soft match
   *  for the newChild.  We stop if we find a potential soft match for the new child OR
   *  if we find a potential id match in the old parents children OR if we find two
   *  potential soft matches for the next two pieces of new content
   * =============================================================================
   * @param {Node} newContent
   * @param {Node} oldParent
   * @param {Node} newChild
   * @param {Node} insertionPoint
   * @param {MorphContext} ctx
   * @returns {null | Node}
   */function findSoftMatch(e,t,n,o,r){
/**
     * @type {Node | null}
     */
let l=o;
/**
     * @type {Node | null}
     */let i=n.nextSibling;let a=0;while(l!=null){if(getIdIntersectionCount(r,l,e)>0)return null;if(isSoftMatch(l,n))return l;if(isSoftMatch(l,i)){a++;i=/** @type {Node} */i.nextSibling;if(a>=2)return null}l=l.nextSibling}return l}
/** @type {WeakSet<Node>} */const n=new WeakSet;
/**
   *
   * @param {string} newContent
   * @returns {Node | null | DocumentFragment}
   */function parseContent(e){let t=new DOMParser;let o=e.replace(/<svg(\s[^>]*>|>)([\s\S]*?)<\/svg>/gim,"");if(o.match(/<\/html>/)||o.match(/<\/head>/)||o.match(/<\/body>/)){let r=t.parseFromString(e,"text/html");if(o.match(/<\/html>/)){n.add(r);return r}{let e=r.firstChild;if(e){n.add(e);return e}return null}}{let o=t.parseFromString("<body><template>"+e+"</template></body>","text/html");let r=/** @type {HTMLTemplateElement} */o.body.querySelector("template").content;n.add(r);return r}}
/**
   *
   * @param {null | Node | HTMLCollection | Node[] | Document & {generatedByIdiomorph:boolean}} newContent
   * @returns {Element}
   */function normalizeContent(e){if(e==null){const e=document.createElement("div");return e}if(n.has(/** @type {Element} */e))/** @type {Element} */
return e;if(e instanceof Node){const t=document.createElement("div");t.append(e);return t}{const t=document.createElement("div");for(const n of[...e])t.append(n);return t}}
/**
   *
   * @param {Node | null} previousSibling
   * @param {Node} morphedNode
   * @param {Node | null} nextSibling
   * @returns {Node[]}
   */function insertSiblings(e,t,n){
/**
     * @type {Node[]}
     */
let o=[];
/**
     * @type {Node[]}
     */let r=[];while(e!=null){o.push(e);e=e.previousSibling}let l=o.pop();while(l!==void 0){r.push(l);t.parentElement?.insertBefore(l,t);l=o.pop()}r.push(t);while(n!=null){o.push(n);r.push(n);n=n.nextSibling}while(o.length>0){const e=/** @type {Node} */o.pop();t.parentElement?.insertBefore(e,t.nextSibling)}return r}
/**
   *
   * @param {Element} newContent
   * @param {Element} oldNode
   * @param {MorphContext} ctx
   * @returns {Node | null}
   */function findBestNodeMatch(e,t,n){
/**
     * @type {Node | null}
     */
let o;o=e.firstChild;
/**
     * @type {Node | null}
     */let r=o;let l=0;while(o){let e=scoreElement(o,t,n);if(e>l){r=o;l=e}o=o.nextSibling}return r}
/**
   *
   * @param {Node | null} node1
   * @param {Element} node2
   * @param {MorphContext} ctx
   * @returns {number}
   */function scoreElement(e,t,n){return isSoftMatch(t,e)?.5+getIdIntersectionCount(n,/** @type {Node} */e,t):0}
/**
   *
   * @param {Node} tempNode
   * @param {MorphContext} ctx
   */function removeNode(e,t){removeIdsFromConsideration(t,e);if(t.config.twoPass&&hasPersistentIdNodes(t,e)&&e instanceof Element)moveToPantry(e,t);else{if(t.callbacks.beforeNodeRemoved(e)===false)return;e.parentNode?.removeChild(e);t.callbacks.afterNodeRemoved(e)}}
/**
   *
   * @param {Node} node
   * @param {MorphContext} ctx
   */function moveToPantry(e,t){if(t.callbacks.beforeNodePantried(e)!==false){Array.from(e.childNodes).forEach((e=>{moveToPantry(e,t)}));if(t.persistentIds.has(/** @type {Element} */e.id))t.pantry.moveBefore?t.pantry.moveBefore(e,null):t.pantry.insertBefore(e,null);else{if(t.callbacks.beforeNodeRemoved(e)===false)return;e.parentNode?.removeChild(e);t.callbacks.afterNodeRemoved(e)}}}
/**
   *
   * @param {Node | null} root
   * @param {MorphContext} ctx
   */function restoreFromPantry(e,t){if(e instanceof Element){Array.from(t.pantry.children).reverse().forEach((n=>{const o=e.querySelector(`#${n.id}`);if(o){if(o.parentElement?.moveBefore){o.parentElement.moveBefore(n,o);while(o.hasChildNodes())n.moveBefore(o.firstChild,null)}else{o.before(n);while(o.firstChild)n.insertBefore(o.firstChild,null)}if(t.callbacks.beforeNodeMorphed(n,o)!==false){syncNodeFrom(o,n,t);t.callbacks.afterNodeMorphed(n,o)}o.remove()}}));t.pantry.remove()}}
/**
   *
   * @param {MorphContext} ctx
   * @param {string} id
   * @returns {boolean}
   */function isIdInConsideration(e,t){return!e.deadIds.has(t)}
/**
   *
   * @param {MorphContext} ctx
   * @param {string} id
   * @param {Node} targetNode
   * @returns {boolean}
   */function idIsWithinNode(t,n,o){let r=t.idMap.get(o)||e;return r.has(n)}
/**
   *
   * @param {MorphContext} ctx
   * @param {Node} node
   * @returns {void}
   */function removeIdsFromConsideration(t,n){let o=t.idMap.get(n)||e;for(const e of o)t.deadIds.add(e)}
/**
   *
   * @param {MorphContext} ctx
   * @param {Node} node
   * @returns {boolean}
   */function hasPersistentIdNodes(t,n){for(const o of t.idMap.get(n)||e)if(t.persistentIds.has(o))return true;return false}
/**
   *
   * @param {MorphContext} ctx
   * @param {Node} node1
   * @param {Node} node2
   * @returns {number}
   */function getIdIntersectionCount(t,n,o){let r=t.idMap.get(n)||e;let l=0;for(const e of r)isIdInConsideration(t,e)&&idIsWithinNode(t,e,o)&&++l;return l}
/**
   * @param {Element} content
   * @returns {Element[]}
   */function nodesWithIds(e){let t=Array.from(e.querySelectorAll("[id]"));e.id&&t.push(e);return t}
/**
   * A bottom up algorithm that finds all elements with ids in the node
   * argument and populates id sets for those nodes and all their parents, generating
   * a set of ids contained within all nodes for the entire hierarchy in the DOM
   *
   * @param {Element} node
   * @param {Map<Node, Set<string>>} idMap
   */function populateIdMapForNode(e,t){let n=e.parentElement;for(const o of nodesWithIds(e)){
/**
       * @type {Element|null}
       */
let e=o;while(e!==n&&e!=null){let n=t.get(e);if(n==null){n=new Set;t.set(e,n)}n.add(o.id);e=e.parentElement}}}
/**
   * This function computes a map of nodes to all ids contained within that node (inclusive of the
   * node).  This map can be used to ask if two nodes have intersecting sets of ids, which allows
   * for a looser definition of "matching" than tradition id matching, and allows child nodes
   * to contribute to a parent nodes matching.
   *
   * @param {Element} oldContent  the old content that will be morphed
   * @param {Element} newContent  the new content to morph to
   * @returns {Map<Node, Set<string>>} a map of nodes to id sets for the
   */function createIdMap(e,t){
/**
     *
     * @type {Map<Node, Set<string>>}
     */
let n=new Map;populateIdMapForNode(e,n);populateIdMapForNode(t,n);return n}
/**
   * @param {Element} oldContent  the old content that will be morphed
   * @param {Element} newContent  the new content to morph to
   * @returns {Set<string>} the id set of all persistent nodes that exist in both old and new content
   */function createPersistentIds(e,t){const toIdTagName=e=>e.tagName+"#"+e.id;const n=new Set(nodesWithIds(e).map(toIdTagName));let o=new Set;for(const e of nodesWithIds(t))n.has(toIdTagName(e))&&o.add(e.id);return o}return{morph:morph,defaults:t}}();export{e as Idiomorph};

