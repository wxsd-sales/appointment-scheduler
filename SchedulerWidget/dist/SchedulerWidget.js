
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var SchedulerWidget = (function () {
	'use strict';

	/** @returns {void} */
	function noop() {}

	/** @returns {void} */
	function add_location(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	/**
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function run_all(fns) {
		fns.forEach(run);
	}

	/**
	 * @param {any} thing
	 * @returns {thing is Function}
	 */
	function is_function(thing) {
		return typeof thing === 'function';
	}

	/** @returns {boolean} */
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
	}

	/** @returns {boolean} */
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
	}

	/** @type {typeof globalThis} */
	const globals =
		typeof window !== 'undefined'
			? window
			: typeof globalThis !== 'undefined'
			? globalThis
			: // @ts-ignore Node typings have this
			  global;

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append(target, node) {
		target.appendChild(node);
	}

	/**
	 * @param {Node} target
	 * @param {string} style_sheet_id
	 * @param {string} styles
	 * @returns {void}
	 */
	function append_styles(target, style_sheet_id, styles) {
		const append_styles_to = get_root_for_style(target);
		if (!append_styles_to.getElementById(style_sheet_id)) {
			const style = element('style');
			style.id = style_sheet_id;
			style.textContent = styles;
			append_stylesheet(append_styles_to, style);
		}
	}

	/**
	 * @param {Node} node
	 * @returns {ShadowRoot | Document}
	 */
	function get_root_for_style(node) {
		if (!node) return document;
		const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
		if (root && /** @type {ShadowRoot} */ (root).host) {
			return /** @type {ShadowRoot} */ (root);
		}
		return node.ownerDocument;
	}

	/**
	 * @param {ShadowRoot | Document} node
	 * @param {HTMLStyleElement} style
	 * @returns {CSSStyleSheet}
	 */
	function append_stylesheet(node, style) {
		append(/** @type {Document} */ (node).head || node, style);
		return style.sheet;
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	/**
	 * @template {keyof HTMLElementTagNameMap} K
	 * @param {K} name
	 * @returns {HTMLElementTagNameMap[K]}
	 */
	function element(name) {
		return document.createElement(name);
	}

	/**
	 * @template {keyof SVGElementTagNameMap} K
	 * @param {K} name
	 * @returns {SVGElement}
	 */
	function svg_element(name) {
		return document.createElementNS('http://www.w3.org/2000/svg', name);
	}

	/**
	 * @param {string} data
	 * @returns {Text}
	 */
	function text(data) {
		return document.createTextNode(data);
	}

	/**
	 * @returns {Text} */
	function space() {
		return text(' ');
	}

	/**
	 * @param {EventTarget} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @returns {() => void}
	 */
	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}

	/**
	 * @param {HTMLInputElement[]} group
	 * @returns {{ p(...inputs: HTMLInputElement[]): void; r(): void; }}
	 */
	function init_binding_group(group) {
		/**
		 * @type {HTMLInputElement[]} */
		let _inputs;
		return {
			/* push */ p(...inputs) {
				_inputs = inputs;
				_inputs.forEach((input) => group.push(input));
			},
			/* remove */ r() {
				_inputs.forEach((input) => group.splice(group.indexOf(input), 1));
			}
		};
	}

	/**
	 * @param {Element} element
	 * @returns {ChildNode[]}
	 */
	function children(element) {
		return Array.from(element.childNodes);
	}

	/**
	 * @returns {void} */
	function set_input_value(input, value) {
		input.value = value == null ? '' : value;
	}

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @param {{ bubbles?: boolean, cancelable?: boolean }} [options]
	 * @returns {CustomEvent<T>}
	 */
	function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
		return new CustomEvent(type, { detail, bubbles, cancelable });
	}

	/**
	 * @param {HTMLElement} element
	 * @returns {{}}
	 */
	function get_custom_elements_slots(element) {
		const result = {};
		element.childNodes.forEach(
			/** @param {Element} node */ (node) => {
				result[node.slot || 'default'] = true;
			}
		);
		return result;
	}

	/**
	 * @typedef {Node & {
	 * 	claim_order?: number;
	 * 	hydrate_init?: true;
	 * 	actual_end_child?: NodeEx;
	 * 	childNodes: NodeListOf<NodeEx>;
	 * }} NodeEx
	 */

	/** @typedef {ChildNode & NodeEx} ChildNodeEx */

	/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

	/**
	 * @typedef {ChildNodeEx[] & {
	 * 	claim_info?: {
	 * 		last_index: number;
	 * 		total_claimed: number;
	 * 	};
	 * }} ChildNodeArray
	 */

	let current_component;

	/** @returns {void} */
	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error('Function called outside component initialization');
		return current_component;
	}

	/**
	 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
	 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
	 * it can be called from an external module).
	 *
	 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
	 *
	 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
	 *
	 * https://svelte.dev/docs/svelte#onmount
	 * @template T
	 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
	 * @returns {void}
	 */
	function onMount(fn) {
		get_current_component().$$.on_mount.push(fn);
	}

	/**
	 * Schedules a callback to run immediately after the component has been updated.
	 *
	 * The first time the callback runs will be after the initial `onMount`
	 *
	 * https://svelte.dev/docs/svelte#afterupdate
	 * @param {() => any} fn
	 * @returns {void}
	 */
	function afterUpdate(fn) {
		get_current_component().$$.after_update.push(fn);
	}

	/**
	 * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
	 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
	 *
	 * Component events created with `createEventDispatcher` create a
	 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
	 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
	 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
	 * property and can contain any type of data.
	 *
	 * The event dispatcher can be typed to narrow the allowed event names and the type of the `detail` argument:
	 * ```ts
	 * const dispatch = createEventDispatcher<{
	 *  loaded: never; // does not take a detail argument
	 *  change: string; // takes a detail argument of type string, which is required
	 *  optional: number | null; // takes an optional detail argument of type number
	 * }>();
	 * ```
	 *
	 * https://svelte.dev/docs/svelte#createeventdispatcher
	 * @template {Record<string, any>} [EventMap=any]
	 * @returns {import('./public.js').EventDispatcher<EventMap>}
	 */
	function createEventDispatcher() {
		const component = get_current_component();
		return (type, detail, { cancelable = false } = {}) => {
			const callbacks = component.$$.callbacks[type];
			if (callbacks) {
				// TODO are there situations where events could be dispatched
				// in a server (non-DOM) environment?
				const event = custom_event(/** @type {string} */ (type), detail, { cancelable });
				callbacks.slice().forEach((fn) => {
					fn.call(component, event);
				});
				return !event.defaultPrevented;
			}
			return true;
		};
	}

	const dirty_components = [];
	const binding_callbacks = [];

	let render_callbacks = [];

	const flush_callbacks = [];

	const resolved_promise = /* @__PURE__ */ Promise.resolve();

	let update_scheduled = false;

	/** @returns {void} */
	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	/** @returns {void} */
	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	/** @returns {void} */
	function add_flush_callback(fn) {
		flush_callbacks.push(fn);
	}

	// flush() calls callbacks in this order:
	// 1. All beforeUpdate callbacks, in order: parents before children
	// 2. All bind:this callbacks, in reverse order: children before parents.
	// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
	//    for afterUpdates called during the initial onMount, which are called in
	//    reverse order: children before parents.
	// Since callbacks might update component values, which could trigger another
	// call to flush(), the following steps guard against this:
	// 1. During beforeUpdate, any updated components will be added to the
	//    dirty_components array and will cause a reentrant call to flush(). Because
	//    the flush index is kept outside the function, the reentrant call will pick
	//    up where the earlier call left off and go through all dirty components. The
	//    current_component value is saved and restored so that the reentrant call will
	//    not interfere with the "parent" flush() call.
	// 2. bind:this callbacks cannot trigger new flush() calls.
	// 3. During afterUpdate, any updated components will NOT have their afterUpdate
	//    callback called a second time; the seen_callbacks set, outside the flush()
	//    function, guarantees this behavior.
	const seen_callbacks = new Set();

	let flushidx = 0; // Do *not* move this inside the flush() function

	/** @returns {void} */
	function flush() {
		// Do not reenter flush while dirty components are updated, as this can
		// result in an infinite loop. Instead, let the inner flush handle it.
		// Reentrancy is ok afterwards for bindings etc.
		if (flushidx !== 0) {
			return;
		}
		const saved_component = current_component;
		do {
			// first, call beforeUpdate functions
			// and update components
			try {
				while (flushidx < dirty_components.length) {
					const component = dirty_components[flushidx];
					flushidx++;
					set_current_component(component);
					update(component.$$);
				}
			} catch (e) {
				// reset dirty state to not end up in a deadlocked state and then rethrow
				dirty_components.length = 0;
				flushidx = 0;
				throw e;
			}
			set_current_component(null);
			dirty_components.length = 0;
			flushidx = 0;
			while (binding_callbacks.length) binding_callbacks.pop()();
			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			for (let i = 0; i < render_callbacks.length; i += 1) {
				const callback = render_callbacks[i];
				if (!seen_callbacks.has(callback)) {
					// ...so guard against infinite loops
					seen_callbacks.add(callback);
					callback();
				}
			}
			render_callbacks.length = 0;
		} while (dirty_components.length);
		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}
		update_scheduled = false;
		seen_callbacks.clear();
		set_current_component(saved_component);
	}

	/** @returns {void} */
	function update($$) {
		if ($$.fragment !== null) {
			$$.update();
			run_all($$.before_update);
			const dirty = $$.dirty;
			$$.dirty = [-1];
			$$.fragment && $$.fragment.p($$.ctx, dirty);
			$$.after_update.forEach(add_render_callback);
		}
	}

	/**
	 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function flush_render_callbacks(fns) {
		const filtered = [];
		const targets = [];
		render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
		targets.forEach((c) => c());
		render_callbacks = filtered;
	}

	const outroing = new Set();

	/**
	 * @type {Outro}
	 */
	let outros;

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} [local]
	 * @returns {void}
	 */
	function transition_in(block, local) {
		if (block && block.i) {
			outroing.delete(block);
			block.i(local);
		}
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} local
	 * @param {0 | 1} [detach]
	 * @param {() => void} [callback]
	 * @returns {void}
	 */
	function transition_out(block, local, detach, callback) {
		if (block && block.o) {
			if (outroing.has(block)) return;
			outroing.add(block);
			outros.c.push(() => {
				outroing.delete(block);
				if (callback) {
					if (detach) block.d(1);
					callback();
				}
			});
			block.o(local);
		} else if (callback) {
			callback();
		}
	}

	/** @typedef {1} INTRO */
	/** @typedef {0} OUTRO */
	/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
	/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

	/**
	 * @typedef {Object} Outro
	 * @property {number} r
	 * @property {Function[]} c
	 * @property {Object} p
	 */

	/**
	 * @typedef {Object} PendingProgram
	 * @property {number} start
	 * @property {INTRO|OUTRO} b
	 * @property {Outro} [group]
	 */

	/**
	 * @typedef {Object} Program
	 * @property {number} a
	 * @property {INTRO|OUTRO} b
	 * @property {1|-1} d
	 * @property {number} duration
	 * @property {number} start
	 * @property {number} end
	 * @property {Outro} [group]
	 */

	// general each functions:

	function ensure_array_like(array_like_or_iterator) {
		return array_like_or_iterator?.length !== undefined
			? array_like_or_iterator
			: Array.from(array_like_or_iterator);
	}

	// keyed each functions:

	/** @returns {void} */
	function destroy_block(block, lookup) {
		block.d(1);
		lookup.delete(block.key);
	}

	/** @returns {any[]} */
	function update_keyed_each(
		old_blocks,
		dirty,
		get_key,
		dynamic,
		ctx,
		list,
		lookup,
		node,
		destroy,
		create_each_block,
		next,
		get_context
	) {
		let o = old_blocks.length;
		let n = list.length;
		let i = o;
		const old_indexes = {};
		while (i--) old_indexes[old_blocks[i].key] = i;
		const new_blocks = [];
		const new_lookup = new Map();
		const deltas = new Map();
		const updates = [];
		i = n;
		while (i--) {
			const child_ctx = get_context(ctx, list, i);
			const key = get_key(child_ctx);
			let block = lookup.get(key);
			if (!block) {
				block = create_each_block(key, child_ctx);
				block.c();
			} else if (dynamic) {
				// defer updates until all the DOM shuffling is done
				updates.push(() => block.p(child_ctx, dirty));
			}
			new_lookup.set(key, (new_blocks[i] = block));
			if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
		}
		const will_move = new Set();
		const did_move = new Set();
		/** @returns {void} */
		function insert(block) {
			transition_in(block, 1);
			block.m(node, next);
			lookup.set(block.key, block);
			next = block.first;
			n--;
		}
		while (o && n) {
			const new_block = new_blocks[n - 1];
			const old_block = old_blocks[o - 1];
			const new_key = new_block.key;
			const old_key = old_block.key;
			if (new_block === old_block) {
				// do nothing
				next = new_block.first;
				o--;
				n--;
			} else if (!new_lookup.has(old_key)) {
				// remove old block
				destroy(old_block, lookup);
				o--;
			} else if (!lookup.has(new_key) || will_move.has(new_key)) {
				insert(new_block);
			} else if (did_move.has(old_key)) {
				o--;
			} else if (deltas.get(new_key) > deltas.get(old_key)) {
				did_move.add(new_key);
				insert(new_block);
			} else {
				will_move.add(old_key);
				o--;
			}
		}
		while (o--) {
			const old_block = old_blocks[o];
			if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
		}
		while (n) insert(new_blocks[n - 1]);
		run_all(updates);
		return new_blocks;
	}

	/** @returns {void} */
	function validate_each_keys(ctx, list, get_context, get_key) {
		const keys = new Map();
		for (let i = 0; i < list.length; i++) {
			const key = get_key(get_context(ctx, list, i));
			if (keys.has(key)) {
				let value = '';
				try {
					value = `with value '${String(key)}' `;
				} catch (e) {
					// can't stringify
				}
				throw new Error(
					`Cannot have duplicate keys in a keyed each: Keys at index ${keys.get(
					key
				)} and ${i} ${value}are duplicates`
				);
			}
			keys.set(key, i);
		}
	}

	/** @returns {void} */
	function bind(component, name, callback) {
		const index = component.$$.props[name];
		if (index !== undefined) {
			component.$$.bound[index] = callback;
			callback(component.$$.ctx[index]);
		}
	}

	/** @returns {void} */
	function create_component(block) {
		block && block.c();
	}

	/** @returns {void} */
	function mount_component(component, target, anchor) {
		const { fragment, after_update } = component.$$;
		fragment && fragment.m(target, anchor);
		// onMount happens before the initial afterUpdate
		add_render_callback(() => {
			const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
			// if the component was destroyed immediately
			// it will update the `$$.on_destroy` reference to `null`.
			// the destructured on_destroy may still reference to the old array
			if (component.$$.on_destroy) {
				component.$$.on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});
		after_update.forEach(add_render_callback);
	}

	/** @returns {void} */
	function destroy_component(component, detaching) {
		const $$ = component.$$;
		if ($$.fragment !== null) {
			flush_render_callbacks($$.after_update);
			run_all($$.on_destroy);
			$$.fragment && $$.fragment.d(detaching);
			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			$$.on_destroy = $$.fragment = null;
			$$.ctx = [];
		}
	}

	/** @returns {void} */
	function make_dirty(component, i) {
		if (component.$$.dirty[0] === -1) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty.fill(0);
		}
		component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
	}

	// TODO: Document the other params
	/**
	 * @param {SvelteComponent} component
	 * @param {import('./public.js').ComponentConstructorOptions} options
	 *
	 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
	 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
	 * This will be the `add_css` function from the compiled component.
	 *
	 * @returns {void}
	 */
	function init(
		component,
		options,
		instance,
		create_fragment,
		not_equal,
		props,
		append_styles = null,
		dirty = [-1]
	) {
		const parent_component = current_component;
		set_current_component(component);
		/** @type {import('./private.js').T$$} */
		const $$ = (component.$$ = {
			fragment: null,
			ctx: [],
			// state
			props,
			update: noop,
			not_equal,
			bound: blank_object(),
			// lifecycle
			on_mount: [],
			on_destroy: [],
			on_disconnect: [],
			before_update: [],
			after_update: [],
			context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
			// everything else
			callbacks: blank_object(),
			dirty,
			skip_bound: false,
			root: options.target || parent_component.$$.root
		});
		append_styles && append_styles($$.root);
		let ready = false;
		$$.ctx = instance
			? instance(component, options.props || {}, (i, ret, ...rest) => {
					const value = rest.length ? rest[0] : ret;
					if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
						if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
						if (ready) make_dirty(component, i);
					}
					return ret;
			  })
			: [];
		$$.update();
		ready = true;
		run_all($$.before_update);
		// `false` as a special case of no DOM component
		$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
		if (options.target) {
			if (options.hydrate) {
				// TODO: what is the correct type here?
				// @ts-expect-error
				const nodes = children(options.target);
				$$.fragment && $$.fragment.l(nodes);
				nodes.forEach(detach);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.c();
			}
			if (options.intro) transition_in(component.$$.fragment);
			mount_component(component, options.target, options.anchor);
			flush();
		}
		set_current_component(parent_component);
	}

	let SvelteElement;

	if (typeof HTMLElement === 'function') {
		SvelteElement = class extends HTMLElement {
			/** The Svelte component constructor */
			$$ctor;
			/** Slots */
			$$s;
			/** The Svelte component instance */
			$$c;
			/** Whether or not the custom element is connected */
			$$cn = false;
			/** Component props data */
			$$d = {};
			/** `true` if currently in the process of reflecting component props back to attributes */
			$$r = false;
			/** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
			$$p_d = {};
			/** @type {Record<string, Function[]>} Event listeners */
			$$l = {};
			/** @type {Map<Function, Function>} Event listener unsubscribe functions */
			$$l_u = new Map();

			constructor($$componentCtor, $$slots, use_shadow_dom) {
				super();
				this.$$ctor = $$componentCtor;
				this.$$s = $$slots;
				if (use_shadow_dom) {
					this.attachShadow({ mode: 'open' });
				}
			}

			addEventListener(type, listener, options) {
				// We can't determine upfront if the event is a custom event or not, so we have to
				// listen to both. If someone uses a custom event with the same name as a regular
				// browser event, this fires twice - we can't avoid that.
				this.$$l[type] = this.$$l[type] || [];
				this.$$l[type].push(listener);
				if (this.$$c) {
					const unsub = this.$$c.$on(type, listener);
					this.$$l_u.set(listener, unsub);
				}
				super.addEventListener(type, listener, options);
			}

			removeEventListener(type, listener, options) {
				super.removeEventListener(type, listener, options);
				if (this.$$c) {
					const unsub = this.$$l_u.get(listener);
					if (unsub) {
						unsub();
						this.$$l_u.delete(listener);
					}
				}
			}

			async connectedCallback() {
				this.$$cn = true;
				if (!this.$$c) {
					// We wait one tick to let possible child slot elements be created/mounted
					await Promise.resolve();
					if (!this.$$cn) {
						return;
					}
					function create_slot(name) {
						return () => {
							let node;
							const obj = {
								c: function create() {
									node = element('slot');
									if (name !== 'default') {
										attr(node, 'name', name);
									}
								},
								/**
								 * @param {HTMLElement} target
								 * @param {HTMLElement} [anchor]
								 */
								m: function mount(target, anchor) {
									insert(target, node, anchor);
								},
								d: function destroy(detaching) {
									if (detaching) {
										detach(node);
									}
								}
							};
							return obj;
						};
					}
					const $$slots = {};
					const existing_slots = get_custom_elements_slots(this);
					for (const name of this.$$s) {
						if (name in existing_slots) {
							$$slots[name] = [create_slot(name)];
						}
					}
					for (const attribute of this.attributes) {
						// this.$$data takes precedence over this.attributes
						const name = this.$$g_p(attribute.name);
						if (!(name in this.$$d)) {
							this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, 'toProp');
						}
					}
					// Port over props that were set programmatically before ce was initialized
					for (const key in this.$$p_d) {
						if (!(key in this.$$d) && this[key] !== undefined) {
							this.$$d[key] = this[key]; // don't transform, these were set through JavaScript
							delete this[key]; // remove the property that shadows the getter/setter
						}
					}
					this.$$c = new this.$$ctor({
						target: this.shadowRoot || this,
						props: {
							...this.$$d,
							$$slots,
							$$scope: {
								ctx: []
							}
						}
					});

					// Reflect component props as attributes
					const reflect_attributes = () => {
						this.$$r = true;
						for (const key in this.$$p_d) {
							this.$$d[key] = this.$$c.$$.ctx[this.$$c.$$.props[key]];
							if (this.$$p_d[key].reflect) {
								const attribute_value = get_custom_element_value(
									key,
									this.$$d[key],
									this.$$p_d,
									'toAttribute'
								);
								if (attribute_value == null) {
									this.removeAttribute(this.$$p_d[key].attribute || key);
								} else {
									this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
								}
							}
						}
						this.$$r = false;
					};
					this.$$c.$$.after_update.push(reflect_attributes);
					reflect_attributes(); // once initially because after_update is added too late for first render

					for (const type in this.$$l) {
						for (const listener of this.$$l[type]) {
							const unsub = this.$$c.$on(type, listener);
							this.$$l_u.set(listener, unsub);
						}
					}
					this.$$l = {};
				}
			}

			// We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
			// and setting attributes through setAttribute etc, this is helpful
			attributeChangedCallback(attr, _oldValue, newValue) {
				if (this.$$r) return;
				attr = this.$$g_p(attr);
				this.$$d[attr] = get_custom_element_value(attr, newValue, this.$$p_d, 'toProp');
				this.$$c?.$set({ [attr]: this.$$d[attr] });
			}

			disconnectedCallback() {
				this.$$cn = false;
				// In a microtask, because this could be a move within the DOM
				Promise.resolve().then(() => {
					if (!this.$$cn) {
						this.$$c.$destroy();
						this.$$c = undefined;
					}
				});
			}

			$$g_p(attribute_name) {
				return (
					Object.keys(this.$$p_d).find(
						(key) =>
							this.$$p_d[key].attribute === attribute_name ||
							(!this.$$p_d[key].attribute && key.toLowerCase() === attribute_name)
					) || attribute_name
				);
			}
		};
	}

	/**
	 * @param {string} prop
	 * @param {any} value
	 * @param {Record<string, CustomElementPropDefinition>} props_definition
	 * @param {'toAttribute' | 'toProp'} [transform]
	 */
	function get_custom_element_value(prop, value, props_definition, transform) {
		const type = props_definition[prop]?.type;
		value = type === 'Boolean' && typeof value !== 'boolean' ? value != null : value;
		if (!transform || !props_definition[prop]) {
			return value;
		} else if (transform === 'toAttribute') {
			switch (type) {
				case 'Object':
				case 'Array':
					return value == null ? null : JSON.stringify(value);
				case 'Boolean':
					return value ? '' : null;
				case 'Number':
					return value == null ? null : value;
				default:
					return value;
			}
		} else {
			switch (type) {
				case 'Object':
				case 'Array':
					return value && JSON.parse(value);
				case 'Boolean':
					return value; // conversion already handled above
				case 'Number':
					return value != null ? +value : value;
				default:
					return value;
			}
		}
	}

	/**
	 * @internal
	 *
	 * Turn a Svelte component into a custom element.
	 * @param {import('./public.js').ComponentType} Component  A Svelte component constructor
	 * @param {Record<string, CustomElementPropDefinition>} props_definition  The props to observe
	 * @param {string[]} slots  The slots to create
	 * @param {string[]} accessors  Other accessors besides the ones for props the component has
	 * @param {boolean} use_shadow_dom  Whether to use shadow DOM
	 * @param {(ce: new () => HTMLElement) => new () => HTMLElement} [extend]
	 */
	function create_custom_element(
		Component,
		props_definition,
		slots,
		accessors,
		use_shadow_dom,
		extend
	) {
		let Class = class extends SvelteElement {
			constructor() {
				super(Component, slots, use_shadow_dom);
				this.$$p_d = props_definition;
			}
			static get observedAttributes() {
				return Object.keys(props_definition).map((key) =>
					(props_definition[key].attribute || key).toLowerCase()
				);
			}
		};
		Object.keys(props_definition).forEach((prop) => {
			Object.defineProperty(Class.prototype, prop, {
				get() {
					return this.$$c && prop in this.$$c ? this.$$c[prop] : this.$$d[prop];
				},
				set(value) {
					value = get_custom_element_value(prop, value, props_definition);
					this.$$d[prop] = value;
					this.$$c?.$set({ [prop]: value });
				}
			});
		});
		accessors.forEach((accessor) => {
			Object.defineProperty(Class.prototype, accessor, {
				get() {
					return this.$$c?.[accessor];
				}
			});
		});
		if (extend) {
			// @ts-expect-error - assigning here is fine
			Class = extend(Class);
		}
		Component.element = /** @type {any} */ (Class);
		return Class;
	}

	/**
	 * Base class for Svelte components. Used when dev=false.
	 *
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 */
	class SvelteComponent {
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$ = undefined;
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$set = undefined;

		/** @returns {void} */
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop;
		}

		/**
		 * @template {Extract<keyof Events, string>} K
		 * @param {K} type
		 * @param {((e: Events[K]) => void) | null | undefined} callback
		 * @returns {() => void}
		 */
		$on(type, callback) {
			if (!is_function(callback)) {
				return noop;
			}
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		/**
		 * @param {Partial<Props>} props
		 * @returns {void}
		 */
		$set(props) {
			if (this.$$set && !is_empty(props)) {
				this.$$.skip_bound = true;
				this.$$set(props);
				this.$$.skip_bound = false;
			}
		}
	}

	/**
	 * @typedef {Object} CustomElementPropDefinition
	 * @property {string} [attribute]
	 * @property {boolean} [reflect]
	 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	 */

	// generated during release, do not modify

	/**
	 * The current version, as set in package.json.
	 *
	 * https://svelte.dev/docs/svelte-compiler#svelte-version
	 * @type {string}
	 */
	const VERSION = '4.2.9';
	const PUBLIC_VERSION = '4';

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @returns {void}
	 */
	function dispatch_dev(type, detail) {
		document.dispatchEvent(custom_event(type, { version: VERSION, ...detail }, { bubbles: true }));
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append_dev(target, node) {
		dispatch_dev('SvelteDOMInsert', { target, node });
		append(target, node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert_dev(target, node, anchor) {
		dispatch_dev('SvelteDOMInsert', { target, node, anchor });
		insert(target, node, anchor);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach_dev(node) {
		dispatch_dev('SvelteDOMRemove', { node });
		detach(node);
	}

	/**
	 * @param {Node} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @param {boolean} [has_prevent_default]
	 * @param {boolean} [has_stop_propagation]
	 * @param {boolean} [has_stop_immediate_propagation]
	 * @returns {() => void}
	 */
	function listen_dev(
		node,
		event,
		handler,
		options,
		has_prevent_default,
		has_stop_propagation,
		has_stop_immediate_propagation
	) {
		const modifiers =
			options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
		if (has_prevent_default) modifiers.push('preventDefault');
		if (has_stop_propagation) modifiers.push('stopPropagation');
		if (has_stop_immediate_propagation) modifiers.push('stopImmediatePropagation');
		dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
		const dispose = listen(node, event, handler, options);
		return () => {
			dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
			dispose();
		};
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr_dev(node, attribute, value) {
		attr(node, attribute, value);
		if (value == null) dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
		else dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
	}

	/**
	 * @param {Element} node
	 * @param {string} property
	 * @param {any} [value]
	 * @returns {void}
	 */
	function prop_dev(node, property, value) {
		node[property] = value;
		dispatch_dev('SvelteDOMSetProperty', { node, property, value });
	}

	/**
	 * @param {Text} text
	 * @param {unknown} data
	 * @returns {void}
	 */
	function set_data_dev(text, data) {
		data = '' + data;
		if (text.data === data) return;
		dispatch_dev('SvelteDOMSetData', { node: text, data });
		text.data = /** @type {string} */ (data);
	}

	function ensure_array_like_dev(arg) {
		if (
			typeof arg !== 'string' &&
			!(arg && typeof arg === 'object' && 'length' in arg) &&
			!(typeof Symbol === 'function' && arg && Symbol.iterator in arg)
		) {
			throw new Error('{#each} only works with iterable values.');
		}
		return ensure_array_like(arg);
	}

	/**
	 * @returns {void} */
	function validate_slots(name, slot, keys) {
		for (const slot_key of Object.keys(slot)) {
			if (!~keys.indexOf(slot_key)) {
				console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
			}
		}
	}

	/**
	 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
	 *
	 * Can be used to create strongly typed Svelte components.
	 *
	 * #### Example:
	 *
	 * You have component library on npm called `component-library`, from which
	 * you export a component called `MyComponent`. For Svelte+TypeScript users,
	 * you want to provide typings. Therefore you create a `index.d.ts`:
	 * ```ts
	 * import { SvelteComponent } from "svelte";
	 * export class MyComponent extends SvelteComponent<{foo: string}> {}
	 * ```
	 * Typing this makes it possible for IDEs like VS Code with the Svelte extension
	 * to provide intellisense and to use the component like this in a Svelte file
	 * with TypeScript:
	 * ```svelte
	 * <script lang="ts">
	 * 	import { MyComponent } from "component-library";
	 * </script>
	 * <MyComponent foo={'bar'} />
	 * ```
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 * @template {Record<string, any>} [Slots=any]
	 * @extends {SvelteComponent<Props, Events>}
	 */
	class SvelteComponentDev extends SvelteComponent {
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Props}
		 */
		$$prop_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Events}
		 */
		$$events_def;
		/**
		 * For type checking capabilities only.
		 * Does not exist at runtime.
		 * ### DO NOT USE!
		 *
		 * @type {Slots}
		 */
		$$slot_def;

		/** @param {import('./public.js').ComponentConstructorOptions<Props>} options */
		constructor(options) {
			if (!options || (!options.target && !options.$$inline)) {
				throw new Error("'target' is a required option");
			}
			super();
		}

		/** @returns {void} */
		$destroy() {
			super.$destroy();
			this.$destroy = () => {
				console.warn('Component was already destroyed'); // eslint-disable-line no-console
			};
		}

		/** @returns {void} */
		$capture_state() {}

		/** @returns {void} */
		$inject_state() {}
	}

	if (typeof window !== 'undefined')
		// @ts-ignore
		(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

	/* src/components/Input.svelte generated by Svelte v4.2.9 */
	const file$4 = "src/components/Input.svelte";

	function add_css$2(target) {
		append_styles(target, "svelte-sl394t", "input.svelte-sl394t{width:90%;padding:1rem;margin-bottom:1rem;border:1px solid #ccc;border-radius:8px;box-sizing:border-box}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5wdXQuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQTZCRSxvQkFDRSxTQUFVLENBQ1YsWUFBYSxDQUNiLGtCQUFtQixDQUNuQixxQkFBc0IsQ0FDdEIsaUJBQWtCLENBQ2xCLHFCQUNGIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIklucHV0LnN2ZWx0ZSJdfQ== */");
	}

	function create_fragment$4(ctx) {
		let input;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				input = element("input");
				attr_dev(input, "type", /*type*/ ctx[0]);
				attr_dev(input, "id", /*name*/ ctx[1]);
				attr_dev(input, "name", /*name*/ ctx[1]);
				attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
				input.required = /*required*/ ctx[4];
				input.disabled = /*disabled*/ ctx[3];
				input.readOnly = /*readonly*/ ctx[5];
				attr_dev(input, "class", "svelte-sl394t");
				add_location(input, file$4, 17, 0, 386);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, input, anchor);

				if (!mounted) {
					dispose = listen_dev(input, "change", /*onChange*/ ctx[6], false, false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*type*/ 1) {
					attr_dev(input, "type", /*type*/ ctx[0]);
				}

				if (dirty & /*name*/ 2) {
					attr_dev(input, "id", /*name*/ ctx[1]);
				}

				if (dirty & /*name*/ 2) {
					attr_dev(input, "name", /*name*/ ctx[1]);
				}

				if (dirty & /*placeholder*/ 4) {
					attr_dev(input, "placeholder", /*placeholder*/ ctx[2]);
				}

				if (dirty & /*required*/ 16) {
					prop_dev(input, "required", /*required*/ ctx[4]);
				}

				if (dirty & /*disabled*/ 8) {
					prop_dev(input, "disabled", /*disabled*/ ctx[3]);
				}

				if (dirty & /*readonly*/ 32) {
					prop_dev(input, "readOnly", /*readonly*/ ctx[5]);
				}
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(input);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$4.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$4($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('Input', slots, []);
		let { type = "text" } = $$props;
		let { name = "" } = $$props;
		let { placeholder = "" } = $$props;
		let { disabled = false } = $$props;
		let { required = false } = $$props;
		let { readonly = false } = $$props;
		const dispatch = createEventDispatcher();

		//@ts-ignore
		function onChange(event) {
			dispatch("onChange", event.target.value);
		}

		const writable_props = ['type', 'name', 'placeholder', 'disabled', 'required', 'readonly'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Input> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('type' in $$props) $$invalidate(0, type = $$props.type);
			if ('name' in $$props) $$invalidate(1, name = $$props.name);
			if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
			if ('disabled' in $$props) $$invalidate(3, disabled = $$props.disabled);
			if ('required' in $$props) $$invalidate(4, required = $$props.required);
			if ('readonly' in $$props) $$invalidate(5, readonly = $$props.readonly);
		};

		$$self.$capture_state = () => ({
			type,
			name,
			placeholder,
			disabled,
			required,
			readonly,
			createEventDispatcher,
			dispatch,
			onChange
		});

		$$self.$inject_state = $$props => {
			if ('type' in $$props) $$invalidate(0, type = $$props.type);
			if ('name' in $$props) $$invalidate(1, name = $$props.name);
			if ('placeholder' in $$props) $$invalidate(2, placeholder = $$props.placeholder);
			if ('disabled' in $$props) $$invalidate(3, disabled = $$props.disabled);
			if ('required' in $$props) $$invalidate(4, required = $$props.required);
			if ('readonly' in $$props) $$invalidate(5, readonly = $$props.readonly);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [type, name, placeholder, disabled, required, readonly, onChange];
	}

	class Input extends SvelteComponentDev {
		constructor(options) {
			super(options);

			init(
				this,
				options,
				instance$4,
				create_fragment$4,
				safe_not_equal,
				{
					type: 0,
					name: 1,
					placeholder: 2,
					disabled: 3,
					required: 4,
					readonly: 5
				},
				add_css$2
			);

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "Input",
				options,
				id: create_fragment$4.name
			});
		}

		get type() {
			return this.$$.ctx[0];
		}

		set type(type) {
			this.$$set({ type });
			flush();
		}

		get name() {
			return this.$$.ctx[1];
		}

		set name(name) {
			this.$$set({ name });
			flush();
		}

		get placeholder() {
			return this.$$.ctx[2];
		}

		set placeholder(placeholder) {
			this.$$set({ placeholder });
			flush();
		}

		get disabled() {
			return this.$$.ctx[3];
		}

		set disabled(disabled) {
			this.$$set({ disabled });
			flush();
		}

		get required() {
			return this.$$.ctx[4];
		}

		set required(required) {
			this.$$set({ required });
			flush();
		}

		get readonly() {
			return this.$$.ctx[5];
		}

		set readonly(readonly) {
			this.$$set({ readonly });
			flush();
		}
	}

	create_custom_element(Input, {"type":{},"name":{},"placeholder":{},"disabled":{"type":"Boolean"},"required":{"type":"Boolean"},"readonly":{"type":"Boolean"}}, [], [], true);

	/* src/components/PreviousNavigationIcon.svelte generated by Svelte v4.2.9 */
	const file$3 = "src/components/PreviousNavigationIcon.svelte";

	function create_fragment$3(ctx) {
		let div;
		let svg;
		let g2;
		let g1;
		let rect0;
		let rect1;
		let g0;
		let rect2;
		let path0;
		let line0;
		let line1;
		let line2;
		let line3;
		let circle0;
		let circle1;
		let rect3;
		let path1;
		let path1_fill_value;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				div = element("div");
				svg = svg_element("svg");
				g2 = svg_element("g");
				g1 = svg_element("g");
				rect0 = svg_element("rect");
				rect1 = svg_element("rect");
				g0 = svg_element("g");
				rect2 = svg_element("rect");
				path0 = svg_element("path");
				line0 = svg_element("line");
				line1 = svg_element("line");
				line2 = svg_element("line");
				line3 = svg_element("line");
				circle0 = svg_element("circle");
				circle1 = svg_element("circle");
				rect3 = svg_element("rect");
				path1 = svg_element("path");
				attr_dev(rect0, "id", "canvas");
				attr_dev(rect0, "fill", "#FFBFF9");
				attr_dev(rect0, "x", "0");
				attr_dev(rect0, "y", "0");
				attr_dev(rect0, "width", "24");
				attr_dev(rect0, "height", "24");
				add_location(rect0, file$3, 30, 9, 710);
				attr_dev(rect1, "id", "art-area");
				attr_dev(rect1, "fill", "#FFFFFF");
				attr_dev(rect1, "x", "1");
				attr_dev(rect1, "y", "1");
				attr_dev(rect1, "width", "22");
				attr_dev(rect1, "height", "22");
				add_location(rect1, file$3, 31, 16, 794);
				attr_dev(rect2, "id", "vertical-rectangle");
				attr_dev(rect2, "stroke-width", "0.25");
				attr_dev(rect2, "x", "6.625");
				attr_dev(rect2, "y", "0.125");
				attr_dev(rect2, "width", "10.75");
				attr_dev(rect2, "height", "21.75");
				attr_dev(rect2, "rx", "2");
				add_location(rect2, file$3, 43, 11, 1080);
				attr_dev(path0, "d", "M17.375,20 C17.375,20.517767 17.1651335,20.986517 16.8258252,21.3258252 C16.486517,21.6651335 16.017767,21.875 15.5,21.875 L8.5,21.875 C7.98223305,21.875 7.51348305,21.6651335 7.17417479,21.3258252 C6.83486652,20.986517 6.625,20.517767 6.625,20 L6.625,2 C6.625,1.48223305 6.83486652,1.01348305 7.17417479,0.674174785 C7.51348305,0.334866524 7.98223305,0.125 8.5,0.125 L15.5,0.125 C16.017767,0.125 16.486517,0.334866524 16.8258252,0.674174785 C17.1651335,1.01348305 17.375,1.48223305 17.375,2 L17.375,20 Z");
				attr_dev(path0, "id", "horizontal-rectangle");
				attr_dev(path0, "stroke-width", "0.25");
				attr_dev(path0, "transform", "translate(12.000000, 11.000000) rotate(-270.000000) translate(-12.000000, -11.000000) ");
				add_location(path0, file$3, 51, 18, 1288);
				attr_dev(line0, "x1", "1");
				attr_dev(line0, "y1", "11");
				attr_dev(line0, "x2", "23");
				attr_dev(line0, "y2", "11");
				attr_dev(line0, "id", "vertical-center");
				attr_dev(line0, "stroke-width", "0.3");
				attr_dev(line0, "stroke-linecap", "square");
				attr_dev(line0, "stroke-dasharray", "1");
				attr_dev(line0, "transform", "translate(12.000000, 11.000000) rotate(-90.000000) translate(-12.000000, -11.000000) ");
				add_location(line0, file$3, 56, 18, 2014);
				attr_dev(line1, "x1", "0.978218914");
				attr_dev(line1, "y1", "11");
				attr_dev(line1, "x2", "22.9782189");
				attr_dev(line1, "y2", "11");
				attr_dev(line1, "id", "horizontal-center");
				attr_dev(line1, "stroke-width", "0.3");
				attr_dev(line1, "stroke-linecap", "square");
				attr_dev(line1, "stroke-dasharray", "1");
				attr_dev(line1, "transform", "translate(11.978219, 11.000000) rotate(-180.000000) translate(-11.978219, -11.000000) ");
				add_location(line1, file$3, 66, 18, 2360);
				attr_dev(line2, "x1", "-2.8492424");
				attr_dev(line2, "y1", "11");
				attr_dev(line2, "x2", "26.8492424");
				attr_dev(line2, "y2", "11");
				attr_dev(line2, "id", "diagonal");
				attr_dev(line2, "stroke-width", "0.3");
				attr_dev(line2, "stroke-linecap", "square");
				attr_dev(line2, "stroke-dasharray", "1");
				attr_dev(line2, "transform", "translate(12.000000, 11.000000) rotate(-135.000000) translate(-12.000000, -11.000000) ");
				add_location(line2, file$3, 76, 18, 2727);
				attr_dev(line3, "x1", "-2.8492424");
				attr_dev(line3, "y1", "11");
				attr_dev(line3, "x2", "26.8492424");
				attr_dev(line3, "y2", "11");
				attr_dev(line3, "id", "diagonal");
				attr_dev(line3, "stroke-width", "0.3");
				attr_dev(line3, "stroke-linecap", "square");
				attr_dev(line3, "stroke-dasharray", "1");
				attr_dev(line3, "transform", "translate(12.000000, 11.000000) rotate(-45.000000) translate(-12.000000, -11.000000) ");
				add_location(line3, file$3, 86, 18, 3084);
				attr_dev(circle0, "id", "circle");
				attr_dev(circle0, "stroke-width", "0.5");
				attr_dev(circle0, "cx", "12");
				attr_dev(circle0, "cy", "11");
				attr_dev(circle0, "r", "8.75");
				add_location(circle0, file$3, 96, 18, 3440);
				attr_dev(circle1, "id", "inner-circle");
				attr_dev(circle1, "stroke-width", "0.5");
				attr_dev(circle1, "cx", "12");
				attr_dev(circle1, "cy", "11");
				attr_dev(circle1, "r", "5.25");
				add_location(circle1, file$3, 102, 20, 3584);
				attr_dev(rect3, "id", "square");
				attr_dev(rect3, "stroke-width", "0.5");
				attr_dev(rect3, "x", "3.25");
				attr_dev(rect3, "y", "2.25");
				attr_dev(rect3, "width", "17.5");
				attr_dev(rect3, "height", "17.5");
				attr_dev(rect3, "rx", "2");
				add_location(rect3, file$3, 108, 20, 3734);
				attr_dev(g0, "id", "grid");
				attr_dev(g0, "stroke-width", "1");
				attr_dev(g0, "transform", "translate(0.000000, 1.000000)");
				attr_dev(g0, "stroke", "#FF2AEC");
				add_location(g0, file$3, 38, 16, 940);
				attr_dev(g1, "id", "consumer/icon-sizing/24px");
				attr_dev(g1, "opacity", "0.01");
				add_location(g1, file$3, 29, 7, 652);
				attr_dev(path1, "d", "M9.23590967,12.0878886 L17.8393474,20.6892098 C18.4252059,21.2749242 18.4253227,22.2246717 17.8396083,22.8105302 C17.253894,23.3963886 16.3041465,23.3965055 15.718288,22.8107911 L6.06446996,13.1593479 C5.4826928,12.5777139 5.47793343,11.6360254 6.05380178,11.0485406 L15.7076198,1.19998375 C16.287528,0.608377498 17.2372282,0.598894374 17.8288344,1.1788026 C18.4204407,1.75871082 18.4299238,2.70841094 17.8500156,3.30001719 L9.23590967,12.0878886 Z");
				attr_dev(path1, "id", "chevron-left-strong");
				attr_dev(path1, "fill", path1_fill_value = /*disabled*/ ctx[0] ? "#B5ADAD" : "#5A469B");
				add_location(path1, file$3, 118, 7, 3949);
				attr_dev(g2, "id", "common/icon/C/chevron-left-strong/24px");
				attr_dev(g2, "stroke", "none");
				attr_dev(g2, "stroke-width", "1");
				attr_dev(g2, "fill", "none");
				attr_dev(g2, "fill-rule", "evenodd");
				add_location(g2, file$3, 23, 5, 505);
				attr_dev(svg, "width", "24px");
				attr_dev(svg, "height", "24px");
				attr_dev(svg, "viewBox", "0 0 24 24");
				attr_dev(svg, "version", "1.1");
				attr_dev(svg, "aria-hidden", "true");
				attr_dev(svg, "role", "img");
				attr_dev(svg, "focusable", "false");
				add_location(svg, file$3, 15, 2, 358);
				add_location(div, file$3, 14, 0, 331);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, svg);
				append_dev(svg, g2);
				append_dev(g2, g1);
				append_dev(g1, rect0);
				append_dev(g1, rect1);
				append_dev(g1, g0);
				append_dev(g0, rect2);
				append_dev(g0, path0);
				append_dev(g0, line0);
				append_dev(g0, line1);
				append_dev(g0, line2);
				append_dev(g0, line3);
				append_dev(g0, circle0);
				append_dev(g0, circle1);
				append_dev(g0, rect3);
				append_dev(g2, path1);

				if (!mounted) {
					dispose = listen_dev(div, "click", /*onClick*/ ctx[1], false, false, false, false);
					mounted = true;
				}
			},
			p: function update(ctx, [dirty]) {
				if (dirty & /*disabled*/ 1 && path1_fill_value !== (path1_fill_value = /*disabled*/ ctx[0] ? "#B5ADAD" : "#5A469B")) {
					attr_dev(path1, "fill", path1_fill_value);
				}
			},
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$3.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$3($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('PreviousNavigationIcon', slots, []);
		let { disabled = false } = $$props;
		const dispatch = createEventDispatcher();

		function onClick() {
			if (!disabled) dispatch("onClick");
		}

		const writable_props = ['disabled'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PreviousNavigationIcon> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('disabled' in $$props) $$invalidate(0, disabled = $$props.disabled);
		};

		$$self.$capture_state = () => ({
			disabled,
			createEventDispatcher,
			dispatch,
			onClick
		});

		$$self.$inject_state = $$props => {
			if ('disabled' in $$props) $$invalidate(0, disabled = $$props.disabled);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [disabled, onClick];
	}

	class PreviousNavigationIcon extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$3, create_fragment$3, safe_not_equal, { disabled: 0 });

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "PreviousNavigationIcon",
				options,
				id: create_fragment$3.name
			});
		}

		get disabled() {
			return this.$$.ctx[0];
		}

		set disabled(disabled) {
			this.$$set({ disabled });
			flush();
		}
	}

	create_custom_element(PreviousNavigationIcon, {"disabled":{"type":"Boolean"}}, [], [], true);

	/* src/components/NextNavigationIcon.svelte generated by Svelte v4.2.9 */
	const file$2 = "src/components/NextNavigationIcon.svelte";

	function create_fragment$2(ctx) {
		let div;
		let svg;
		let g2;
		let g1;
		let rect0;
		let rect1;
		let g0;
		let rect2;
		let path0;
		let line0;
		let line1;
		let line2;
		let line3;
		let circle0;
		let circle1;
		let rect3;
		let path1;
		let mounted;
		let dispose;

		const block = {
			c: function create() {
				div = element("div");
				svg = svg_element("svg");
				g2 = svg_element("g");
				g1 = svg_element("g");
				rect0 = svg_element("rect");
				rect1 = svg_element("rect");
				g0 = svg_element("g");
				rect2 = svg_element("rect");
				path0 = svg_element("path");
				line0 = svg_element("line");
				line1 = svg_element("line");
				line2 = svg_element("line");
				line3 = svg_element("line");
				circle0 = svg_element("circle");
				circle1 = svg_element("circle");
				rect3 = svg_element("rect");
				path1 = svg_element("path");
				attr_dev(rect0, "id", "canvas");
				attr_dev(rect0, "fill", "#FFBFF9");
				attr_dev(rect0, "x", "0");
				attr_dev(rect0, "y", "0");
				attr_dev(rect0, "width", "24");
				attr_dev(rect0, "height", "24");
				add_location(rect0, file$2, 28, 9, 664);
				attr_dev(rect1, "id", "art-area");
				attr_dev(rect1, "fill", "#FFFFFF");
				attr_dev(rect1, "x", "1");
				attr_dev(rect1, "y", "1");
				attr_dev(rect1, "width", "22");
				attr_dev(rect1, "height", "22");
				add_location(rect1, file$2, 29, 16, 748);
				attr_dev(rect2, "id", "vertical-rectangle");
				attr_dev(rect2, "stroke-width", "0.25");
				attr_dev(rect2, "x", "6.625");
				attr_dev(rect2, "y", "0.125");
				attr_dev(rect2, "width", "10.75");
				attr_dev(rect2, "height", "21.75");
				attr_dev(rect2, "rx", "2");
				add_location(rect2, file$2, 41, 11, 1034);
				attr_dev(path0, "d", "M17.375,20 C17.375,20.517767 17.1651335,20.986517 16.8258252,21.3258252 C16.486517,21.6651335 16.017767,21.875 15.5,21.875 L8.5,21.875 C7.98223305,21.875 7.51348305,21.6651335 7.17417479,21.3258252 C6.83486652,20.986517 6.625,20.517767 6.625,20 L6.625,2 C6.625,1.48223305 6.83486652,1.01348305 7.17417479,0.674174785 C7.51348305,0.334866524 7.98223305,0.125 8.5,0.125 L15.5,0.125 C16.017767,0.125 16.486517,0.334866524 16.8258252,0.674174785 C17.1651335,1.01348305 17.375,1.48223305 17.375,2 L17.375,20 Z");
				attr_dev(path0, "id", "horizontal-rectangle");
				attr_dev(path0, "stroke-width", "0.25");
				attr_dev(path0, "transform", "translate(12.000000, 11.000000) rotate(-270.000000) translate(-12.000000, -11.000000) ");
				add_location(path0, file$2, 49, 18, 1242);
				attr_dev(line0, "x1", "1");
				attr_dev(line0, "y1", "11");
				attr_dev(line0, "x2", "23");
				attr_dev(line0, "y2", "11");
				attr_dev(line0, "id", "vertical-center");
				attr_dev(line0, "stroke-width", "0.3");
				attr_dev(line0, "stroke-linecap", "square");
				attr_dev(line0, "stroke-dasharray", "1");
				attr_dev(line0, "transform", "translate(12.000000, 11.000000) rotate(-90.000000) translate(-12.000000, -11.000000) ");
				add_location(line0, file$2, 54, 18, 1968);
				attr_dev(line1, "x1", "0.978218914");
				attr_dev(line1, "y1", "11");
				attr_dev(line1, "x2", "22.9782189");
				attr_dev(line1, "y2", "11");
				attr_dev(line1, "id", "horizontal-center");
				attr_dev(line1, "stroke-width", "0.3");
				attr_dev(line1, "stroke-linecap", "square");
				attr_dev(line1, "stroke-dasharray", "1");
				attr_dev(line1, "transform", "translate(11.978219, 11.000000) rotate(-180.000000) translate(-11.978219, -11.000000) ");
				add_location(line1, file$2, 64, 18, 2314);
				attr_dev(line2, "x1", "-2.8492424");
				attr_dev(line2, "y1", "11");
				attr_dev(line2, "x2", "26.8492424");
				attr_dev(line2, "y2", "11");
				attr_dev(line2, "id", "diagonal");
				attr_dev(line2, "stroke-width", "0.3");
				attr_dev(line2, "stroke-linecap", "square");
				attr_dev(line2, "stroke-dasharray", "1");
				attr_dev(line2, "transform", "translate(12.000000, 11.000000) rotate(-135.000000) translate(-12.000000, -11.000000) ");
				add_location(line2, file$2, 74, 18, 2681);
				attr_dev(line3, "x1", "-2.8492424");
				attr_dev(line3, "y1", "11");
				attr_dev(line3, "x2", "26.8492424");
				attr_dev(line3, "y2", "11");
				attr_dev(line3, "id", "diagonal");
				attr_dev(line3, "stroke-width", "0.3");
				attr_dev(line3, "stroke-linecap", "square");
				attr_dev(line3, "stroke-dasharray", "1");
				attr_dev(line3, "transform", "translate(12.000000, 11.000000) rotate(-45.000000) translate(-12.000000, -11.000000) ");
				add_location(line3, file$2, 84, 18, 3038);
				attr_dev(circle0, "id", "circle");
				attr_dev(circle0, "stroke-width", "0.5");
				attr_dev(circle0, "cx", "12");
				attr_dev(circle0, "cy", "11");
				attr_dev(circle0, "r", "8.75");
				add_location(circle0, file$2, 94, 18, 3394);
				attr_dev(circle1, "id", "inner-circle");
				attr_dev(circle1, "stroke-width", "0.5");
				attr_dev(circle1, "cx", "12");
				attr_dev(circle1, "cy", "11");
				attr_dev(circle1, "r", "5.25");
				add_location(circle1, file$2, 100, 20, 3538);
				attr_dev(rect3, "id", "square");
				attr_dev(rect3, "stroke-width", "0.5");
				attr_dev(rect3, "x", "3.25");
				attr_dev(rect3, "y", "2.25");
				attr_dev(rect3, "width", "17.5");
				attr_dev(rect3, "height", "17.5");
				attr_dev(rect3, "rx", "2");
				add_location(rect3, file$2, 106, 20, 3688);
				attr_dev(g0, "id", "grid");
				attr_dev(g0, "stroke-width", "1");
				attr_dev(g0, "transform", "translate(0.000000, 1.000000)");
				attr_dev(g0, "stroke", "#FF2AEC");
				add_location(g0, file$2, 36, 16, 894);
				attr_dev(g1, "id", "consumer/icon-sizing/24px");
				attr_dev(g1, "opacity", "0.01");
				add_location(g1, file$2, 27, 7, 606);
				attr_dev(path1, "d", "M14.667908,11.9121119 L6.06447031,3.31079064 C5.47861182,2.72507627 5.47849499,1.77532881 6.06420936,1.18947031 C6.64992373,0.60361182 7.59967119,0.603494986 8.18552969,1.18920936 L17.8393477,10.8406525 C18.4211249,11.4222866 18.4258843,12.363975 17.8500159,12.9514599 L8.19619787,22.8000167 C7.61628965,23.391623 6.66658953,23.4011061 6.07498328,22.8211979 C5.48337703,22.2412896 5.4738939,21.2915895 6.05380213,20.6999833 L14.667908,11.9121119 Z");
				attr_dev(path1, "id", "chevron-right-strong");
				attr_dev(path1, "fill", "#5A469B");
				add_location(path1, file$2, 116, 7, 3903);
				attr_dev(g2, "id", "common/icon/C/chevron-right-strong/24px");
				attr_dev(g2, "stroke", "none");
				attr_dev(g2, "stroke-width", "1");
				attr_dev(g2, "fill", "none");
				attr_dev(g2, "fill-rule", "evenodd");
				add_location(g2, file$2, 21, 5, 458);
				attr_dev(svg, "width", "24px");
				attr_dev(svg, "height", "24px");
				attr_dev(svg, "viewBox", "0 0 24 24");
				attr_dev(svg, "version", "1.1");
				attr_dev(svg, "aria-hidden", "true");
				attr_dev(svg, "role", "img");
				attr_dev(svg, "focusable", "false");
				add_location(svg, file$2, 13, 2, 311);
				add_location(div, file$2, 12, 0, 284);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, svg);
				append_dev(svg, g2);
				append_dev(g2, g1);
				append_dev(g1, rect0);
				append_dev(g1, rect1);
				append_dev(g1, g0);
				append_dev(g0, rect2);
				append_dev(g0, path0);
				append_dev(g0, line0);
				append_dev(g0, line1);
				append_dev(g0, line2);
				append_dev(g0, line3);
				append_dev(g0, circle0);
				append_dev(g0, circle1);
				append_dev(g0, rect3);
				append_dev(g2, path1);

				if (!mounted) {
					dispose = listen_dev(div, "click", /*onClick*/ ctx[0], false, false, false, false);
					mounted = true;
				}
			},
			p: noop,
			i: noop,
			o: noop,
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$2.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('NextNavigationIcon', slots, []);
		const dispatch = createEventDispatcher();

		function onClick() {
			dispatch("onClick");
		}

		const writable_props = [];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NextNavigationIcon> was created with unknown prop '${key}'`);
		});

		$$self.$capture_state = () => ({ createEventDispatcher, dispatch, onClick });
		return [onClick];
	}

	class NextNavigationIcon extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "NextNavigationIcon",
				options,
				id: create_fragment$2.name
			});
		}
	}

	create_custom_element(NextNavigationIcon, {}, [], [], true);

	/* src/components/DatePickerForm.svelte generated by Svelte v4.2.9 */

	const { console: console_1 } = globals;
	const file$1 = "src/components/DatePickerForm.svelte";

	function add_css$1(target) {
		append_styles(target, "svelte-92lnwi", ".container.svelte-92lnwi{display:flex;padding:2rem;flex-direction:column}.date-picker-header.svelte-92lnwi{font-size:24px;font-weight:700}.date-picker-sub-heading.svelte-92lnwi{font-size:18px;font-weight:600}.address_date_container.svelte-92lnwi{display:flex;align-items:center;justify-content:space-between;margin:0 1rem 1rem 0}.radios-container.svelte-92lnwi{display:flex;align-items:center;gap:20px;margin-bottom:1rem}.time-of-day-container.svelte-92lnwi{margin-bottom:1rem}.slots-container.svelte-92lnwi{display:flex;justify-content:space-between;margin-bottom:2rem}.day-slots-container.svelte-92lnwi{display:flex;gap:20px;flex-direction:column}@media(max-width: 768px){.container.svelte-92lnwi{padding:1rem}.address_date_container.svelte-92lnwi{flex-direction:column-reverse;align-items:flex-start}}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0ZVBpY2tlckZvcm0uc3ZlbHRlIiwibWFwcGluZ3MiOiJBQXFRRSx5QkFDRSxZQUFhLENBQ2IsWUFBYSxDQUNiLHFCQUNGLENBRUEsa0NBQ0UsY0FBZSxDQUNmLGVBQ0YsQ0FFQSx1Q0FDRSxjQUFlLENBQ2YsZUFDRixDQUVBLHNDQUNFLFlBQWEsQ0FDYixrQkFBbUIsQ0FDbkIsNkJBQThCLENBQzlCLG9CQUNGLENBRUEsZ0NBQ0UsWUFBYSxDQUNiLGtCQUFtQixDQUNuQixRQUFTLENBQ1Qsa0JBQ0YsQ0FFQSxxQ0FDRSxrQkFDRixDQUVBLCtCQUNFLFlBQWEsQ0FDYiw2QkFBOEIsQ0FDOUIsa0JBQ0YsQ0FFQSxtQ0FDRSxZQUFhLENBQ2IsUUFBUyxDQUNULHFCQUNGLENBRUEseUJBQ0UseUJBQ0UsWUFDRixDQUVBLHNDQUNFLDZCQUE4QixDQUM5QixzQkFDRixDQUNGIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkRhdGVQaWNrZXJGb3JtLnN2ZWx0ZSJdfQ== */");
	}

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[28] = list[i];
		return child_ctx;
	}

	function get_each_context_1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[31] = list[i];
		return child_ctx;
	}

	// (243:8) {#each timeSlots as slot (slot)}
	function create_each_block_1(key_1, ctx) {
		let div;
		let input;
		let input_checked_value;
		let input_value_value;
		let t0;
		let t1_value = /*slot*/ ctx[31] + "";
		let t1;
		let mounted;
		let dispose;

		function change_handler() {
			return /*change_handler*/ ctx[16](/*businessDay*/ ctx[28], /*slot*/ ctx[31]);
		}

		const block = {
			key: key_1,
			first: null,
			c: function create() {
				div = element("div");
				input = element("input");
				t0 = space();
				t1 = text(t1_value);
				attr_dev(input, "type", "radio");
				input.checked = input_checked_value = /*isSlotChecked*/ ctx[6](/*businessDay*/ ctx[28], /*slot*/ ctx[31]);
				input.value = input_value_value = /*slot*/ ctx[31];
				add_location(input, file$1, 244, 12, 5893);
				add_location(div, file$1, 243, 10, 5875);
				this.first = div;
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				append_dev(div, input);
				append_dev(div, t0);
				append_dev(div, t1);

				if (!mounted) {
					dispose = listen_dev(input, "change", change_handler, false, false, false, false);
					mounted = true;
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;

				if (dirty[0] & /*businessDays, timeSlots*/ 18 && input_checked_value !== (input_checked_value = /*isSlotChecked*/ ctx[6](/*businessDay*/ ctx[28], /*slot*/ ctx[31]))) {
					prop_dev(input, "checked", input_checked_value);
				}

				if (dirty[0] & /*timeSlots*/ 16 && input_value_value !== (input_value_value = /*slot*/ ctx[31])) {
					prop_dev(input, "value", input_value_value);
				}

				if (dirty[0] & /*timeSlots*/ 16 && t1_value !== (t1_value = /*slot*/ ctx[31] + "")) set_data_dev(t1, t1_value);
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				mounted = false;
				dispose();
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block_1.name,
			type: "each",
			source: "(243:8) {#each timeSlots as slot (slot)}",
			ctx
		});

		return block;
	}

	// (240:4) {#each businessDays as businessDay (businessDay)}
	function create_each_block(key_1, ctx) {
		let div1;
		let div0;
		let t0_value = getFormattedDate(/*businessDay*/ ctx[28]) + "";
		let t0;
		let t1;
		let each_blocks = [];
		let each_1_lookup = new Map();
		let each_value_1 = ensure_array_like_dev(/*timeSlots*/ ctx[4]);
		const get_key = ctx => /*slot*/ ctx[31];
		validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

		for (let i = 0; i < each_value_1.length; i += 1) {
			let child_ctx = get_each_context_1(ctx, each_value_1, i);
			let key = get_key(child_ctx);
			each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
		}

		const block = {
			key: key_1,
			first: null,
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				t0 = text(t0_value);
				t1 = space();

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				add_location(div0, file$1, 241, 8, 5781);
				attr_dev(div1, "class", "day-slots-container svelte-92lnwi");
				add_location(div1, file$1, 240, 6, 5739);
				this.first = div1;
			},
			m: function mount(target, anchor) {
				insert_dev(target, div1, anchor);
				append_dev(div1, div0);
				append_dev(div0, t0);
				append_dev(div1, t1);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(div1, null);
					}
				}
			},
			p: function update(new_ctx, dirty) {
				ctx = new_ctx;
				if (dirty[0] & /*businessDays*/ 2 && t0_value !== (t0_value = getFormattedDate(/*businessDay*/ ctx[28]) + "")) set_data_dev(t0, t0_value);

				if (dirty[0] & /*timeSlots, isSlotChecked, businessDays, saveSlotDateAndTime*/ 114) {
					each_value_1 = ensure_array_like_dev(/*timeSlots*/ ctx[4]);
					validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
					each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div1, destroy_block, create_each_block_1, null, get_each_context_1);
				}
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div1);
				}

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].d();
				}
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_each_block.name,
			type: "each",
			source: "(240:4) {#each businessDays as businessDay (businessDay)}",
			ctx
		});

		return block;
	}

	function create_fragment$1(ctx) {
		let div5;
		let h1;
		let t1;
		let div1;
		let div0;
		let input0;
		let updating_value;
		let t2;
		let div3;
		let h3;
		let t4;
		let div2;
		let label0;
		let input1;
		let t5;
		let t6;
		let label1;
		let input2;
		let t7;
		let t8;
		let div4;
		let previousnavigationicon;
		let t9;
		let each_blocks = [];
		let each_1_lookup = new Map();
		let t10;
		let nextnavigationicon;
		let current;
		let binding_group;
		let mounted;
		let dispose;

		function input0_value_binding(value) {
			/*input0_value_binding*/ ctx[12](value);
		}

		let input0_props = {
			type: "date",
			placeholder: "Select date...",
			required: true
		};

		if (/*date*/ ctx[0] !== void 0) {
			input0_props.value = /*date*/ ctx[0];
		}

		input0 = new Input({ props: input0_props, $$inline: true });
		binding_callbacks.push(() => bind(input0, 'value', input0_value_binding));
		input0.$on("onChange", /*updateDate*/ ctx[10]);

		previousnavigationicon = new PreviousNavigationIcon({
				props: {
					disabled: /*previousNavigationDisabled*/ ctx[2]
				},
				$$inline: true
			});

		previousnavigationicon.$on("onClick", /*goToPreviousBusinessDays*/ ctx[8]);
		let each_value = ensure_array_like_dev(/*businessDays*/ ctx[1]);
		const get_key = ctx => /*businessDay*/ ctx[28];
		validate_each_keys(ctx, each_value, get_each_context, get_key);

		for (let i = 0; i < each_value.length; i += 1) {
			let child_ctx = get_each_context(ctx, each_value, i);
			let key = get_key(child_ctx);
			each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
		}

		nextnavigationicon = new NextNavigationIcon({ $$inline: true });
		nextnavigationicon.$on("onClick", /*goToNextBusinessDays*/ ctx[9]);
		binding_group = init_binding_group(/*$$binding_groups*/ ctx[14][0]);

		const block = {
			c: function create() {
				div5 = element("div");
				h1 = element("h1");
				h1.textContent = "Choose a day and time";
				t1 = space();
				div1 = element("div");
				div0 = element("div");
				create_component(input0.$$.fragment);
				t2 = space();
				div3 = element("div");
				h3 = element("h3");
				h3.textContent = "Time of day";
				t4 = space();
				div2 = element("div");
				label0 = element("label");
				input1 = element("input");
				t5 = text("\n        Morning");
				t6 = space();
				label1 = element("label");
				input2 = element("input");
				t7 = text("\n        Afternoon");
				t8 = space();
				div4 = element("div");
				create_component(previousnavigationicon.$$.fragment);
				t9 = space();

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t10 = space();
				create_component(nextnavigationicon.$$.fragment);
				attr_dev(h1, "class", "date-picker-header svelte-92lnwi");
				add_location(h1, file$1, 196, 2, 4642);
				attr_dev(div0, "class", "date-container");
				add_location(div0, file$1, 198, 4, 4743);
				attr_dev(div1, "class", "address_date_container svelte-92lnwi");
				add_location(div1, file$1, 197, 2, 4702);
				attr_dev(h3, "class", "date-picker-sub-heading time-of-day-container svelte-92lnwi");
				add_location(h3, file$1, 210, 4, 4990);
				attr_dev(input1, "type", "radio");
				input1.__value = "morning";
				set_input_value(input1, input1.__value);
				add_location(input1, file$1, 213, 8, 5122);
				add_location(label0, file$1, 212, 6, 5106);
				attr_dev(input2, "type", "radio");
				input2.__value = "afternoon";
				set_input_value(input2, input2.__value);
				add_location(input2, file$1, 222, 8, 5321);
				add_location(label1, file$1, 221, 6, 5305);
				attr_dev(div2, "class", "radios-container svelte-92lnwi");
				add_location(div2, file$1, 211, 4, 5069);
				attr_dev(div3, "class", "time-of-day-container svelte-92lnwi");
				add_location(div3, file$1, 209, 2, 4950);
				attr_dev(div4, "class", "slots-container svelte-92lnwi");
				add_location(div4, file$1, 233, 2, 5525);
				attr_dev(div5, "class", "container svelte-92lnwi");
				add_location(div5, file$1, 195, 0, 4616);
				binding_group.p(input1, input2);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div5, anchor);
				append_dev(div5, h1);
				append_dev(div5, t1);
				append_dev(div5, div1);
				append_dev(div1, div0);
				mount_component(input0, div0, null);
				append_dev(div5, t2);
				append_dev(div5, div3);
				append_dev(div3, h3);
				append_dev(div3, t4);
				append_dev(div3, div2);
				append_dev(div2, label0);
				append_dev(label0, input1);
				input1.checked = input1.__value === /*selectedTimeOfDay*/ ctx[3];
				append_dev(label0, t5);
				append_dev(div2, t6);
				append_dev(div2, label1);
				append_dev(label1, input2);
				input2.checked = input2.__value === /*selectedTimeOfDay*/ ctx[3];
				append_dev(label1, t7);
				append_dev(div5, t8);
				append_dev(div5, div4);
				mount_component(previousnavigationicon, div4, null);
				append_dev(div4, t9);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(div4, null);
					}
				}

				append_dev(div4, t10);
				mount_component(nextnavigationicon, div4, null);
				current = true;

				if (!mounted) {
					dispose = [
						listen_dev(input1, "change", /*input1_change_handler*/ ctx[13]),
						listen_dev(input1, "change", /*updateTimeSlots*/ ctx[7], false, false, false, false),
						listen_dev(input2, "change", /*input2_change_handler*/ ctx[15]),
						listen_dev(input2, "change", /*updateTimeSlots*/ ctx[7], false, false, false, false)
					];

					mounted = true;
				}
			},
			p: function update(ctx, dirty) {
				const input0_changes = {};

				if (!updating_value && dirty[0] & /*date*/ 1) {
					updating_value = true;
					input0_changes.value = /*date*/ ctx[0];
					add_flush_callback(() => updating_value = false);
				}

				input0.$set(input0_changes);

				if (dirty[0] & /*selectedTimeOfDay*/ 8) {
					input1.checked = input1.__value === /*selectedTimeOfDay*/ ctx[3];
				}

				if (dirty[0] & /*selectedTimeOfDay*/ 8) {
					input2.checked = input2.__value === /*selectedTimeOfDay*/ ctx[3];
				}

				const previousnavigationicon_changes = {};
				if (dirty[0] & /*previousNavigationDisabled*/ 4) previousnavigationicon_changes.disabled = /*previousNavigationDisabled*/ ctx[2];
				previousnavigationicon.$set(previousnavigationicon_changes);

				if (dirty[0] & /*timeSlots, isSlotChecked, businessDays, saveSlotDateAndTime*/ 114) {
					each_value = ensure_array_like_dev(/*businessDays*/ ctx[1]);
					validate_each_keys(ctx, each_value, get_each_context, get_key);
					each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div4, destroy_block, create_each_block, t10, get_each_context);
				}
			},
			i: function intro(local) {
				if (current) return;
				transition_in(input0.$$.fragment, local);
				transition_in(previousnavigationicon.$$.fragment, local);
				transition_in(nextnavigationicon.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(input0.$$.fragment, local);
				transition_out(previousnavigationicon.$$.fragment, local);
				transition_out(nextnavigationicon.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div5);
				}

				destroy_component(input0);
				destroy_component(previousnavigationicon);

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].d();
				}

				destroy_component(nextnavigationicon);
				binding_group.r();
				mounted = false;
				run_all(dispose);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment$1.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	const showBusinessDays = 3;

	// @ts-ignore
	function generateTimeSlots(startHour, endHour, intervalMinutes) {
		const timeSlots = [];

		for (let hour = startHour; hour <= endHour; hour++) {
			for (let minute = 0; minute < 60; minute += intervalMinutes) {
				const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
				const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
				timeSlots.push(`${formattedHour}:${formattedMinute}`);
			}
		}

		return timeSlots;
	}

	// @ts-ignore
	function isOffDay(date) {
		return date.getDay() === 0 || date.getDay() === 6;
	}

	// @ts-ignore
	function getFormattedDate(date) {
		return new Intl.DateTimeFormat("en-US",
		{
				weekday: "short",
				month: "numeric",
				day: "numeric"
			}).format(date);
	}

	function instance$1($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('DatePickerForm', slots, []);
		let date = new Date();
		let { formData = {} } = $$props;
		let startingSlotDate = new Date();
		let disabled = true;

		/**
	 * @type {any[]}
	 */
		let businessDays = [];

		let previousNavigationDisabled = true;

		// @ts-ignore
		let { selectedTimeOfDay, selectedSlotTime, selectedSlotDate } = formData;

		const dispatch = createEventDispatcher();

		afterUpdate(() => {
			setIsDisabledNextButton();
		});

		/**
	 * @ts-ignore
	 * @type {any[]}
	 */
		let timeSlots = [];

		onMount(() => {
			updateTimeSlots();
			updateBusinessDays();
		});

		// @ts-ignore
		function saveSlotDateAndTime(selectedSlotDate, selectedSlotTime) {
			saveFormData({ selectedSlotTime });
			saveFormData({ selectedSlotDate });
		}

		// @ts-ignore
		function isSlotChecked(slotDate, slotTime) {
			return selectedSlotTime === slotTime && selectedSlotDate === slotDate;
		}

		function updatePreviousNavigationDisabledStatus() {
			$$invalidate(2, previousNavigationDisabled = isStartingDateIsCurrentDate() || startingSlotDate < new Date());
		}

		// @ts-ignore
		function saveFormData(data) {
			dispatch("save", data);
			setIsDisabledNextButton();
		}

		function updateTimeSlots() {
			if (selectedTimeOfDay === "morning") {
				$$invalidate(4, timeSlots = generateTimeSlots(9, 11, 30));
			} else if (selectedTimeOfDay === "afternoon") {
				$$invalidate(4, timeSlots = generateTimeSlots(12, 16, 30));
			}
		}

		function updateBusinessDays() {
			$$invalidate(1, businessDays = getNextBusinessDays());
		}

		function getNextBusinessDays() {
			const result = [];
			let currentDate = new Date(startingSlotDate);
			console.log("currentDate", currentDate, (",startingSlotDate").startingSlotDate);

			if (currentDate > new Date() && !isOffDay(currentDate)) {
				result.push(new Date(currentDate));
			}

			while (result.length < showBusinessDays) {
				currentDate.setDate(currentDate.getDate() + 1);

				if (!isOffDay(currentDate)) {
					//   // Exclude Saturday and Sunday
					result.push(new Date(currentDate));
				}
			}

			return result;
		}

		function isStartingDateIsCurrentDate() {
			return startingSlotDate.toDateString() === new Date().toDateString();
		}

		function goToPreviousBusinessDays() {
			if (isStartingDateIsCurrentDate()) return;
			let currentDate = new Date(startingSlotDate);
			let index = 0;

			while (index < showBusinessDays) {
				currentDate.setDate(currentDate.getDate() - 1);

				if (!isOffDay(currentDate)) {
					index++;
				}
			}

			startingSlotDate = new Date(currentDate);
			updatePreviousNavigationDisabledStatus();
			updateBusinessDays();
		}

		function goToNextBusinessDays() {
			let currentDate = new Date(startingSlotDate);
			let index = 0;

			while (index < showBusinessDays) {
				currentDate.setDate(currentDate.getDate() + 1);

				if (!isOffDay(currentDate)) {
					index++;
				}
			}

			startingSlotDate = new Date(currentDate);
			$$invalidate(2, previousNavigationDisabled = false);
			updateBusinessDays();
		}

		function setIsDisabledNextButton() {
			//@ts-ignore
			let { selectedTimeOfDay: timeOfDay, selectedSlotTime: slotTime, selectedSlotDate: slotDate, calendarDate: date } = formData;

			disabled = !timeOfDay || !slotTime || !slotDate || !date;
		}

		function updateDate(event) {
			$$invalidate(0, date = event.detail);
			startingSlotDate = date;
			saveFormData({ calendarDate: date });
			updateBusinessDays();
			updatePreviousNavigationDisabledStatus();
		}

		const writable_props = ['formData'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<DatePickerForm> was created with unknown prop '${key}'`);
		});

		const $$binding_groups = [[]];

		function input0_value_binding(value) {
			date = value;
			$$invalidate(0, date);
		}

		function input1_change_handler() {
			selectedTimeOfDay = this.__value;
			$$invalidate(3, selectedTimeOfDay);
		}

		function input2_change_handler() {
			selectedTimeOfDay = this.__value;
			$$invalidate(3, selectedTimeOfDay);
		}

		const change_handler = (businessDay, slot) => saveSlotDateAndTime(businessDay, slot);

		$$self.$$set = $$props => {
			if ('formData' in $$props) $$invalidate(11, formData = $$props.formData);
		};

		$$self.$capture_state = () => ({
			createEventDispatcher,
			onMount,
			afterUpdate,
			Input,
			PreviousNavigationIcon,
			NextNavigationIcon,
			showBusinessDays,
			date,
			formData,
			startingSlotDate,
			disabled,
			businessDays,
			previousNavigationDisabled,
			selectedTimeOfDay,
			selectedSlotTime,
			selectedSlotDate,
			dispatch,
			timeSlots,
			saveSlotDateAndTime,
			isSlotChecked,
			updatePreviousNavigationDisabledStatus,
			generateTimeSlots,
			saveFormData,
			updateTimeSlots,
			updateBusinessDays,
			isOffDay,
			getNextBusinessDays,
			isStartingDateIsCurrentDate,
			goToPreviousBusinessDays,
			goToNextBusinessDays,
			getFormattedDate,
			setIsDisabledNextButton,
			updateDate
		});

		$$self.$inject_state = $$props => {
			if ('date' in $$props) $$invalidate(0, date = $$props.date);
			if ('formData' in $$props) $$invalidate(11, formData = $$props.formData);
			if ('startingSlotDate' in $$props) startingSlotDate = $$props.startingSlotDate;
			if ('disabled' in $$props) disabled = $$props.disabled;
			if ('businessDays' in $$props) $$invalidate(1, businessDays = $$props.businessDays);
			if ('previousNavigationDisabled' in $$props) $$invalidate(2, previousNavigationDisabled = $$props.previousNavigationDisabled);
			if ('selectedTimeOfDay' in $$props) $$invalidate(3, selectedTimeOfDay = $$props.selectedTimeOfDay);
			if ('selectedSlotTime' in $$props) selectedSlotTime = $$props.selectedSlotTime;
			if ('selectedSlotDate' in $$props) selectedSlotDate = $$props.selectedSlotDate;
			if ('timeSlots' in $$props) $$invalidate(4, timeSlots = $$props.timeSlots);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [
			date,
			businessDays,
			previousNavigationDisabled,
			selectedTimeOfDay,
			timeSlots,
			saveSlotDateAndTime,
			isSlotChecked,
			updateTimeSlots,
			goToPreviousBusinessDays,
			goToNextBusinessDays,
			updateDate,
			formData,
			input0_value_binding,
			input1_change_handler,
			$$binding_groups,
			input2_change_handler,
			change_handler
		];
	}

	class DatePickerForm extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$1, safe_not_equal, { formData: 11 }, add_css$1, [-1, -1]);

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "DatePickerForm",
				options,
				id: create_fragment$1.name
			});
		}

		get formData() {
			return this.$$.ctx[11];
		}

		set formData(formData) {
			this.$$set({ formData });
			flush();
		}
	}

	create_custom_element(DatePickerForm, {"formData":{}}, [], [], true);

	/* src/components/AppointmentWidget.svelte generated by Svelte v4.2.9 */
	const file = "src/components/AppointmentWidget.svelte";

	function add_css(target) {
		append_styles(target, "svelte-1djjlu3", ".widget-container.svelte-1djjlu3{max-width:1080px;margin:2rem auto;padding:1rem;border:1px solid #ccc;border-radius:20px;background-color:#f9f9f9;display:flex;align-items:center}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwb2ludG1lbnRXaWRnZXQuc3ZlbHRlIiwibWFwcGluZ3MiOiJBQXFDRSxpQ0FDRSxnQkFBaUIsQ0FDakIsZ0JBQWlCLENBQ2pCLFlBQWEsQ0FDYixxQkFBc0IsQ0FDdEIsa0JBQW1CLENBQ25CLHdCQUF5QixDQUN6QixZQUFhLENBQ2Isa0JBQ0YiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiQXBwb2ludG1lbnRXaWRnZXQuc3ZlbHRlIl19 */");
	}

	function create_fragment(ctx) {
		let div;
		let datepickerform;
		let current;

		datepickerform = new DatePickerForm({
				props: { formData: /*formData*/ ctx[0] },
				$$inline: true
			});

		datepickerform.$on("save", /*saveFormData*/ ctx[1]);

		const block = {
			c: function create() {
				div = element("div");
				create_component(datepickerform.$$.fragment);
				attr_dev(div, "class", "widget-container box panel svelte-1djjlu3");
				add_location(div, file, 32, 0, 582);
			},
			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},
			m: function mount(target, anchor) {
				insert_dev(target, div, anchor);
				mount_component(datepickerform, div, null);
				current = true;
			},
			p: function update(ctx, [dirty]) {
				const datepickerform_changes = {};
				if (dirty & /*formData*/ 1) datepickerform_changes.formData = /*formData*/ ctx[0];
				datepickerform.$set(datepickerform_changes);
			},
			i: function intro(local) {
				if (current) return;
				transition_in(datepickerform.$$.fragment, local);
				current = true;
			},
			o: function outro(local) {
				transition_out(datepickerform.$$.fragment, local);
				current = false;
			},
			d: function destroy(detaching) {
				if (detaching) {
					detach_dev(div);
				}

				destroy_component(datepickerform);
			}
		};

		dispatch_dev("SvelteRegisterBlock", {
			block,
			id: create_fragment.name,
			type: "component",
			source: "",
			ctx
		});

		return block;
	}

	function instance($$self, $$props, $$invalidate) {
		let { $$slots: slots = {}, $$scope } = $$props;
		validate_slots('AppointmentWidget', slots, []);
		let step = 1;

		onMount(() => {
			step = 1;
		});

		let formData = {
			calendarDate: new Date(),
			selectedTimeOfDay: "morning"
		};

		let { notifyChanges } = $$props;

		function getFormData() {
			return formData;
		}

		/** @ts-ignore*/
		function saveFormData(data) {
			$$invalidate(0, formData = { ...formData, ...data.detail });

			// @ts-ignore
			if (notifyChanges) notifyChanges(formData);
		}

		$$self.$$.on_mount.push(function () {
			if (notifyChanges === undefined && !('notifyChanges' in $$props || $$self.$$.bound[$$self.$$.props['notifyChanges']])) {
				console.warn("<AppointmentWidget> was created without expected prop 'notifyChanges'");
			}
		});

		const writable_props = ['notifyChanges'];

		Object.keys($$props).forEach(key => {
			if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AppointmentWidget> was created with unknown prop '${key}'`);
		});

		$$self.$$set = $$props => {
			if ('notifyChanges' in $$props) $$invalidate(2, notifyChanges = $$props.notifyChanges);
		};

		$$self.$capture_state = () => ({
			DatePickerForm,
			onMount,
			step,
			formData,
			notifyChanges,
			getFormData,
			saveFormData
		});

		$$self.$inject_state = $$props => {
			if ('step' in $$props) step = $$props.step;
			if ('formData' in $$props) $$invalidate(0, formData = $$props.formData);
			if ('notifyChanges' in $$props) $$invalidate(2, notifyChanges = $$props.notifyChanges);
		};

		if ($$props && "$$inject" in $$props) {
			$$self.$inject_state($$props.$$inject);
		}

		return [formData, saveFormData, notifyChanges, getFormData];
	}

	class AppointmentWidget extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance, create_fragment, safe_not_equal, { notifyChanges: 2, getFormData: 3 }, add_css);

			dispatch_dev("SvelteRegisterComponent", {
				component: this,
				tagName: "AppointmentWidget",
				options,
				id: create_fragment.name
			});
		}

		get notifyChanges() {
			return this.$$.ctx[2];
		}

		set notifyChanges(notifyChanges) {
			this.$$set({ notifyChanges });
			flush();
		}

		get getFormData() {
			return this.$$.ctx[3];
		}

		set getFormData(value) {
			throw new Error("<AppointmentWidget>: Cannot set read-only property 'getFormData'");
		}
	}

	create_custom_element(AppointmentWidget, {"notifyChanges":{}}, [], ["getFormData"], true);

	return AppointmentWidget;

})();
//# sourceMappingURL=SchedulerWidget.js.map
