(function() {
	const P1 = {
		MediaQuery: {
			prop: "useMediaQuery",
			filter: () => !0
		},
		React: {
			prop: "useRef",
			filter: r => "createElement" in r
		},
		ReactDOM: {
			prop: "findDOMNode",
			filter: r => "createPortal" in r
		}
	};

	function Rr(r, e) {
		const t = Symbol(r);
		let a = !1;
		return new Promise(n => {
			Object.defineProperty(Object.prototype, r, {
				configurable: !0,
				enumerable: !1,
				set(i) {
					if (this === Object.prototype) {
						a = !0, Object.prototype[t] = i;
						return
					}
					Object.defineProperty(this, r, {
						configurable: !0,
						writable: !0,
						enumerable: !0,
						value: i
					}), (!e || e(this)) && (n(this), a || delete Object.prototype[r])
				},
				get() {
					return this[t]
				}
			})
		})
	}
	const t0 = new Proxy({}, {
		get(r, e) {
			return new Proxy(r[e] ?? {}, {
				get(t, a) {
					return r[e]?.[a]
				}
			})
		}
	});
	Object.entries(P1).forEach(([r, e]) => {
		Rr(e.prop, e.filter).then(t => Object.assign(t0, {
			[r]: t
		}))
	});
	var le = {
			exfiltrate: Rr,
			common: t0
		},
		G1 = Object.defineProperty,
		V1 = (r, e, t) => e in r ? G1(r, e, {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: t
		}) : r[e] = t,
		$r = (r, e, t) => (V1(r, typeof e != "symbol" ? e + "" : e, t), t);
	let Ve = class {
		constructor(e, t = !0) {
			$r(this, "name", "Storage"), $r(this, "logging", !0), this.name = e, this.logging = t, this.init()
		}
		init() {
			localStorage.getItem(this.name) || localStorage.setItem(this.name, JSON.stringify({}))
		}
		log(e, ...t) {
			this.logging && Promise.resolve().then(function() {
				return g1
			}).then(({
				default: a
			}) => {
				a.info(e, ...t)
			})
		}
		error(e, ...t) {
			Promise.resolve().then(function() {
				return g1
			}).then(({
				default: a
			}) => {
				a.error(e, ...t)
			})
		}
		set(e, t) {
			if (this.init(), typeof e == "string") this.log("Setting", {
				key: e,
				value: t
			});
			else return this.error("Setting", {
				key: e,
				value: t
			});
			const a = JSON.parse(localStorage.getItem(this.name) ?? "{}");
			localStorage.setItem(this.name, JSON.stringify({
				...a,
				[e]: t
			}))
		}
		get(e) {
			return this.init(), this.log("Getting", {
				key: e
			}), JSON.parse(localStorage.getItem(this.name) ?? "{}")[e] ?? null
		}
		delete(e) {
			if (this.init(), typeof e == "string") this.log("Deleting", {
				key: e
			});
			else return this.error("Deleting", {
				key: e
			});
			const {
				[e]: t, ...a
			} = JSON.parse(localStorage.getItem(this.name) ?? "{}");
			localStorage.setItem(this.name, JSON.stringify({
				...a
			}))
		}
		toggle(e) {
			if (this.init(), typeof e == "string") this.log("Toggling", {
				key: e
			});
			else return this.error("Toggling", {
				key: e
			});
			this.set(e, !this.get(e))
		}
		list() {
			return this.init(), this.log("Listing", {
				_: null
			}), JSON.parse(localStorage.getItem(this.name) ?? "{}")
		}
		clear() {
			this.log("Clearing", {
				_: null
			}), localStorage.setItem(this.name, "{}")
		}
	};
	const C0 = {
			colors: new Ve("SparxSolverCustomTheme", !1),
			preferences: new Ve("SparxSolverPreferences", !1),
			bookwork: new Ve("SparxSolverBookwork")
		},
		{
			preferences: fe
		} = C0,
		j1 = {
			defaults: {
				firstName: "First name",
				lastName: "Last name"
			},
			get firstName() {
				return fe.get("shouldUseName") ? fe.get("betterFirstName") || this.defaults.firstName : fe.get("firstName")
			},
			get lastName() {
				return fe.get("shouldUseName") ? fe.get("betterLastName") || this.defaults.lastName : fe.get("lastName")
			}
		},
		Ir = {
			user: "https://github.com/c0lide",
			get plain() {
				return this.user + "/SparxSolver"
			},
			raw: "https://raw.githubusercontent.com/c0lide/SparxSolver"
		};
	var U1 = {
		name: j1,
		repository: Ir,
		getImage: r => `${Ir.raw}/main/extension/assets/${r}`,
		capitalize: r => r.trim().replace(/^\w/, e => e.toUpperCase()),
		noop: () => {}
	};

	function Or(r = {}, e = i => i, {
		ignore: t = [],
		walkable: a = [],
		maxProperties: n = 100
	} = {}) {
		let i = [r];
		const o = function(...u) {
			try {
				return Reflect.apply(e, this, u)
			} catch {
				return !1
			}
		};
		for (; i.length && n;) {
			const u = i.shift();
			if (o(u)) return u;
			if (Array.isArray(u)) i.push(...u);
			else if (typeof u == "object" && u !== null)
				if (a.length)
					for (const m in u) {
						const p = u[m];
						~a.indexOf(m) && !~t.indexOf(m) && i.push(p)
					} else
						for (const m in u) {
							const p = u[m];
							u && ~t.indexOf(m) || i.push(p)
						}
			n--
		}
	}

	function W1(r, e = a => a, t = {}) {
		return Or(r, e, {
			walkable: ["props", "children"],
			...t
		})
	}
	const Y1 = (r, e = 0) => {
		if (!r) return null;
		const t = Object.keys(r).find(o => o.startsWith("__reactFiber$") || o.startsWith("__reactInternalInstance$") || o.startsWith("__reactContainer$")) ?? "",
			a = r[t];
		if (!a) return null;
		if (t.startsWith("__reactContainer$")) return a;
		if (a._currentElement) {
			let o = a._currentElement._owner;
			for (let u = 0; u < e; u++) o = o._currentElement._owner;
			return o._instance
		}
		const n = o => {
			let u = o.return;
			for (; u && typeof u.type == "string";) u = u.return;
			return u
		};
		let i = n(a);
		for (let o = 0; o < e; o++) i = n(i);
		return i
	};
	async function X1(r, e, t = 100, a = 100) {
		let n = 0;
		for (; n < t;) {
			const i = r();
			if (e ? e(i) : i) return i;
			await new Promise(o => setTimeout(o, a)), n++
		}
		return null
	}

	function Z1(r, e = "/student") {
		SparxSolver.navigation.navigator.replace(e ? `${e}${r}` : r)
	}

	function K1(r) {
		for (const e in r) return !1;
		return !0
	}
	const l0 = {
			...U1,
			findInReactTree: W1,
			findInTree: Or,
			findReact: Y1,
			lazyDefine: X1,
			navigate: Z1,
			isEmpty: K1
		},
		Lr = (...r) => r.reduce((e, t) => ({
			...e,
			...t
		}), {}),
		w0 = r => ({
			styles: r,
			merge: e => {
				const t = e(r);
				return Lr(...t)
			}
		}),
		X = w0({
			flex: {
				display: "flex"
			},
			align: {
				alignItems: "center"
			},
			justify: {
				justifyContent: "center"
			},
			row: {
				flexDirection: "row"
			},
			column: {
				flexDirection: "column"
			},
			wrap: {
				flexWrap: "wrap"
			},
			textCenter: {
				textAlign: "center"
			}
		}),
		{
			React: T0
		} = le.common,
		{
			merge: zt
		} = w0({
			body: {
				marginBottom: "1em",
				border: "2px solid var(--raw-light)",
				boxShadow: "var(--spx-shadow-md)",
				borderRadius: 20,
				overflow: "hidden"
			},
			bodyWrapper: {
				overflow: "hidden",
				transition: "max-height 200ms ease, opacity 200ms ease"
			},
			arrow: {
				scale: "50%",
				marginRight: "0.25em",
				userSelect: "none",
				transition: "all 300ms ease"
			}
		}),
		At = ({
			children: r
		}) => T0.createElement("h2", null, r),
		Tt = ({
			children: r,
			style: e
		}) => T0.createElement("div", {
			style: zt(t => [t.body, e ?? {}])
		}, r),
		pe = ({
			title: r,
			children: e,
			collapsable: t = !0,
			style: a
		}) => {
			const [n, i] = T0.useState(!1);
			return T0.createElement("div", {
				style: Lr({
					marginInline: "2em"
				}, a)
			}, T0.createElement("div", {
				style: X.merge(o => [o.flex, o.row, {
					cursor: t ? "pointer" : "auto",
					userSelect: t ? "none" : "auto",
					width: "fit-content"
				}]),
				...t ? {
					onClick: () => i(o => !o)
				} : {}
			}, t && T0.createElement("div", {
				style: zt(o => [o.arrow, {
					rotate: n ? "0deg" : "90deg"
				}])
			}, T0.createElement("h2", null, "\u25B6")), r && T0.createElement("div", null, T0.createElement(At, null, r))), e && T0.createElement("div", {
				style: zt(o => [o.bodyWrapper, {
					maxHeight: n ? "0" : "100%",
					opacity: n ? "0" : "1"
				}])
			}, T0.createElement(Tt, null, e)))
		};
	var J1 = {
			SectionTitle: At,
			SectionBody: Tt,
			Section: pe
		},
		_1 = Object.freeze({
			__proto__: null,
			Section: pe,
			SectionBody: Tt,
			SectionTitle: At,
			default: J1
		});
	const {
		React: Fr
	} = t0, {
		merge: Hr
	} = w0({
		common: {
			margin: 0,
			color: "var(--raw-light)"
		}
	});
	var je = {
		Small: () => Fr.createElement("hr", {
			style: Hr(r => [r.common, {
				borderStyle: "dashed"
			}])
		}),
		Large: () => Fr.createElement("hr", {
			style: Hr(r => [r.common, {
				borderStyle: "dotted",
				borderWidth: 3
			}])
		})
	};
	const {
		React: Pr
	} = le.common, ve = (r, e) => {
		const [t, a] = Pr.useState(C0[e].get(r));
		return Pr.useLayoutEffect(() => {
			C0[e].set(r, t)
		}, [t]), [t, a]
	};
	var Q1 = Object.freeze({
		__proto__: null,
		useStorageValue: ve
	});
	class p0 {
		constructor(e, t, a) {
			this.lexer = void 0, this.start = void 0, this.end = void 0, this.lexer = e, this.start = t, this.end = a
		}
		static range(e, t) {
			return t ? !e || !e.loc || !t.loc || e.loc.lexer !== t.loc.lexer ? null : new p0(e.loc.lexer, e.loc.start, t.loc.end) : e && e.loc
		}
	}
	class D0 {
		constructor(e, t) {
			this.text = void 0, this.loc = void 0, this.noexpand = void 0, this.treatAsRelax = void 0, this.text = e, this.loc = t
		}
		range(e, t) {
			return new D0(t, p0.range(this, e))
		}
	}
	class M {
		constructor(e, t) {
			this.name = void 0, this.position = void 0, this.length = void 0, this.rawMessage = void 0;
			var a = "KaTeX parse error: " + e,
				n, i, o = t && t.loc;
			if (o && o.start <= o.end) {
				var u = o.lexer.input;
				n = o.start, i = o.end, n === u.length ? a += " at end of input: " : a += " at position " + (n + 1) + ": ";
				var m = u.slice(n, i).replace(/[^]/g, "$&\u0332"),
					p;
				n > 15 ? p = "\u2026" + u.slice(n - 15, n) : p = u.slice(0, n);
				var v;
				i + 15 < u.length ? v = u.slice(i, i + 15) + "\u2026" : v = u.slice(i), a += p + m + v
			}
			var b = new Error(a);
			return b.name = "ParseError", b.__proto__ = M.prototype, b.position = n, n != null && i != null && (b.length = i - n), b.rawMessage = e, b
		}
	}
	M.prototype.__proto__ = Error.prototype;
	var en = function(e, t) {
			return e.indexOf(t) !== -1
		},
		tn = function(e, t) {
			return e === void 0 ? t : e
		},
		rn = /([A-Z])/g,
		an = function(e) {
			return e.replace(rn, "-$1").toLowerCase()
		},
		nn = {
			"&": "&amp;",
			">": "&gt;",
			"<": "&lt;",
			'"': "&quot;",
			"'": "&#x27;"
		},
		ln = /[&><"']/g;

	function sn(r) {
		return String(r).replace(ln, e => nn[e])
	}
	var Gr = function r(e) {
			return e.type === "ordgroup" || e.type === "color" ? e.body.length === 1 ? r(e.body[0]) : e : e.type === "font" ? r(e.body) : e
		},
		on = function(e) {
			var t = Gr(e);
			return t.type === "mathord" || t.type === "textord" || t.type === "atom"
		},
		un = function(e) {
			if (!e) throw new Error("Expected non-null, but got " + String(e));
			return e
		},
		hn = function(e) {
			var t = /^\s*([^\\/#]*?)(?::|&#0*58|&#x0*3a)/i.exec(e);
			return t != null ? t[1] : "_relative"
		},
		R = {
			contains: en,
			deflt: tn,
			escape: sn,
			hyphenate: an,
			getBaseElem: Gr,
			isCharacterBox: on,
			protocolFromUrl: hn
		},
		Ue = {
			displayMode: {
				type: "boolean",
				description: "Render math in display mode, which puts the math in display style (so \\int and \\sum are large, for example), and centers the math on the page on its own line.",
				cli: "-d, --display-mode"
			},
			output: {
				type: {
					enum: ["htmlAndMathml", "html", "mathml"]
				},
				description: "Determines the markup language of the output.",
				cli: "-F, --format <type>"
			},
			leqno: {
				type: "boolean",
				description: "Render display math in leqno style (left-justified tags)."
			},
			fleqn: {
				type: "boolean",
				description: "Render display math flush left."
			},
			throwOnError: {
				type: "boolean",
				default: !0,
				cli: "-t, --no-throw-on-error",
				cliDescription: "Render errors (in the color given by --error-color) instead of throwing a ParseError exception when encountering an error."
			},
			errorColor: {
				type: "string",
				default: "#cc0000",
				cli: "-c, --error-color <color>",
				cliDescription: "A color string given in the format 'rgb' or 'rrggbb' (no #). This option determines the color of errors rendered by the -t option.",
				cliProcessor: r => "#" + r
			},
			macros: {
				type: "object",
				cli: "-m, --macro <def>",
				cliDescription: "Define custom macro of the form '\\foo:expansion' (use multiple -m arguments for multiple macros).",
				cliDefault: [],
				cliProcessor: (r, e) => (e.push(r), e)
			},
			minRuleThickness: {
				type: "number",
				description: "Specifies a minimum thickness, in ems, for fraction lines, `\\sqrt` top lines, `{array}` vertical lines, `\\hline`, `\\hdashline`, `\\underline`, `\\overline`, and the borders of `\\fbox`, `\\boxed`, and `\\fcolorbox`.",
				processor: r => Math.max(0, r),
				cli: "--min-rule-thickness <size>",
				cliProcessor: parseFloat
			},
			colorIsTextColor: {
				type: "boolean",
				description: "Makes \\color behave like LaTeX's 2-argument \\textcolor, instead of LaTeX's one-argument \\color mode change.",
				cli: "-b, --color-is-text-color"
			},
			strict: {
				type: [{
					enum: ["warn", "ignore", "error"]
				}, "boolean", "function"],
				description: "Turn on strict / LaTeX faithfulness mode, which throws an error if the input uses features that are not supported by LaTeX.",
				cli: "-S, --strict",
				cliDefault: !1
			},
			trust: {
				type: ["boolean", "function"],
				description: "Trust the input, enabling all HTML features such as \\url.",
				cli: "-T, --trust"
			},
			maxSize: {
				type: "number",
				default: 1 / 0,
				description: "If non-zero, all user-specified sizes, e.g. in \\rule{500em}{500em}, will be capped to maxSize ems. Otherwise, elements and spaces can be arbitrarily large",
				processor: r => Math.max(0, r),
				cli: "-s, --max-size <n>",
				cliProcessor: parseInt
			},
			maxExpand: {
				type: "number",
				default: 1e3,
				description: "Limit the number of macro expansions to the specified number, to prevent e.g. infinite macro loops. If set to Infinity, the macro expander will try to fully expand as in LaTeX.",
				processor: r => Math.max(0, r),
				cli: "-e, --max-expand <n>",
				cliProcessor: r => r === "Infinity" ? 1 / 0 : parseInt(r)
			},
			globalGroup: {
				type: "boolean",
				cli: !1
			}
		};

	function mn(r) {
		if (r.default) return r.default;
		var e = r.type,
			t = Array.isArray(e) ? e[0] : e;
		if (typeof t != "string") return t.enum[0];
		switch (t) {
			case "boolean":
				return !1;
			case "string":
				return "";
			case "number":
				return 0;
			case "object":
				return {}
		}
	}
	class Bt {
		constructor(e) {
			this.displayMode = void 0, this.output = void 0, this.leqno = void 0, this.fleqn = void 0, this.throwOnError = void 0, this.errorColor = void 0, this.macros = void 0, this.minRuleThickness = void 0, this.colorIsTextColor = void 0, this.strict = void 0, this.trust = void 0, this.maxSize = void 0, this.maxExpand = void 0, this.globalGroup = void 0, e = e || {};
			for (var t in Ue)
				if (Ue.hasOwnProperty(t)) {
					var a = Ue[t];
					this[t] = e[t] !== void 0 ? a.processor ? a.processor(e[t]) : e[t] : mn(a)
				}
		}
		reportNonstrict(e, t, a) {
			var n = this.strict;
			if (typeof n == "function" && (n = n(e, t, a)), !(!n || n === "ignore")) {
				if (n === !0 || n === "error") throw new M("LaTeX-incompatible input and strict mode is set to 'error': " + (t + " [" + e + "]"), a);
				n === "warn" ? typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (t + " [" + e + "]")) : typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + n + "': " + t + " [" + e + "]"))
			}
		}
		useStrictBehavior(e, t, a) {
			var n = this.strict;
			if (typeof n == "function") try {
				n = n(e, t, a)
			} catch {
				n = "error"
			}
			return !n || n === "ignore" ? !1 : n === !0 || n === "error" ? !0 : n === "warn" ? (typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to 'warn': " + (t + " [" + e + "]")), !1) : (typeof console < "u" && console.warn("LaTeX-incompatible input and strict mode is set to " + ("unrecognized '" + n + "': " + t + " [" + e + "]")), !1)
		}
		isTrusted(e) {
			e.url && !e.protocol && (e.protocol = R.protocolFromUrl(e.url));
			var t = typeof this.trust == "function" ? this.trust(e) : this.trust;
			return !!t
		}
	}
	class Y0 {
		constructor(e, t, a) {
			this.id = void 0, this.size = void 0, this.cramped = void 0, this.id = e, this.size = t, this.cramped = a
		}
		sup() {
			return N0[cn[this.id]]
		}
		sub() {
			return N0[dn[this.id]]
		}
		fracNum() {
			return N0[fn[this.id]]
		}
		fracDen() {
			return N0[pn[this.id]]
		}
		cramp() {
			return N0[vn[this.id]]
		}
		text() {
			return N0[gn[this.id]]
		}
		isTight() {
			return this.size >= 2
		}
	}
	var Et = 0,
		We = 1,
		ge = 2,
		L0 = 3,
		Ne = 4,
		x0 = 5,
		be = 6,
		s0 = 7,
		N0 = [new Y0(Et, 0, !1), new Y0(We, 0, !0), new Y0(ge, 1, !1), new Y0(L0, 1, !0), new Y0(Ne, 2, !1), new Y0(x0, 2, !0), new Y0(be, 3, !1), new Y0(s0, 3, !0)],
		cn = [Ne, x0, Ne, x0, be, s0, be, s0],
		dn = [x0, x0, x0, x0, s0, s0, s0, s0],
		fn = [ge, L0, Ne, x0, be, s0, be, s0],
		pn = [L0, L0, x0, x0, s0, s0, s0, s0],
		vn = [We, We, L0, L0, x0, x0, s0, s0],
		gn = [Et, We, ge, L0, ge, L0, ge, L0],
		N = {
			DISPLAY: N0[Et],
			TEXT: N0[ge],
			SCRIPT: N0[Ne],
			SCRIPTSCRIPT: N0[be]
		},
		Ct = [{
			name: "latin",
			blocks: [
				[256, 591],
				[768, 879]
			]
		}, {
			name: "cyrillic",
			blocks: [
				[1024, 1279]
			]
		}, {
			name: "armenian",
			blocks: [
				[1328, 1423]
			]
		}, {
			name: "brahmic",
			blocks: [
				[2304, 4255]
			]
		}, {
			name: "georgian",
			blocks: [
				[4256, 4351]
			]
		}, {
			name: "cjk",
			blocks: [
				[12288, 12543],
				[19968, 40879],
				[65280, 65376]
			]
		}, {
			name: "hangul",
			blocks: [
				[44032, 55215]
			]
		}];

	function bn(r) {
		for (var e = 0; e < Ct.length; e++)
			for (var t = Ct[e], a = 0; a < t.blocks.length; a++) {
				var n = t.blocks[a];
				if (r >= n[0] && r <= n[1]) return t.name
			}
		return null
	}
	var Ye = [];
	Ct.forEach(r => r.blocks.forEach(e => Ye.push(...e)));

	function Vr(r) {
		for (var e = 0; e < Ye.length; e += 2)
			if (r >= Ye[e] && r <= Ye[e + 1]) return !0;
		return !1
	}
	var ye = 80,
		yn = function(e, t) {
			return "M95," + (622 + e + t) + `
c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,-10,-9.5,-14
c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54
c44.2,-33.3,65.8,-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10
s173,378,173,378c0.7,0,35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429
c69,-144,104.5,-217.7,106.5,-221
l` + e / 2.075 + " -" + e + `
c5.3,-9.3,12,-14,20,-14
H400000v` + (40 + e) + `H845.2724
s-225.272,467,-225.272,467s-235,486,-235,486c-2.7,4.7,-9,7,-19,7
c-6,0,-10,-1,-12,-3s-194,-422,-194,-422s-65,47,-65,47z
M` + (834 + e) + " " + t + "h400000v" + (40 + e) + "h-400000z"
		},
		wn = function(e, t) {
			return "M263," + (601 + e + t) + `c0.7,0,18,39.7,52,119
c34,79.3,68.167,158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120
c340,-704.7,510.7,-1060.3,512,-1067
l` + e / 2.084 + " -" + e + `
c4.7,-7.3,11,-11,19,-11
H40000v` + (40 + e) + `H1012.3
s-271.3,567,-271.3,567c-38.7,80.7,-84,175,-136,283c-52,108,-89.167,185.3,-111.5,232
c-22.3,46.7,-33.8,70.3,-34.5,71c-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1
s-109,-253,-109,-253c-72.7,-168,-109.3,-252,-110,-252c-10.7,8,-22,16.7,-34,26
c-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26s76,-59,76,-59s76,-60,76,-60z
M` + (1001 + e) + " " + t + "h400000v" + (40 + e) + "h-400000z"
		},
		xn = function(e, t) {
			return "M983 " + (10 + e + t) + `
l` + e / 3.13 + " -" + e + `
c4,-6.7,10,-10,18,-10 H400000v` + (40 + e) + `
H1013.1s-83.4,268,-264.1,840c-180.7,572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7
s-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744
c-10,12,-21,25,-33,39s-32,39,-32,39c-6,-5.3,-15,-14,-27,-26s25,-30,25,-30
c26.7,-32.7,52,-63,76,-91s52,-60,52,-60s208,722,208,722
c56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,-658.5
c53.7,-170.3,84.5,-266.8,92.5,-289.5z
M` + (1001 + e) + " " + t + "h400000v" + (40 + e) + "h-400000z"
		},
		kn = function(e, t) {
			return "M424," + (2398 + e + t) + `
c-1.3,-0.7,-38.5,-172,-111.5,-514c-73,-342,-109.8,-513.3,-110.5,-514
c0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,25c-5.7,9.3,-9.8,16,-12.5,20
s-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,-13s76,-122,76,-122s77,-121,77,-121
s209,968,209,968c0,-2,84.7,-361.7,254,-1079c169.3,-717.3,254.7,-1077.7,256,-1081
l` + e / 4.223 + " -" + e + `c4,-6.7,10,-10,18,-10 H400000
v` + (40 + e) + `H1014.6
s-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185
c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2z M` + (1001 + e) + " " + t + `
h400000v` + (40 + e) + "h-400000z"
		},
		Sn = function(e, t) {
			return "M473," + (2713 + e + t) + `
c339.3,-1799.3,509.3,-2700,510,-2702 l` + e / 5.298 + " -" + e + `
c3.3,-7.3,9.3,-11,18,-11 H400000v` + (40 + e) + `H1017.7
s-90.5,478,-276.2,1466c-185.7,988,-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9
c-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200
c0,-1.3,-5.3,8.7,-16,30c-10.7,21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26
s76,-153,76,-153s77,-151,77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,
606zM` + (1001 + e) + " " + t + "h400000v" + (40 + e) + "H1017.7z"
		},
		Mn = function(e) {
			var t = e / 2;
			return "M400000 " + e + " H0 L" + t + " 0 l65 45 L145 " + (e - 80) + " H400000z"
		},
		zn = function(e, t, a) {
			var n = a - 54 - t - e;
			return "M702 " + (e + t) + "H400000" + (40 + e) + `
H742v` + n + `l-4 4-4 4c-.667.7 -2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1
h-12l-28-84c-16.667-52-96.667 -294.333-240-727l-212 -643 -85 170
c-4-3.333-8.333-7.667-13 -13l-13-13l77-155 77-156c66 199.333 139 419.667
219 661 l218 661zM702 ` + t + "H400000v" + (40 + e) + "H742z"
		},
		An = function(e, t, a) {
			t = 1e3 * t;
			var n = "";
			switch (e) {
				case "sqrtMain":
					n = yn(t, ye);
					break;
				case "sqrtSize1":
					n = wn(t, ye);
					break;
				case "sqrtSize2":
					n = xn(t, ye);
					break;
				case "sqrtSize3":
					n = kn(t, ye);
					break;
				case "sqrtSize4":
					n = Sn(t, ye);
					break;
				case "sqrtTall":
					n = zn(t, ye, a)
			}
			return n
		},
		Tn = function(e, t) {
			switch (e) {
				case "\u239C":
					return "M291 0 H417 V" + t + " H291z M291 0 H417 V" + t + " H291z";
				case "\u2223":
					return "M145 0 H188 V" + t + " H145z M145 0 H188 V" + t + " H145z";
				case "\u2225":
					return "M145 0 H188 V" + t + " H145z M145 0 H188 V" + t + " H145z" + ("M367 0 H410 V" + t + " H367z M367 0 H410 V" + t + " H367z");
				case "\u239F":
					return "M457 0 H583 V" + t + " H457z M457 0 H583 V" + t + " H457z";
				case "\u23A2":
					return "M319 0 H403 V" + t + " H319z M319 0 H403 V" + t + " H319z";
				case "\u23A5":
					return "M263 0 H347 V" + t + " H263z M263 0 H347 V" + t + " H263z";
				case "\u23AA":
					return "M384 0 H504 V" + t + " H384z M384 0 H504 V" + t + " H384z";
				case "\u23D0":
					return "M312 0 H355 V" + t + " H312z M312 0 H355 V" + t + " H312z";
				case "\u2016":
					return "M257 0 H300 V" + t + " H257z M257 0 H300 V" + t + " H257z" + ("M478 0 H521 V" + t + " H478z M478 0 H521 V" + t + " H478z");
				default:
					return ""
			}
		},
		jr = {
			doubleleftarrow: `M262 157
l10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3
 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28
 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5
c2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5
 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87
-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7
-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z
m8 0v40h399730v-40zm0 194v40h399730v-40z`,
			doublerightarrow: `M399738 392l
-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5
 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88
-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68
-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18
-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782
c-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3
-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z`,
			leftarrow: `M400000 241H110l3-3c68.7-52.7 113.7-120
 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8
-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247
c-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208
 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3
 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202
 l-3-3h399890zM100 241v40h399900v-40z`,
			leftbrace: `M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117
-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7
 5-6 9-10 13-.7 1-7.3 1-20 1H6z`,
			leftbraceunder: `M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13
 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688
 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7
-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z`,
			leftgroup: `M400000 80
H435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0
 435 0h399565z`,
			leftgroupunder: `M400000 262
H435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219
 435 219h399565z`,
			leftharpoon: `M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3
-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5
-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7
-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z`,
			leftharpoonplus: `M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5
 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3
-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7
-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z
m0 0v40h400000v-40z`,
			leftharpoondown: `M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333
 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5
 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667
-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z`,
			leftharpoondownplus: `M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12
 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7
-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0
v40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z`,
			lefthook: `M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5
-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3
-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21
 71.5 23h399859zM103 281v-40h399897v40z`,
			leftlinesegment: `M40 281 V428 H0 V94 H40 V241 H400000 v40z
M40 281 V428 H0 V94 H40 V241 H400000 v40z`,
			leftmapsto: `M40 281 V448H0V74H40V241H400000v40z
M40 281 V448H0V74H40V241H400000v40z`,
			leftToFrom: `M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23
-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8
c28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3
 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z`,
			longequal: `M0 50 h400000 v40H0z m0 194h40000v40H0z
M0 50 h400000 v40H0z m0 194h40000v40H0z`,
			midbrace: `M200428 334
c-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14
-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7
 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11
 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z`,
			midbraceunder: `M199572 214
c100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14
 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3
 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0
-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z`,
			oiintSize1: `M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6
-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z
m368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8
60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z`,
			oiintSize2: `M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8
-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z
m502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2
c0 110 84 276 504 276s502.4-166 502.4-276z`,
			oiiintSize1: `M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6
-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z
m525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0
85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z`,
			oiiintSize2: `M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8
-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z
m770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1
c0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z`,
			rightarrow: `M0 241v40h399891c-47.3 35.3-84 78-110 128
-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20
 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7
 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85
-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
 151.7 139 205zm0 0v40h399900v-40z`,
			rightbrace: `M400000 542l
-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5
s-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1
c124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z`,
			rightbraceunder: `M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3
 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237
-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z`,
			rightgroup: `M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0
 3-1 3-3v-38c-76-158-257-219-435-219H0z`,
			rightgroupunder: `M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18
 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z`,
			rightharpoon: `M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3
-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2
-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58
 69.2 92 94.5zm0 0v40h399900v-40z`,
			rightharpoonplus: `M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11
-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7
 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z
m0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z`,
			rightharpoondown: `M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8
 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5
-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95
-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z`,
			rightharpoondownplus: `M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8
 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3
 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3
-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z
m0-194v40h400000v-40zm0 0v40h400000v-40z`,
			righthook: `M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3
 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0
-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21
 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z`,
			rightlinesegment: `M399960 241 V94 h40 V428 h-40 V281 H0 v-40z
M399960 241 V94 h40 V428 h-40 V281 H0 v-40z`,
			rightToFrom: `M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23
 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32
-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142
-167z M100 147v40h399900v-40zM0 341v40h399900v-40z`,
			twoheadleftarrow: `M0 167c68 40
 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69
-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3
-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19
-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101
 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z`,
			twoheadrightarrow: `M400000 167
c-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3
 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42
 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333
-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70
 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z`,
			tilde1: `M200 55.538c-77 0-168 73.953-177 73.953-3 0-7
-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0
 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0
 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128
-68.267.847-113-73.952-191-73.952z`,
			tilde2: `M344 55.266c-142 0-300.638 81.316-311.5 86.418
-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9
 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114
c1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751
 181.476 676 181.476c-149 0-189-126.21-332-126.21z`,
			tilde3: `M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457
-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0
 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697
 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696
 -338 0-409-156.573-744-156.573z`,
			tilde4: `M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345
-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409
 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9
 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409
 -175.236-744-175.236z`,
			vec: `M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5
3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11
10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63
-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1
-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59
H213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359
c-16-25.333-24-45-24-59z`,
			widehat1: `M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22
c-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z`,
			widehat2: `M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,
			widehat3: `M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,
			widehat4: `M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10
-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z`,
			widecheck1: `M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,
-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z`,
			widecheck2: `M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,
			widecheck3: `M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,
			widecheck4: `M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,
-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z`,
			baraboveleftarrow: `M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202
c4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5
c-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130
s-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47
121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6
s2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11
c0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z
M100 620v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z`,
			rightarrowabovebar: `M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32
-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0
13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39
-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5
-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5
-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67
151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z`,
			baraboveshortleftharpoon: `M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17
c2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21
c-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40
c-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z
M0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z`,
			rightharpoonaboveshortbar: `M0,241 l0,40c399126,0,399993,0,399993,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z`,
			shortbaraboveleftharpoon: `M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11
c1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,
1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,
-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z
M93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z`,
			shortrightharpoonabovebar: `M53,241l0,40c398570,0,399437,0,399437,0
c4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,
-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6
c-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z
M500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z`
		},
		Bn = function(e, t) {
			switch (e) {
				case "lbrack":
					return "M403 1759 V84 H666 V0 H319 V1759 v" + t + ` v1759 h347 v-84
H403z M403 1759 V0 H319 V1759 v` + t + " v1759 h84z";
				case "rbrack":
					return "M347 1759 V0 H0 V84 H263 V1759 v" + t + ` v1759 H0 v84 H347z
M347 1759 V0 H263 V1759 v` + t + " v1759 h84z";
				case "vert":
					return "M145 15 v585 v" + t + ` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v` + -t + ` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v` + t + " v585 h43z";
				case "doublevert":
					return "M145 15 v585 v" + t + ` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v` + -t + ` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M188 15 H145 v585 v` + t + ` v585 h43z
M367 15 v585 v` + t + ` v585 c2.667,10,9.667,15,21,15
c10,0,16.667,-5,20,-15 v-585 v` + -t + ` v-585 c-2.667,-10,-9.667,-15,-21,-15
c-10,0,-16.667,5,-20,15z M410 15 H367 v585 v` + t + " v585 h43z";
				case "lfloor":
					return "M319 602 V0 H403 V602 v" + t + ` v1715 h263 v84 H319z
MM319 602 V0 H403 V602 v` + t + " v1715 H319z";
				case "rfloor":
					return "M319 602 V0 H403 V602 v" + t + ` v1799 H0 v-84 H319z
MM319 602 V0 H403 V602 v` + t + " v1715 H319z";
				case "lceil":
					return "M403 1759 V84 H666 V0 H319 V1759 v" + t + ` v602 h84z
M403 1759 V0 H319 V1759 v` + t + " v602 h84z";
				case "rceil":
					return "M347 1759 V0 H0 V84 H263 V1759 v" + t + ` v602 h84z
M347 1759 V0 h-84 V1759 v` + t + " v602 h84z";
				case "lparen":
					return `M863,9c0,-2,-2,-5,-6,-9c0,0,-17,0,-17,0c-12.7,0,-19.3,0.3,-20,1
c-5.3,5.3,-10.3,11,-15,17c-242.7,294.7,-395.3,682,-458,1162c-21.3,163.3,-33.3,349,
-36,557 l0,` + (t + 84) + `c0.2,6,0,26,0,60c2,159.3,10,310.7,24,454c53.3,528,210,
949.7,470,1265c4.7,6,9.7,11.7,15,17c0.7,0.7,7,1,19,1c0,0,18,0,18,0c4,-4,6,-7,6,-9
c0,-2.7,-3.3,-8.7,-10,-18c-135.3,-192.7,-235.5,-414.3,-300.5,-665c-65,-250.7,-102.5,
-544.7,-112.5,-882c-2,-104,-3,-167,-3,-189
l0,-` + (t + 92) + `c0,-162.7,5.7,-314,17,-454c20.7,-272,63.7,-513,129,-723c65.3,
-210,155.3,-396.3,270,-559c6.7,-9.3,10,-15.3,10,-18z`;
				case "rparen":
					return `M76,0c-16.7,0,-25,3,-25,9c0,2,2,6.3,6,13c21.3,28.7,42.3,60.3,
63,95c96.7,156.7,172.8,332.5,228.5,527.5c55.7,195,92.8,416.5,111.5,664.5
c11.3,139.3,17,290.7,17,454c0,28,1.7,43,3.3,45l0,` + (t + 9) + `
c-3,4,-3.3,16.7,-3.3,38c0,162,-5.7,313.7,-17,455c-18.7,248,-55.8,469.3,-111.5,664
c-55.7,194.7,-131.8,370.3,-228.5,527c-20.7,34.7,-41.7,66.3,-63,95c-2,3.3,-4,7,-6,11
c0,7.3,5.7,11,17,11c0,0,11,0,11,0c9.3,0,14.3,-0.3,15,-1c5.3,-5.3,10.3,-11,15,-17
c242.7,-294.7,395.3,-681.7,458,-1161c21.3,-164.7,33.3,-350.7,36,-558
l0,-` + (t + 144) + `c-2,-159.3,-10,-310.7,-24,-454c-53.3,-528,-210,-949.7,
-470,-1265c-4.7,-6,-9.7,-11.7,-15,-17c-0.7,-0.7,-6.7,-1,-18,-1z`;
				default:
					throw new Error("Unknown stretchy delimiter.")
			}
		};
	class qe {
		constructor(e) {
			this.children = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, this.children = e, this.classes = [], this.height = 0, this.depth = 0, this.maxFontSize = 0, this.style = {}
		}
		hasClass(e) {
			return R.contains(this.classes, e)
		}
		toNode() {
			for (var e = document.createDocumentFragment(), t = 0; t < this.children.length; t++) e.appendChild(this.children[t].toNode());
			return e
		}
		toMarkup() {
			for (var e = "", t = 0; t < this.children.length; t++) e += this.children[t].toMarkup();
			return e
		}
		toText() {
			var e = t => t.toText();
			return this.children.map(e).join("")
		}
	}
	var q0 = {
			"AMS-Regular": {
				32: [0, 0, 0, 0, .25],
				65: [0, .68889, 0, 0, .72222],
				66: [0, .68889, 0, 0, .66667],
				67: [0, .68889, 0, 0, .72222],
				68: [0, .68889, 0, 0, .72222],
				69: [0, .68889, 0, 0, .66667],
				70: [0, .68889, 0, 0, .61111],
				71: [0, .68889, 0, 0, .77778],
				72: [0, .68889, 0, 0, .77778],
				73: [0, .68889, 0, 0, .38889],
				74: [.16667, .68889, 0, 0, .5],
				75: [0, .68889, 0, 0, .77778],
				76: [0, .68889, 0, 0, .66667],
				77: [0, .68889, 0, 0, .94445],
				78: [0, .68889, 0, 0, .72222],
				79: [.16667, .68889, 0, 0, .77778],
				80: [0, .68889, 0, 0, .61111],
				81: [.16667, .68889, 0, 0, .77778],
				82: [0, .68889, 0, 0, .72222],
				83: [0, .68889, 0, 0, .55556],
				84: [0, .68889, 0, 0, .66667],
				85: [0, .68889, 0, 0, .72222],
				86: [0, .68889, 0, 0, .72222],
				87: [0, .68889, 0, 0, 1],
				88: [0, .68889, 0, 0, .72222],
				89: [0, .68889, 0, 0, .72222],
				90: [0, .68889, 0, 0, .66667],
				107: [0, .68889, 0, 0, .55556],
				160: [0, 0, 0, 0, .25],
				165: [0, .675, .025, 0, .75],
				174: [.15559, .69224, 0, 0, .94666],
				240: [0, .68889, 0, 0, .55556],
				295: [0, .68889, 0, 0, .54028],
				710: [0, .825, 0, 0, 2.33334],
				732: [0, .9, 0, 0, 2.33334],
				770: [0, .825, 0, 0, 2.33334],
				771: [0, .9, 0, 0, 2.33334],
				989: [.08167, .58167, 0, 0, .77778],
				1008: [0, .43056, .04028, 0, .66667],
				8245: [0, .54986, 0, 0, .275],
				8463: [0, .68889, 0, 0, .54028],
				8487: [0, .68889, 0, 0, .72222],
				8498: [0, .68889, 0, 0, .55556],
				8502: [0, .68889, 0, 0, .66667],
				8503: [0, .68889, 0, 0, .44445],
				8504: [0, .68889, 0, 0, .66667],
				8513: [0, .68889, 0, 0, .63889],
				8592: [-.03598, .46402, 0, 0, .5],
				8594: [-.03598, .46402, 0, 0, .5],
				8602: [-.13313, .36687, 0, 0, 1],
				8603: [-.13313, .36687, 0, 0, 1],
				8606: [.01354, .52239, 0, 0, 1],
				8608: [.01354, .52239, 0, 0, 1],
				8610: [.01354, .52239, 0, 0, 1.11111],
				8611: [.01354, .52239, 0, 0, 1.11111],
				8619: [0, .54986, 0, 0, 1],
				8620: [0, .54986, 0, 0, 1],
				8621: [-.13313, .37788, 0, 0, 1.38889],
				8622: [-.13313, .36687, 0, 0, 1],
				8624: [0, .69224, 0, 0, .5],
				8625: [0, .69224, 0, 0, .5],
				8630: [0, .43056, 0, 0, 1],
				8631: [0, .43056, 0, 0, 1],
				8634: [.08198, .58198, 0, 0, .77778],
				8635: [.08198, .58198, 0, 0, .77778],
				8638: [.19444, .69224, 0, 0, .41667],
				8639: [.19444, .69224, 0, 0, .41667],
				8642: [.19444, .69224, 0, 0, .41667],
				8643: [.19444, .69224, 0, 0, .41667],
				8644: [.1808, .675, 0, 0, 1],
				8646: [.1808, .675, 0, 0, 1],
				8647: [.1808, .675, 0, 0, 1],
				8648: [.19444, .69224, 0, 0, .83334],
				8649: [.1808, .675, 0, 0, 1],
				8650: [.19444, .69224, 0, 0, .83334],
				8651: [.01354, .52239, 0, 0, 1],
				8652: [.01354, .52239, 0, 0, 1],
				8653: [-.13313, .36687, 0, 0, 1],
				8654: [-.13313, .36687, 0, 0, 1],
				8655: [-.13313, .36687, 0, 0, 1],
				8666: [.13667, .63667, 0, 0, 1],
				8667: [.13667, .63667, 0, 0, 1],
				8669: [-.13313, .37788, 0, 0, 1],
				8672: [-.064, .437, 0, 0, 1.334],
				8674: [-.064, .437, 0, 0, 1.334],
				8705: [0, .825, 0, 0, .5],
				8708: [0, .68889, 0, 0, .55556],
				8709: [.08167, .58167, 0, 0, .77778],
				8717: [0, .43056, 0, 0, .42917],
				8722: [-.03598, .46402, 0, 0, .5],
				8724: [.08198, .69224, 0, 0, .77778],
				8726: [.08167, .58167, 0, 0, .77778],
				8733: [0, .69224, 0, 0, .77778],
				8736: [0, .69224, 0, 0, .72222],
				8737: [0, .69224, 0, 0, .72222],
				8738: [.03517, .52239, 0, 0, .72222],
				8739: [.08167, .58167, 0, 0, .22222],
				8740: [.25142, .74111, 0, 0, .27778],
				8741: [.08167, .58167, 0, 0, .38889],
				8742: [.25142, .74111, 0, 0, .5],
				8756: [0, .69224, 0, 0, .66667],
				8757: [0, .69224, 0, 0, .66667],
				8764: [-.13313, .36687, 0, 0, .77778],
				8765: [-.13313, .37788, 0, 0, .77778],
				8769: [-.13313, .36687, 0, 0, .77778],
				8770: [-.03625, .46375, 0, 0, .77778],
				8774: [.30274, .79383, 0, 0, .77778],
				8776: [-.01688, .48312, 0, 0, .77778],
				8778: [.08167, .58167, 0, 0, .77778],
				8782: [.06062, .54986, 0, 0, .77778],
				8783: [.06062, .54986, 0, 0, .77778],
				8785: [.08198, .58198, 0, 0, .77778],
				8786: [.08198, .58198, 0, 0, .77778],
				8787: [.08198, .58198, 0, 0, .77778],
				8790: [0, .69224, 0, 0, .77778],
				8791: [.22958, .72958, 0, 0, .77778],
				8796: [.08198, .91667, 0, 0, .77778],
				8806: [.25583, .75583, 0, 0, .77778],
				8807: [.25583, .75583, 0, 0, .77778],
				8808: [.25142, .75726, 0, 0, .77778],
				8809: [.25142, .75726, 0, 0, .77778],
				8812: [.25583, .75583, 0, 0, .5],
				8814: [.20576, .70576, 0, 0, .77778],
				8815: [.20576, .70576, 0, 0, .77778],
				8816: [.30274, .79383, 0, 0, .77778],
				8817: [.30274, .79383, 0, 0, .77778],
				8818: [.22958, .72958, 0, 0, .77778],
				8819: [.22958, .72958, 0, 0, .77778],
				8822: [.1808, .675, 0, 0, .77778],
				8823: [.1808, .675, 0, 0, .77778],
				8828: [.13667, .63667, 0, 0, .77778],
				8829: [.13667, .63667, 0, 0, .77778],
				8830: [.22958, .72958, 0, 0, .77778],
				8831: [.22958, .72958, 0, 0, .77778],
				8832: [.20576, .70576, 0, 0, .77778],
				8833: [.20576, .70576, 0, 0, .77778],
				8840: [.30274, .79383, 0, 0, .77778],
				8841: [.30274, .79383, 0, 0, .77778],
				8842: [.13597, .63597, 0, 0, .77778],
				8843: [.13597, .63597, 0, 0, .77778],
				8847: [.03517, .54986, 0, 0, .77778],
				8848: [.03517, .54986, 0, 0, .77778],
				8858: [.08198, .58198, 0, 0, .77778],
				8859: [.08198, .58198, 0, 0, .77778],
				8861: [.08198, .58198, 0, 0, .77778],
				8862: [0, .675, 0, 0, .77778],
				8863: [0, .675, 0, 0, .77778],
				8864: [0, .675, 0, 0, .77778],
				8865: [0, .675, 0, 0, .77778],
				8872: [0, .69224, 0, 0, .61111],
				8873: [0, .69224, 0, 0, .72222],
				8874: [0, .69224, 0, 0, .88889],
				8876: [0, .68889, 0, 0, .61111],
				8877: [0, .68889, 0, 0, .61111],
				8878: [0, .68889, 0, 0, .72222],
				8879: [0, .68889, 0, 0, .72222],
				8882: [.03517, .54986, 0, 0, .77778],
				8883: [.03517, .54986, 0, 0, .77778],
				8884: [.13667, .63667, 0, 0, .77778],
				8885: [.13667, .63667, 0, 0, .77778],
				8888: [0, .54986, 0, 0, 1.11111],
				8890: [.19444, .43056, 0, 0, .55556],
				8891: [.19444, .69224, 0, 0, .61111],
				8892: [.19444, .69224, 0, 0, .61111],
				8901: [0, .54986, 0, 0, .27778],
				8903: [.08167, .58167, 0, 0, .77778],
				8905: [.08167, .58167, 0, 0, .77778],
				8906: [.08167, .58167, 0, 0, .77778],
				8907: [0, .69224, 0, 0, .77778],
				8908: [0, .69224, 0, 0, .77778],
				8909: [-.03598, .46402, 0, 0, .77778],
				8910: [0, .54986, 0, 0, .76042],
				8911: [0, .54986, 0, 0, .76042],
				8912: [.03517, .54986, 0, 0, .77778],
				8913: [.03517, .54986, 0, 0, .77778],
				8914: [0, .54986, 0, 0, .66667],
				8915: [0, .54986, 0, 0, .66667],
				8916: [0, .69224, 0, 0, .66667],
				8918: [.0391, .5391, 0, 0, .77778],
				8919: [.0391, .5391, 0, 0, .77778],
				8920: [.03517, .54986, 0, 0, 1.33334],
				8921: [.03517, .54986, 0, 0, 1.33334],
				8922: [.38569, .88569, 0, 0, .77778],
				8923: [.38569, .88569, 0, 0, .77778],
				8926: [.13667, .63667, 0, 0, .77778],
				8927: [.13667, .63667, 0, 0, .77778],
				8928: [.30274, .79383, 0, 0, .77778],
				8929: [.30274, .79383, 0, 0, .77778],
				8934: [.23222, .74111, 0, 0, .77778],
				8935: [.23222, .74111, 0, 0, .77778],
				8936: [.23222, .74111, 0, 0, .77778],
				8937: [.23222, .74111, 0, 0, .77778],
				8938: [.20576, .70576, 0, 0, .77778],
				8939: [.20576, .70576, 0, 0, .77778],
				8940: [.30274, .79383, 0, 0, .77778],
				8941: [.30274, .79383, 0, 0, .77778],
				8994: [.19444, .69224, 0, 0, .77778],
				8995: [.19444, .69224, 0, 0, .77778],
				9416: [.15559, .69224, 0, 0, .90222],
				9484: [0, .69224, 0, 0, .5],
				9488: [0, .69224, 0, 0, .5],
				9492: [0, .37788, 0, 0, .5],
				9496: [0, .37788, 0, 0, .5],
				9585: [.19444, .68889, 0, 0, .88889],
				9586: [.19444, .74111, 0, 0, .88889],
				9632: [0, .675, 0, 0, .77778],
				9633: [0, .675, 0, 0, .77778],
				9650: [0, .54986, 0, 0, .72222],
				9651: [0, .54986, 0, 0, .72222],
				9654: [.03517, .54986, 0, 0, .77778],
				9660: [0, .54986, 0, 0, .72222],
				9661: [0, .54986, 0, 0, .72222],
				9664: [.03517, .54986, 0, 0, .77778],
				9674: [.11111, .69224, 0, 0, .66667],
				9733: [.19444, .69224, 0, 0, .94445],
				10003: [0, .69224, 0, 0, .83334],
				10016: [0, .69224, 0, 0, .83334],
				10731: [.11111, .69224, 0, 0, .66667],
				10846: [.19444, .75583, 0, 0, .61111],
				10877: [.13667, .63667, 0, 0, .77778],
				10878: [.13667, .63667, 0, 0, .77778],
				10885: [.25583, .75583, 0, 0, .77778],
				10886: [.25583, .75583, 0, 0, .77778],
				10887: [.13597, .63597, 0, 0, .77778],
				10888: [.13597, .63597, 0, 0, .77778],
				10889: [.26167, .75726, 0, 0, .77778],
				10890: [.26167, .75726, 0, 0, .77778],
				10891: [.48256, .98256, 0, 0, .77778],
				10892: [.48256, .98256, 0, 0, .77778],
				10901: [.13667, .63667, 0, 0, .77778],
				10902: [.13667, .63667, 0, 0, .77778],
				10933: [.25142, .75726, 0, 0, .77778],
				10934: [.25142, .75726, 0, 0, .77778],
				10935: [.26167, .75726, 0, 0, .77778],
				10936: [.26167, .75726, 0, 0, .77778],
				10937: [.26167, .75726, 0, 0, .77778],
				10938: [.26167, .75726, 0, 0, .77778],
				10949: [.25583, .75583, 0, 0, .77778],
				10950: [.25583, .75583, 0, 0, .77778],
				10955: [.28481, .79383, 0, 0, .77778],
				10956: [.28481, .79383, 0, 0, .77778],
				57350: [.08167, .58167, 0, 0, .22222],
				57351: [.08167, .58167, 0, 0, .38889],
				57352: [.08167, .58167, 0, 0, .77778],
				57353: [0, .43056, .04028, 0, .66667],
				57356: [.25142, .75726, 0, 0, .77778],
				57357: [.25142, .75726, 0, 0, .77778],
				57358: [.41951, .91951, 0, 0, .77778],
				57359: [.30274, .79383, 0, 0, .77778],
				57360: [.30274, .79383, 0, 0, .77778],
				57361: [.41951, .91951, 0, 0, .77778],
				57366: [.25142, .75726, 0, 0, .77778],
				57367: [.25142, .75726, 0, 0, .77778],
				57368: [.25142, .75726, 0, 0, .77778],
				57369: [.25142, .75726, 0, 0, .77778],
				57370: [.13597, .63597, 0, 0, .77778],
				57371: [.13597, .63597, 0, 0, .77778]
			},
			"Caligraphic-Regular": {
				32: [0, 0, 0, 0, .25],
				65: [0, .68333, 0, .19445, .79847],
				66: [0, .68333, .03041, .13889, .65681],
				67: [0, .68333, .05834, .13889, .52653],
				68: [0, .68333, .02778, .08334, .77139],
				69: [0, .68333, .08944, .11111, .52778],
				70: [0, .68333, .09931, .11111, .71875],
				71: [.09722, .68333, .0593, .11111, .59487],
				72: [0, .68333, .00965, .11111, .84452],
				73: [0, .68333, .07382, 0, .54452],
				74: [.09722, .68333, .18472, .16667, .67778],
				75: [0, .68333, .01445, .05556, .76195],
				76: [0, .68333, 0, .13889, .68972],
				77: [0, .68333, 0, .13889, 1.2009],
				78: [0, .68333, .14736, .08334, .82049],
				79: [0, .68333, .02778, .11111, .79611],
				80: [0, .68333, .08222, .08334, .69556],
				81: [.09722, .68333, 0, .11111, .81667],
				82: [0, .68333, 0, .08334, .8475],
				83: [0, .68333, .075, .13889, .60556],
				84: [0, .68333, .25417, 0, .54464],
				85: [0, .68333, .09931, .08334, .62583],
				86: [0, .68333, .08222, 0, .61278],
				87: [0, .68333, .08222, .08334, .98778],
				88: [0, .68333, .14643, .13889, .7133],
				89: [.09722, .68333, .08222, .08334, .66834],
				90: [0, .68333, .07944, .13889, .72473],
				160: [0, 0, 0, 0, .25]
			},
			"Fraktur-Regular": {
				32: [0, 0, 0, 0, .25],
				33: [0, .69141, 0, 0, .29574],
				34: [0, .69141, 0, 0, .21471],
				38: [0, .69141, 0, 0, .73786],
				39: [0, .69141, 0, 0, .21201],
				40: [.24982, .74947, 0, 0, .38865],
				41: [.24982, .74947, 0, 0, .38865],
				42: [0, .62119, 0, 0, .27764],
				43: [.08319, .58283, 0, 0, .75623],
				44: [0, .10803, 0, 0, .27764],
				45: [.08319, .58283, 0, 0, .75623],
				46: [0, .10803, 0, 0, .27764],
				47: [.24982, .74947, 0, 0, .50181],
				48: [0, .47534, 0, 0, .50181],
				49: [0, .47534, 0, 0, .50181],
				50: [0, .47534, 0, 0, .50181],
				51: [.18906, .47534, 0, 0, .50181],
				52: [.18906, .47534, 0, 0, .50181],
				53: [.18906, .47534, 0, 0, .50181],
				54: [0, .69141, 0, 0, .50181],
				55: [.18906, .47534, 0, 0, .50181],
				56: [0, .69141, 0, 0, .50181],
				57: [.18906, .47534, 0, 0, .50181],
				58: [0, .47534, 0, 0, .21606],
				59: [.12604, .47534, 0, 0, .21606],
				61: [-.13099, .36866, 0, 0, .75623],
				63: [0, .69141, 0, 0, .36245],
				65: [0, .69141, 0, 0, .7176],
				66: [0, .69141, 0, 0, .88397],
				67: [0, .69141, 0, 0, .61254],
				68: [0, .69141, 0, 0, .83158],
				69: [0, .69141, 0, 0, .66278],
				70: [.12604, .69141, 0, 0, .61119],
				71: [0, .69141, 0, 0, .78539],
				72: [.06302, .69141, 0, 0, .7203],
				73: [0, .69141, 0, 0, .55448],
				74: [.12604, .69141, 0, 0, .55231],
				75: [0, .69141, 0, 0, .66845],
				76: [0, .69141, 0, 0, .66602],
				77: [0, .69141, 0, 0, 1.04953],
				78: [0, .69141, 0, 0, .83212],
				79: [0, .69141, 0, 0, .82699],
				80: [.18906, .69141, 0, 0, .82753],
				81: [.03781, .69141, 0, 0, .82699],
				82: [0, .69141, 0, 0, .82807],
				83: [0, .69141, 0, 0, .82861],
				84: [0, .69141, 0, 0, .66899],
				85: [0, .69141, 0, 0, .64576],
				86: [0, .69141, 0, 0, .83131],
				87: [0, .69141, 0, 0, 1.04602],
				88: [0, .69141, 0, 0, .71922],
				89: [.18906, .69141, 0, 0, .83293],
				90: [.12604, .69141, 0, 0, .60201],
				91: [.24982, .74947, 0, 0, .27764],
				93: [.24982, .74947, 0, 0, .27764],
				94: [0, .69141, 0, 0, .49965],
				97: [0, .47534, 0, 0, .50046],
				98: [0, .69141, 0, 0, .51315],
				99: [0, .47534, 0, 0, .38946],
				100: [0, .62119, 0, 0, .49857],
				101: [0, .47534, 0, 0, .40053],
				102: [.18906, .69141, 0, 0, .32626],
				103: [.18906, .47534, 0, 0, .5037],
				104: [.18906, .69141, 0, 0, .52126],
				105: [0, .69141, 0, 0, .27899],
				106: [0, .69141, 0, 0, .28088],
				107: [0, .69141, 0, 0, .38946],
				108: [0, .69141, 0, 0, .27953],
				109: [0, .47534, 0, 0, .76676],
				110: [0, .47534, 0, 0, .52666],
				111: [0, .47534, 0, 0, .48885],
				112: [.18906, .52396, 0, 0, .50046],
				113: [.18906, .47534, 0, 0, .48912],
				114: [0, .47534, 0, 0, .38919],
				115: [0, .47534, 0, 0, .44266],
				116: [0, .62119, 0, 0, .33301],
				117: [0, .47534, 0, 0, .5172],
				118: [0, .52396, 0, 0, .5118],
				119: [0, .52396, 0, 0, .77351],
				120: [.18906, .47534, 0, 0, .38865],
				121: [.18906, .47534, 0, 0, .49884],
				122: [.18906, .47534, 0, 0, .39054],
				160: [0, 0, 0, 0, .25],
				8216: [0, .69141, 0, 0, .21471],
				8217: [0, .69141, 0, 0, .21471],
				58112: [0, .62119, 0, 0, .49749],
				58113: [0, .62119, 0, 0, .4983],
				58114: [.18906, .69141, 0, 0, .33328],
				58115: [.18906, .69141, 0, 0, .32923],
				58116: [.18906, .47534, 0, 0, .50343],
				58117: [0, .69141, 0, 0, .33301],
				58118: [0, .62119, 0, 0, .33409],
				58119: [0, .47534, 0, 0, .50073]
			},
			"Main-Bold": {
				32: [0, 0, 0, 0, .25],
				33: [0, .69444, 0, 0, .35],
				34: [0, .69444, 0, 0, .60278],
				35: [.19444, .69444, 0, 0, .95833],
				36: [.05556, .75, 0, 0, .575],
				37: [.05556, .75, 0, 0, .95833],
				38: [0, .69444, 0, 0, .89444],
				39: [0, .69444, 0, 0, .31944],
				40: [.25, .75, 0, 0, .44722],
				41: [.25, .75, 0, 0, .44722],
				42: [0, .75, 0, 0, .575],
				43: [.13333, .63333, 0, 0, .89444],
				44: [.19444, .15556, 0, 0, .31944],
				45: [0, .44444, 0, 0, .38333],
				46: [0, .15556, 0, 0, .31944],
				47: [.25, .75, 0, 0, .575],
				48: [0, .64444, 0, 0, .575],
				49: [0, .64444, 0, 0, .575],
				50: [0, .64444, 0, 0, .575],
				51: [0, .64444, 0, 0, .575],
				52: [0, .64444, 0, 0, .575],
				53: [0, .64444, 0, 0, .575],
				54: [0, .64444, 0, 0, .575],
				55: [0, .64444, 0, 0, .575],
				56: [0, .64444, 0, 0, .575],
				57: [0, .64444, 0, 0, .575],
				58: [0, .44444, 0, 0, .31944],
				59: [.19444, .44444, 0, 0, .31944],
				60: [.08556, .58556, 0, 0, .89444],
				61: [-.10889, .39111, 0, 0, .89444],
				62: [.08556, .58556, 0, 0, .89444],
				63: [0, .69444, 0, 0, .54305],
				64: [0, .69444, 0, 0, .89444],
				65: [0, .68611, 0, 0, .86944],
				66: [0, .68611, 0, 0, .81805],
				67: [0, .68611, 0, 0, .83055],
				68: [0, .68611, 0, 0, .88194],
				69: [0, .68611, 0, 0, .75555],
				70: [0, .68611, 0, 0, .72361],
				71: [0, .68611, 0, 0, .90416],
				72: [0, .68611, 0, 0, .9],
				73: [0, .68611, 0, 0, .43611],
				74: [0, .68611, 0, 0, .59444],
				75: [0, .68611, 0, 0, .90138],
				76: [0, .68611, 0, 0, .69166],
				77: [0, .68611, 0, 0, 1.09166],
				78: [0, .68611, 0, 0, .9],
				79: [0, .68611, 0, 0, .86388],
				80: [0, .68611, 0, 0, .78611],
				81: [.19444, .68611, 0, 0, .86388],
				82: [0, .68611, 0, 0, .8625],
				83: [0, .68611, 0, 0, .63889],
				84: [0, .68611, 0, 0, .8],
				85: [0, .68611, 0, 0, .88472],
				86: [0, .68611, .01597, 0, .86944],
				87: [0, .68611, .01597, 0, 1.18888],
				88: [0, .68611, 0, 0, .86944],
				89: [0, .68611, .02875, 0, .86944],
				90: [0, .68611, 0, 0, .70277],
				91: [.25, .75, 0, 0, .31944],
				92: [.25, .75, 0, 0, .575],
				93: [.25, .75, 0, 0, .31944],
				94: [0, .69444, 0, 0, .575],
				95: [.31, .13444, .03194, 0, .575],
				97: [0, .44444, 0, 0, .55902],
				98: [0, .69444, 0, 0, .63889],
				99: [0, .44444, 0, 0, .51111],
				100: [0, .69444, 0, 0, .63889],
				101: [0, .44444, 0, 0, .52708],
				102: [0, .69444, .10903, 0, .35139],
				103: [.19444, .44444, .01597, 0, .575],
				104: [0, .69444, 0, 0, .63889],
				105: [0, .69444, 0, 0, .31944],
				106: [.19444, .69444, 0, 0, .35139],
				107: [0, .69444, 0, 0, .60694],
				108: [0, .69444, 0, 0, .31944],
				109: [0, .44444, 0, 0, .95833],
				110: [0, .44444, 0, 0, .63889],
				111: [0, .44444, 0, 0, .575],
				112: [.19444, .44444, 0, 0, .63889],
				113: [.19444, .44444, 0, 0, .60694],
				114: [0, .44444, 0, 0, .47361],
				115: [0, .44444, 0, 0, .45361],
				116: [0, .63492, 0, 0, .44722],
				117: [0, .44444, 0, 0, .63889],
				118: [0, .44444, .01597, 0, .60694],
				119: [0, .44444, .01597, 0, .83055],
				120: [0, .44444, 0, 0, .60694],
				121: [.19444, .44444, .01597, 0, .60694],
				122: [0, .44444, 0, 0, .51111],
				123: [.25, .75, 0, 0, .575],
				124: [.25, .75, 0, 0, .31944],
				125: [.25, .75, 0, 0, .575],
				126: [.35, .34444, 0, 0, .575],
				160: [0, 0, 0, 0, .25],
				163: [0, .69444, 0, 0, .86853],
				168: [0, .69444, 0, 0, .575],
				172: [0, .44444, 0, 0, .76666],
				176: [0, .69444, 0, 0, .86944],
				177: [.13333, .63333, 0, 0, .89444],
				184: [.17014, 0, 0, 0, .51111],
				198: [0, .68611, 0, 0, 1.04166],
				215: [.13333, .63333, 0, 0, .89444],
				216: [.04861, .73472, 0, 0, .89444],
				223: [0, .69444, 0, 0, .59722],
				230: [0, .44444, 0, 0, .83055],
				247: [.13333, .63333, 0, 0, .89444],
				248: [.09722, .54167, 0, 0, .575],
				305: [0, .44444, 0, 0, .31944],
				338: [0, .68611, 0, 0, 1.16944],
				339: [0, .44444, 0, 0, .89444],
				567: [.19444, .44444, 0, 0, .35139],
				710: [0, .69444, 0, 0, .575],
				711: [0, .63194, 0, 0, .575],
				713: [0, .59611, 0, 0, .575],
				714: [0, .69444, 0, 0, .575],
				715: [0, .69444, 0, 0, .575],
				728: [0, .69444, 0, 0, .575],
				729: [0, .69444, 0, 0, .31944],
				730: [0, .69444, 0, 0, .86944],
				732: [0, .69444, 0, 0, .575],
				733: [0, .69444, 0, 0, .575],
				915: [0, .68611, 0, 0, .69166],
				916: [0, .68611, 0, 0, .95833],
				920: [0, .68611, 0, 0, .89444],
				923: [0, .68611, 0, 0, .80555],
				926: [0, .68611, 0, 0, .76666],
				928: [0, .68611, 0, 0, .9],
				931: [0, .68611, 0, 0, .83055],
				933: [0, .68611, 0, 0, .89444],
				934: [0, .68611, 0, 0, .83055],
				936: [0, .68611, 0, 0, .89444],
				937: [0, .68611, 0, 0, .83055],
				8211: [0, .44444, .03194, 0, .575],
				8212: [0, .44444, .03194, 0, 1.14999],
				8216: [0, .69444, 0, 0, .31944],
				8217: [0, .69444, 0, 0, .31944],
				8220: [0, .69444, 0, 0, .60278],
				8221: [0, .69444, 0, 0, .60278],
				8224: [.19444, .69444, 0, 0, .51111],
				8225: [.19444, .69444, 0, 0, .51111],
				8242: [0, .55556, 0, 0, .34444],
				8407: [0, .72444, .15486, 0, .575],
				8463: [0, .69444, 0, 0, .66759],
				8465: [0, .69444, 0, 0, .83055],
				8467: [0, .69444, 0, 0, .47361],
				8472: [.19444, .44444, 0, 0, .74027],
				8476: [0, .69444, 0, 0, .83055],
				8501: [0, .69444, 0, 0, .70277],
				8592: [-.10889, .39111, 0, 0, 1.14999],
				8593: [.19444, .69444, 0, 0, .575],
				8594: [-.10889, .39111, 0, 0, 1.14999],
				8595: [.19444, .69444, 0, 0, .575],
				8596: [-.10889, .39111, 0, 0, 1.14999],
				8597: [.25, .75, 0, 0, .575],
				8598: [.19444, .69444, 0, 0, 1.14999],
				8599: [.19444, .69444, 0, 0, 1.14999],
				8600: [.19444, .69444, 0, 0, 1.14999],
				8601: [.19444, .69444, 0, 0, 1.14999],
				8636: [-.10889, .39111, 0, 0, 1.14999],
				8637: [-.10889, .39111, 0, 0, 1.14999],
				8640: [-.10889, .39111, 0, 0, 1.14999],
				8641: [-.10889, .39111, 0, 0, 1.14999],
				8656: [-.10889, .39111, 0, 0, 1.14999],
				8657: [.19444, .69444, 0, 0, .70277],
				8658: [-.10889, .39111, 0, 0, 1.14999],
				8659: [.19444, .69444, 0, 0, .70277],
				8660: [-.10889, .39111, 0, 0, 1.14999],
				8661: [.25, .75, 0, 0, .70277],
				8704: [0, .69444, 0, 0, .63889],
				8706: [0, .69444, .06389, 0, .62847],
				8707: [0, .69444, 0, 0, .63889],
				8709: [.05556, .75, 0, 0, .575],
				8711: [0, .68611, 0, 0, .95833],
				8712: [.08556, .58556, 0, 0, .76666],
				8715: [.08556, .58556, 0, 0, .76666],
				8722: [.13333, .63333, 0, 0, .89444],
				8723: [.13333, .63333, 0, 0, .89444],
				8725: [.25, .75, 0, 0, .575],
				8726: [.25, .75, 0, 0, .575],
				8727: [-.02778, .47222, 0, 0, .575],
				8728: [-.02639, .47361, 0, 0, .575],
				8729: [-.02639, .47361, 0, 0, .575],
				8730: [.18, .82, 0, 0, .95833],
				8733: [0, .44444, 0, 0, .89444],
				8734: [0, .44444, 0, 0, 1.14999],
				8736: [0, .69224, 0, 0, .72222],
				8739: [.25, .75, 0, 0, .31944],
				8741: [.25, .75, 0, 0, .575],
				8743: [0, .55556, 0, 0, .76666],
				8744: [0, .55556, 0, 0, .76666],
				8745: [0, .55556, 0, 0, .76666],
				8746: [0, .55556, 0, 0, .76666],
				8747: [.19444, .69444, .12778, 0, .56875],
				8764: [-.10889, .39111, 0, 0, .89444],
				8768: [.19444, .69444, 0, 0, .31944],
				8771: [.00222, .50222, 0, 0, .89444],
				8773: [.027, .638, 0, 0, .894],
				8776: [.02444, .52444, 0, 0, .89444],
				8781: [.00222, .50222, 0, 0, .89444],
				8801: [.00222, .50222, 0, 0, .89444],
				8804: [.19667, .69667, 0, 0, .89444],
				8805: [.19667, .69667, 0, 0, .89444],
				8810: [.08556, .58556, 0, 0, 1.14999],
				8811: [.08556, .58556, 0, 0, 1.14999],
				8826: [.08556, .58556, 0, 0, .89444],
				8827: [.08556, .58556, 0, 0, .89444],
				8834: [.08556, .58556, 0, 0, .89444],
				8835: [.08556, .58556, 0, 0, .89444],
				8838: [.19667, .69667, 0, 0, .89444],
				8839: [.19667, .69667, 0, 0, .89444],
				8846: [0, .55556, 0, 0, .76666],
				8849: [.19667, .69667, 0, 0, .89444],
				8850: [.19667, .69667, 0, 0, .89444],
				8851: [0, .55556, 0, 0, .76666],
				8852: [0, .55556, 0, 0, .76666],
				8853: [.13333, .63333, 0, 0, .89444],
				8854: [.13333, .63333, 0, 0, .89444],
				8855: [.13333, .63333, 0, 0, .89444],
				8856: [.13333, .63333, 0, 0, .89444],
				8857: [.13333, .63333, 0, 0, .89444],
				8866: [0, .69444, 0, 0, .70277],
				8867: [0, .69444, 0, 0, .70277],
				8868: [0, .69444, 0, 0, .89444],
				8869: [0, .69444, 0, 0, .89444],
				8900: [-.02639, .47361, 0, 0, .575],
				8901: [-.02639, .47361, 0, 0, .31944],
				8902: [-.02778, .47222, 0, 0, .575],
				8968: [.25, .75, 0, 0, .51111],
				8969: [.25, .75, 0, 0, .51111],
				8970: [.25, .75, 0, 0, .51111],
				8971: [.25, .75, 0, 0, .51111],
				8994: [-.13889, .36111, 0, 0, 1.14999],
				8995: [-.13889, .36111, 0, 0, 1.14999],
				9651: [.19444, .69444, 0, 0, 1.02222],
				9657: [-.02778, .47222, 0, 0, .575],
				9661: [.19444, .69444, 0, 0, 1.02222],
				9667: [-.02778, .47222, 0, 0, .575],
				9711: [.19444, .69444, 0, 0, 1.14999],
				9824: [.12963, .69444, 0, 0, .89444],
				9825: [.12963, .69444, 0, 0, .89444],
				9826: [.12963, .69444, 0, 0, .89444],
				9827: [.12963, .69444, 0, 0, .89444],
				9837: [0, .75, 0, 0, .44722],
				9838: [.19444, .69444, 0, 0, .44722],
				9839: [.19444, .69444, 0, 0, .44722],
				10216: [.25, .75, 0, 0, .44722],
				10217: [.25, .75, 0, 0, .44722],
				10815: [0, .68611, 0, 0, .9],
				10927: [.19667, .69667, 0, 0, .89444],
				10928: [.19667, .69667, 0, 0, .89444],
				57376: [.19444, .69444, 0, 0, 0]
			},
			"Main-BoldItalic": {
				32: [0, 0, 0, 0, .25],
				33: [0, .69444, .11417, 0, .38611],
				34: [0, .69444, .07939, 0, .62055],
				35: [.19444, .69444, .06833, 0, .94444],
				37: [.05556, .75, .12861, 0, .94444],
				38: [0, .69444, .08528, 0, .88555],
				39: [0, .69444, .12945, 0, .35555],
				40: [.25, .75, .15806, 0, .47333],
				41: [.25, .75, .03306, 0, .47333],
				42: [0, .75, .14333, 0, .59111],
				43: [.10333, .60333, .03306, 0, .88555],
				44: [.19444, .14722, 0, 0, .35555],
				45: [0, .44444, .02611, 0, .41444],
				46: [0, .14722, 0, 0, .35555],
				47: [.25, .75, .15806, 0, .59111],
				48: [0, .64444, .13167, 0, .59111],
				49: [0, .64444, .13167, 0, .59111],
				50: [0, .64444, .13167, 0, .59111],
				51: [0, .64444, .13167, 0, .59111],
				52: [.19444, .64444, .13167, 0, .59111],
				53: [0, .64444, .13167, 0, .59111],
				54: [0, .64444, .13167, 0, .59111],
				55: [.19444, .64444, .13167, 0, .59111],
				56: [0, .64444, .13167, 0, .59111],
				57: [0, .64444, .13167, 0, .59111],
				58: [0, .44444, .06695, 0, .35555],
				59: [.19444, .44444, .06695, 0, .35555],
				61: [-.10889, .39111, .06833, 0, .88555],
				63: [0, .69444, .11472, 0, .59111],
				64: [0, .69444, .09208, 0, .88555],
				65: [0, .68611, 0, 0, .86555],
				66: [0, .68611, .0992, 0, .81666],
				67: [0, .68611, .14208, 0, .82666],
				68: [0, .68611, .09062, 0, .87555],
				69: [0, .68611, .11431, 0, .75666],
				70: [0, .68611, .12903, 0, .72722],
				71: [0, .68611, .07347, 0, .89527],
				72: [0, .68611, .17208, 0, .8961],
				73: [0, .68611, .15681, 0, .47166],
				74: [0, .68611, .145, 0, .61055],
				75: [0, .68611, .14208, 0, .89499],
				76: [0, .68611, 0, 0, .69777],
				77: [0, .68611, .17208, 0, 1.07277],
				78: [0, .68611, .17208, 0, .8961],
				79: [0, .68611, .09062, 0, .85499],
				80: [0, .68611, .0992, 0, .78721],
				81: [.19444, .68611, .09062, 0, .85499],
				82: [0, .68611, .02559, 0, .85944],
				83: [0, .68611, .11264, 0, .64999],
				84: [0, .68611, .12903, 0, .7961],
				85: [0, .68611, .17208, 0, .88083],
				86: [0, .68611, .18625, 0, .86555],
				87: [0, .68611, .18625, 0, 1.15999],
				88: [0, .68611, .15681, 0, .86555],
				89: [0, .68611, .19803, 0, .86555],
				90: [0, .68611, .14208, 0, .70888],
				91: [.25, .75, .1875, 0, .35611],
				93: [.25, .75, .09972, 0, .35611],
				94: [0, .69444, .06709, 0, .59111],
				95: [.31, .13444, .09811, 0, .59111],
				97: [0, .44444, .09426, 0, .59111],
				98: [0, .69444, .07861, 0, .53222],
				99: [0, .44444, .05222, 0, .53222],
				100: [0, .69444, .10861, 0, .59111],
				101: [0, .44444, .085, 0, .53222],
				102: [.19444, .69444, .21778, 0, .4],
				103: [.19444, .44444, .105, 0, .53222],
				104: [0, .69444, .09426, 0, .59111],
				105: [0, .69326, .11387, 0, .35555],
				106: [.19444, .69326, .1672, 0, .35555],
				107: [0, .69444, .11111, 0, .53222],
				108: [0, .69444, .10861, 0, .29666],
				109: [0, .44444, .09426, 0, .94444],
				110: [0, .44444, .09426, 0, .64999],
				111: [0, .44444, .07861, 0, .59111],
				112: [.19444, .44444, .07861, 0, .59111],
				113: [.19444, .44444, .105, 0, .53222],
				114: [0, .44444, .11111, 0, .50167],
				115: [0, .44444, .08167, 0, .48694],
				116: [0, .63492, .09639, 0, .385],
				117: [0, .44444, .09426, 0, .62055],
				118: [0, .44444, .11111, 0, .53222],
				119: [0, .44444, .11111, 0, .76777],
				120: [0, .44444, .12583, 0, .56055],
				121: [.19444, .44444, .105, 0, .56166],
				122: [0, .44444, .13889, 0, .49055],
				126: [.35, .34444, .11472, 0, .59111],
				160: [0, 0, 0, 0, .25],
				168: [0, .69444, .11473, 0, .59111],
				176: [0, .69444, 0, 0, .94888],
				184: [.17014, 0, 0, 0, .53222],
				198: [0, .68611, .11431, 0, 1.02277],
				216: [.04861, .73472, .09062, 0, .88555],
				223: [.19444, .69444, .09736, 0, .665],
				230: [0, .44444, .085, 0, .82666],
				248: [.09722, .54167, .09458, 0, .59111],
				305: [0, .44444, .09426, 0, .35555],
				338: [0, .68611, .11431, 0, 1.14054],
				339: [0, .44444, .085, 0, .82666],
				567: [.19444, .44444, .04611, 0, .385],
				710: [0, .69444, .06709, 0, .59111],
				711: [0, .63194, .08271, 0, .59111],
				713: [0, .59444, .10444, 0, .59111],
				714: [0, .69444, .08528, 0, .59111],
				715: [0, .69444, 0, 0, .59111],
				728: [0, .69444, .10333, 0, .59111],
				729: [0, .69444, .12945, 0, .35555],
				730: [0, .69444, 0, 0, .94888],
				732: [0, .69444, .11472, 0, .59111],
				733: [0, .69444, .11472, 0, .59111],
				915: [0, .68611, .12903, 0, .69777],
				916: [0, .68611, 0, 0, .94444],
				920: [0, .68611, .09062, 0, .88555],
				923: [0, .68611, 0, 0, .80666],
				926: [0, .68611, .15092, 0, .76777],
				928: [0, .68611, .17208, 0, .8961],
				931: [0, .68611, .11431, 0, .82666],
				933: [0, .68611, .10778, 0, .88555],
				934: [0, .68611, .05632, 0, .82666],
				936: [0, .68611, .10778, 0, .88555],
				937: [0, .68611, .0992, 0, .82666],
				8211: [0, .44444, .09811, 0, .59111],
				8212: [0, .44444, .09811, 0, 1.18221],
				8216: [0, .69444, .12945, 0, .35555],
				8217: [0, .69444, .12945, 0, .35555],
				8220: [0, .69444, .16772, 0, .62055],
				8221: [0, .69444, .07939, 0, .62055]
			},
			"Main-Italic": {
				32: [0, 0, 0, 0, .25],
				33: [0, .69444, .12417, 0, .30667],
				34: [0, .69444, .06961, 0, .51444],
				35: [.19444, .69444, .06616, 0, .81777],
				37: [.05556, .75, .13639, 0, .81777],
				38: [0, .69444, .09694, 0, .76666],
				39: [0, .69444, .12417, 0, .30667],
				40: [.25, .75, .16194, 0, .40889],
				41: [.25, .75, .03694, 0, .40889],
				42: [0, .75, .14917, 0, .51111],
				43: [.05667, .56167, .03694, 0, .76666],
				44: [.19444, .10556, 0, 0, .30667],
				45: [0, .43056, .02826, 0, .35778],
				46: [0, .10556, 0, 0, .30667],
				47: [.25, .75, .16194, 0, .51111],
				48: [0, .64444, .13556, 0, .51111],
				49: [0, .64444, .13556, 0, .51111],
				50: [0, .64444, .13556, 0, .51111],
				51: [0, .64444, .13556, 0, .51111],
				52: [.19444, .64444, .13556, 0, .51111],
				53: [0, .64444, .13556, 0, .51111],
				54: [0, .64444, .13556, 0, .51111],
				55: [.19444, .64444, .13556, 0, .51111],
				56: [0, .64444, .13556, 0, .51111],
				57: [0, .64444, .13556, 0, .51111],
				58: [0, .43056, .0582, 0, .30667],
				59: [.19444, .43056, .0582, 0, .30667],
				61: [-.13313, .36687, .06616, 0, .76666],
				63: [0, .69444, .1225, 0, .51111],
				64: [0, .69444, .09597, 0, .76666],
				65: [0, .68333, 0, 0, .74333],
				66: [0, .68333, .10257, 0, .70389],
				67: [0, .68333, .14528, 0, .71555],
				68: [0, .68333, .09403, 0, .755],
				69: [0, .68333, .12028, 0, .67833],
				70: [0, .68333, .13305, 0, .65277],
				71: [0, .68333, .08722, 0, .77361],
				72: [0, .68333, .16389, 0, .74333],
				73: [0, .68333, .15806, 0, .38555],
				74: [0, .68333, .14028, 0, .525],
				75: [0, .68333, .14528, 0, .76888],
				76: [0, .68333, 0, 0, .62722],
				77: [0, .68333, .16389, 0, .89666],
				78: [0, .68333, .16389, 0, .74333],
				79: [0, .68333, .09403, 0, .76666],
				80: [0, .68333, .10257, 0, .67833],
				81: [.19444, .68333, .09403, 0, .76666],
				82: [0, .68333, .03868, 0, .72944],
				83: [0, .68333, .11972, 0, .56222],
				84: [0, .68333, .13305, 0, .71555],
				85: [0, .68333, .16389, 0, .74333],
				86: [0, .68333, .18361, 0, .74333],
				87: [0, .68333, .18361, 0, .99888],
				88: [0, .68333, .15806, 0, .74333],
				89: [0, .68333, .19383, 0, .74333],
				90: [0, .68333, .14528, 0, .61333],
				91: [.25, .75, .1875, 0, .30667],
				93: [.25, .75, .10528, 0, .30667],
				94: [0, .69444, .06646, 0, .51111],
				95: [.31, .12056, .09208, 0, .51111],
				97: [0, .43056, .07671, 0, .51111],
				98: [0, .69444, .06312, 0, .46],
				99: [0, .43056, .05653, 0, .46],
				100: [0, .69444, .10333, 0, .51111],
				101: [0, .43056, .07514, 0, .46],
				102: [.19444, .69444, .21194, 0, .30667],
				103: [.19444, .43056, .08847, 0, .46],
				104: [0, .69444, .07671, 0, .51111],
				105: [0, .65536, .1019, 0, .30667],
				106: [.19444, .65536, .14467, 0, .30667],
				107: [0, .69444, .10764, 0, .46],
				108: [0, .69444, .10333, 0, .25555],
				109: [0, .43056, .07671, 0, .81777],
				110: [0, .43056, .07671, 0, .56222],
				111: [0, .43056, .06312, 0, .51111],
				112: [.19444, .43056, .06312, 0, .51111],
				113: [.19444, .43056, .08847, 0, .46],
				114: [0, .43056, .10764, 0, .42166],
				115: [0, .43056, .08208, 0, .40889],
				116: [0, .61508, .09486, 0, .33222],
				117: [0, .43056, .07671, 0, .53666],
				118: [0, .43056, .10764, 0, .46],
				119: [0, .43056, .10764, 0, .66444],
				120: [0, .43056, .12042, 0, .46389],
				121: [.19444, .43056, .08847, 0, .48555],
				122: [0, .43056, .12292, 0, .40889],
				126: [.35, .31786, .11585, 0, .51111],
				160: [0, 0, 0, 0, .25],
				168: [0, .66786, .10474, 0, .51111],
				176: [0, .69444, 0, 0, .83129],
				184: [.17014, 0, 0, 0, .46],
				198: [0, .68333, .12028, 0, .88277],
				216: [.04861, .73194, .09403, 0, .76666],
				223: [.19444, .69444, .10514, 0, .53666],
				230: [0, .43056, .07514, 0, .71555],
				248: [.09722, .52778, .09194, 0, .51111],
				338: [0, .68333, .12028, 0, .98499],
				339: [0, .43056, .07514, 0, .71555],
				710: [0, .69444, .06646, 0, .51111],
				711: [0, .62847, .08295, 0, .51111],
				713: [0, .56167, .10333, 0, .51111],
				714: [0, .69444, .09694, 0, .51111],
				715: [0, .69444, 0, 0, .51111],
				728: [0, .69444, .10806, 0, .51111],
				729: [0, .66786, .11752, 0, .30667],
				730: [0, .69444, 0, 0, .83129],
				732: [0, .66786, .11585, 0, .51111],
				733: [0, .69444, .1225, 0, .51111],
				915: [0, .68333, .13305, 0, .62722],
				916: [0, .68333, 0, 0, .81777],
				920: [0, .68333, .09403, 0, .76666],
				923: [0, .68333, 0, 0, .69222],
				926: [0, .68333, .15294, 0, .66444],
				928: [0, .68333, .16389, 0, .74333],
				931: [0, .68333, .12028, 0, .71555],
				933: [0, .68333, .11111, 0, .76666],
				934: [0, .68333, .05986, 0, .71555],
				936: [0, .68333, .11111, 0, .76666],
				937: [0, .68333, .10257, 0, .71555],
				8211: [0, .43056, .09208, 0, .51111],
				8212: [0, .43056, .09208, 0, 1.02222],
				8216: [0, .69444, .12417, 0, .30667],
				8217: [0, .69444, .12417, 0, .30667],
				8220: [0, .69444, .1685, 0, .51444],
				8221: [0, .69444, .06961, 0, .51444],
				8463: [0, .68889, 0, 0, .54028]
			},
			"Main-Regular": {
				32: [0, 0, 0, 0, .25],
				33: [0, .69444, 0, 0, .27778],
				34: [0, .69444, 0, 0, .5],
				35: [.19444, .69444, 0, 0, .83334],
				36: [.05556, .75, 0, 0, .5],
				37: [.05556, .75, 0, 0, .83334],
				38: [0, .69444, 0, 0, .77778],
				39: [0, .69444, 0, 0, .27778],
				40: [.25, .75, 0, 0, .38889],
				41: [.25, .75, 0, 0, .38889],
				42: [0, .75, 0, 0, .5],
				43: [.08333, .58333, 0, 0, .77778],
				44: [.19444, .10556, 0, 0, .27778],
				45: [0, .43056, 0, 0, .33333],
				46: [0, .10556, 0, 0, .27778],
				47: [.25, .75, 0, 0, .5],
				48: [0, .64444, 0, 0, .5],
				49: [0, .64444, 0, 0, .5],
				50: [0, .64444, 0, 0, .5],
				51: [0, .64444, 0, 0, .5],
				52: [0, .64444, 0, 0, .5],
				53: [0, .64444, 0, 0, .5],
				54: [0, .64444, 0, 0, .5],
				55: [0, .64444, 0, 0, .5],
				56: [0, .64444, 0, 0, .5],
				57: [0, .64444, 0, 0, .5],
				58: [0, .43056, 0, 0, .27778],
				59: [.19444, .43056, 0, 0, .27778],
				60: [.0391, .5391, 0, 0, .77778],
				61: [-.13313, .36687, 0, 0, .77778],
				62: [.0391, .5391, 0, 0, .77778],
				63: [0, .69444, 0, 0, .47222],
				64: [0, .69444, 0, 0, .77778],
				65: [0, .68333, 0, 0, .75],
				66: [0, .68333, 0, 0, .70834],
				67: [0, .68333, 0, 0, .72222],
				68: [0, .68333, 0, 0, .76389],
				69: [0, .68333, 0, 0, .68056],
				70: [0, .68333, 0, 0, .65278],
				71: [0, .68333, 0, 0, .78472],
				72: [0, .68333, 0, 0, .75],
				73: [0, .68333, 0, 0, .36111],
				74: [0, .68333, 0, 0, .51389],
				75: [0, .68333, 0, 0, .77778],
				76: [0, .68333, 0, 0, .625],
				77: [0, .68333, 0, 0, .91667],
				78: [0, .68333, 0, 0, .75],
				79: [0, .68333, 0, 0, .77778],
				80: [0, .68333, 0, 0, .68056],
				81: [.19444, .68333, 0, 0, .77778],
				82: [0, .68333, 0, 0, .73611],
				83: [0, .68333, 0, 0, .55556],
				84: [0, .68333, 0, 0, .72222],
				85: [0, .68333, 0, 0, .75],
				86: [0, .68333, .01389, 0, .75],
				87: [0, .68333, .01389, 0, 1.02778],
				88: [0, .68333, 0, 0, .75],
				89: [0, .68333, .025, 0, .75],
				90: [0, .68333, 0, 0, .61111],
				91: [.25, .75, 0, 0, .27778],
				92: [.25, .75, 0, 0, .5],
				93: [.25, .75, 0, 0, .27778],
				94: [0, .69444, 0, 0, .5],
				95: [.31, .12056, .02778, 0, .5],
				97: [0, .43056, 0, 0, .5],
				98: [0, .69444, 0, 0, .55556],
				99: [0, .43056, 0, 0, .44445],
				100: [0, .69444, 0, 0, .55556],
				101: [0, .43056, 0, 0, .44445],
				102: [0, .69444, .07778, 0, .30556],
				103: [.19444, .43056, .01389, 0, .5],
				104: [0, .69444, 0, 0, .55556],
				105: [0, .66786, 0, 0, .27778],
				106: [.19444, .66786, 0, 0, .30556],
				107: [0, .69444, 0, 0, .52778],
				108: [0, .69444, 0, 0, .27778],
				109: [0, .43056, 0, 0, .83334],
				110: [0, .43056, 0, 0, .55556],
				111: [0, .43056, 0, 0, .5],
				112: [.19444, .43056, 0, 0, .55556],
				113: [.19444, .43056, 0, 0, .52778],
				114: [0, .43056, 0, 0, .39167],
				115: [0, .43056, 0, 0, .39445],
				116: [0, .61508, 0, 0, .38889],
				117: [0, .43056, 0, 0, .55556],
				118: [0, .43056, .01389, 0, .52778],
				119: [0, .43056, .01389, 0, .72222],
				120: [0, .43056, 0, 0, .52778],
				121: [.19444, .43056, .01389, 0, .52778],
				122: [0, .43056, 0, 0, .44445],
				123: [.25, .75, 0, 0, .5],
				124: [.25, .75, 0, 0, .27778],
				125: [.25, .75, 0, 0, .5],
				126: [.35, .31786, 0, 0, .5],
				160: [0, 0, 0, 0, .25],
				163: [0, .69444, 0, 0, .76909],
				167: [.19444, .69444, 0, 0, .44445],
				168: [0, .66786, 0, 0, .5],
				172: [0, .43056, 0, 0, .66667],
				176: [0, .69444, 0, 0, .75],
				177: [.08333, .58333, 0, 0, .77778],
				182: [.19444, .69444, 0, 0, .61111],
				184: [.17014, 0, 0, 0, .44445],
				198: [0, .68333, 0, 0, .90278],
				215: [.08333, .58333, 0, 0, .77778],
				216: [.04861, .73194, 0, 0, .77778],
				223: [0, .69444, 0, 0, .5],
				230: [0, .43056, 0, 0, .72222],
				247: [.08333, .58333, 0, 0, .77778],
				248: [.09722, .52778, 0, 0, .5],
				305: [0, .43056, 0, 0, .27778],
				338: [0, .68333, 0, 0, 1.01389],
				339: [0, .43056, 0, 0, .77778],
				567: [.19444, .43056, 0, 0, .30556],
				710: [0, .69444, 0, 0, .5],
				711: [0, .62847, 0, 0, .5],
				713: [0, .56778, 0, 0, .5],
				714: [0, .69444, 0, 0, .5],
				715: [0, .69444, 0, 0, .5],
				728: [0, .69444, 0, 0, .5],
				729: [0, .66786, 0, 0, .27778],
				730: [0, .69444, 0, 0, .75],
				732: [0, .66786, 0, 0, .5],
				733: [0, .69444, 0, 0, .5],
				915: [0, .68333, 0, 0, .625],
				916: [0, .68333, 0, 0, .83334],
				920: [0, .68333, 0, 0, .77778],
				923: [0, .68333, 0, 0, .69445],
				926: [0, .68333, 0, 0, .66667],
				928: [0, .68333, 0, 0, .75],
				931: [0, .68333, 0, 0, .72222],
				933: [0, .68333, 0, 0, .77778],
				934: [0, .68333, 0, 0, .72222],
				936: [0, .68333, 0, 0, .77778],
				937: [0, .68333, 0, 0, .72222],
				8211: [0, .43056, .02778, 0, .5],
				8212: [0, .43056, .02778, 0, 1],
				8216: [0, .69444, 0, 0, .27778],
				8217: [0, .69444, 0, 0, .27778],
				8220: [0, .69444, 0, 0, .5],
				8221: [0, .69444, 0, 0, .5],
				8224: [.19444, .69444, 0, 0, .44445],
				8225: [.19444, .69444, 0, 0, .44445],
				8230: [0, .123, 0, 0, 1.172],
				8242: [0, .55556, 0, 0, .275],
				8407: [0, .71444, .15382, 0, .5],
				8463: [0, .68889, 0, 0, .54028],
				8465: [0, .69444, 0, 0, .72222],
				8467: [0, .69444, 0, .11111, .41667],
				8472: [.19444, .43056, 0, .11111, .63646],
				8476: [0, .69444, 0, 0, .72222],
				8501: [0, .69444, 0, 0, .61111],
				8592: [-.13313, .36687, 0, 0, 1],
				8593: [.19444, .69444, 0, 0, .5],
				8594: [-.13313, .36687, 0, 0, 1],
				8595: [.19444, .69444, 0, 0, .5],
				8596: [-.13313, .36687, 0, 0, 1],
				8597: [.25, .75, 0, 0, .5],
				8598: [.19444, .69444, 0, 0, 1],
				8599: [.19444, .69444, 0, 0, 1],
				8600: [.19444, .69444, 0, 0, 1],
				8601: [.19444, .69444, 0, 0, 1],
				8614: [.011, .511, 0, 0, 1],
				8617: [.011, .511, 0, 0, 1.126],
				8618: [.011, .511, 0, 0, 1.126],
				8636: [-.13313, .36687, 0, 0, 1],
				8637: [-.13313, .36687, 0, 0, 1],
				8640: [-.13313, .36687, 0, 0, 1],
				8641: [-.13313, .36687, 0, 0, 1],
				8652: [.011, .671, 0, 0, 1],
				8656: [-.13313, .36687, 0, 0, 1],
				8657: [.19444, .69444, 0, 0, .61111],
				8658: [-.13313, .36687, 0, 0, 1],
				8659: [.19444, .69444, 0, 0, .61111],
				8660: [-.13313, .36687, 0, 0, 1],
				8661: [.25, .75, 0, 0, .61111],
				8704: [0, .69444, 0, 0, .55556],
				8706: [0, .69444, .05556, .08334, .5309],
				8707: [0, .69444, 0, 0, .55556],
				8709: [.05556, .75, 0, 0, .5],
				8711: [0, .68333, 0, 0, .83334],
				8712: [.0391, .5391, 0, 0, .66667],
				8715: [.0391, .5391, 0, 0, .66667],
				8722: [.08333, .58333, 0, 0, .77778],
				8723: [.08333, .58333, 0, 0, .77778],
				8725: [.25, .75, 0, 0, .5],
				8726: [.25, .75, 0, 0, .5],
				8727: [-.03472, .46528, 0, 0, .5],
				8728: [-.05555, .44445, 0, 0, .5],
				8729: [-.05555, .44445, 0, 0, .5],
				8730: [.2, .8, 0, 0, .83334],
				8733: [0, .43056, 0, 0, .77778],
				8734: [0, .43056, 0, 0, 1],
				8736: [0, .69224, 0, 0, .72222],
				8739: [.25, .75, 0, 0, .27778],
				8741: [.25, .75, 0, 0, .5],
				8743: [0, .55556, 0, 0, .66667],
				8744: [0, .55556, 0, 0, .66667],
				8745: [0, .55556, 0, 0, .66667],
				8746: [0, .55556, 0, 0, .66667],
				8747: [.19444, .69444, .11111, 0, .41667],
				8764: [-.13313, .36687, 0, 0, .77778],
				8768: [.19444, .69444, 0, 0, .27778],
				8771: [-.03625, .46375, 0, 0, .77778],
				8773: [-.022, .589, 0, 0, .778],
				8776: [-.01688, .48312, 0, 0, .77778],
				8781: [-.03625, .46375, 0, 0, .77778],
				8784: [-.133, .673, 0, 0, .778],
				8801: [-.03625, .46375, 0, 0, .77778],
				8804: [.13597, .63597, 0, 0, .77778],
				8805: [.13597, .63597, 0, 0, .77778],
				8810: [.0391, .5391, 0, 0, 1],
				8811: [.0391, .5391, 0, 0, 1],
				8826: [.0391, .5391, 0, 0, .77778],
				8827: [.0391, .5391, 0, 0, .77778],
				8834: [.0391, .5391, 0, 0, .77778],
				8835: [.0391, .5391, 0, 0, .77778],
				8838: [.13597, .63597, 0, 0, .77778],
				8839: [.13597, .63597, 0, 0, .77778],
				8846: [0, .55556, 0, 0, .66667],
				8849: [.13597, .63597, 0, 0, .77778],
				8850: [.13597, .63597, 0, 0, .77778],
				8851: [0, .55556, 0, 0, .66667],
				8852: [0, .55556, 0, 0, .66667],
				8853: [.08333, .58333, 0, 0, .77778],
				8854: [.08333, .58333, 0, 0, .77778],
				8855: [.08333, .58333, 0, 0, .77778],
				8856: [.08333, .58333, 0, 0, .77778],
				8857: [.08333, .58333, 0, 0, .77778],
				8866: [0, .69444, 0, 0, .61111],
				8867: [0, .69444, 0, 0, .61111],
				8868: [0, .69444, 0, 0, .77778],
				8869: [0, .69444, 0, 0, .77778],
				8872: [.249, .75, 0, 0, .867],
				8900: [-.05555, .44445, 0, 0, .5],
				8901: [-.05555, .44445, 0, 0, .27778],
				8902: [-.03472, .46528, 0, 0, .5],
				8904: [.005, .505, 0, 0, .9],
				8942: [.03, .903, 0, 0, .278],
				8943: [-.19, .313, 0, 0, 1.172],
				8945: [-.1, .823, 0, 0, 1.282],
				8968: [.25, .75, 0, 0, .44445],
				8969: [.25, .75, 0, 0, .44445],
				8970: [.25, .75, 0, 0, .44445],
				8971: [.25, .75, 0, 0, .44445],
				8994: [-.14236, .35764, 0, 0, 1],
				8995: [-.14236, .35764, 0, 0, 1],
				9136: [.244, .744, 0, 0, .412],
				9137: [.244, .745, 0, 0, .412],
				9651: [.19444, .69444, 0, 0, .88889],
				9657: [-.03472, .46528, 0, 0, .5],
				9661: [.19444, .69444, 0, 0, .88889],
				9667: [-.03472, .46528, 0, 0, .5],
				9711: [.19444, .69444, 0, 0, 1],
				9824: [.12963, .69444, 0, 0, .77778],
				9825: [.12963, .69444, 0, 0, .77778],
				9826: [.12963, .69444, 0, 0, .77778],
				9827: [.12963, .69444, 0, 0, .77778],
				9837: [0, .75, 0, 0, .38889],
				9838: [.19444, .69444, 0, 0, .38889],
				9839: [.19444, .69444, 0, 0, .38889],
				10216: [.25, .75, 0, 0, .38889],
				10217: [.25, .75, 0, 0, .38889],
				10222: [.244, .744, 0, 0, .412],
				10223: [.244, .745, 0, 0, .412],
				10229: [.011, .511, 0, 0, 1.609],
				10230: [.011, .511, 0, 0, 1.638],
				10231: [.011, .511, 0, 0, 1.859],
				10232: [.024, .525, 0, 0, 1.609],
				10233: [.024, .525, 0, 0, 1.638],
				10234: [.024, .525, 0, 0, 1.858],
				10236: [.011, .511, 0, 0, 1.638],
				10815: [0, .68333, 0, 0, .75],
				10927: [.13597, .63597, 0, 0, .77778],
				10928: [.13597, .63597, 0, 0, .77778],
				57376: [.19444, .69444, 0, 0, 0]
			},
			"Math-BoldItalic": {
				32: [0, 0, 0, 0, .25],
				48: [0, .44444, 0, 0, .575],
				49: [0, .44444, 0, 0, .575],
				50: [0, .44444, 0, 0, .575],
				51: [.19444, .44444, 0, 0, .575],
				52: [.19444, .44444, 0, 0, .575],
				53: [.19444, .44444, 0, 0, .575],
				54: [0, .64444, 0, 0, .575],
				55: [.19444, .44444, 0, 0, .575],
				56: [0, .64444, 0, 0, .575],
				57: [.19444, .44444, 0, 0, .575],
				65: [0, .68611, 0, 0, .86944],
				66: [0, .68611, .04835, 0, .8664],
				67: [0, .68611, .06979, 0, .81694],
				68: [0, .68611, .03194, 0, .93812],
				69: [0, .68611, .05451, 0, .81007],
				70: [0, .68611, .15972, 0, .68889],
				71: [0, .68611, 0, 0, .88673],
				72: [0, .68611, .08229, 0, .98229],
				73: [0, .68611, .07778, 0, .51111],
				74: [0, .68611, .10069, 0, .63125],
				75: [0, .68611, .06979, 0, .97118],
				76: [0, .68611, 0, 0, .75555],
				77: [0, .68611, .11424, 0, 1.14201],
				78: [0, .68611, .11424, 0, .95034],
				79: [0, .68611, .03194, 0, .83666],
				80: [0, .68611, .15972, 0, .72309],
				81: [.19444, .68611, 0, 0, .86861],
				82: [0, .68611, .00421, 0, .87235],
				83: [0, .68611, .05382, 0, .69271],
				84: [0, .68611, .15972, 0, .63663],
				85: [0, .68611, .11424, 0, .80027],
				86: [0, .68611, .25555, 0, .67778],
				87: [0, .68611, .15972, 0, 1.09305],
				88: [0, .68611, .07778, 0, .94722],
				89: [0, .68611, .25555, 0, .67458],
				90: [0, .68611, .06979, 0, .77257],
				97: [0, .44444, 0, 0, .63287],
				98: [0, .69444, 0, 0, .52083],
				99: [0, .44444, 0, 0, .51342],
				100: [0, .69444, 0, 0, .60972],
				101: [0, .44444, 0, 0, .55361],
				102: [.19444, .69444, .11042, 0, .56806],
				103: [.19444, .44444, .03704, 0, .5449],
				104: [0, .69444, 0, 0, .66759],
				105: [0, .69326, 0, 0, .4048],
				106: [.19444, .69326, .0622, 0, .47083],
				107: [0, .69444, .01852, 0, .6037],
				108: [0, .69444, .0088, 0, .34815],
				109: [0, .44444, 0, 0, 1.0324],
				110: [0, .44444, 0, 0, .71296],
				111: [0, .44444, 0, 0, .58472],
				112: [.19444, .44444, 0, 0, .60092],
				113: [.19444, .44444, .03704, 0, .54213],
				114: [0, .44444, .03194, 0, .5287],
				115: [0, .44444, 0, 0, .53125],
				116: [0, .63492, 0, 0, .41528],
				117: [0, .44444, 0, 0, .68102],
				118: [0, .44444, .03704, 0, .56666],
				119: [0, .44444, .02778, 0, .83148],
				120: [0, .44444, 0, 0, .65903],
				121: [.19444, .44444, .03704, 0, .59028],
				122: [0, .44444, .04213, 0, .55509],
				160: [0, 0, 0, 0, .25],
				915: [0, .68611, .15972, 0, .65694],
				916: [0, .68611, 0, 0, .95833],
				920: [0, .68611, .03194, 0, .86722],
				923: [0, .68611, 0, 0, .80555],
				926: [0, .68611, .07458, 0, .84125],
				928: [0, .68611, .08229, 0, .98229],
				931: [0, .68611, .05451, 0, .88507],
				933: [0, .68611, .15972, 0, .67083],
				934: [0, .68611, 0, 0, .76666],
				936: [0, .68611, .11653, 0, .71402],
				937: [0, .68611, .04835, 0, .8789],
				945: [0, .44444, 0, 0, .76064],
				946: [.19444, .69444, .03403, 0, .65972],
				947: [.19444, .44444, .06389, 0, .59003],
				948: [0, .69444, .03819, 0, .52222],
				949: [0, .44444, 0, 0, .52882],
				950: [.19444, .69444, .06215, 0, .50833],
				951: [.19444, .44444, .03704, 0, .6],
				952: [0, .69444, .03194, 0, .5618],
				953: [0, .44444, 0, 0, .41204],
				954: [0, .44444, 0, 0, .66759],
				955: [0, .69444, 0, 0, .67083],
				956: [.19444, .44444, 0, 0, .70787],
				957: [0, .44444, .06898, 0, .57685],
				958: [.19444, .69444, .03021, 0, .50833],
				959: [0, .44444, 0, 0, .58472],
				960: [0, .44444, .03704, 0, .68241],
				961: [.19444, .44444, 0, 0, .6118],
				962: [.09722, .44444, .07917, 0, .42361],
				963: [0, .44444, .03704, 0, .68588],
				964: [0, .44444, .13472, 0, .52083],
				965: [0, .44444, .03704, 0, .63055],
				966: [.19444, .44444, 0, 0, .74722],
				967: [.19444, .44444, 0, 0, .71805],
				968: [.19444, .69444, .03704, 0, .75833],
				969: [0, .44444, .03704, 0, .71782],
				977: [0, .69444, 0, 0, .69155],
				981: [.19444, .69444, 0, 0, .7125],
				982: [0, .44444, .03194, 0, .975],
				1009: [.19444, .44444, 0, 0, .6118],
				1013: [0, .44444, 0, 0, .48333],
				57649: [0, .44444, 0, 0, .39352],
				57911: [.19444, .44444, 0, 0, .43889]
			},
			"Math-Italic": {
				32: [0, 0, 0, 0, .25],
				48: [0, .43056, 0, 0, .5],
				49: [0, .43056, 0, 0, .5],
				50: [0, .43056, 0, 0, .5],
				51: [.19444, .43056, 0, 0, .5],
				52: [.19444, .43056, 0, 0, .5],
				53: [.19444, .43056, 0, 0, .5],
				54: [0, .64444, 0, 0, .5],
				55: [.19444, .43056, 0, 0, .5],
				56: [0, .64444, 0, 0, .5],
				57: [.19444, .43056, 0, 0, .5],
				65: [0, .68333, 0, .13889, .75],
				66: [0, .68333, .05017, .08334, .75851],
				67: [0, .68333, .07153, .08334, .71472],
				68: [0, .68333, .02778, .05556, .82792],
				69: [0, .68333, .05764, .08334, .7382],
				70: [0, .68333, .13889, .08334, .64306],
				71: [0, .68333, 0, .08334, .78625],
				72: [0, .68333, .08125, .05556, .83125],
				73: [0, .68333, .07847, .11111, .43958],
				74: [0, .68333, .09618, .16667, .55451],
				75: [0, .68333, .07153, .05556, .84931],
				76: [0, .68333, 0, .02778, .68056],
				77: [0, .68333, .10903, .08334, .97014],
				78: [0, .68333, .10903, .08334, .80347],
				79: [0, .68333, .02778, .08334, .76278],
				80: [0, .68333, .13889, .08334, .64201],
				81: [.19444, .68333, 0, .08334, .79056],
				82: [0, .68333, .00773, .08334, .75929],
				83: [0, .68333, .05764, .08334, .6132],
				84: [0, .68333, .13889, .08334, .58438],
				85: [0, .68333, .10903, .02778, .68278],
				86: [0, .68333, .22222, 0, .58333],
				87: [0, .68333, .13889, 0, .94445],
				88: [0, .68333, .07847, .08334, .82847],
				89: [0, .68333, .22222, 0, .58056],
				90: [0, .68333, .07153, .08334, .68264],
				97: [0, .43056, 0, 0, .52859],
				98: [0, .69444, 0, 0, .42917],
				99: [0, .43056, 0, .05556, .43276],
				100: [0, .69444, 0, .16667, .52049],
				101: [0, .43056, 0, .05556, .46563],
				102: [.19444, .69444, .10764, .16667, .48959],
				103: [.19444, .43056, .03588, .02778, .47697],
				104: [0, .69444, 0, 0, .57616],
				105: [0, .65952, 0, 0, .34451],
				106: [.19444, .65952, .05724, 0, .41181],
				107: [0, .69444, .03148, 0, .5206],
				108: [0, .69444, .01968, .08334, .29838],
				109: [0, .43056, 0, 0, .87801],
				110: [0, .43056, 0, 0, .60023],
				111: [0, .43056, 0, .05556, .48472],
				112: [.19444, .43056, 0, .08334, .50313],
				113: [.19444, .43056, .03588, .08334, .44641],
				114: [0, .43056, .02778, .05556, .45116],
				115: [0, .43056, 0, .05556, .46875],
				116: [0, .61508, 0, .08334, .36111],
				117: [0, .43056, 0, .02778, .57246],
				118: [0, .43056, .03588, .02778, .48472],
				119: [0, .43056, .02691, .08334, .71592],
				120: [0, .43056, 0, .02778, .57153],
				121: [.19444, .43056, .03588, .05556, .49028],
				122: [0, .43056, .04398, .05556, .46505],
				160: [0, 0, 0, 0, .25],
				915: [0, .68333, .13889, .08334, .61528],
				916: [0, .68333, 0, .16667, .83334],
				920: [0, .68333, .02778, .08334, .76278],
				923: [0, .68333, 0, .16667, .69445],
				926: [0, .68333, .07569, .08334, .74236],
				928: [0, .68333, .08125, .05556, .83125],
				931: [0, .68333, .05764, .08334, .77986],
				933: [0, .68333, .13889, .05556, .58333],
				934: [0, .68333, 0, .08334, .66667],
				936: [0, .68333, .11, .05556, .61222],
				937: [0, .68333, .05017, .08334, .7724],
				945: [0, .43056, .0037, .02778, .6397],
				946: [.19444, .69444, .05278, .08334, .56563],
				947: [.19444, .43056, .05556, 0, .51773],
				948: [0, .69444, .03785, .05556, .44444],
				949: [0, .43056, 0, .08334, .46632],
				950: [.19444, .69444, .07378, .08334, .4375],
				951: [.19444, .43056, .03588, .05556, .49653],
				952: [0, .69444, .02778, .08334, .46944],
				953: [0, .43056, 0, .05556, .35394],
				954: [0, .43056, 0, 0, .57616],
				955: [0, .69444, 0, 0, .58334],
				956: [.19444, .43056, 0, .02778, .60255],
				957: [0, .43056, .06366, .02778, .49398],
				958: [.19444, .69444, .04601, .11111, .4375],
				959: [0, .43056, 0, .05556, .48472],
				960: [0, .43056, .03588, 0, .57003],
				961: [.19444, .43056, 0, .08334, .51702],
				962: [.09722, .43056, .07986, .08334, .36285],
				963: [0, .43056, .03588, 0, .57141],
				964: [0, .43056, .1132, .02778, .43715],
				965: [0, .43056, .03588, .02778, .54028],
				966: [.19444, .43056, 0, .08334, .65417],
				967: [.19444, .43056, 0, .05556, .62569],
				968: [.19444, .69444, .03588, .11111, .65139],
				969: [0, .43056, .03588, 0, .62245],
				977: [0, .69444, 0, .08334, .59144],
				981: [.19444, .69444, 0, .08334, .59583],
				982: [0, .43056, .02778, 0, .82813],
				1009: [.19444, .43056, 0, .08334, .51702],
				1013: [0, .43056, 0, .05556, .4059],
				57649: [0, .43056, 0, .02778, .32246],
				57911: [.19444, .43056, 0, .08334, .38403]
			},
			"SansSerif-Bold": {
				32: [0, 0, 0, 0, .25],
				33: [0, .69444, 0, 0, .36667],
				34: [0, .69444, 0, 0, .55834],
				35: [.19444, .69444, 0, 0, .91667],
				36: [.05556, .75, 0, 0, .55],
				37: [.05556, .75, 0, 0, 1.02912],
				38: [0, .69444, 0, 0, .83056],
				39: [0, .69444, 0, 0, .30556],
				40: [.25, .75, 0, 0, .42778],
				41: [.25, .75, 0, 0, .42778],
				42: [0, .75, 0, 0, .55],
				43: [.11667, .61667, 0, 0, .85556],
				44: [.10556, .13056, 0, 0, .30556],
				45: [0, .45833, 0, 0, .36667],
				46: [0, .13056, 0, 0, .30556],
				47: [.25, .75, 0, 0, .55],
				48: [0, .69444, 0, 0, .55],
				49: [0, .69444, 0, 0, .55],
				50: [0, .69444, 0, 0, .55],
				51: [0, .69444, 0, 0, .55],
				52: [0, .69444, 0, 0, .55],
				53: [0, .69444, 0, 0, .55],
				54: [0, .69444, 0, 0, .55],
				55: [0, .69444, 0, 0, .55],
				56: [0, .69444, 0, 0, .55],
				57: [0, .69444, 0, 0, .55],
				58: [0, .45833, 0, 0, .30556],
				59: [.10556, .45833, 0, 0, .30556],
				61: [-.09375, .40625, 0, 0, .85556],
				63: [0, .69444, 0, 0, .51945],
				64: [0, .69444, 0, 0, .73334],
				65: [0, .69444, 0, 0, .73334],
				66: [0, .69444, 0, 0, .73334],
				67: [0, .69444, 0, 0, .70278],
				68: [0, .69444, 0, 0, .79445],
				69: [0, .69444, 0, 0, .64167],
				70: [0, .69444, 0, 0, .61111],
				71: [0, .69444, 0, 0, .73334],
				72: [0, .69444, 0, 0, .79445],
				73: [0, .69444, 0, 0, .33056],
				74: [0, .69444, 0, 0, .51945],
				75: [0, .69444, 0, 0, .76389],
				76: [0, .69444, 0, 0, .58056],
				77: [0, .69444, 0, 0, .97778],
				78: [0, .69444, 0, 0, .79445],
				79: [0, .69444, 0, 0, .79445],
				80: [0, .69444, 0, 0, .70278],
				81: [.10556, .69444, 0, 0, .79445],
				82: [0, .69444, 0, 0, .70278],
				83: [0, .69444, 0, 0, .61111],
				84: [0, .69444, 0, 0, .73334],
				85: [0, .69444, 0, 0, .76389],
				86: [0, .69444, .01528, 0, .73334],
				87: [0, .69444, .01528, 0, 1.03889],
				88: [0, .69444, 0, 0, .73334],
				89: [0, .69444, .0275, 0, .73334],
				90: [0, .69444, 0, 0, .67223],
				91: [.25, .75, 0, 0, .34306],
				93: [.25, .75, 0, 0, .34306],
				94: [0, .69444, 0, 0, .55],
				95: [.35, .10833, .03056, 0, .55],
				97: [0, .45833, 0, 0, .525],
				98: [0, .69444, 0, 0, .56111],
				99: [0, .45833, 0, 0, .48889],
				100: [0, .69444, 0, 0, .56111],
				101: [0, .45833, 0, 0, .51111],
				102: [0, .69444, .07639, 0, .33611],
				103: [.19444, .45833, .01528, 0, .55],
				104: [0, .69444, 0, 0, .56111],
				105: [0, .69444, 0, 0, .25556],
				106: [.19444, .69444, 0, 0, .28611],
				107: [0, .69444, 0, 0, .53056],
				108: [0, .69444, 0, 0, .25556],
				109: [0, .45833, 0, 0, .86667],
				110: [0, .45833, 0, 0, .56111],
				111: [0, .45833, 0, 0, .55],
				112: [.19444, .45833, 0, 0, .56111],
				113: [.19444, .45833, 0, 0, .56111],
				114: [0, .45833, .01528, 0, .37222],
				115: [0, .45833, 0, 0, .42167],
				116: [0, .58929, 0, 0, .40417],
				117: [0, .45833, 0, 0, .56111],
				118: [0, .45833, .01528, 0, .5],
				119: [0, .45833, .01528, 0, .74445],
				120: [0, .45833, 0, 0, .5],
				121: [.19444, .45833, .01528, 0, .5],
				122: [0, .45833, 0, 0, .47639],
				126: [.35, .34444, 0, 0, .55],
				160: [0, 0, 0, 0, .25],
				168: [0, .69444, 0, 0, .55],
				176: [0, .69444, 0, 0, .73334],
				180: [0, .69444, 0, 0, .55],
				184: [.17014, 0, 0, 0, .48889],
				305: [0, .45833, 0, 0, .25556],
				567: [.19444, .45833, 0, 0, .28611],
				710: [0, .69444, 0, 0, .55],
				711: [0, .63542, 0, 0, .55],
				713: [0, .63778, 0, 0, .55],
				728: [0, .69444, 0, 0, .55],
				729: [0, .69444, 0, 0, .30556],
				730: [0, .69444, 0, 0, .73334],
				732: [0, .69444, 0, 0, .55],
				733: [0, .69444, 0, 0, .55],
				915: [0, .69444, 0, 0, .58056],
				916: [0, .69444, 0, 0, .91667],
				920: [0, .69444, 0, 0, .85556],
				923: [0, .69444, 0, 0, .67223],
				926: [0, .69444, 0, 0, .73334],
				928: [0, .69444, 0, 0, .79445],
				931: [0, .69444, 0, 0, .79445],
				933: [0, .69444, 0, 0, .85556],
				934: [0, .69444, 0, 0, .79445],
				936: [0, .69444, 0, 0, .85556],
				937: [0, .69444, 0, 0, .79445],
				8211: [0, .45833, .03056, 0, .55],
				8212: [0, .45833, .03056, 0, 1.10001],
				8216: [0, .69444, 0, 0, .30556],
				8217: [0, .69444, 0, 0, .30556],
				8220: [0, .69444, 0, 0, .55834],
				8221: [0, .69444, 0, 0, .55834]
			},
			"SansSerif-Italic": {
				32: [0, 0, 0, 0, .25],
				33: [0, .69444, .05733, 0, .31945],
				34: [0, .69444, .00316, 0, .5],
				35: [.19444, .69444, .05087, 0, .83334],
				36: [.05556, .75, .11156, 0, .5],
				37: [.05556, .75, .03126, 0, .83334],
				38: [0, .69444, .03058, 0, .75834],
				39: [0, .69444, .07816, 0, .27778],
				40: [.25, .75, .13164, 0, .38889],
				41: [.25, .75, .02536, 0, .38889],
				42: [0, .75, .11775, 0, .5],
				43: [.08333, .58333, .02536, 0, .77778],
				44: [.125, .08333, 0, 0, .27778],
				45: [0, .44444, .01946, 0, .33333],
				46: [0, .08333, 0, 0, .27778],
				47: [.25, .75, .13164, 0, .5],
				48: [0, .65556, .11156, 0, .5],
				49: [0, .65556, .11156, 0, .5],
				50: [0, .65556, .11156, 0, .5],
				51: [0, .65556, .11156, 0, .5],
				52: [0, .65556, .11156, 0, .5],
				53: [0, .65556, .11156, 0, .5],
				54: [0, .65556, .11156, 0, .5],
				55: [0, .65556, .11156, 0, .5],
				56: [0, .65556, .11156, 0, .5],
				57: [0, .65556, .11156, 0, .5],
				58: [0, .44444, .02502, 0, .27778],
				59: [.125, .44444, .02502, 0, .27778],
				61: [-.13, .37, .05087, 0, .77778],
				63: [0, .69444, .11809, 0, .47222],
				64: [0, .69444, .07555, 0, .66667],
				65: [0, .69444, 0, 0, .66667],
				66: [0, .69444, .08293, 0, .66667],
				67: [0, .69444, .11983, 0, .63889],
				68: [0, .69444, .07555, 0, .72223],
				69: [0, .69444, .11983, 0, .59722],
				70: [0, .69444, .13372, 0, .56945],
				71: [0, .69444, .11983, 0, .66667],
				72: [0, .69444, .08094, 0, .70834],
				73: [0, .69444, .13372, 0, .27778],
				74: [0, .69444, .08094, 0, .47222],
				75: [0, .69444, .11983, 0, .69445],
				76: [0, .69444, 0, 0, .54167],
				77: [0, .69444, .08094, 0, .875],
				78: [0, .69444, .08094, 0, .70834],
				79: [0, .69444, .07555, 0, .73611],
				80: [0, .69444, .08293, 0, .63889],
				81: [.125, .69444, .07555, 0, .73611],
				82: [0, .69444, .08293, 0, .64584],
				83: [0, .69444, .09205, 0, .55556],
				84: [0, .69444, .13372, 0, .68056],
				85: [0, .69444, .08094, 0, .6875],
				86: [0, .69444, .1615, 0, .66667],
				87: [0, .69444, .1615, 0, .94445],
				88: [0, .69444, .13372, 0, .66667],
				89: [0, .69444, .17261, 0, .66667],
				90: [0, .69444, .11983, 0, .61111],
				91: [.25, .75, .15942, 0, .28889],
				93: [.25, .75, .08719, 0, .28889],
				94: [0, .69444, .0799, 0, .5],
				95: [.35, .09444, .08616, 0, .5],
				97: [0, .44444, .00981, 0, .48056],
				98: [0, .69444, .03057, 0, .51667],
				99: [0, .44444, .08336, 0, .44445],
				100: [0, .69444, .09483, 0, .51667],
				101: [0, .44444, .06778, 0, .44445],
				102: [0, .69444, .21705, 0, .30556],
				103: [.19444, .44444, .10836, 0, .5],
				104: [0, .69444, .01778, 0, .51667],
				105: [0, .67937, .09718, 0, .23889],
				106: [.19444, .67937, .09162, 0, .26667],
				107: [0, .69444, .08336, 0, .48889],
				108: [0, .69444, .09483, 0, .23889],
				109: [0, .44444, .01778, 0, .79445],
				110: [0, .44444, .01778, 0, .51667],
				111: [0, .44444, .06613, 0, .5],
				112: [.19444, .44444, .0389, 0, .51667],
				113: [.19444, .44444, .04169, 0, .51667],
				114: [0, .44444, .10836, 0, .34167],
				115: [0, .44444, .0778, 0, .38333],
				116: [0, .57143, .07225, 0, .36111],
				117: [0, .44444, .04169, 0, .51667],
				118: [0, .44444, .10836, 0, .46111],
				119: [0, .44444, .10836, 0, .68334],
				120: [0, .44444, .09169, 0, .46111],
				121: [.19444, .44444, .10836, 0, .46111],
				122: [0, .44444, .08752, 0, .43472],
				126: [.35, .32659, .08826, 0, .5],
				160: [0, 0, 0, 0, .25],
				168: [0, .67937, .06385, 0, .5],
				176: [0, .69444, 0, 0, .73752],
				184: [.17014, 0, 0, 0, .44445],
				305: [0, .44444, .04169, 0, .23889],
				567: [.19444, .44444, .04169, 0, .26667],
				710: [0, .69444, .0799, 0, .5],
				711: [0, .63194, .08432, 0, .5],
				713: [0, .60889, .08776, 0, .5],
				714: [0, .69444, .09205, 0, .5],
				715: [0, .69444, 0, 0, .5],
				728: [0, .69444, .09483, 0, .5],
				729: [0, .67937, .07774, 0, .27778],
				730: [0, .69444, 0, 0, .73752],
				732: [0, .67659, .08826, 0, .5],
				733: [0, .69444, .09205, 0, .5],
				915: [0, .69444, .13372, 0, .54167],
				916: [0, .69444, 0, 0, .83334],
				920: [0, .69444, .07555, 0, .77778],
				923: [0, .69444, 0, 0, .61111],
				926: [0, .69444, .12816, 0, .66667],
				928: [0, .69444, .08094, 0, .70834],
				931: [0, .69444, .11983, 0, .72222],
				933: [0, .69444, .09031, 0, .77778],
				934: [0, .69444, .04603, 0, .72222],
				936: [0, .69444, .09031, 0, .77778],
				937: [0, .69444, .08293, 0, .72222],
				8211: [0, .44444, .08616, 0, .5],
				8212: [0, .44444, .08616, 0, 1],
				8216: [0, .69444, .07816, 0, .27778],
				8217: [0, .69444, .07816, 0, .27778],
				8220: [0, .69444, .14205, 0, .5],
				8221: [0, .69444, .00316, 0, .5]
			},
			"SansSerif-Regular": {
				32: [0, 0, 0, 0, .25],
				33: [0, .69444, 0, 0, .31945],
				34: [0, .69444, 0, 0, .5],
				35: [.19444, .69444, 0, 0, .83334],
				36: [.05556, .75, 0, 0, .5],
				37: [.05556, .75, 0, 0, .83334],
				38: [0, .69444, 0, 0, .75834],
				39: [0, .69444, 0, 0, .27778],
				40: [.25, .75, 0, 0, .38889],
				41: [.25, .75, 0, 0, .38889],
				42: [0, .75, 0, 0, .5],
				43: [.08333, .58333, 0, 0, .77778],
				44: [.125, .08333, 0, 0, .27778],
				45: [0, .44444, 0, 0, .33333],
				46: [0, .08333, 0, 0, .27778],
				47: [.25, .75, 0, 0, .5],
				48: [0, .65556, 0, 0, .5],
				49: [0, .65556, 0, 0, .5],
				50: [0, .65556, 0, 0, .5],
				51: [0, .65556, 0, 0, .5],
				52: [0, .65556, 0, 0, .5],
				53: [0, .65556, 0, 0, .5],
				54: [0, .65556, 0, 0, .5],
				55: [0, .65556, 0, 0, .5],
				56: [0, .65556, 0, 0, .5],
				57: [0, .65556, 0, 0, .5],
				58: [0, .44444, 0, 0, .27778],
				59: [.125, .44444, 0, 0, .27778],
				61: [-.13, .37, 0, 0, .77778],
				63: [0, .69444, 0, 0, .47222],
				64: [0, .69444, 0, 0, .66667],
				65: [0, .69444, 0, 0, .66667],
				66: [0, .69444, 0, 0, .66667],
				67: [0, .69444, 0, 0, .63889],
				68: [0, .69444, 0, 0, .72223],
				69: [0, .69444, 0, 0, .59722],
				70: [0, .69444, 0, 0, .56945],
				71: [0, .69444, 0, 0, .66667],
				72: [0, .69444, 0, 0, .70834],
				73: [0, .69444, 0, 0, .27778],
				74: [0, .69444, 0, 0, .47222],
				75: [0, .69444, 0, 0, .69445],
				76: [0, .69444, 0, 0, .54167],
				77: [0, .69444, 0, 0, .875],
				78: [0, .69444, 0, 0, .70834],
				79: [0, .69444, 0, 0, .73611],
				80: [0, .69444, 0, 0, .63889],
				81: [.125, .69444, 0, 0, .73611],
				82: [0, .69444, 0, 0, .64584],
				83: [0, .69444, 0, 0, .55556],
				84: [0, .69444, 0, 0, .68056],
				85: [0, .69444, 0, 0, .6875],
				86: [0, .69444, .01389, 0, .66667],
				87: [0, .69444, .01389, 0, .94445],
				88: [0, .69444, 0, 0, .66667],
				89: [0, .69444, .025, 0, .66667],
				90: [0, .69444, 0, 0, .61111],
				91: [.25, .75, 0, 0, .28889],
				93: [.25, .75, 0, 0, .28889],
				94: [0, .69444, 0, 0, .5],
				95: [.35, .09444, .02778, 0, .5],
				97: [0, .44444, 0, 0, .48056],
				98: [0, .69444, 0, 0, .51667],
				99: [0, .44444, 0, 0, .44445],
				100: [0, .69444, 0, 0, .51667],
				101: [0, .44444, 0, 0, .44445],
				102: [0, .69444, .06944, 0, .30556],
				103: [.19444, .44444, .01389, 0, .5],
				104: [0, .69444, 0, 0, .51667],
				105: [0, .67937, 0, 0, .23889],
				106: [.19444, .67937, 0, 0, .26667],
				107: [0, .69444, 0, 0, .48889],
				108: [0, .69444, 0, 0, .23889],
				109: [0, .44444, 0, 0, .79445],
				110: [0, .44444, 0, 0, .51667],
				111: [0, .44444, 0, 0, .5],
				112: [.19444, .44444, 0, 0, .51667],
				113: [.19444, .44444, 0, 0, .51667],
				114: [0, .44444, .01389, 0, .34167],
				115: [0, .44444, 0, 0, .38333],
				116: [0, .57143, 0, 0, .36111],
				117: [0, .44444, 0, 0, .51667],
				118: [0, .44444, .01389, 0, .46111],
				119: [0, .44444, .01389, 0, .68334],
				120: [0, .44444, 0, 0, .46111],
				121: [.19444, .44444, .01389, 0, .46111],
				122: [0, .44444, 0, 0, .43472],
				126: [.35, .32659, 0, 0, .5],
				160: [0, 0, 0, 0, .25],
				168: [0, .67937, 0, 0, .5],
				176: [0, .69444, 0, 0, .66667],
				184: [.17014, 0, 0, 0, .44445],
				305: [0, .44444, 0, 0, .23889],
				567: [.19444, .44444, 0, 0, .26667],
				710: [0, .69444, 0, 0, .5],
				711: [0, .63194, 0, 0, .5],
				713: [0, .60889, 0, 0, .5],
				714: [0, .69444, 0, 0, .5],
				715: [0, .69444, 0, 0, .5],
				728: [0, .69444, 0, 0, .5],
				729: [0, .67937, 0, 0, .27778],
				730: [0, .69444, 0, 0, .66667],
				732: [0, .67659, 0, 0, .5],
				733: [0, .69444, 0, 0, .5],
				915: [0, .69444, 0, 0, .54167],
				916: [0, .69444, 0, 0, .83334],
				920: [0, .69444, 0, 0, .77778],
				923: [0, .69444, 0, 0, .61111],
				926: [0, .69444, 0, 0, .66667],
				928: [0, .69444, 0, 0, .70834],
				931: [0, .69444, 0, 0, .72222],
				933: [0, .69444, 0, 0, .77778],
				934: [0, .69444, 0, 0, .72222],
				936: [0, .69444, 0, 0, .77778],
				937: [0, .69444, 0, 0, .72222],
				8211: [0, .44444, .02778, 0, .5],
				8212: [0, .44444, .02778, 0, 1],
				8216: [0, .69444, 0, 0, .27778],
				8217: [0, .69444, 0, 0, .27778],
				8220: [0, .69444, 0, 0, .5],
				8221: [0, .69444, 0, 0, .5]
			},
			"Script-Regular": {
				32: [0, 0, 0, 0, .25],
				65: [0, .7, .22925, 0, .80253],
				66: [0, .7, .04087, 0, .90757],
				67: [0, .7, .1689, 0, .66619],
				68: [0, .7, .09371, 0, .77443],
				69: [0, .7, .18583, 0, .56162],
				70: [0, .7, .13634, 0, .89544],
				71: [0, .7, .17322, 0, .60961],
				72: [0, .7, .29694, 0, .96919],
				73: [0, .7, .19189, 0, .80907],
				74: [.27778, .7, .19189, 0, 1.05159],
				75: [0, .7, .31259, 0, .91364],
				76: [0, .7, .19189, 0, .87373],
				77: [0, .7, .15981, 0, 1.08031],
				78: [0, .7, .3525, 0, .9015],
				79: [0, .7, .08078, 0, .73787],
				80: [0, .7, .08078, 0, 1.01262],
				81: [0, .7, .03305, 0, .88282],
				82: [0, .7, .06259, 0, .85],
				83: [0, .7, .19189, 0, .86767],
				84: [0, .7, .29087, 0, .74697],
				85: [0, .7, .25815, 0, .79996],
				86: [0, .7, .27523, 0, .62204],
				87: [0, .7, .27523, 0, .80532],
				88: [0, .7, .26006, 0, .94445],
				89: [0, .7, .2939, 0, .70961],
				90: [0, .7, .24037, 0, .8212],
				160: [0, 0, 0, 0, .25]
			},
			"Size1-Regular": {
				32: [0, 0, 0, 0, .25],
				40: [.35001, .85, 0, 0, .45834],
				41: [.35001, .85, 0, 0, .45834],
				47: [.35001, .85, 0, 0, .57778],
				91: [.35001, .85, 0, 0, .41667],
				92: [.35001, .85, 0, 0, .57778],
				93: [.35001, .85, 0, 0, .41667],
				123: [.35001, .85, 0, 0, .58334],
				125: [.35001, .85, 0, 0, .58334],
				160: [0, 0, 0, 0, .25],
				710: [0, .72222, 0, 0, .55556],
				732: [0, .72222, 0, 0, .55556],
				770: [0, .72222, 0, 0, .55556],
				771: [0, .72222, 0, 0, .55556],
				8214: [-99e-5, .601, 0, 0, .77778],
				8593: [1e-5, .6, 0, 0, .66667],
				8595: [1e-5, .6, 0, 0, .66667],
				8657: [1e-5, .6, 0, 0, .77778],
				8659: [1e-5, .6, 0, 0, .77778],
				8719: [.25001, .75, 0, 0, .94445],
				8720: [.25001, .75, 0, 0, .94445],
				8721: [.25001, .75, 0, 0, 1.05556],
				8730: [.35001, .85, 0, 0, 1],
				8739: [-.00599, .606, 0, 0, .33333],
				8741: [-.00599, .606, 0, 0, .55556],
				8747: [.30612, .805, .19445, 0, .47222],
				8748: [.306, .805, .19445, 0, .47222],
				8749: [.306, .805, .19445, 0, .47222],
				8750: [.30612, .805, .19445, 0, .47222],
				8896: [.25001, .75, 0, 0, .83334],
				8897: [.25001, .75, 0, 0, .83334],
				8898: [.25001, .75, 0, 0, .83334],
				8899: [.25001, .75, 0, 0, .83334],
				8968: [.35001, .85, 0, 0, .47222],
				8969: [.35001, .85, 0, 0, .47222],
				8970: [.35001, .85, 0, 0, .47222],
				8971: [.35001, .85, 0, 0, .47222],
				9168: [-99e-5, .601, 0, 0, .66667],
				10216: [.35001, .85, 0, 0, .47222],
				10217: [.35001, .85, 0, 0, .47222],
				10752: [.25001, .75, 0, 0, 1.11111],
				10753: [.25001, .75, 0, 0, 1.11111],
				10754: [.25001, .75, 0, 0, 1.11111],
				10756: [.25001, .75, 0, 0, .83334],
				10758: [.25001, .75, 0, 0, .83334]
			},
			"Size2-Regular": {
				32: [0, 0, 0, 0, .25],
				40: [.65002, 1.15, 0, 0, .59722],
				41: [.65002, 1.15, 0, 0, .59722],
				47: [.65002, 1.15, 0, 0, .81111],
				91: [.65002, 1.15, 0, 0, .47222],
				92: [.65002, 1.15, 0, 0, .81111],
				93: [.65002, 1.15, 0, 0, .47222],
				123: [.65002, 1.15, 0, 0, .66667],
				125: [.65002, 1.15, 0, 0, .66667],
				160: [0, 0, 0, 0, .25],
				710: [0, .75, 0, 0, 1],
				732: [0, .75, 0, 0, 1],
				770: [0, .75, 0, 0, 1],
				771: [0, .75, 0, 0, 1],
				8719: [.55001, 1.05, 0, 0, 1.27778],
				8720: [.55001, 1.05, 0, 0, 1.27778],
				8721: [.55001, 1.05, 0, 0, 1.44445],
				8730: [.65002, 1.15, 0, 0, 1],
				8747: [.86225, 1.36, .44445, 0, .55556],
				8748: [.862, 1.36, .44445, 0, .55556],
				8749: [.862, 1.36, .44445, 0, .55556],
				8750: [.86225, 1.36, .44445, 0, .55556],
				8896: [.55001, 1.05, 0, 0, 1.11111],
				8897: [.55001, 1.05, 0, 0, 1.11111],
				8898: [.55001, 1.05, 0, 0, 1.11111],
				8899: [.55001, 1.05, 0, 0, 1.11111],
				8968: [.65002, 1.15, 0, 0, .52778],
				8969: [.65002, 1.15, 0, 0, .52778],
				8970: [.65002, 1.15, 0, 0, .52778],
				8971: [.65002, 1.15, 0, 0, .52778],
				10216: [.65002, 1.15, 0, 0, .61111],
				10217: [.65002, 1.15, 0, 0, .61111],
				10752: [.55001, 1.05, 0, 0, 1.51112],
				10753: [.55001, 1.05, 0, 0, 1.51112],
				10754: [.55001, 1.05, 0, 0, 1.51112],
				10756: [.55001, 1.05, 0, 0, 1.11111],
				10758: [.55001, 1.05, 0, 0, 1.11111]
			},
			"Size3-Regular": {
				32: [0, 0, 0, 0, .25],
				40: [.95003, 1.45, 0, 0, .73611],
				41: [.95003, 1.45, 0, 0, .73611],
				47: [.95003, 1.45, 0, 0, 1.04445],
				91: [.95003, 1.45, 0, 0, .52778],
				92: [.95003, 1.45, 0, 0, 1.04445],
				93: [.95003, 1.45, 0, 0, .52778],
				123: [.95003, 1.45, 0, 0, .75],
				125: [.95003, 1.45, 0, 0, .75],
				160: [0, 0, 0, 0, .25],
				710: [0, .75, 0, 0, 1.44445],
				732: [0, .75, 0, 0, 1.44445],
				770: [0, .75, 0, 0, 1.44445],
				771: [0, .75, 0, 0, 1.44445],
				8730: [.95003, 1.45, 0, 0, 1],
				8968: [.95003, 1.45, 0, 0, .58334],
				8969: [.95003, 1.45, 0, 0, .58334],
				8970: [.95003, 1.45, 0, 0, .58334],
				8971: [.95003, 1.45, 0, 0, .58334],
				10216: [.95003, 1.45, 0, 0, .75],
				10217: [.95003, 1.45, 0, 0, .75]
			},
			"Size4-Regular": {
				32: [0, 0, 0, 0, .25],
				40: [1.25003, 1.75, 0, 0, .79167],
				41: [1.25003, 1.75, 0, 0, .79167],
				47: [1.25003, 1.75, 0, 0, 1.27778],
				91: [1.25003, 1.75, 0, 0, .58334],
				92: [1.25003, 1.75, 0, 0, 1.27778],
				93: [1.25003, 1.75, 0, 0, .58334],
				123: [1.25003, 1.75, 0, 0, .80556],
				125: [1.25003, 1.75, 0, 0, .80556],
				160: [0, 0, 0, 0, .25],
				710: [0, .825, 0, 0, 1.8889],
				732: [0, .825, 0, 0, 1.8889],
				770: [0, .825, 0, 0, 1.8889],
				771: [0, .825, 0, 0, 1.8889],
				8730: [1.25003, 1.75, 0, 0, 1],
				8968: [1.25003, 1.75, 0, 0, .63889],
				8969: [1.25003, 1.75, 0, 0, .63889],
				8970: [1.25003, 1.75, 0, 0, .63889],
				8971: [1.25003, 1.75, 0, 0, .63889],
				9115: [.64502, 1.155, 0, 0, .875],
				9116: [1e-5, .6, 0, 0, .875],
				9117: [.64502, 1.155, 0, 0, .875],
				9118: [.64502, 1.155, 0, 0, .875],
				9119: [1e-5, .6, 0, 0, .875],
				9120: [.64502, 1.155, 0, 0, .875],
				9121: [.64502, 1.155, 0, 0, .66667],
				9122: [-99e-5, .601, 0, 0, .66667],
				9123: [.64502, 1.155, 0, 0, .66667],
				9124: [.64502, 1.155, 0, 0, .66667],
				9125: [-99e-5, .601, 0, 0, .66667],
				9126: [.64502, 1.155, 0, 0, .66667],
				9127: [1e-5, .9, 0, 0, .88889],
				9128: [.65002, 1.15, 0, 0, .88889],
				9129: [.90001, 0, 0, 0, .88889],
				9130: [0, .3, 0, 0, .88889],
				9131: [1e-5, .9, 0, 0, .88889],
				9132: [.65002, 1.15, 0, 0, .88889],
				9133: [.90001, 0, 0, 0, .88889],
				9143: [.88502, .915, 0, 0, 1.05556],
				10216: [1.25003, 1.75, 0, 0, .80556],
				10217: [1.25003, 1.75, 0, 0, .80556],
				57344: [-.00499, .605, 0, 0, 1.05556],
				57345: [-.00499, .605, 0, 0, 1.05556],
				57680: [0, .12, 0, 0, .45],
				57681: [0, .12, 0, 0, .45],
				57682: [0, .12, 0, 0, .45],
				57683: [0, .12, 0, 0, .45]
			},
			"Typewriter-Regular": {
				32: [0, 0, 0, 0, .525],
				33: [0, .61111, 0, 0, .525],
				34: [0, .61111, 0, 0, .525],
				35: [0, .61111, 0, 0, .525],
				36: [.08333, .69444, 0, 0, .525],
				37: [.08333, .69444, 0, 0, .525],
				38: [0, .61111, 0, 0, .525],
				39: [0, .61111, 0, 0, .525],
				40: [.08333, .69444, 0, 0, .525],
				41: [.08333, .69444, 0, 0, .525],
				42: [0, .52083, 0, 0, .525],
				43: [-.08056, .53055, 0, 0, .525],
				44: [.13889, .125, 0, 0, .525],
				45: [-.08056, .53055, 0, 0, .525],
				46: [0, .125, 0, 0, .525],
				47: [.08333, .69444, 0, 0, .525],
				48: [0, .61111, 0, 0, .525],
				49: [0, .61111, 0, 0, .525],
				50: [0, .61111, 0, 0, .525],
				51: [0, .61111, 0, 0, .525],
				52: [0, .61111, 0, 0, .525],
				53: [0, .61111, 0, 0, .525],
				54: [0, .61111, 0, 0, .525],
				55: [0, .61111, 0, 0, .525],
				56: [0, .61111, 0, 0, .525],
				57: [0, .61111, 0, 0, .525],
				58: [0, .43056, 0, 0, .525],
				59: [.13889, .43056, 0, 0, .525],
				60: [-.05556, .55556, 0, 0, .525],
				61: [-.19549, .41562, 0, 0, .525],
				62: [-.05556, .55556, 0, 0, .525],
				63: [0, .61111, 0, 0, .525],
				64: [0, .61111, 0, 0, .525],
				65: [0, .61111, 0, 0, .525],
				66: [0, .61111, 0, 0, .525],
				67: [0, .61111, 0, 0, .525],
				68: [0, .61111, 0, 0, .525],
				69: [0, .61111, 0, 0, .525],
				70: [0, .61111, 0, 0, .525],
				71: [0, .61111, 0, 0, .525],
				72: [0, .61111, 0, 0, .525],
				73: [0, .61111, 0, 0, .525],
				74: [0, .61111, 0, 0, .525],
				75: [0, .61111, 0, 0, .525],
				76: [0, .61111, 0, 0, .525],
				77: [0, .61111, 0, 0, .525],
				78: [0, .61111, 0, 0, .525],
				79: [0, .61111, 0, 0, .525],
				80: [0, .61111, 0, 0, .525],
				81: [.13889, .61111, 0, 0, .525],
				82: [0, .61111, 0, 0, .525],
				83: [0, .61111, 0, 0, .525],
				84: [0, .61111, 0, 0, .525],
				85: [0, .61111, 0, 0, .525],
				86: [0, .61111, 0, 0, .525],
				87: [0, .61111, 0, 0, .525],
				88: [0, .61111, 0, 0, .525],
				89: [0, .61111, 0, 0, .525],
				90: [0, .61111, 0, 0, .525],
				91: [.08333, .69444, 0, 0, .525],
				92: [.08333, .69444, 0, 0, .525],
				93: [.08333, .69444, 0, 0, .525],
				94: [0, .61111, 0, 0, .525],
				95: [.09514, 0, 0, 0, .525],
				96: [0, .61111, 0, 0, .525],
				97: [0, .43056, 0, 0, .525],
				98: [0, .61111, 0, 0, .525],
				99: [0, .43056, 0, 0, .525],
				100: [0, .61111, 0, 0, .525],
				101: [0, .43056, 0, 0, .525],
				102: [0, .61111, 0, 0, .525],
				103: [.22222, .43056, 0, 0, .525],
				104: [0, .61111, 0, 0, .525],
				105: [0, .61111, 0, 0, .525],
				106: [.22222, .61111, 0, 0, .525],
				107: [0, .61111, 0, 0, .525],
				108: [0, .61111, 0, 0, .525],
				109: [0, .43056, 0, 0, .525],
				110: [0, .43056, 0, 0, .525],
				111: [0, .43056, 0, 0, .525],
				112: [.22222, .43056, 0, 0, .525],
				113: [.22222, .43056, 0, 0, .525],
				114: [0, .43056, 0, 0, .525],
				115: [0, .43056, 0, 0, .525],
				116: [0, .55358, 0, 0, .525],
				117: [0, .43056, 0, 0, .525],
				118: [0, .43056, 0, 0, .525],
				119: [0, .43056, 0, 0, .525],
				120: [0, .43056, 0, 0, .525],
				121: [.22222, .43056, 0, 0, .525],
				122: [0, .43056, 0, 0, .525],
				123: [.08333, .69444, 0, 0, .525],
				124: [.08333, .69444, 0, 0, .525],
				125: [.08333, .69444, 0, 0, .525],
				126: [0, .61111, 0, 0, .525],
				127: [0, .61111, 0, 0, .525],
				160: [0, 0, 0, 0, .525],
				176: [0, .61111, 0, 0, .525],
				184: [.19445, 0, 0, 0, .525],
				305: [0, .43056, 0, 0, .525],
				567: [.22222, .43056, 0, 0, .525],
				711: [0, .56597, 0, 0, .525],
				713: [0, .56555, 0, 0, .525],
				714: [0, .61111, 0, 0, .525],
				715: [0, .61111, 0, 0, .525],
				728: [0, .61111, 0, 0, .525],
				730: [0, .61111, 0, 0, .525],
				770: [0, .61111, 0, 0, .525],
				771: [0, .61111, 0, 0, .525],
				776: [0, .61111, 0, 0, .525],
				915: [0, .61111, 0, 0, .525],
				916: [0, .61111, 0, 0, .525],
				920: [0, .61111, 0, 0, .525],
				923: [0, .61111, 0, 0, .525],
				926: [0, .61111, 0, 0, .525],
				928: [0, .61111, 0, 0, .525],
				931: [0, .61111, 0, 0, .525],
				933: [0, .61111, 0, 0, .525],
				934: [0, .61111, 0, 0, .525],
				936: [0, .61111, 0, 0, .525],
				937: [0, .61111, 0, 0, .525],
				8216: [0, .61111, 0, 0, .525],
				8217: [0, .61111, 0, 0, .525],
				8242: [0, .61111, 0, 0, .525],
				9251: [.11111, .21944, 0, 0, .525]
			}
		},
		Xe = {
			slant: [.25, .25, .25],
			space: [0, 0, 0],
			stretch: [0, 0, 0],
			shrink: [0, 0, 0],
			xHeight: [.431, .431, .431],
			quad: [1, 1.171, 1.472],
			extraSpace: [0, 0, 0],
			num1: [.677, .732, .925],
			num2: [.394, .384, .387],
			num3: [.444, .471, .504],
			denom1: [.686, .752, 1.025],
			denom2: [.345, .344, .532],
			sup1: [.413, .503, .504],
			sup2: [.363, .431, .404],
			sup3: [.289, .286, .294],
			sub1: [.15, .143, .2],
			sub2: [.247, .286, .4],
			supDrop: [.386, .353, .494],
			subDrop: [.05, .071, .1],
			delim1: [2.39, 1.7, 1.98],
			delim2: [1.01, 1.157, 1.42],
			axisHeight: [.25, .25, .25],
			defaultRuleThickness: [.04, .049, .049],
			bigOpSpacing1: [.111, .111, .111],
			bigOpSpacing2: [.166, .166, .166],
			bigOpSpacing3: [.2, .2, .2],
			bigOpSpacing4: [.6, .611, .611],
			bigOpSpacing5: [.1, .143, .143],
			sqrtRuleThickness: [.04, .04, .04],
			ptPerEm: [10, 10, 10],
			doubleRuleSep: [.2, .2, .2],
			arrayRuleWidth: [.04, .04, .04],
			fboxsep: [.3, .3, .3],
			fboxrule: [.04, .04, .04]
		},
		Ur = {
			\u00C5: "A",
			\u00D0: "D",
			\u00DE: "o",
			\u00E5: "a",
			\u00F0: "d",
			\u00FE: "o",
			\u0410: "A",
			\u0411: "B",
			\u0412: "B",
			\u0413: "F",
			\u0414: "A",
			\u0415: "E",
			\u0416: "K",
			\u0417: "3",
			\u0418: "N",
			\u0419: "N",
			\u041A: "K",
			\u041B: "N",
			\u041C: "M",
			\u041D: "H",
			\u041E: "O",
			\u041F: "N",
			\u0420: "P",
			\u0421: "C",
			\u0422: "T",
			\u0423: "y",
			\u0424: "O",
			\u0425: "X",
			\u0426: "U",
			\u0427: "h",
			\u0428: "W",
			\u0429: "W",
			\u042A: "B",
			\u042B: "X",
			\u042C: "B",
			\u042D: "3",
			\u042E: "X",
			\u042F: "R",
			\u0430: "a",
			\u0431: "b",
			\u0432: "a",
			\u0433: "r",
			\u0434: "y",
			\u0435: "e",
			\u0436: "m",
			\u0437: "e",
			\u0438: "n",
			\u0439: "n",
			\u043A: "n",
			\u043B: "n",
			\u043C: "m",
			\u043D: "n",
			\u043E: "o",
			\u043F: "n",
			\u0440: "p",
			\u0441: "c",
			\u0442: "o",
			\u0443: "y",
			\u0444: "b",
			\u0445: "x",
			\u0446: "n",
			\u0447: "n",
			\u0448: "w",
			\u0449: "w",
			\u044A: "a",
			\u044B: "m",
			\u044C: "a",
			\u044D: "e",
			\u044E: "m",
			\u044F: "r"
		};

	function En(r, e) {
		q0[r] = e
	}

	function Dt(r, e, t) {
		if (!q0[e]) throw new Error("Font metrics not found for font: " + e + ".");
		var a = r.charCodeAt(0),
			n = q0[e][a];
		if (!n && r[0] in Ur && (a = Ur[r[0]].charCodeAt(0), n = q0[e][a]), !n && t === "text" && Vr(a) && (n = q0[e][77]), n) return {
			depth: n[0],
			height: n[1],
			italic: n[2],
			skew: n[3],
			width: n[4]
		}
	}
	var Nt = {};

	function Cn(r) {
		var e;
		if (r >= 5 ? e = 0 : r >= 3 ? e = 1 : e = 2, !Nt[e]) {
			var t = Nt[e] = {
				cssEmPerMu: Xe.quad[e] / 18
			};
			for (var a in Xe) Xe.hasOwnProperty(a) && (t[a] = Xe[a][e])
		}
		return Nt[e]
	}
	var Dn = [
			[1, 1, 1],
			[2, 1, 1],
			[3, 1, 1],
			[4, 2, 1],
			[5, 2, 1],
			[6, 3, 1],
			[7, 4, 2],
			[8, 6, 3],
			[9, 7, 6],
			[10, 8, 7],
			[11, 10, 9]
		],
		Wr = [.5, .6, .7, .8, .9, 1, 1.2, 1.44, 1.728, 2.074, 2.488],
		Yr = function(e, t) {
			return t.size < 2 ? e : Dn[e - 1][t.size - 1]
		};
	class F0 {
		constructor(e) {
			this.style = void 0, this.color = void 0, this.size = void 0, this.textSize = void 0, this.phantom = void 0, this.font = void 0, this.fontFamily = void 0, this.fontWeight = void 0, this.fontShape = void 0, this.sizeMultiplier = void 0, this.maxSize = void 0, this.minRuleThickness = void 0, this._fontMetrics = void 0, this.style = e.style, this.color = e.color, this.size = e.size || F0.BASESIZE, this.textSize = e.textSize || this.size, this.phantom = !!e.phantom, this.font = e.font || "", this.fontFamily = e.fontFamily || "", this.fontWeight = e.fontWeight || "", this.fontShape = e.fontShape || "", this.sizeMultiplier = Wr[this.size - 1], this.maxSize = e.maxSize, this.minRuleThickness = e.minRuleThickness, this._fontMetrics = void 0
		}
		extend(e) {
			var t = {
				style: this.style,
				size: this.size,
				textSize: this.textSize,
				color: this.color,
				phantom: this.phantom,
				font: this.font,
				fontFamily: this.fontFamily,
				fontWeight: this.fontWeight,
				fontShape: this.fontShape,
				maxSize: this.maxSize,
				minRuleThickness: this.minRuleThickness
			};
			for (var a in e) e.hasOwnProperty(a) && (t[a] = e[a]);
			return new F0(t)
		}
		havingStyle(e) {
			return this.style === e ? this : this.extend({
				style: e,
				size: Yr(this.textSize, e)
			})
		}
		havingCrampedStyle() {
			return this.havingStyle(this.style.cramp())
		}
		havingSize(e) {
			return this.size === e && this.textSize === e ? this : this.extend({
				style: this.style.text(),
				size: e,
				textSize: e,
				sizeMultiplier: Wr[e - 1]
			})
		}
		havingBaseStyle(e) {
			e = e || this.style.text();
			var t = Yr(F0.BASESIZE, e);
			return this.size === t && this.textSize === F0.BASESIZE && this.style === e ? this : this.extend({
				style: e,
				size: t
			})
		}
		havingBaseSizing() {
			var e;
			switch (this.style.id) {
				case 4:
				case 5:
					e = 3;
					break;
				case 6:
				case 7:
					e = 1;
					break;
				default:
					e = 6
			}
			return this.extend({
				style: this.style.text(),
				size: e
			})
		}
		withColor(e) {
			return this.extend({
				color: e
			})
		}
		withPhantom() {
			return this.extend({
				phantom: !0
			})
		}
		withFont(e) {
			return this.extend({
				font: e
			})
		}
		withTextFontFamily(e) {
			return this.extend({
				fontFamily: e,
				font: ""
			})
		}
		withTextFontWeight(e) {
			return this.extend({
				fontWeight: e,
				font: ""
			})
		}
		withTextFontShape(e) {
			return this.extend({
				fontShape: e,
				font: ""
			})
		}
		sizingClasses(e) {
			return e.size !== this.size ? ["sizing", "reset-size" + e.size, "size" + this.size] : []
		}
		baseSizingClasses() {
			return this.size !== F0.BASESIZE ? ["sizing", "reset-size" + this.size, "size" + F0.BASESIZE] : []
		}
		fontMetrics() {
			return this._fontMetrics || (this._fontMetrics = Cn(this.size)), this._fontMetrics
		}
		getColor() {
			return this.phantom ? "transparent" : this.color
		}
	}
	F0.BASESIZE = 6;
	var qt = {
			pt: 1,
			mm: 7227 / 2540,
			cm: 7227 / 254,
			in: 72.27,
			bp: 803 / 800,
			pc: 12,
			dd: 1238 / 1157,
			cc: 14856 / 1157,
			nd: 685 / 642,
			nc: 1370 / 107,
			sp: 1 / 65536,
			px: 803 / 800
		},
		Nn = {
			ex: !0,
			em: !0,
			mu: !0
		},
		Xr = function(e) {
			return typeof e != "string" && (e = e.unit), e in qt || e in Nn || e === "ex"
		},
		Z = function(e, t) {
			var a;
			if (e.unit in qt) a = qt[e.unit] / t.fontMetrics().ptPerEm / t.sizeMultiplier;
			else if (e.unit === "mu") a = t.fontMetrics().cssEmPerMu;
			else {
				var n;
				if (t.style.isTight() ? n = t.havingStyle(t.style.text()) : n = t, e.unit === "ex") a = n.fontMetrics().xHeight;
				else if (e.unit === "em") a = n.fontMetrics().quad;
				else throw new M("Invalid unit: '" + e.unit + "'");
				n !== t && (a *= n.sizeMultiplier / t.sizeMultiplier)
			}
			return Math.min(e.number * a, t.maxSize)
		},
		A = function(e) {
			return +e.toFixed(4) + "em"
		},
		X0 = function(e) {
			return e.filter(t => t).join(" ")
		},
		Zr = function(e, t, a) {
			if (this.classes = e || [], this.attributes = {}, this.height = 0, this.depth = 0, this.maxFontSize = 0, this.style = a || {}, t) {
				t.style.isTight() && this.classes.push("mtight");
				var n = t.getColor();
				n && (this.style.color = n)
			}
		},
		Kr = function(e) {
			var t = document.createElement(e);
			t.className = X0(this.classes);
			for (var a in this.style) this.style.hasOwnProperty(a) && (t.style[a] = this.style[a]);
			for (var n in this.attributes) this.attributes.hasOwnProperty(n) && t.setAttribute(n, this.attributes[n]);
			for (var i = 0; i < this.children.length; i++) t.appendChild(this.children[i].toNode());
			return t
		},
		Jr = function(e) {
			var t = "<" + e;
			this.classes.length && (t += ' class="' + R.escape(X0(this.classes)) + '"');
			var a = "";
			for (var n in this.style) this.style.hasOwnProperty(n) && (a += R.hyphenate(n) + ":" + this.style[n] + ";");
			a && (t += ' style="' + R.escape(a) + '"');
			for (var i in this.attributes) this.attributes.hasOwnProperty(i) && (t += " " + i + '="' + R.escape(this.attributes[i]) + '"');
			t += ">";
			for (var o = 0; o < this.children.length; o++) t += this.children[o].toMarkup();
			return t += "</" + e + ">", t
		};
	class Re {
		constructor(e, t, a, n) {
			this.children = void 0, this.attributes = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.width = void 0, this.maxFontSize = void 0, this.style = void 0, Zr.call(this, e, a, n), this.children = t || []
		}
		setAttribute(e, t) {
			this.attributes[e] = t
		}
		hasClass(e) {
			return R.contains(this.classes, e)
		}
		toNode() {
			return Kr.call(this, "span")
		}
		toMarkup() {
			return Jr.call(this, "span")
		}
	}
	class Rt {
		constructor(e, t, a, n) {
			this.children = void 0, this.attributes = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, Zr.call(this, t, n), this.children = a || [], this.setAttribute("href", e)
		}
		setAttribute(e, t) {
			this.attributes[e] = t
		}
		hasClass(e) {
			return R.contains(this.classes, e)
		}
		toNode() {
			return Kr.call(this, "a")
		}
		toMarkup() {
			return Jr.call(this, "a")
		}
	}
	class qn {
		constructor(e, t, a) {
			this.src = void 0, this.alt = void 0, this.classes = void 0, this.height = void 0, this.depth = void 0, this.maxFontSize = void 0, this.style = void 0, this.alt = t, this.src = e, this.classes = ["mord"], this.style = a
		}
		hasClass(e) {
			return R.contains(this.classes, e)
		}
		toNode() {
			var e = document.createElement("img");
			e.src = this.src, e.alt = this.alt, e.className = "mord";
			for (var t in this.style) this.style.hasOwnProperty(t) && (e.style[t] = this.style[t]);
			return e
		}
		toMarkup() {
			var e = "<img  src='" + this.src + " 'alt='" + this.alt + "' ",
				t = "";
			for (var a in this.style) this.style.hasOwnProperty(a) && (t += R.hyphenate(a) + ":" + this.style[a] + ";");
			return t && (e += ' style="' + R.escape(t) + '"'), e += "'/>", e
		}
	}
	var Rn = {
		\u00EE: "\u0131\u0302",
		\u00EF: "\u0131\u0308",
		\u00ED: "\u0131\u0301",
		\u00EC: "\u0131\u0300"
	};
	class k0 {
		constructor(e, t, a, n, i, o, u, m) {
			this.text = void 0, this.height = void 0, this.depth = void 0, this.italic = void 0, this.skew = void 0, this.width = void 0, this.maxFontSize = void 0, this.classes = void 0, this.style = void 0, this.text = e, this.height = t || 0, this.depth = a || 0, this.italic = n || 0, this.skew = i || 0, this.width = o || 0, this.classes = u || [], this.style = m || {}, this.maxFontSize = 0;
			var p = bn(this.text.charCodeAt(0));
			p && this.classes.push(p + "_fallback"), /[îïíì]/.test(this.text) && (this.text = Rn[this.text])
		}
		hasClass(e) {
			return R.contains(this.classes, e)
		}
		toNode() {
			var e = document.createTextNode(this.text),
				t = null;
			this.italic > 0 && (t = document.createElement("span"), t.style.marginRight = A(this.italic)), this.classes.length > 0 && (t = t || document.createElement("span"), t.className = X0(this.classes));
			for (var a in this.style) this.style.hasOwnProperty(a) && (t = t || document.createElement("span"), t.style[a] = this.style[a]);
			return t ? (t.appendChild(e), t) : e
		}
		toMarkup() {
			var e = !1,
				t = "<span";
			this.classes.length && (e = !0, t += ' class="', t += R.escape(X0(this.classes)), t += '"');
			var a = "";
			this.italic > 0 && (a += "margin-right:" + this.italic + "em;");
			for (var n in this.style) this.style.hasOwnProperty(n) && (a += R.hyphenate(n) + ":" + this.style[n] + ";");
			a && (e = !0, t += ' style="' + R.escape(a) + '"');
			var i = R.escape(this.text);
			return e ? (t += ">", t += i, t += "</span>", t) : i
		}
	}
	class H0 {
		constructor(e, t) {
			this.children = void 0, this.attributes = void 0, this.children = e || [], this.attributes = t || {}
		}
		toNode() {
			var e = "http://www.w3.org/2000/svg",
				t = document.createElementNS(e, "svg");
			for (var a in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, a) && t.setAttribute(a, this.attributes[a]);
			for (var n = 0; n < this.children.length; n++) t.appendChild(this.children[n].toNode());
			return t
		}
		toMarkup() {
			var e = '<svg xmlns="http://www.w3.org/2000/svg"';
			for (var t in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, t) && (e += " " + t + "='" + this.attributes[t] + "'");
			e += ">";
			for (var a = 0; a < this.children.length; a++) e += this.children[a].toMarkup();
			return e += "</svg>", e
		}
	}
	class Z0 {
		constructor(e, t) {
			this.pathName = void 0, this.alternate = void 0, this.pathName = e, this.alternate = t
		}
		toNode() {
			var e = "http://www.w3.org/2000/svg",
				t = document.createElementNS(e, "path");
			return this.alternate ? t.setAttribute("d", this.alternate) : t.setAttribute("d", jr[this.pathName]), t
		}
		toMarkup() {
			return this.alternate ? "<path d='" + this.alternate + "'/>" : "<path d='" + jr[this.pathName] + "'/>"
		}
	}
	class $t {
		constructor(e) {
			this.attributes = void 0, this.attributes = e || {}
		}
		toNode() {
			var e = "http://www.w3.org/2000/svg",
				t = document.createElementNS(e, "line");
			for (var a in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, a) && t.setAttribute(a, this.attributes[a]);
			return t
		}
		toMarkup() {
			var e = "<line";
			for (var t in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, t) && (e += " " + t + "='" + this.attributes[t] + "'");
			return e += "/>", e
		}
	}

	function _r(r) {
		if (r instanceof k0) return r;
		throw new Error("Expected symbolNode but got " + String(r) + ".")
	}

	function $n(r) {
		if (r instanceof Re) return r;
		throw new Error("Expected span<HtmlDomNode> but got " + String(r) + ".")
	}
	var In = {
			bin: 1,
			close: 1,
			inner: 1,
			open: 1,
			punct: 1,
			rel: 1
		},
		On = {
			"accent-token": 1,
			mathord: 1,
			"op-token": 1,
			spacing: 1,
			textord: 1
		},
		W = {
			math: {},
			text: {}
		};

	function l(r, e, t, a, n, i) {
		W[r][n] = {
			font: e,
			group: t,
			replace: a
		}, i && a && (W[r][a] = W[r][n])
	}
	var s = "math",
		k = "text",
		h = "main",
		d = "ams",
		Y = "accent-token",
		E = "bin",
		o0 = "close",
		we = "inner",
		q = "mathord",
		r0 = "op-token",
		v0 = "open",
		Ze = "punct",
		f = "rel",
		P0 = "spacing",
		g = "textord";
	l(s, h, f, "\u2261", "\\equiv", !0), l(s, h, f, "\u227A", "\\prec", !0), l(s, h, f, "\u227B", "\\succ", !0), l(s, h, f, "\u223C", "\\sim", !0), l(s, h, f, "\u22A5", "\\perp"), l(s, h, f, "\u2AAF", "\\preceq", !0), l(s, h, f, "\u2AB0", "\\succeq", !0), l(s, h, f, "\u2243", "\\simeq", !0), l(s, h, f, "\u2223", "\\mid", !0), l(s, h, f, "\u226A", "\\ll", !0), l(s, h, f, "\u226B", "\\gg", !0), l(s, h, f, "\u224D", "\\asymp", !0), l(s, h, f, "\u2225", "\\parallel"), l(s, h, f, "\u22C8", "\\bowtie", !0), l(s, h, f, "\u2323", "\\smile", !0), l(s, h, f, "\u2291", "\\sqsubseteq", !0), l(s, h, f, "\u2292", "\\sqsupseteq", !0), l(s, h, f, "\u2250", "\\doteq", !0), l(s, h, f, "\u2322", "\\frown", !0), l(s, h, f, "\u220B", "\\ni", !0), l(s, h, f, "\u221D", "\\propto", !0), l(s, h, f, "\u22A2", "\\vdash", !0), l(s, h, f, "\u22A3", "\\dashv", !0), l(s, h, f, "\u220B", "\\owns"), l(s, h, Ze, ".", "\\ldotp"), l(s, h, Ze, "\u22C5", "\\cdotp"), l(s, h, g, "#", "\\#"), l(k, h, g, "#", "\\#"), l(s, h, g, "&", "\\&"), l(k, h, g, "&", "\\&"), l(s, h, g, "\u2135", "\\aleph", !0), l(s, h, g, "\u2200", "\\forall", !0), l(s, h, g, "\u210F", "\\hbar", !0), l(s, h, g, "\u2203", "\\exists", !0), l(s, h, g, "\u2207", "\\nabla", !0), l(s, h, g, "\u266D", "\\flat", !0), l(s, h, g, "\u2113", "\\ell", !0), l(s, h, g, "\u266E", "\\natural", !0), l(s, h, g, "\u2663", "\\clubsuit", !0), l(s, h, g, "\u2118", "\\wp", !0), l(s, h, g, "\u266F", "\\sharp", !0), l(s, h, g, "\u2662", "\\diamondsuit", !0), l(s, h, g, "\u211C", "\\Re", !0), l(s, h, g, "\u2661", "\\heartsuit", !0), l(s, h, g, "\u2111", "\\Im", !0), l(s, h, g, "\u2660", "\\spadesuit", !0), l(s, h, g, "\xA7", "\\S", !0), l(k, h, g, "\xA7", "\\S"), l(s, h, g, "\xB6", "\\P", !0), l(k, h, g, "\xB6", "\\P"), l(s, h, g, "\u2020", "\\dag"), l(k, h, g, "\u2020", "\\dag"), l(k, h, g, "\u2020", "\\textdagger"), l(s, h, g, "\u2021", "\\ddag"), l(k, h, g, "\u2021", "\\ddag"), l(k, h, g, "\u2021", "\\textdaggerdbl"), l(s, h, o0, "\u23B1", "\\rmoustache", !0), l(s, h, v0, "\u23B0", "\\lmoustache", !0), l(s, h, o0, "\u27EF", "\\rgroup", !0), l(s, h, v0, "\u27EE", "\\lgroup", !0), l(s, h, E, "\u2213", "\\mp", !0), l(s, h, E, "\u2296", "\\ominus", !0), l(s, h, E, "\u228E", "\\uplus", !0), l(s, h, E, "\u2293", "\\sqcap", !0), l(s, h, E, "\u2217", "\\ast"), l(s, h, E, "\u2294", "\\sqcup", !0), l(s, h, E, "\u25EF", "\\bigcirc", !0), l(s, h, E, "\u2219", "\\bullet", !0), l(s, h, E, "\u2021", "\\ddagger"), l(s, h, E, "\u2240", "\\wr", !0), l(s, h, E, "\u2A3F", "\\amalg"), l(s, h, E, "&", "\\And"), l(s, h, f, "\u27F5", "\\longleftarrow", !0), l(s, h, f, "\u21D0", "\\Leftarrow", !0), l(s, h, f, "\u27F8", "\\Longleftarrow", !0), l(s, h, f, "\u27F6", "\\longrightarrow", !0), l(s, h, f, "\u21D2", "\\Rightarrow", !0), l(s, h, f, "\u27F9", "\\Longrightarrow", !0), l(s, h, f, "\u2194", "\\leftrightarrow", !0), l(s, h, f, "\u27F7", "\\longleftrightarrow", !0), l(s, h, f, "\u21D4", "\\Leftrightarrow", !0), l(s, h, f, "\u27FA", "\\Longleftrightarrow", !0), l(s, h, f, "\u21A6", "\\mapsto", !0), l(s, h, f, "\u27FC", "\\longmapsto", !0), l(s, h, f, "\u2197", "\\nearrow", !0), l(s, h, f, "\u21A9", "\\hookleftarrow", !0), l(s, h, f, "\u21AA", "\\hookrightarrow", !0), l(s, h, f, "\u2198", "\\searrow", !0), l(s, h, f, "\u21BC", "\\leftharpoonup", !0), l(s, h, f, "\u21C0", "\\rightharpoonup", !0), l(s, h, f, "\u2199", "\\swarrow", !0), l(s, h, f, "\u21BD", "\\leftharpoondown", !0), l(s, h, f, "\u21C1", "\\rightharpoondown", !0), l(s, h, f, "\u2196", "\\nwarrow", !0), l(s, h, f, "\u21CC", "\\rightleftharpoons", !0), l(s, d, f, "\u226E", "\\nless", !0), l(s, d, f, "\uE010", "\\@nleqslant"), l(s, d, f, "\uE011", "\\@nleqq"), l(s, d, f, "\u2A87", "\\lneq", !0), l(s, d, f, "\u2268", "\\lneqq", !0), l(s, d, f, "\uE00C", "\\@lvertneqq"), l(s, d, f, "\u22E6", "\\lnsim", !0), l(s, d, f, "\u2A89", "\\lnapprox", !0), l(s, d, f, "\u2280", "\\nprec", !0), l(s, d, f, "\u22E0", "\\npreceq", !0), l(s, d, f, "\u22E8", "\\precnsim", !0), l(s, d, f, "\u2AB9", "\\precnapprox", !0), l(s, d, f, "\u2241", "\\nsim", !0), l(s, d, f, "\uE006", "\\@nshortmid"), l(s, d, f, "\u2224", "\\nmid", !0), l(s, d, f, "\u22AC", "\\nvdash", !0), l(s, d, f, "\u22AD", "\\nvDash", !0), l(s, d, f, "\u22EA", "\\ntriangleleft"), l(s, d, f, "\u22EC", "\\ntrianglelefteq", !0), l(s, d, f, "\u228A", "\\subsetneq", !0), l(s, d, f, "\uE01A", "\\@varsubsetneq"), l(s, d, f, "\u2ACB", "\\subsetneqq", !0), l(s, d, f, "\uE017", "\\@varsubsetneqq"), l(s, d, f, "\u226F", "\\ngtr", !0), l(s, d, f, "\uE00F", "\\@ngeqslant"), l(s, d, f, "\uE00E", "\\@ngeqq"), l(s, d, f, "\u2A88", "\\gneq", !0), l(s, d, f, "\u2269", "\\gneqq", !0), l(s, d, f, "\uE00D", "\\@gvertneqq"), l(s, d, f, "\u22E7", "\\gnsim", !0), l(s, d, f, "\u2A8A", "\\gnapprox", !0), l(s, d, f, "\u2281", "\\nsucc", !0), l(s, d, f, "\u22E1", "\\nsucceq", !0), l(s, d, f, "\u22E9", "\\succnsim", !0), l(s, d, f, "\u2ABA", "\\succnapprox", !0), l(s, d, f, "\u2246", "\\ncong", !0), l(s, d, f, "\uE007", "\\@nshortparallel"), l(s, d, f, "\u2226", "\\nparallel", !0), l(s, d, f, "\u22AF", "\\nVDash", !0), l(s, d, f, "\u22EB", "\\ntriangleright"), l(s, d, f, "\u22ED", "\\ntrianglerighteq", !0), l(s, d, f, "\uE018", "\\@nsupseteqq"), l(s, d, f, "\u228B", "\\supsetneq", !0), l(s, d, f, "\uE01B", "\\@varsupsetneq"), l(s, d, f, "\u2ACC", "\\supsetneqq", !0), l(s, d, f, "\uE019", "\\@varsupsetneqq"), l(s, d, f, "\u22AE", "\\nVdash", !0), l(s, d, f, "\u2AB5", "\\precneqq", !0), l(s, d, f, "\u2AB6", "\\succneqq", !0), l(s, d, f, "\uE016", "\\@nsubseteqq"), l(s, d, E, "\u22B4", "\\unlhd"), l(s, d, E, "\u22B5", "\\unrhd"), l(s, d, f, "\u219A", "\\nleftarrow", !0), l(s, d, f, "\u219B", "\\nrightarrow", !0), l(s, d, f, "\u21CD", "\\nLeftarrow", !0), l(s, d, f, "\u21CF", "\\nRightarrow", !0), l(s, d, f, "\u21AE", "\\nleftrightarrow", !0), l(s, d, f, "\u21CE", "\\nLeftrightarrow", !0), l(s, d, f, "\u25B3", "\\vartriangle"), l(s, d, g, "\u210F", "\\hslash"), l(s, d, g, "\u25BD", "\\triangledown"), l(s, d, g, "\u25CA", "\\lozenge"), l(s, d, g, "\u24C8", "\\circledS"), l(s, d, g, "\xAE", "\\circledR"), l(k, d, g, "\xAE", "\\circledR"), l(s, d, g, "\u2221", "\\measuredangle", !0), l(s, d, g, "\u2204", "\\nexists"), l(s, d, g, "\u2127", "\\mho"), l(s, d, g, "\u2132", "\\Finv", !0), l(s, d, g, "\u2141", "\\Game", !0), l(s, d, g, "\u2035", "\\backprime"), l(s, d, g, "\u25B2", "\\blacktriangle"), l(s, d, g, "\u25BC", "\\blacktriangledown"), l(s, d, g, "\u25A0", "\\blacksquare"), l(s, d, g, "\u29EB", "\\blacklozenge"), l(s, d, g, "\u2605", "\\bigstar"), l(s, d, g, "\u2222", "\\sphericalangle", !0), l(s, d, g, "\u2201", "\\complement", !0), l(s, d, g, "\xF0", "\\eth", !0), l(k, h, g, "\xF0", "\xF0"), l(s, d, g, "\u2571", "\\diagup"), l(s, d, g, "\u2572", "\\diagdown"), l(s, d, g, "\u25A1", "\\square"), l(s, d, g, "\u25A1", "\\Box"), l(s, d, g, "\u25CA", "\\Diamond"), l(s, d, g, "\xA5", "\\yen", !0), l(k, d, g, "\xA5", "\\yen", !0), l(s, d, g, "\u2713", "\\checkmark", !0), l(k, d, g, "\u2713", "\\checkmark"), l(s, d, g, "\u2136", "\\beth", !0), l(s, d, g, "\u2138", "\\daleth", !0), l(s, d, g, "\u2137", "\\gimel", !0), l(s, d, g, "\u03DD", "\\digamma", !0), l(s, d, g, "\u03F0", "\\varkappa"), l(s, d, v0, "\u250C", "\\@ulcorner", !0), l(s, d, o0, "\u2510", "\\@urcorner", !0), l(s, d, v0, "\u2514", "\\@llcorner", !0), l(s, d, o0, "\u2518", "\\@lrcorner", !0), l(s, d, f, "\u2266", "\\leqq", !0), l(s, d, f, "\u2A7D", "\\leqslant", !0), l(s, d, f, "\u2A95", "\\eqslantless", !0), l(s, d, f, "\u2272", "\\lesssim", !0), l(s, d, f, "\u2A85", "\\lessapprox", !0), l(s, d, f, "\u224A", "\\approxeq", !0), l(s, d, E, "\u22D6", "\\lessdot"), l(s, d, f, "\u22D8", "\\lll", !0), l(s, d, f, "\u2276", "\\lessgtr", !0), l(s, d, f, "\u22DA", "\\lesseqgtr", !0), l(s, d, f, "\u2A8B", "\\lesseqqgtr", !0), l(s, d, f, "\u2251", "\\doteqdot"), l(s, d, f, "\u2253", "\\risingdotseq", !0), l(s, d, f, "\u2252", "\\fallingdotseq", !0), l(s, d, f, "\u223D", "\\backsim", !0), l(s, d, f, "\u22CD", "\\backsimeq", !0), l(s, d, f, "\u2AC5", "\\subseteqq", !0), l(s, d, f, "\u22D0", "\\Subset", !0), l(s, d, f, "\u228F", "\\sqsubset", !0), l(s, d, f, "\u227C", "\\preccurlyeq", !0), l(s, d, f, "\u22DE", "\\curlyeqprec", !0), l(s, d, f, "\u227E", "\\precsim", !0), l(s, d, f, "\u2AB7", "\\precapprox", !0), l(s, d, f, "\u22B2", "\\vartriangleleft"), l(s, d, f, "\u22B4", "\\trianglelefteq"), l(s, d, f, "\u22A8", "\\vDash", !0), l(s, d, f, "\u22AA", "\\Vvdash", !0), l(s, d, f, "\u2323", "\\smallsmile"), l(s, d, f, "\u2322", "\\smallfrown"), l(s, d, f, "\u224F", "\\bumpeq", !0), l(s, d, f, "\u224E", "\\Bumpeq", !0), l(s, d, f, "\u2267", "\\geqq", !0), l(s, d, f, "\u2A7E", "\\geqslant", !0), l(s, d, f, "\u2A96", "\\eqslantgtr", !0), l(s, d, f, "\u2273", "\\gtrsim", !0), l(s, d, f, "\u2A86", "\\gtrapprox", !0), l(s, d, E, "\u22D7", "\\gtrdot"), l(s, d, f, "\u22D9", "\\ggg", !0), l(s, d, f, "\u2277", "\\gtrless", !0), l(s, d, f, "\u22DB", "\\gtreqless", !0), l(s, d, f, "\u2A8C", "\\gtreqqless", !0), l(s, d, f, "\u2256", "\\eqcirc", !0), l(s, d, f, "\u2257", "\\circeq", !0), l(s, d, f, "\u225C", "\\triangleq", !0), l(s, d, f, "\u223C", "\\thicksim"), l(s, d, f, "\u2248", "\\thickapprox"), l(s, d, f, "\u2AC6", "\\supseteqq", !0), l(s, d, f, "\u22D1", "\\Supset", !0), l(s, d, f, "\u2290", "\\sqsupset", !0), l(s, d, f, "\u227D", "\\succcurlyeq", !0), l(s, d, f, "\u22DF", "\\curlyeqsucc", !0), l(s, d, f, "\u227F", "\\succsim", !0), l(s, d, f, "\u2AB8", "\\succapprox", !0), l(s, d, f, "\u22B3", "\\vartriangleright"), l(s, d, f, "\u22B5", "\\trianglerighteq"), l(s, d, f, "\u22A9", "\\Vdash", !0), l(s, d, f, "\u2223", "\\shortmid"), l(s, d, f, "\u2225", "\\shortparallel"), l(s, d, f, "\u226C", "\\between", !0), l(s, d, f, "\u22D4", "\\pitchfork", !0), l(s, d, f, "\u221D", "\\varpropto"), l(s, d, f, "\u25C0", "\\blacktriangleleft"), l(s, d, f, "\u2234", "\\therefore", !0), l(s, d, f, "\u220D", "\\backepsilon"), l(s, d, f, "\u25B6", "\\blacktriangleright"), l(s, d, f, "\u2235", "\\because", !0), l(s, d, f, "\u22D8", "\\llless"), l(s, d, f, "\u22D9", "\\gggtr"), l(s, d, E, "\u22B2", "\\lhd"), l(s, d, E, "\u22B3", "\\rhd"), l(s, d, f, "\u2242", "\\eqsim", !0), l(s, h, f, "\u22C8", "\\Join"), l(s, d, f, "\u2251", "\\Doteq", !0), l(s, d, E, "\u2214", "\\dotplus", !0), l(s, d, E, "\u2216", "\\smallsetminus"), l(s, d, E, "\u22D2", "\\Cap", !0), l(s, d, E, "\u22D3", "\\Cup", !0), l(s, d, E, "\u2A5E", "\\doublebarwedge", !0), l(s, d, E, "\u229F", "\\boxminus", !0), l(s, d, E, "\u229E", "\\boxplus", !0), l(s, d, E, "\u22C7", "\\divideontimes", !0), l(s, d, E, "\u22C9", "\\ltimes", !0), l(s, d, E, "\u22CA", "\\rtimes", !0), l(s, d, E, "\u22CB", "\\leftthreetimes", !0), l(s, d, E, "\u22CC", "\\rightthreetimes", !0), l(s, d, E, "\u22CF", "\\curlywedge", !0), l(s, d, E, "\u22CE", "\\curlyvee", !0), l(s, d, E, "\u229D", "\\circleddash", !0), l(s, d, E, "\u229B", "\\circledast", !0), l(s, d, E, "\u22C5", "\\centerdot"), l(s, d, E, "\u22BA", "\\intercal", !0), l(s, d, E, "\u22D2", "\\doublecap"), l(s, d, E, "\u22D3", "\\doublecup"), l(s, d, E, "\u22A0", "\\boxtimes", !0), l(s, d, f, "\u21E2", "\\dashrightarrow", !0), l(s, d, f, "\u21E0", "\\dashleftarrow", !0), l(s, d, f, "\u21C7", "\\leftleftarrows", !0), l(s, d, f, "\u21C6", "\\leftrightarrows", !0), l(s, d, f, "\u21DA", "\\Lleftarrow", !0), l(s, d, f, "\u219E", "\\twoheadleftarrow", !0), l(s, d, f, "\u21A2", "\\leftarrowtail", !0), l(s, d, f, "\u21AB", "\\looparrowleft", !0), l(s, d, f, "\u21CB", "\\leftrightharpoons", !0), l(s, d, f, "\u21B6", "\\curvearrowleft", !0), l(s, d, f, "\u21BA", "\\circlearrowleft", !0), l(s, d, f, "\u21B0", "\\Lsh", !0), l(s, d, f, "\u21C8", "\\upuparrows", !0), l(s, d, f, "\u21BF", "\\upharpoonleft", !0), l(s, d, f, "\u21C3", "\\downharpoonleft", !0), l(s, h, f, "\u22B6", "\\origof", !0), l(s, h, f, "\u22B7", "\\imageof", !0), l(s, d, f, "\u22B8", "\\multimap", !0), l(s, d, f, "\u21AD", "\\leftrightsquigarrow", !0), l(s, d, f, "\u21C9", "\\rightrightarrows", !0), l(s, d, f, "\u21C4", "\\rightleftarrows", !0), l(s, d, f, "\u21A0", "\\twoheadrightarrow", !0), l(s, d, f, "\u21A3", "\\rightarrowtail", !0), l(s, d, f, "\u21AC", "\\looparrowright", !0), l(s, d, f, "\u21B7", "\\curvearrowright", !0), l(s, d, f, "\u21BB", "\\circlearrowright", !0), l(s, d, f, "\u21B1", "\\Rsh", !0), l(s, d, f, "\u21CA", "\\downdownarrows", !0), l(s, d, f, "\u21BE", "\\upharpoonright", !0), l(s, d, f, "\u21C2", "\\downharpoonright", !0), l(s, d, f, "\u21DD", "\\rightsquigarrow", !0), l(s, d, f, "\u21DD", "\\leadsto"), l(s, d, f, "\u21DB", "\\Rrightarrow", !0), l(s, d, f, "\u21BE", "\\restriction"), l(s, h, g, "\u2018", "`"), l(s, h, g, "$", "\\$"), l(k, h, g, "$", "\\$"), l(k, h, g, "$", "\\textdollar"), l(s, h, g, "%", "\\%"), l(k, h, g, "%", "\\%"), l(s, h, g, "_", "\\_"), l(k, h, g, "_", "\\_"), l(k, h, g, "_", "\\textunderscore"), l(s, h, g, "\u2220", "\\angle", !0), l(s, h, g, "\u221E", "\\infty", !0), l(s, h, g, "\u2032", "\\prime"), l(s, h, g, "\u25B3", "\\triangle"), l(s, h, g, "\u0393", "\\Gamma", !0), l(s, h, g, "\u0394", "\\Delta", !0), l(s, h, g, "\u0398", "\\Theta", !0), l(s, h, g, "\u039B", "\\Lambda", !0), l(s, h, g, "\u039E", "\\Xi", !0), l(s, h, g, "\u03A0", "\\Pi", !0), l(s, h, g, "\u03A3", "\\Sigma", !0), l(s, h, g, "\u03A5", "\\Upsilon", !0), l(s, h, g, "\u03A6", "\\Phi", !0), l(s, h, g, "\u03A8", "\\Psi", !0), l(s, h, g, "\u03A9", "\\Omega", !0), l(s, h, g, "A", "\u0391"), l(s, h, g, "B", "\u0392"), l(s, h, g, "E", "\u0395"), l(s, h, g, "Z", "\u0396"), l(s, h, g, "H", "\u0397"), l(s, h, g, "I", "\u0399"), l(s, h, g, "K", "\u039A"), l(s, h, g, "M", "\u039C"), l(s, h, g, "N", "\u039D"), l(s, h, g, "O", "\u039F"), l(s, h, g, "P", "\u03A1"), l(s, h, g, "T", "\u03A4"), l(s, h, g, "X", "\u03A7"), l(s, h, g, "\xAC", "\\neg", !0), l(s, h, g, "\xAC", "\\lnot"), l(s, h, g, "\u22A4", "\\top"), l(s, h, g, "\u22A5", "\\bot"), l(s, h, g, "\u2205", "\\emptyset"), l(s, d, g, "\u2205", "\\varnothing"), l(s, h, q, "\u03B1", "\\alpha", !0), l(s, h, q, "\u03B2", "\\beta", !0), l(s, h, q, "\u03B3", "\\gamma", !0), l(s, h, q, "\u03B4", "\\delta", !0), l(s, h, q, "\u03F5", "\\epsilon", !0), l(s, h, q, "\u03B6", "\\zeta", !0), l(s, h, q, "\u03B7", "\\eta", !0), l(s, h, q, "\u03B8", "\\theta", !0), l(s, h, q, "\u03B9", "\\iota", !0), l(s, h, q, "\u03BA", "\\kappa", !0), l(s, h, q, "\u03BB", "\\lambda", !0), l(s, h, q, "\u03BC", "\\mu", !0), l(s, h, q, "\u03BD", "\\nu", !0), l(s, h, q, "\u03BE", "\\xi", !0), l(s, h, q, "\u03BF", "\\omicron", !0), l(s, h, q, "\u03C0", "\\pi", !0), l(s, h, q, "\u03C1", "\\rho", !0), l(s, h, q, "\u03C3", "\\sigma", !0), l(s, h, q, "\u03C4", "\\tau", !0), l(s, h, q, "\u03C5", "\\upsilon", !0), l(s, h, q, "\u03D5", "\\phi", !0), l(s, h, q, "\u03C7", "\\chi", !0), l(s, h, q, "\u03C8", "\\psi", !0), l(s, h, q, "\u03C9", "\\omega", !0), l(s, h, q, "\u03B5", "\\varepsilon", !0), l(s, h, q, "\u03D1", "\\vartheta", !0), l(s, h, q, "\u03D6", "\\varpi", !0), l(s, h, q, "\u03F1", "\\varrho", !0), l(s, h, q, "\u03C2", "\\varsigma", !0), l(s, h, q, "\u03C6", "\\varphi", !0), l(s, h, E, "\u2217", "*", !0), l(s, h, E, "+", "+"), l(s, h, E, "\u2212", "-", !0), l(s, h, E, "\u22C5", "\\cdot", !0), l(s, h, E, "\u2218", "\\circ", !0), l(s, h, E, "\xF7", "\\div", !0), l(s, h, E, "\xB1", "\\pm", !0), l(s, h, E, "\xD7", "\\times", !0), l(s, h, E, "\u2229", "\\cap", !0), l(s, h, E, "\u222A", "\\cup", !0), l(s, h, E, "\u2216", "\\setminus", !0), l(s, h, E, "\u2227", "\\land"), l(s, h, E, "\u2228", "\\lor"), l(s, h, E, "\u2227", "\\wedge", !0), l(s, h, E, "\u2228", "\\vee", !0), l(s, h, g, "\u221A", "\\surd"), l(s, h, v0, "\u27E8", "\\langle", !0), l(s, h, v0, "\u2223", "\\lvert"), l(s, h, v0, "\u2225", "\\lVert"), l(s, h, o0, "?", "?"), l(s, h, o0, "!", "!"), l(s, h, o0, "\u27E9", "\\rangle", !0), l(s, h, o0, "\u2223", "\\rvert"), l(s, h, o0, "\u2225", "\\rVert"), l(s, h, f, "=", "="), l(s, h, f, ":", ":"), l(s, h, f, "\u2248", "\\approx", !0), l(s, h, f, "\u2245", "\\cong", !0), l(s, h, f, "\u2265", "\\ge"), l(s, h, f, "\u2265", "\\geq", !0), l(s, h, f, "\u2190", "\\gets"), l(s, h, f, ">", "\\gt", !0), l(s, h, f, "\u2208", "\\in", !0), l(s, h, f, "\uE020", "\\@not"), l(s, h, f, "\u2282", "\\subset", !0), l(s, h, f, "\u2283", "\\supset", !0), l(s, h, f, "\u2286", "\\subseteq", !0), l(s, h, f, "\u2287", "\\supseteq", !0), l(s, d, f, "\u2288", "\\nsubseteq", !0), l(s, d, f, "\u2289", "\\nsupseteq", !0), l(s, h, f, "\u22A8", "\\models"), l(s, h, f, "\u2190", "\\leftarrow", !0), l(s, h, f, "\u2264", "\\le"), l(s, h, f, "\u2264", "\\leq", !0), l(s, h, f, "<", "\\lt", !0), l(s, h, f, "\u2192", "\\rightarrow", !0), l(s, h, f, "\u2192", "\\to"), l(s, d, f, "\u2271", "\\ngeq", !0), l(s, d, f, "\u2270", "\\nleq", !0), l(s, h, P0, "\xA0", "\\ "), l(s, h, P0, "\xA0", "\\space"), l(s, h, P0, "\xA0", "\\nobreakspace"), l(k, h, P0, "\xA0", "\\ "), l(k, h, P0, "\xA0", " "), l(k, h, P0, "\xA0", "\\space"), l(k, h, P0, "\xA0", "\\nobreakspace"), l(s, h, P0, null, "\\nobreak"), l(s, h, P0, null, "\\allowbreak"), l(s, h, Ze, ",", ","), l(s, h, Ze, ";", ";"), l(s, d, E, "\u22BC", "\\barwedge", !0), l(s, d, E, "\u22BB", "\\veebar", !0), l(s, h, E, "\u2299", "\\odot", !0), l(s, h, E, "\u2295", "\\oplus", !0), l(s, h, E, "\u2297", "\\otimes", !0), l(s, h, g, "\u2202", "\\partial", !0), l(s, h, E, "\u2298", "\\oslash", !0), l(s, d, E, "\u229A", "\\circledcirc", !0), l(s, d, E, "\u22A1", "\\boxdot", !0), l(s, h, E, "\u25B3", "\\bigtriangleup"), l(s, h, E, "\u25BD", "\\bigtriangledown"), l(s, h, E, "\u2020", "\\dagger"), l(s, h, E, "\u22C4", "\\diamond"), l(s, h, E, "\u22C6", "\\star"), l(s, h, E, "\u25C3", "\\triangleleft"), l(s, h, E, "\u25B9", "\\triangleright"), l(s, h, v0, "{", "\\{"), l(k, h, g, "{", "\\{"), l(k, h, g, "{", "\\textbraceleft"), l(s, h, o0, "}", "\\}"), l(k, h, g, "}", "\\}"), l(k, h, g, "}", "\\textbraceright"), l(s, h, v0, "{", "\\lbrace"), l(s, h, o0, "}", "\\rbrace"), l(s, h, v0, "[", "\\lbrack", !0), l(k, h, g, "[", "\\lbrack", !0), l(s, h, o0, "]", "\\rbrack", !0), l(k, h, g, "]", "\\rbrack", !0), l(s, h, v0, "(", "\\lparen", !0), l(s, h, o0, ")", "\\rparen", !0), l(k, h, g, "<", "\\textless", !0), l(k, h, g, ">", "\\textgreater", !0), l(s, h, v0, "\u230A", "\\lfloor", !0), l(s, h, o0, "\u230B", "\\rfloor", !0), l(s, h, v0, "\u2308", "\\lceil", !0), l(s, h, o0, "\u2309", "\\rceil", !0), l(s, h, g, "\\", "\\backslash"), l(s, h, g, "\u2223", "|"), l(s, h, g, "\u2223", "\\vert"), l(k, h, g, "|", "\\textbar", !0), l(s, h, g, "\u2225", "\\|"), l(s, h, g, "\u2225", "\\Vert"), l(k, h, g, "\u2225", "\\textbardbl"), l(k, h, g, "~", "\\textasciitilde"), l(k, h, g, "\\", "\\textbackslash"), l(k, h, g, "^", "\\textasciicircum"), l(s, h, f, "\u2191", "\\uparrow", !0), l(s, h, f, "\u21D1", "\\Uparrow", !0), l(s, h, f, "\u2193", "\\downarrow", !0), l(s, h, f, "\u21D3", "\\Downarrow", !0), l(s, h, f, "\u2195", "\\updownarrow", !0), l(s, h, f, "\u21D5", "\\Updownarrow", !0), l(s, h, r0, "\u2210", "\\coprod"), l(s, h, r0, "\u22C1", "\\bigvee"), l(s, h, r0, "\u22C0", "\\bigwedge"), l(s, h, r0, "\u2A04", "\\biguplus"), l(s, h, r0, "\u22C2", "\\bigcap"), l(s, h, r0, "\u22C3", "\\bigcup"), l(s, h, r0, "\u222B", "\\int"), l(s, h, r0, "\u222B", "\\intop"), l(s, h, r0, "\u222C", "\\iint"), l(s, h, r0, "\u222D", "\\iiint"), l(s, h, r0, "\u220F", "\\prod"), l(s, h, r0, "\u2211", "\\sum"), l(s, h, r0, "\u2A02", "\\bigotimes"), l(s, h, r0, "\u2A01", "\\bigoplus"), l(s, h, r0, "\u2A00", "\\bigodot"), l(s, h, r0, "\u222E", "\\oint"), l(s, h, r0, "\u222F", "\\oiint"), l(s, h, r0, "\u2230", "\\oiiint"), l(s, h, r0, "\u2A06", "\\bigsqcup"), l(s, h, r0, "\u222B", "\\smallint"), l(k, h, we, "\u2026", "\\textellipsis"), l(s, h, we, "\u2026", "\\mathellipsis"), l(k, h, we, "\u2026", "\\ldots", !0), l(s, h, we, "\u2026", "\\ldots", !0), l(s, h, we, "\u22EF", "\\@cdots", !0), l(s, h, we, "\u22F1", "\\ddots", !0), l(s, h, g, "\u22EE", "\\varvdots"), l(s, h, Y, "\u02CA", "\\a"), l(s, h, Y, "\u02CB", "\\grave"), l(s, h, Y, "\xA8", "\\ddot"), l(s, h, Y, "~", "\\tilde"), l(s, h, Y, "\u02C9", "\\bar"), l(s, h, Y, "\u02D8", "\\breve"), l(s, h, Y, "\u02C7", "\\check"), l(s, h, Y, "^", "\\hat"), l(s, h, Y, "\u20D7", "\\vec"), l(s, h, Y, "\u02D9", "\\dot"), l(s, h, Y, "\u02DA", "\\mathring"), l(s, h, q, "\uE131", "\\@imath"), l(s, h, q, "\uE237", "\\@jmath"), l(s, h, g, "\u0131", "\u0131"), l(s, h, g, "\u0237", "\u0237"), l(k, h, g, "\u0131", "\\i", !0), l(k, h, g, "\u0237", "\\j", !0), l(k, h, g, "\xDF", "\\ss", !0), l(k, h, g, "\xE6", "\\ae", !0), l(k, h, g, "\u0153", "\\oe", !0), l(k, h, g, "\xF8", "\\o", !0), l(k, h, g, "\xC6", "\\AE", !0), l(k, h, g, "\u0152", "\\OE", !0), l(k, h, g, "\xD8", "\\O", !0), l(k, h, Y, "\u02CA", "\\'"), l(k, h, Y, "\u02CB", "\\`"), l(k, h, Y, "\u02C6", "\\^"), l(k, h, Y, "\u02DC", "\\~"), l(k, h, Y, "\u02C9", "\\="), l(k, h, Y, "\u02D8", "\\u"), l(k, h, Y, "\u02D9", "\\."), l(k, h, Y, "\xB8", "\\c"), l(k, h, Y, "\u02DA", "\\r"), l(k, h, Y, "\u02C7", "\\v"), l(k, h, Y, "\xA8", '\\"'), l(k, h, Y, "\u02DD", "\\H"), l(k, h, Y, "\u25EF", "\\textcircled");
	var Qr = {
		"--": !0,
		"---": !0,
		"``": !0,
		"''": !0
	};
	l(k, h, g, "\u2013", "--", !0), l(k, h, g, "\u2013", "\\textendash"), l(k, h, g, "\u2014", "---", !0), l(k, h, g, "\u2014", "\\textemdash"), l(k, h, g, "\u2018", "`", !0), l(k, h, g, "\u2018", "\\textquoteleft"), l(k, h, g, "\u2019", "'", !0), l(k, h, g, "\u2019", "\\textquoteright"), l(k, h, g, "\u201C", "``", !0), l(k, h, g, "\u201C", "\\textquotedblleft"), l(k, h, g, "\u201D", "''", !0), l(k, h, g, "\u201D", "\\textquotedblright"), l(s, h, g, "\xB0", "\\degree", !0), l(k, h, g, "\xB0", "\\degree"), l(k, h, g, "\xB0", "\\textdegree", !0), l(s, h, g, "\xA3", "\\pounds"), l(s, h, g, "\xA3", "\\mathsterling", !0), l(k, h, g, "\xA3", "\\pounds"), l(k, h, g, "\xA3", "\\textsterling", !0), l(s, d, g, "\u2720", "\\maltese"), l(k, d, g, "\u2720", "\\maltese");
	for (var ea = '0123456789/@."', It = 0; It < ea.length; It++) {
		var ta = ea.charAt(It);
		l(s, h, g, ta, ta)
	}
	for (var ra = '0123456789!@*()-=+";:?/.,', Ot = 0; Ot < ra.length; Ot++) {
		var aa = ra.charAt(Ot);
		l(k, h, g, aa, aa)
	}
	for (var Ke = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", Lt = 0; Lt < Ke.length; Lt++) {
		var Je = Ke.charAt(Lt);
		l(s, h, q, Je, Je), l(k, h, g, Je, Je)
	}
	l(s, d, g, "C", "\u2102"), l(k, d, g, "C", "\u2102"), l(s, d, g, "H", "\u210D"), l(k, d, g, "H", "\u210D"), l(s, d, g, "N", "\u2115"), l(k, d, g, "N", "\u2115"), l(s, d, g, "P", "\u2119"), l(k, d, g, "P", "\u2119"), l(s, d, g, "Q", "\u211A"), l(k, d, g, "Q", "\u211A"), l(s, d, g, "R", "\u211D"), l(k, d, g, "R", "\u211D"), l(s, d, g, "Z", "\u2124"), l(k, d, g, "Z", "\u2124"), l(s, h, q, "h", "\u210E"), l(k, h, q, "h", "\u210E");
	for (var $ = "", u0 = 0; u0 < Ke.length; u0++) {
		var _ = Ke.charAt(u0);
		$ = String.fromCharCode(55349, 56320 + u0), l(s, h, q, _, $), l(k, h, g, _, $), $ = String.fromCharCode(55349, 56372 + u0), l(s, h, q, _, $), l(k, h, g, _, $), $ = String.fromCharCode(55349, 56424 + u0), l(s, h, q, _, $), l(k, h, g, _, $), $ = String.fromCharCode(55349, 56580 + u0), l(s, h, q, _, $), l(k, h, g, _, $), $ = String.fromCharCode(55349, 56684 + u0), l(s, h, q, _, $), l(k, h, g, _, $), $ = String.fromCharCode(55349, 56736 + u0), l(s, h, q, _, $), l(k, h, g, _, $), $ = String.fromCharCode(55349, 56788 + u0), l(s, h, q, _, $), l(k, h, g, _, $), $ = String.fromCharCode(55349, 56840 + u0), l(s, h, q, _, $), l(k, h, g, _, $), $ = String.fromCharCode(55349, 56944 + u0), l(s, h, q, _, $), l(k, h, g, _, $), u0 < 26 && ($ = String.fromCharCode(55349, 56632 + u0), l(s, h, q, _, $), l(k, h, g, _, $), $ = String.fromCharCode(55349, 56476 + u0), l(s, h, q, _, $), l(k, h, g, _, $))
	}
	$ = String.fromCharCode(55349, 56668), l(s, h, q, "k", $), l(k, h, g, "k", $);
	for (var se = 0; se < 10; se++) {
		var K0 = se.toString();
		$ = String.fromCharCode(55349, 57294 + se), l(s, h, q, K0, $), l(k, h, g, K0, $), $ = String.fromCharCode(55349, 57314 + se), l(s, h, q, K0, $), l(k, h, g, K0, $), $ = String.fromCharCode(55349, 57324 + se), l(s, h, q, K0, $), l(k, h, g, K0, $), $ = String.fromCharCode(55349, 57334 + se), l(s, h, q, K0, $), l(k, h, g, K0, $)
	}
	for (var Ft = "\xD0\xDE\xFE", Ht = 0; Ht < Ft.length; Ht++) {
		var _e = Ft.charAt(Ht);
		l(s, h, q, _e, _e), l(k, h, g, _e, _e)
	}
	var Qe = [
			["mathbf", "textbf", "Main-Bold"],
			["mathbf", "textbf", "Main-Bold"],
			["mathnormal", "textit", "Math-Italic"],
			["mathnormal", "textit", "Math-Italic"],
			["boldsymbol", "boldsymbol", "Main-BoldItalic"],
			["boldsymbol", "boldsymbol", "Main-BoldItalic"],
			["mathscr", "textscr", "Script-Regular"],
			["", "", ""],
			["", "", ""],
			["", "", ""],
			["mathfrak", "textfrak", "Fraktur-Regular"],
			["mathfrak", "textfrak", "Fraktur-Regular"],
			["mathbb", "textbb", "AMS-Regular"],
			["mathbb", "textbb", "AMS-Regular"],
			["mathboldfrak", "textboldfrak", "Fraktur-Regular"],
			["mathboldfrak", "textboldfrak", "Fraktur-Regular"],
			["mathsf", "textsf", "SansSerif-Regular"],
			["mathsf", "textsf", "SansSerif-Regular"],
			["mathboldsf", "textboldsf", "SansSerif-Bold"],
			["mathboldsf", "textboldsf", "SansSerif-Bold"],
			["mathitsf", "textitsf", "SansSerif-Italic"],
			["mathitsf", "textitsf", "SansSerif-Italic"],
			["", "", ""],
			["", "", ""],
			["mathtt", "texttt", "Typewriter-Regular"],
			["mathtt", "texttt", "Typewriter-Regular"]
		],
		na = [
			["mathbf", "textbf", "Main-Bold"],
			["", "", ""],
			["mathsf", "textsf", "SansSerif-Regular"],
			["mathboldsf", "textboldsf", "SansSerif-Bold"],
			["mathtt", "texttt", "Typewriter-Regular"]
		],
		Ln = function(e, t) {
			var a = e.charCodeAt(0),
				n = e.charCodeAt(1),
				i = (a - 55296) * 1024 + (n - 56320) + 65536,
				o = t === "math" ? 0 : 1;
			if (119808 <= i && i < 120484) {
				var u = Math.floor((i - 119808) / 26);
				return [Qe[u][2], Qe[u][o]]
			} else if (120782 <= i && i <= 120831) {
				var m = Math.floor((i - 120782) / 10);
				return [na[m][2], na[m][o]]
			} else {
				if (i === 120485 || i === 120486) return [Qe[0][2], Qe[0][o]];
				if (120486 < i && i < 120782) return ["", ""];
				throw new M("Unsupported character: " + e)
			}
		},
		et = function(e, t, a) {
			return W[a][e] && W[a][e].replace && (e = W[a][e].replace), {
				value: e,
				metrics: Dt(e, t, a)
			}
		},
		B0 = function(e, t, a, n, i) {
			var o = et(e, t, a),
				u = o.metrics;
			e = o.value;
			var m;
			if (u) {
				var p = u.italic;
				(a === "text" || n && n.font === "mathit") && (p = 0), m = new k0(e, u.height, u.depth, p, u.skew, u.width, i)
			} else typeof console < "u" && console.warn("No character metrics " + ("for '" + e + "' in style '" + t + "' and mode '" + a + "'")), m = new k0(e, 0, 0, 0, 0, 0, i);
			if (n) {
				m.maxFontSize = n.sizeMultiplier, n.style.isTight() && m.classes.push("mtight");
				var v = n.getColor();
				v && (m.style.color = v)
			}
			return m
		},
		Fn = function(e, t, a, n) {
			return n === void 0 && (n = []), a.font === "boldsymbol" && et(e, "Main-Bold", t).metrics ? B0(e, "Main-Bold", t, a, n.concat(["mathbf"])) : e === "\\" || W[t][e].font === "main" ? B0(e, "Main-Regular", t, a, n) : B0(e, "AMS-Regular", t, a, n.concat(["amsrm"]))
		},
		Hn = function(e, t, a, n, i) {
			return i !== "textord" && et(e, "Math-BoldItalic", t).metrics ? {
				fontName: "Math-BoldItalic",
				fontClass: "boldsymbol"
			} : {
				fontName: "Main-Bold",
				fontClass: "mathbf"
			}
		},
		Pn = function(e, t, a) {
			var n = e.mode,
				i = e.text,
				o = ["mord"],
				u = n === "math" || n === "text" && t.font,
				m = u ? t.font : t.fontFamily,
				p = "",
				v = "";
			if (i.charCodeAt(0) === 55349 && ([p, v] = Ln(i, n)), p.length > 0) return B0(i, p, n, t, o.concat(v));
			if (m) {
				var b, x;
				if (m === "boldsymbol") {
					var w = Hn(i, n, t, o, a);
					b = w.fontName, x = [w.fontClass]
				} else u ? (b = sa[m].fontName, x = [m]) : (b = tt(m, t.fontWeight, t.fontShape), x = [m, t.fontWeight, t.fontShape]);
				if (et(i, b, n).metrics) return B0(i, b, n, t, o.concat(x));
				if (Qr.hasOwnProperty(i) && b.slice(0, 10) === "Typewriter") {
					for (var z = [], T = 0; T < i.length; T++) z.push(B0(i[T], b, n, t, o.concat(x)));
					return la(z)
				}
			}
			if (a === "mathord") return B0(i, "Math-Italic", n, t, o.concat(["mathnormal"]));
			if (a === "textord") {
				var C = W[n][i] && W[n][i].font;
				if (C === "ams") {
					var D = tt("amsrm", t.fontWeight, t.fontShape);
					return B0(i, D, n, t, o.concat("amsrm", t.fontWeight, t.fontShape))
				} else if (C === "main" || !C) {
					var I = tt("textrm", t.fontWeight, t.fontShape);
					return B0(i, I, n, t, o.concat(t.fontWeight, t.fontShape))
				} else {
					var O = tt(C, t.fontWeight, t.fontShape);
					return B0(i, O, n, t, o.concat(O, t.fontWeight, t.fontShape))
				}
			} else throw new Error("unexpected type: " + a + " in makeOrd")
		},
		Gn = (r, e) => {
			if (X0(r.classes) !== X0(e.classes) || r.skew !== e.skew || r.maxFontSize !== e.maxFontSize) return !1;
			if (r.classes.length === 1) {
				var t = r.classes[0];
				if (t === "mbin" || t === "mord") return !1
			}
			for (var a in r.style)
				if (r.style.hasOwnProperty(a) && r.style[a] !== e.style[a]) return !1;
			for (var n in e.style)
				if (e.style.hasOwnProperty(n) && r.style[n] !== e.style[n]) return !1;
			return !0
		},
		Vn = r => {
			for (var e = 0; e < r.length - 1; e++) {
				var t = r[e],
					a = r[e + 1];
				t instanceof k0 && a instanceof k0 && Gn(t, a) && (t.text += a.text, t.height = Math.max(t.height, a.height), t.depth = Math.max(t.depth, a.depth), t.italic = a.italic, r.splice(e + 1, 1), e--)
			}
			return r
		},
		Pt = function(e) {
			for (var t = 0, a = 0, n = 0, i = 0; i < e.children.length; i++) {
				var o = e.children[i];
				o.height > t && (t = o.height), o.depth > a && (a = o.depth), o.maxFontSize > n && (n = o.maxFontSize)
			}
			e.height = t, e.depth = a, e.maxFontSize = n
		},
		m0 = function(e, t, a, n) {
			var i = new Re(e, t, a, n);
			return Pt(i), i
		},
		ia = (r, e, t, a) => new Re(r, e, t, a),
		jn = function(e, t, a) {
			var n = m0([e], [], t);
			return n.height = Math.max(a || t.fontMetrics().defaultRuleThickness, t.minRuleThickness), n.style.borderBottomWidth = A(n.height), n.maxFontSize = 1, n
		},
		Un = function(e, t, a, n) {
			var i = new Rt(e, t, a, n);
			return Pt(i), i
		},
		la = function(e) {
			var t = new qe(e);
			return Pt(t), t
		},
		Wn = function(e, t) {
			return e instanceof qe ? m0([], [e], t) : e
		},
		Yn = function(e) {
			if (e.positionType === "individualShift") {
				for (var t = e.children, a = [t[0]], n = -t[0].shift - t[0].elem.depth, i = n, o = 1; o < t.length; o++) {
					var u = -t[o].shift - i - t[o].elem.depth,
						m = u - (t[o - 1].elem.height + t[o - 1].elem.depth);
					i = i + u, a.push({
						type: "kern",
						size: m
					}), a.push(t[o])
				}
				return {
					children: a,
					depth: n
				}
			}
			var p;
			if (e.positionType === "top") {
				for (var v = e.positionData, b = 0; b < e.children.length; b++) {
					var x = e.children[b];
					v -= x.type === "kern" ? x.size : x.elem.height + x.elem.depth
				}
				p = v
			} else if (e.positionType === "bottom") p = -e.positionData;
			else {
				var w = e.children[0];
				if (w.type !== "elem") throw new Error('First child must have type "elem".');
				if (e.positionType === "shift") p = -w.elem.depth - e.positionData;
				else if (e.positionType === "firstBaseline") p = -w.elem.depth;
				else throw new Error("Invalid positionType " + e.positionType + ".")
			}
			return {
				children: e.children,
				depth: p
			}
		},
		Xn = function(e, t) {
			for (var {
					children: a,
					depth: n
				} = Yn(e), i = 0, o = 0; o < a.length; o++) {
				var u = a[o];
				if (u.type === "elem") {
					var m = u.elem;
					i = Math.max(i, m.maxFontSize, m.height)
				}
			}
			i += 2;
			var p = m0(["pstrut"], []);
			p.style.height = A(i);
			for (var v = [], b = n, x = n, w = n, z = 0; z < a.length; z++) {
				var T = a[z];
				if (T.type === "kern") w += T.size;
				else {
					var C = T.elem,
						D = T.wrapperClasses || [],
						I = T.wrapperStyle || {},
						O = m0(D, [p, C], void 0, I);
					O.style.top = A(-i - w - C.depth), T.marginLeft && (O.style.marginLeft = T.marginLeft), T.marginRight && (O.style.marginRight = T.marginRight), v.push(O), w += C.height + C.depth
				}
				b = Math.min(b, w), x = Math.max(x, w)
			}
			var G = m0(["vlist"], v);
			G.style.height = A(x);
			var F;
			if (b < 0) {
				var V = m0([], []),
					P = m0(["vlist"], [V]);
				P.style.height = A(-b);
				var J = m0(["vlist-s"], [new k0("\u200B")]);
				F = [m0(["vlist-r"], [G, J]), m0(["vlist-r"], [P])]
			} else F = [m0(["vlist-r"], [G])];
			var j = m0(["vlist-t"], F);
			return F.length === 2 && j.classes.push("vlist-t2"), j.height = x, j.depth = -b, j
		},
		Zn = (r, e) => {
			var t = m0(["mspace"], [], e),
				a = Z(r, e);
			return t.style.marginRight = A(a), t
		},
		tt = function(e, t, a) {
			var n = "";
			switch (e) {
				case "amsrm":
					n = "AMS";
					break;
				case "textrm":
					n = "Main";
					break;
				case "textsf":
					n = "SansSerif";
					break;
				case "texttt":
					n = "Typewriter";
					break;
				default:
					n = e
			}
			var i;
			return t === "textbf" && a === "textit" ? i = "BoldItalic" : t === "textbf" ? i = "Bold" : t === "textit" ? i = "Italic" : i = "Regular", n + "-" + i
		},
		sa = {
			mathbf: {
				variant: "bold",
				fontName: "Main-Bold"
			},
			mathrm: {
				variant: "normal",
				fontName: "Main-Regular"
			},
			textit: {
				variant: "italic",
				fontName: "Main-Italic"
			},
			mathit: {
				variant: "italic",
				fontName: "Main-Italic"
			},
			mathnormal: {
				variant: "italic",
				fontName: "Math-Italic"
			},
			mathbb: {
				variant: "double-struck",
				fontName: "AMS-Regular"
			},
			mathcal: {
				variant: "script",
				fontName: "Caligraphic-Regular"
			},
			mathfrak: {
				variant: "fraktur",
				fontName: "Fraktur-Regular"
			},
			mathscr: {
				variant: "script",
				fontName: "Script-Regular"
			},
			mathsf: {
				variant: "sans-serif",
				fontName: "SansSerif-Regular"
			},
			mathtt: {
				variant: "monospace",
				fontName: "Typewriter-Regular"
			}
		},
		oa = {
			vec: ["vec", .471, .714],
			oiintSize1: ["oiintSize1", .957, .499],
			oiintSize2: ["oiintSize2", 1.472, .659],
			oiiintSize1: ["oiiintSize1", 1.304, .499],
			oiiintSize2: ["oiiintSize2", 1.98, .659]
		},
		Kn = function(e, t) {
			var [a, n, i] = oa[e], o = new Z0(a), u = new H0([o], {
				width: A(n),
				height: A(i),
				style: "width:" + A(n),
				viewBox: "0 0 " + 1e3 * n + " " + 1e3 * i,
				preserveAspectRatio: "xMinYMin"
			}), m = ia(["overlay"], [u], t);
			return m.height = i, m.style.height = A(i), m.style.width = A(n), m
		},
		y = {
			fontMap: sa,
			makeSymbol: B0,
			mathsym: Fn,
			makeSpan: m0,
			makeSvgSpan: ia,
			makeLineSpan: jn,
			makeAnchor: Un,
			makeFragment: la,
			wrapFragment: Wn,
			makeVList: Xn,
			makeOrd: Pn,
			makeGlue: Zn,
			staticSvg: Kn,
			svgData: oa,
			tryCombineChars: Vn
		},
		K = {
			number: 3,
			unit: "mu"
		},
		oe = {
			number: 4,
			unit: "mu"
		},
		G0 = {
			number: 5,
			unit: "mu"
		},
		Jn = {
			mord: {
				mop: K,
				mbin: oe,
				mrel: G0,
				minner: K
			},
			mop: {
				mord: K,
				mop: K,
				mrel: G0,
				minner: K
			},
			mbin: {
				mord: oe,
				mop: oe,
				mopen: oe,
				minner: oe
			},
			mrel: {
				mord: G0,
				mop: G0,
				mopen: G0,
				minner: G0
			},
			mopen: {},
			mclose: {
				mop: K,
				mbin: oe,
				mrel: G0,
				minner: K
			},
			mpunct: {
				mord: K,
				mop: K,
				mrel: G0,
				mopen: K,
				mclose: K,
				mpunct: K,
				minner: K
			},
			minner: {
				mord: K,
				mop: K,
				mbin: oe,
				mrel: G0,
				mopen: K,
				mpunct: K,
				minner: K
			}
		},
		_n = {
			mord: {
				mop: K
			},
			mop: {
				mord: K,
				mop: K
			},
			mbin: {},
			mrel: {},
			mopen: {},
			mclose: {
				mop: K
			},
			mpunct: {},
			minner: {
				mop: K
			}
		},
		ua = {},
		rt = {},
		at = {};

	function B(r) {
		for (var {
				type: e,
				names: t,
				props: a,
				handler: n,
				htmlBuilder: i,
				mathmlBuilder: o
			} = r, u = {
				type: e,
				numArgs: a.numArgs,
				argTypes: a.argTypes,
				allowedInArgument: !!a.allowedInArgument,
				allowedInText: !!a.allowedInText,
				allowedInMath: a.allowedInMath === void 0 ? !0 : a.allowedInMath,
				numOptionalArgs: a.numOptionalArgs || 0,
				infix: !!a.infix,
				primitive: !!a.primitive,
				handler: n
			}, m = 0; m < t.length; ++m) ua[t[m]] = u;
		e && (i && (rt[e] = i), o && (at[e] = o))
	}

	function ue(r) {
		var {
			type: e,
			htmlBuilder: t,
			mathmlBuilder: a
		} = r;
		B({
			type: e,
			names: [],
			props: {
				numArgs: 0
			},
			handler() {
				throw new Error("Should never be called.")
			},
			htmlBuilder: t,
			mathmlBuilder: a
		})
	}
	var nt = function(e) {
			return e.type === "ordgroup" && e.body.length === 1 ? e.body[0] : e
		},
		e0 = function(e) {
			return e.type === "ordgroup" ? e.body : [e]
		},
		V0 = y.makeSpan,
		Qn = ["leftmost", "mbin", "mopen", "mrel", "mop", "mpunct"],
		ei = ["rightmost", "mrel", "mclose", "mpunct"],
		ti = {
			display: N.DISPLAY,
			text: N.TEXT,
			script: N.SCRIPT,
			scriptscript: N.SCRIPTSCRIPT
		},
		ri = {
			mord: "mord",
			mop: "mop",
			mbin: "mbin",
			mrel: "mrel",
			mopen: "mopen",
			mclose: "mclose",
			mpunct: "mpunct",
			minner: "minner"
		},
		a0 = function(e, t, a, n) {
			n === void 0 && (n = [null, null]);
			for (var i = [], o = 0; o < e.length; o++) {
				var u = H(e[o], t);
				if (u instanceof qe) {
					var m = u.children;
					i.push(...m)
				} else i.push(u)
			}
			if (y.tryCombineChars(i), !a) return i;
			var p = t;
			if (e.length === 1) {
				var v = e[0];
				v.type === "sizing" ? p = t.havingSize(v.size) : v.type === "styling" && (p = t.havingStyle(ti[v.style]))
			}
			var b = V0([n[0] || "leftmost"], [], t),
				x = V0([n[1] || "rightmost"], [], t),
				w = a === "root";
			return ha(i, (z, T) => {
				var C = T.classes[0],
					D = z.classes[0];
				C === "mbin" && R.contains(ei, D) ? T.classes[0] = "mord" : D === "mbin" && R.contains(Qn, C) && (z.classes[0] = "mord")
			}, {
				node: b
			}, x, w), ha(i, (z, T) => {
				var C = Gt(T),
					D = Gt(z),
					I = C && D ? z.hasClass("mtight") ? _n[C][D] : Jn[C][D] : null;
				if (I) return y.makeGlue(I, p)
			}, {
				node: b
			}, x, w), i
		},
		ha = function r(e, t, a, n, i) {
			n && e.push(n);
			for (var o = 0; o < e.length; o++) {
				var u = e[o],
					m = ma(u);
				if (m) {
					r(m.children, t, a, null, i);
					continue
				}
				var p = !u.hasClass("mspace");
				if (p) {
					var v = t(u, a.node);
					v && (a.insertAfter ? a.insertAfter(v) : (e.unshift(v), o++))
				}
				p ? a.node = u : i && u.hasClass("newline") && (a.node = V0(["leftmost"])), a.insertAfter = (b => x => {
					e.splice(b + 1, 0, x), o++
				})(o)
			}
			n && e.pop()
		},
		ma = function(e) {
			return e instanceof qe || e instanceof Rt || e instanceof Re && e.hasClass("enclosing") ? e : null
		},
		ai = function r(e, t) {
			var a = ma(e);
			if (a) {
				var n = a.children;
				if (n.length) {
					if (t === "right") return r(n[n.length - 1], "right");
					if (t === "left") return r(n[0], "left")
				}
			}
			return e
		},
		Gt = function(e, t) {
			return e ? (t && (e = ai(e, t)), ri[e.classes[0]] || null) : null
		},
		$e = function(e, t) {
			var a = ["nulldelimiter"].concat(e.baseSizingClasses());
			return V0(t.concat(a))
		},
		H = function(e, t, a) {
			if (!e) return V0();
			if (rt[e.type]) {
				var n = rt[e.type](e, t);
				if (a && t.size !== a.size) {
					n = V0(t.sizingClasses(a), [n], t);
					var i = t.sizeMultiplier / a.sizeMultiplier;
					n.height *= i, n.depth *= i
				}
				return n
			} else throw new M("Got group of unknown type: '" + e.type + "'")
		};

	function it(r, e) {
		var t = V0(["base"], r, e),
			a = V0(["strut"]);
		return a.style.height = A(t.height + t.depth), t.depth && (a.style.verticalAlign = A(-t.depth)), t.children.unshift(a), t
	}

	function Vt(r, e) {
		var t = null;
		r.length === 1 && r[0].type === "tag" && (t = r[0].tag, r = r[0].body);
		var a = a0(r, e, "root"),
			n;
		a.length === 2 && a[1].hasClass("tag") && (n = a.pop());
		for (var i = [], o = [], u = 0; u < a.length; u++)
			if (o.push(a[u]), a[u].hasClass("mbin") || a[u].hasClass("mrel") || a[u].hasClass("allowbreak")) {
				for (var m = !1; u < a.length - 1 && a[u + 1].hasClass("mspace") && !a[u + 1].hasClass("newline");) u++, o.push(a[u]), a[u].hasClass("nobreak") && (m = !0);
				m || (i.push(it(o, e)), o = [])
			} else a[u].hasClass("newline") && (o.pop(), o.length > 0 && (i.push(it(o, e)), o = []), i.push(a[u]));
		o.length > 0 && i.push(it(o, e));
		var p;
		t ? (p = it(a0(t, e, !0)), p.classes = ["tag"], i.push(p)) : n && i.push(n);
		var v = V0(["katex-html"], i);
		if (v.setAttribute("aria-hidden", "true"), p) {
			var b = p.children[0];
			b.style.height = A(v.height + v.depth), v.depth && (b.style.verticalAlign = A(-v.depth))
		}
		return v
	}

	function ca(r) {
		return new qe(r)
	}
	class S0 {
		constructor(e, t, a) {
			this.type = void 0, this.attributes = void 0, this.children = void 0, this.classes = void 0, this.type = e, this.attributes = {}, this.children = t || [], this.classes = a || []
		}
		setAttribute(e, t) {
			this.attributes[e] = t
		}
		getAttribute(e) {
			return this.attributes[e]
		}
		toNode() {
			var e = document.createElementNS("http://www.w3.org/1998/Math/MathML", this.type);
			for (var t in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, t) && e.setAttribute(t, this.attributes[t]);
			this.classes.length > 0 && (e.className = X0(this.classes));
			for (var a = 0; a < this.children.length; a++) e.appendChild(this.children[a].toNode());
			return e
		}
		toMarkup() {
			var e = "<" + this.type;
			for (var t in this.attributes) Object.prototype.hasOwnProperty.call(this.attributes, t) && (e += " " + t + '="', e += R.escape(this.attributes[t]), e += '"');
			this.classes.length > 0 && (e += ' class ="' + R.escape(X0(this.classes)) + '"'), e += ">";
			for (var a = 0; a < this.children.length; a++) e += this.children[a].toMarkup();
			return e += "</" + this.type + ">", e
		}
		toText() {
			return this.children.map(e => e.toText()).join("")
		}
	}
	class Ie {
		constructor(e) {
			this.text = void 0, this.text = e
		}
		toNode() {
			return document.createTextNode(this.text)
		}
		toMarkup() {
			return R.escape(this.toText())
		}
		toText() {
			return this.text
		}
	}
	class ni {
		constructor(e) {
			this.width = void 0, this.character = void 0, this.width = e, e >= .05555 && e <= .05556 ? this.character = "\u200A" : e >= .1666 && e <= .1667 ? this.character = "\u2009" : e >= .2222 && e <= .2223 ? this.character = "\u2005" : e >= .2777 && e <= .2778 ? this.character = "\u2005\u200A" : e >= -.05556 && e <= -.05555 ? this.character = "\u200A\u2063" : e >= -.1667 && e <= -.1666 ? this.character = "\u2009\u2063" : e >= -.2223 && e <= -.2222 ? this.character = "\u205F\u2063" : e >= -.2778 && e <= -.2777 ? this.character = "\u2005\u2063" : this.character = null
		}
		toNode() {
			if (this.character) return document.createTextNode(this.character);
			var e = document.createElementNS("http://www.w3.org/1998/Math/MathML", "mspace");
			return e.setAttribute("width", A(this.width)), e
		}
		toMarkup() {
			return this.character ? "<mtext>" + this.character + "</mtext>" : '<mspace width="' + A(this.width) + '"/>'
		}
		toText() {
			return this.character ? this.character : " "
		}
	}
	var S = {
			MathNode: S0,
			TextNode: Ie,
			SpaceNode: ni,
			newDocumentFragment: ca
		},
		M0 = function(e, t, a) {
			return W[t][e] && W[t][e].replace && e.charCodeAt(0) !== 55349 && !(Qr.hasOwnProperty(e) && a && (a.fontFamily && a.fontFamily.slice(4, 6) === "tt" || a.font && a.font.slice(4, 6) === "tt")) && (e = W[t][e].replace), new S.TextNode(e)
		},
		jt = function(e) {
			return e.length === 1 ? e[0] : new S.MathNode("mrow", e)
		},
		Ut = function(e, t) {
			if (t.fontFamily === "texttt") return "monospace";
			if (t.fontFamily === "textsf") return t.fontShape === "textit" && t.fontWeight === "textbf" ? "sans-serif-bold-italic" : t.fontShape === "textit" ? "sans-serif-italic" : t.fontWeight === "textbf" ? "bold-sans-serif" : "sans-serif";
			if (t.fontShape === "textit" && t.fontWeight === "textbf") return "bold-italic";
			if (t.fontShape === "textit") return "italic";
			if (t.fontWeight === "textbf") return "bold";
			var a = t.font;
			if (!a || a === "mathnormal") return null;
			var n = e.mode;
			if (a === "mathit") return "italic";
			if (a === "boldsymbol") return e.type === "textord" ? "bold" : "bold-italic";
			if (a === "mathbf") return "bold";
			if (a === "mathbb") return "double-struck";
			if (a === "mathfrak") return "fraktur";
			if (a === "mathscr" || a === "mathcal") return "script";
			if (a === "mathsf") return "sans-serif";
			if (a === "mathtt") return "monospace";
			var i = e.text;
			if (R.contains(["\\imath", "\\jmath"], i)) return null;
			W[n][i] && W[n][i].replace && (i = W[n][i].replace);
			var o = y.fontMap[a].fontName;
			return Dt(i, o, n) ? y.fontMap[a].variant : null
		},
		c0 = function(e, t, a) {
			if (e.length === 1) {
				var n = U(e[0], t);
				return a && n instanceof S0 && n.type === "mo" && (n.setAttribute("lspace", "0em"), n.setAttribute("rspace", "0em")), [n]
			}
			for (var i = [], o, u = 0; u < e.length; u++) {
				var m = U(e[u], t);
				if (m instanceof S0 && o instanceof S0) {
					if (m.type === "mtext" && o.type === "mtext" && m.getAttribute("mathvariant") === o.getAttribute("mathvariant")) {
						o.children.push(...m.children);
						continue
					} else if (m.type === "mn" && o.type === "mn") {
						o.children.push(...m.children);
						continue
					} else if (m.type === "mi" && m.children.length === 1 && o.type === "mn") {
						var p = m.children[0];
						if (p instanceof Ie && p.text === ".") {
							o.children.push(...m.children);
							continue
						}
					} else if (o.type === "mi" && o.children.length === 1) {
						var v = o.children[0];
						if (v instanceof Ie && v.text === "\u0338" && (m.type === "mo" || m.type === "mi" || m.type === "mn")) {
							var b = m.children[0];
							b instanceof Ie && b.text.length > 0 && (b.text = b.text.slice(0, 1) + "\u0338" + b.text.slice(1), i.pop())
						}
					}
				}
				i.push(m), o = m
			}
			return i
		},
		J0 = function(e, t, a) {
			return jt(c0(e, t, a))
		},
		U = function(e, t) {
			if (!e) return new S.MathNode("mrow");
			if (at[e.type]) {
				var a = at[e.type](e, t);
				return a
			} else throw new M("Got group of unknown type: '" + e.type + "'")
		};

	function da(r, e, t, a, n) {
		var i = c0(r, t),
			o;
		i.length === 1 && i[0] instanceof S0 && R.contains(["mrow", "mtable"], i[0].type) ? o = i[0] : o = new S.MathNode("mrow", i);
		var u = new S.MathNode("annotation", [new S.TextNode(e)]);
		u.setAttribute("encoding", "application/x-tex");
		var m = new S.MathNode("semantics", [o, u]),
			p = new S.MathNode("math", [m]);
		p.setAttribute("xmlns", "http://www.w3.org/1998/Math/MathML"), a && p.setAttribute("display", "block");
		var v = n ? "katex" : "katex-mathml";
		return y.makeSpan([v], [p])
	}
	var fa = function(e) {
			return new F0({
				style: e.displayMode ? N.DISPLAY : N.TEXT,
				maxSize: e.maxSize,
				minRuleThickness: e.minRuleThickness
			})
		},
		pa = function(e, t) {
			if (t.displayMode) {
				var a = ["katex-display"];
				t.leqno && a.push("leqno"), t.fleqn && a.push("fleqn"), e = y.makeSpan(a, [e])
			}
			return e
		},
		ii = function(e, t, a) {
			var n = fa(a),
				i;
			if (a.output === "mathml") return da(e, t, n, a.displayMode, !0);
			if (a.output === "html") {
				var o = Vt(e, n);
				i = y.makeSpan(["katex"], [o])
			} else {
				var u = da(e, t, n, a.displayMode, !1),
					m = Vt(e, n);
				i = y.makeSpan(["katex"], [u, m])
			}
			return pa(i, a)
		},
		li = function(e, t, a) {
			var n = fa(a),
				i = Vt(e, n),
				o = y.makeSpan(["katex"], [i]);
			return pa(o, a)
		},
		si = {
			widehat: "^",
			widecheck: "\u02C7",
			widetilde: "~",
			utilde: "~",
			overleftarrow: "\u2190",
			underleftarrow: "\u2190",
			xleftarrow: "\u2190",
			overrightarrow: "\u2192",
			underrightarrow: "\u2192",
			xrightarrow: "\u2192",
			underbrace: "\u23DF",
			overbrace: "\u23DE",
			overgroup: "\u23E0",
			undergroup: "\u23E1",
			overleftrightarrow: "\u2194",
			underleftrightarrow: "\u2194",
			xleftrightarrow: "\u2194",
			Overrightarrow: "\u21D2",
			xRightarrow: "\u21D2",
			overleftharpoon: "\u21BC",
			xleftharpoonup: "\u21BC",
			overrightharpoon: "\u21C0",
			xrightharpoonup: "\u21C0",
			xLeftarrow: "\u21D0",
			xLeftrightarrow: "\u21D4",
			xhookleftarrow: "\u21A9",
			xhookrightarrow: "\u21AA",
			xmapsto: "\u21A6",
			xrightharpoondown: "\u21C1",
			xleftharpoondown: "\u21BD",
			xrightleftharpoons: "\u21CC",
			xleftrightharpoons: "\u21CB",
			xtwoheadleftarrow: "\u219E",
			xtwoheadrightarrow: "\u21A0",
			xlongequal: "=",
			xtofrom: "\u21C4",
			xrightleftarrows: "\u21C4",
			xrightequilibrium: "\u21CC",
			xleftequilibrium: "\u21CB",
			"\\cdrightarrow": "\u2192",
			"\\cdleftarrow": "\u2190",
			"\\cdlongequal": "="
		},
		oi = function(e) {
			var t = new S.MathNode("mo", [new S.TextNode(si[e.replace(/^\\/, "")])]);
			return t.setAttribute("stretchy", "true"), t
		},
		ui = {
			overrightarrow: [
				["rightarrow"], .888, 522, "xMaxYMin"
			],
			overleftarrow: [
				["leftarrow"], .888, 522, "xMinYMin"
			],
			underrightarrow: [
				["rightarrow"], .888, 522, "xMaxYMin"
			],
			underleftarrow: [
				["leftarrow"], .888, 522, "xMinYMin"
			],
			xrightarrow: [
				["rightarrow"], 1.469, 522, "xMaxYMin"
			],
			"\\cdrightarrow": [
				["rightarrow"], 3, 522, "xMaxYMin"
			],
			xleftarrow: [
				["leftarrow"], 1.469, 522, "xMinYMin"
			],
			"\\cdleftarrow": [
				["leftarrow"], 3, 522, "xMinYMin"
			],
			Overrightarrow: [
				["doublerightarrow"], .888, 560, "xMaxYMin"
			],
			xRightarrow: [
				["doublerightarrow"], 1.526, 560, "xMaxYMin"
			],
			xLeftarrow: [
				["doubleleftarrow"], 1.526, 560, "xMinYMin"
			],
			overleftharpoon: [
				["leftharpoon"], .888, 522, "xMinYMin"
			],
			xleftharpoonup: [
				["leftharpoon"], .888, 522, "xMinYMin"
			],
			xleftharpoondown: [
				["leftharpoondown"], .888, 522, "xMinYMin"
			],
			overrightharpoon: [
				["rightharpoon"], .888, 522, "xMaxYMin"
			],
			xrightharpoonup: [
				["rightharpoon"], .888, 522, "xMaxYMin"
			],
			xrightharpoondown: [
				["rightharpoondown"], .888, 522, "xMaxYMin"
			],
			xlongequal: [
				["longequal"], .888, 334, "xMinYMin"
			],
			"\\cdlongequal": [
				["longequal"], 3, 334, "xMinYMin"
			],
			xtwoheadleftarrow: [
				["twoheadleftarrow"], .888, 334, "xMinYMin"
			],
			xtwoheadrightarrow: [
				["twoheadrightarrow"], .888, 334, "xMaxYMin"
			],
			overleftrightarrow: [
				["leftarrow", "rightarrow"], .888, 522
			],
			overbrace: [
				["leftbrace", "midbrace", "rightbrace"], 1.6, 548
			],
			underbrace: [
				["leftbraceunder", "midbraceunder", "rightbraceunder"], 1.6, 548
			],
			underleftrightarrow: [
				["leftarrow", "rightarrow"], .888, 522
			],
			xleftrightarrow: [
				["leftarrow", "rightarrow"], 1.75, 522
			],
			xLeftrightarrow: [
				["doubleleftarrow", "doublerightarrow"], 1.75, 560
			],
			xrightleftharpoons: [
				["leftharpoondownplus", "rightharpoonplus"], 1.75, 716
			],
			xleftrightharpoons: [
				["leftharpoonplus", "rightharpoondownplus"], 1.75, 716
			],
			xhookleftarrow: [
				["leftarrow", "righthook"], 1.08, 522
			],
			xhookrightarrow: [
				["lefthook", "rightarrow"], 1.08, 522
			],
			overlinesegment: [
				["leftlinesegment", "rightlinesegment"], .888, 522
			],
			underlinesegment: [
				["leftlinesegment", "rightlinesegment"], .888, 522
			],
			overgroup: [
				["leftgroup", "rightgroup"], .888, 342
			],
			undergroup: [
				["leftgroupunder", "rightgroupunder"], .888, 342
			],
			xmapsto: [
				["leftmapsto", "rightarrow"], 1.5, 522
			],
			xtofrom: [
				["leftToFrom", "rightToFrom"], 1.75, 528
			],
			xrightleftarrows: [
				["baraboveleftarrow", "rightarrowabovebar"], 1.75, 901
			],
			xrightequilibrium: [
				["baraboveshortleftharpoon", "rightharpoonaboveshortbar"], 1.75, 716
			],
			xleftequilibrium: [
				["shortbaraboveleftharpoon", "shortrightharpoonabovebar"], 1.75, 716
			]
		},
		hi = function(e) {
			return e.type === "ordgroup" ? e.body.length : 1
		},
		mi = function(e, t) {
			function a() {
				var u = 4e5,
					m = e.label.slice(1);
				if (R.contains(["widehat", "widecheck", "widetilde", "utilde"], m)) {
					var p = e,
						v = hi(p.base),
						b, x, w;
					if (v > 5) m === "widehat" || m === "widecheck" ? (b = 420, u = 2364, w = .42, x = m + "4") : (b = 312, u = 2340, w = .34, x = "tilde4");
					else {
						var z = [1, 1, 2, 2, 3, 3][v];
						m === "widehat" || m === "widecheck" ? (u = [0, 1062, 2364, 2364, 2364][z], b = [0, 239, 300, 360, 420][z], w = [0, .24, .3, .3, .36, .42][z], x = m + z) : (u = [0, 600, 1033, 2339, 2340][z], b = [0, 260, 286, 306, 312][z], w = [0, .26, .286, .3, .306, .34][z], x = "tilde" + z)
					}
					var T = new Z0(x),
						C = new H0([T], {
							width: "100%",
							height: A(w),
							viewBox: "0 0 " + u + " " + b,
							preserveAspectRatio: "none"
						});
					return {
						span: y.makeSvgSpan([], [C], t),
						minWidth: 0,
						height: w
					}
				} else {
					var D = [],
						I = ui[m],
						[O, G, F] = I,
						V = F / 1e3,
						P = O.length,
						J, j;
					if (P === 1) {
						var W0 = I[3];
						J = ["hide-tail"], j = [W0]
					} else if (P === 2) J = ["halfarrow-left", "halfarrow-right"], j = ["xMinYMin", "xMaxYMin"];
					else if (P === 3) J = ["brace-left", "brace-center", "brace-right"], j = ["xMinYMin", "xMidYMin", "xMaxYMin"];
					else throw new Error(`Correct katexImagesData or update code here to support
                    ` + P + " children.");
					for (var h0 = 0; h0 < P; h0++) {
						var i0 = new Z0(O[h0]),
							de = new H0([i0], {
								width: "400em",
								height: A(V),
								viewBox: "0 0 " + u + " " + F,
								preserveAspectRatio: j[h0] + " slice"
							}),
							f0 = y.makeSvgSpan([J[h0]], [de], t);
						if (P === 1) return {
							span: f0,
							minWidth: G,
							height: V
						};
						f0.style.height = A(V), D.push(f0)
					}
					return {
						span: y.makeSpan(["stretchy"], D, t),
						minWidth: G,
						height: V
					}
				}
			}
			var {
				span: n,
				minWidth: i,
				height: o
			} = a();
			return n.height = o, n.style.height = A(o), i > 0 && (n.style.minWidth = A(i)), n
		},
		ci = function(e, t, a, n, i) {
			var o, u = e.height + e.depth + a + n;
			if (/fbox|color|angl/.test(t)) {
				if (o = y.makeSpan(["stretchy", t], [], i), t === "fbox") {
					var m = i.color && i.getColor();
					m && (o.style.borderColor = m)
				}
			} else {
				var p = [];
				/^[bx]cancel$/.test(t) && p.push(new $t({
					x1: "0",
					y1: "0",
					x2: "100%",
					y2: "100%",
					"stroke-width": "0.046em"
				})), /^x?cancel$/.test(t) && p.push(new $t({
					x1: "0",
					y1: "100%",
					x2: "100%",
					y2: "0",
					"stroke-width": "0.046em"
				}));
				var v = new H0(p, {
					width: "100%",
					height: A(u)
				});
				o = y.makeSvgSpan([], [v], i)
			}
			return o.height = u, o.style.height = A(u), o
		},
		j0 = {
			encloseSpan: ci,
			mathMLnode: oi,
			svgSpan: mi
		};

	function L(r, e) {
		if (!r || r.type !== e) throw new Error("Expected node of type " + e + ", but got " + (r ? "node of type " + r.type : String(r)));
		return r
	}

	function Wt(r) {
		var e = lt(r);
		if (!e) throw new Error("Expected node of symbol group type, but got " + (r ? "node of type " + r.type : String(r)));
		return e
	}

	function lt(r) {
		return r && (r.type === "atom" || On.hasOwnProperty(r.type)) ? r : null
	}
	var Yt = (r, e) => {
			var t, a, n;
			r && r.type === "supsub" ? (a = L(r.base, "accent"), t = a.base, r.base = t, n = $n(H(r, e)), r.base = a) : (a = L(r, "accent"), t = a.base);
			var i = H(t, e.havingCrampedStyle()),
				o = a.isShifty && R.isCharacterBox(t),
				u = 0;
			if (o) {
				var m = R.getBaseElem(t),
					p = H(m, e.havingCrampedStyle());
				u = _r(p).skew
			}
			var v = a.label === "\\c",
				b = v ? i.height + i.depth : Math.min(i.height, e.fontMetrics().xHeight),
				x;
			if (a.isStretchy) x = j0.svgSpan(a, e), x = y.makeVList({
				positionType: "firstBaseline",
				children: [{
					type: "elem",
					elem: i
				}, {
					type: "elem",
					elem: x,
					wrapperClasses: ["svg-align"],
					wrapperStyle: u > 0 ? {
						width: "calc(100% - " + A(2 * u) + ")",
						marginLeft: A(2 * u)
					} : void 0
				}]
			}, e);
			else {
				var w, z;
				a.label === "\\vec" ? (w = y.staticSvg("vec", e), z = y.svgData.vec[1]) : (w = y.makeOrd({
					mode: a.mode,
					text: a.label
				}, e, "textord"), w = _r(w), w.italic = 0, z = w.width, v && (b += w.depth)), x = y.makeSpan(["accent-body"], [w]);
				var T = a.label === "\\textcircled";
				T && (x.classes.push("accent-full"), b = i.height);
				var C = u;
				T || (C -= z / 2), x.style.left = A(C), a.label === "\\textcircled" && (x.style.top = ".2em"), x = y.makeVList({
					positionType: "firstBaseline",
					children: [{
						type: "elem",
						elem: i
					}, {
						type: "kern",
						size: -b
					}, {
						type: "elem",
						elem: x
					}]
				}, e)
			}
			var D = y.makeSpan(["mord", "accent"], [x], e);
			return n ? (n.children[0] = D, n.height = Math.max(D.height, n.height), n.classes[0] = "mord", n) : D
		},
		va = (r, e) => {
			var t = r.isStretchy ? j0.mathMLnode(r.label) : new S.MathNode("mo", [M0(r.label, r.mode)]),
				a = new S.MathNode("mover", [U(r.base, e), t]);
			return a.setAttribute("accent", "true"), a
		},
		di = new RegExp(["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring"].map(r => "\\" + r).join("|"));
	B({
		type: "accent",
		names: ["\\acute", "\\grave", "\\ddot", "\\tilde", "\\bar", "\\breve", "\\check", "\\hat", "\\vec", "\\dot", "\\mathring", "\\widecheck", "\\widehat", "\\widetilde", "\\overrightarrow", "\\overleftarrow", "\\Overrightarrow", "\\overleftrightarrow", "\\overgroup", "\\overlinesegment", "\\overleftharpoon", "\\overrightharpoon"],
		props: {
			numArgs: 1
		},
		handler: (r, e) => {
			var t = nt(e[0]),
				a = !di.test(r.funcName),
				n = !a || r.funcName === "\\widehat" || r.funcName === "\\widetilde" || r.funcName === "\\widecheck";
			return {
				type: "accent",
				mode: r.parser.mode,
				label: r.funcName,
				isStretchy: a,
				isShifty: n,
				base: t
			}
		},
		htmlBuilder: Yt,
		mathmlBuilder: va
	}), B({
		type: "accent",
		names: ["\\'", "\\`", "\\^", "\\~", "\\=", "\\u", "\\.", '\\"', "\\c", "\\r", "\\H", "\\v", "\\textcircled"],
		props: {
			numArgs: 1,
			allowedInText: !0,
			allowedInMath: !0,
			argTypes: ["primitive"]
		},
		handler: (r, e) => {
			var t = e[0],
				a = r.parser.mode;
			return a === "math" && (r.parser.settings.reportNonstrict("mathVsTextAccents", "LaTeX's accent " + r.funcName + " works only in text mode"), a = "text"), {
				type: "accent",
				mode: a,
				label: r.funcName,
				isStretchy: !1,
				isShifty: !0,
				base: t
			}
		},
		htmlBuilder: Yt,
		mathmlBuilder: va
	}), B({
		type: "accentUnder",
		names: ["\\underleftarrow", "\\underrightarrow", "\\underleftrightarrow", "\\undergroup", "\\underlinesegment", "\\utilde"],
		props: {
			numArgs: 1
		},
		handler: (r, e) => {
			var {
				parser: t,
				funcName: a
			} = r, n = e[0];
			return {
				type: "accentUnder",
				mode: t.mode,
				label: a,
				base: n
			}
		},
		htmlBuilder: (r, e) => {
			var t = H(r.base, e),
				a = j0.svgSpan(r, e),
				n = r.label === "\\utilde" ? .12 : 0,
				i = y.makeVList({
					positionType: "top",
					positionData: t.height,
					children: [{
						type: "elem",
						elem: a,
						wrapperClasses: ["svg-align"]
					}, {
						type: "kern",
						size: n
					}, {
						type: "elem",
						elem: t
					}]
				}, e);
			return y.makeSpan(["mord", "accentunder"], [i], e)
		},
		mathmlBuilder: (r, e) => {
			var t = j0.mathMLnode(r.label),
				a = new S.MathNode("munder", [U(r.base, e), t]);
			return a.setAttribute("accentunder", "true"), a
		}
	});
	var st = r => {
		var e = new S.MathNode("mpadded", r ? [r] : []);
		return e.setAttribute("width", "+0.6em"), e.setAttribute("lspace", "0.3em"), e
	};
	B({
		type: "xArrow",
		names: ["\\xleftarrow", "\\xrightarrow", "\\xLeftarrow", "\\xRightarrow", "\\xleftrightarrow", "\\xLeftrightarrow", "\\xhookleftarrow", "\\xhookrightarrow", "\\xmapsto", "\\xrightharpoondown", "\\xrightharpoonup", "\\xleftharpoondown", "\\xleftharpoonup", "\\xrightleftharpoons", "\\xleftrightharpoons", "\\xlongequal", "\\xtwoheadrightarrow", "\\xtwoheadleftarrow", "\\xtofrom", "\\xrightleftarrows", "\\xrightequilibrium", "\\xleftequilibrium", "\\\\cdrightarrow", "\\\\cdleftarrow", "\\\\cdlongequal"],
		props: {
			numArgs: 1,
			numOptionalArgs: 1
		},
		handler(r, e, t) {
			var {
				parser: a,
				funcName: n
			} = r;
			return {
				type: "xArrow",
				mode: a.mode,
				label: n,
				body: e[0],
				below: t[0]
			}
		},
		htmlBuilder(r, e) {
			var t = e.style,
				a = e.havingStyle(t.sup()),
				n = y.wrapFragment(H(r.body, a, e), e),
				i = r.label.slice(0, 2) === "\\x" ? "x" : "cd";
			n.classes.push(i + "-arrow-pad");
			var o;
			r.below && (a = e.havingStyle(t.sub()), o = y.wrapFragment(H(r.below, a, e), e), o.classes.push(i + "-arrow-pad"));
			var u = j0.svgSpan(r, e),
				m = -e.fontMetrics().axisHeight + .5 * u.height,
				p = -e.fontMetrics().axisHeight - .5 * u.height - .111;
			(n.depth > .25 || r.label === "\\xleftequilibrium") && (p -= n.depth);
			var v;
			if (o) {
				var b = -e.fontMetrics().axisHeight + o.height + .5 * u.height + .111;
				v = y.makeVList({
					positionType: "individualShift",
					children: [{
						type: "elem",
						elem: n,
						shift: p
					}, {
						type: "elem",
						elem: u,
						shift: m
					}, {
						type: "elem",
						elem: o,
						shift: b
					}]
				}, e)
			} else v = y.makeVList({
				positionType: "individualShift",
				children: [{
					type: "elem",
					elem: n,
					shift: p
				}, {
					type: "elem",
					elem: u,
					shift: m
				}]
			}, e);
			return v.children[0].children[0].children[1].classes.push("svg-align"), y.makeSpan(["mrel", "x-arrow"], [v], e)
		},
		mathmlBuilder(r, e) {
			var t = j0.mathMLnode(r.label);
			t.setAttribute("minsize", r.label.charAt(0) === "x" ? "1.75em" : "3.0em");
			var a;
			if (r.body) {
				var n = st(U(r.body, e));
				if (r.below) {
					var i = st(U(r.below, e));
					a = new S.MathNode("munderover", [t, i, n])
				} else a = new S.MathNode("mover", [t, n])
			} else if (r.below) {
				var o = st(U(r.below, e));
				a = new S.MathNode("munder", [t, o])
			} else a = st(), a = new S.MathNode("mover", [t, a]);
			return a
		}
	});
	var fi = y.makeSpan;

	function ga(r, e) {
		var t = a0(r.body, e, !0);
		return fi([r.mclass], t, e)
	}

	function ba(r, e) {
		var t, a = c0(r.body, e);
		return r.mclass === "minner" ? t = new S.MathNode("mpadded", a) : r.mclass === "mord" ? r.isCharacterBox ? (t = a[0], t.type = "mi") : t = new S.MathNode("mi", a) : (r.isCharacterBox ? (t = a[0], t.type = "mo") : t = new S.MathNode("mo", a), r.mclass === "mbin" ? (t.attributes.lspace = "0.22em", t.attributes.rspace = "0.22em") : r.mclass === "mpunct" ? (t.attributes.lspace = "0em", t.attributes.rspace = "0.17em") : r.mclass === "mopen" || r.mclass === "mclose" ? (t.attributes.lspace = "0em", t.attributes.rspace = "0em") : r.mclass === "minner" && (t.attributes.lspace = "0.0556em", t.attributes.width = "+0.1111em")), t
	}
	B({
		type: "mclass",
		names: ["\\mathord", "\\mathbin", "\\mathrel", "\\mathopen", "\\mathclose", "\\mathpunct", "\\mathinner"],
		props: {
			numArgs: 1,
			primitive: !0
		},
		handler(r, e) {
			var {
				parser: t,
				funcName: a
			} = r, n = e[0];
			return {
				type: "mclass",
				mode: t.mode,
				mclass: "m" + a.slice(5),
				body: e0(n),
				isCharacterBox: R.isCharacterBox(n)
			}
		},
		htmlBuilder: ga,
		mathmlBuilder: ba
	});
	var ot = r => {
		var e = r.type === "ordgroup" && r.body.length ? r.body[0] : r;
		return e.type === "atom" && (e.family === "bin" || e.family === "rel") ? "m" + e.family : "mord"
	};
	B({
		type: "mclass",
		names: ["\\@binrel"],
		props: {
			numArgs: 2
		},
		handler(r, e) {
			var {
				parser: t
			} = r;
			return {
				type: "mclass",
				mode: t.mode,
				mclass: ot(e[0]),
				body: e0(e[1]),
				isCharacterBox: R.isCharacterBox(e[1])
			}
		}
	}), B({
		type: "mclass",
		names: ["\\stackrel", "\\overset", "\\underset"],
		props: {
			numArgs: 2
		},
		handler(r, e) {
			var {
				parser: t,
				funcName: a
			} = r, n = e[1], i = e[0], o;
			a !== "\\stackrel" ? o = ot(n) : o = "mrel";
			var u = {
					type: "op",
					mode: n.mode,
					limits: !0,
					alwaysHandleSupSub: !0,
					parentIsSupSub: !1,
					symbol: !1,
					suppressBaseShift: a !== "\\stackrel",
					body: e0(n)
				},
				m = {
					type: "supsub",
					mode: i.mode,
					base: u,
					sup: a === "\\underset" ? null : i,
					sub: a === "\\underset" ? i : null
				};
			return {
				type: "mclass",
				mode: t.mode,
				mclass: o,
				body: [m],
				isCharacterBox: R.isCharacterBox(m)
			}
		},
		htmlBuilder: ga,
		mathmlBuilder: ba
	}), B({
		type: "pmb",
		names: ["\\pmb"],
		props: {
			numArgs: 1,
			allowedInText: !0
		},
		handler(r, e) {
			var {
				parser: t
			} = r;
			return {
				type: "pmb",
				mode: t.mode,
				mclass: ot(e[0]),
				body: e0(e[0])
			}
		},
		htmlBuilder(r, e) {
			var t = a0(r.body, e, !0),
				a = y.makeSpan([r.mclass], t, e);
			return a.style.textShadow = "0.02em 0.01em 0.04px", a
		},
		mathmlBuilder(r, e) {
			var t = c0(r.body, e),
				a = new S.MathNode("mstyle", t);
			return a.setAttribute("style", "text-shadow: 0.02em 0.01em 0.04px"), a
		}
	});
	var pi = {
			">": "\\\\cdrightarrow",
			"<": "\\\\cdleftarrow",
			"=": "\\\\cdlongequal",
			A: "\\uparrow",
			V: "\\downarrow",
			"|": "\\Vert",
			".": "no arrow"
		},
		ya = () => ({
			type: "styling",
			body: [],
			mode: "math",
			style: "display"
		}),
		wa = r => r.type === "textord" && r.text === "@",
		vi = (r, e) => (r.type === "mathord" || r.type === "atom") && r.text === e;

	function gi(r, e, t) {
		var a = pi[r];
		switch (a) {
			case "\\\\cdrightarrow":
			case "\\\\cdleftarrow":
				return t.callFunction(a, [e[0]], [e[1]]);
			case "\\uparrow":
			case "\\downarrow": {
				var n = t.callFunction("\\\\cdleft", [e[0]], []),
					i = {
						type: "atom",
						text: a,
						mode: "math",
						family: "rel"
					},
					o = t.callFunction("\\Big", [i], []),
					u = t.callFunction("\\\\cdright", [e[1]], []),
					m = {
						type: "ordgroup",
						mode: "math",
						body: [n, o, u]
					};
				return t.callFunction("\\\\cdparent", [m], [])
			}
			case "\\\\cdlongequal":
				return t.callFunction("\\\\cdlongequal", [], []);
			case "\\Vert": {
				var p = {
					type: "textord",
					text: "\\Vert",
					mode: "math"
				};
				return t.callFunction("\\Big", [p], [])
			}
			default:
				return {
					type: "textord", text: " ", mode: "math"
				}
		}
	}

	function bi(r) {
		var e = [];
		for (r.gullet.beginGroup(), r.gullet.macros.set("\\cr", "\\\\\\relax"), r.gullet.beginGroup();;) {
			e.push(r.parseExpression(!1, "\\\\")), r.gullet.endGroup(), r.gullet.beginGroup();
			var t = r.fetch().text;
			if (t === "&" || t === "\\\\") r.consume();
			else if (t === "\\end") {
				e[e.length - 1].length === 0 && e.pop();
				break
			} else throw new M("Expected \\\\ or \\cr or \\end", r.nextToken)
		}
		for (var a = [], n = [a], i = 0; i < e.length; i++) {
			for (var o = e[i], u = ya(), m = 0; m < o.length; m++)
				if (!wa(o[m])) u.body.push(o[m]);
				else {
					a.push(u), m += 1;
					var p = Wt(o[m]).text,
						v = new Array(2);
					if (v[0] = {
							type: "ordgroup",
							mode: "math",
							body: []
						}, v[1] = {
							type: "ordgroup",
							mode: "math",
							body: []
						}, !("=|.".indexOf(p) > -1))
						if ("<>AV".indexOf(p) > -1)
							for (var b = 0; b < 2; b++) {
								for (var x = !0, w = m + 1; w < o.length; w++) {
									if (vi(o[w], p)) {
										x = !1, m = w;
										break
									}
									if (wa(o[w])) throw new M("Missing a " + p + " character to complete a CD arrow.", o[w]);
									v[b].body.push(o[w])
								}
								if (x) throw new M("Missing a " + p + " character to complete a CD arrow.", o[m])
							} else throw new M('Expected one of "<>AV=|." after @', o[m]);
					var z = gi(p, v, r),
						T = {
							type: "styling",
							body: [z],
							mode: "math",
							style: "display"
						};
					a.push(T), u = ya()
				} i % 2 === 0 ? a.push(u) : a.shift(), a = [], n.push(a)
		}
		r.gullet.endGroup(), r.gullet.endGroup();
		var C = new Array(n[0].length).fill({
			type: "align",
			align: "c",
			pregap: .25,
			postgap: .25
		});
		return {
			type: "array",
			mode: "math",
			body: n,
			arraystretch: 1,
			addJot: !0,
			rowGaps: [null],
			cols: C,
			colSeparationType: "CD",
			hLinesBeforeRow: new Array(n.length + 1).fill([])
		}
	}
	B({
		type: "cdlabel",
		names: ["\\\\cdleft", "\\\\cdright"],
		props: {
			numArgs: 1
		},
		handler(r, e) {
			var {
				parser: t,
				funcName: a
			} = r;
			return {
				type: "cdlabel",
				mode: t.mode,
				side: a.slice(4),
				label: e[0]
			}
		},
		htmlBuilder(r, e) {
			var t = e.havingStyle(e.style.sup()),
				a = y.wrapFragment(H(r.label, t, e), e);
			return a.classes.push("cd-label-" + r.side), a.style.bottom = A(.8 - a.depth), a.height = 0, a.depth = 0, a
		},
		mathmlBuilder(r, e) {
			var t = new S.MathNode("mrow", [U(r.label, e)]);
			return t = new S.MathNode("mpadded", [t]), t.setAttribute("width", "0"), r.side === "left" && t.setAttribute("lspace", "-1width"), t.setAttribute("voffset", "0.7em"), t = new S.MathNode("mstyle", [t]), t.setAttribute("displaystyle", "false"), t.setAttribute("scriptlevel", "1"), t
		}
	}), B({
		type: "cdlabelparent",
		names: ["\\\\cdparent"],
		props: {
			numArgs: 1
		},
		handler(r, e) {
			var {
				parser: t
			} = r;
			return {
				type: "cdlabelparent",
				mode: t.mode,
				fragment: e[0]
			}
		},
		htmlBuilder(r, e) {
			var t = y.wrapFragment(H(r.fragment, e), e);
			return t.classes.push("cd-vert-arrow"), t
		},
		mathmlBuilder(r, e) {
			return new S.MathNode("mrow", [U(r.fragment, e)])
		}
	}), B({
		type: "textord",
		names: ["\\@char"],
		props: {
			numArgs: 1,
			allowedInText: !0
		},
		handler(r, e) {
			for (var {
					parser: t
				} = r, a = L(e[0], "ordgroup"), n = a.body, i = "", o = 0; o < n.length; o++) {
				var u = L(n[o], "textord");
				i += u.text
			}
			var m = parseInt(i),
				p;
			if (isNaN(m)) throw new M("\\@char has non-numeric argument " + i);
			if (m < 0 || m >= 1114111) throw new M("\\@char with invalid code point " + i);
			return m <= 65535 ? p = String.fromCharCode(m) : (m -= 65536, p = String.fromCharCode((m >> 10) + 55296, (m & 1023) + 56320)), {
				type: "textord",
				mode: t.mode,
				text: p
			}
		}
	});
	var xa = (r, e) => {
			var t = a0(r.body, e.withColor(r.color), !1);
			return y.makeFragment(t)
		},
		ka = (r, e) => {
			var t = c0(r.body, e.withColor(r.color)),
				a = new S.MathNode("mstyle", t);
			return a.setAttribute("mathcolor", r.color), a
		};
	B({
		type: "color",
		names: ["\\textcolor"],
		props: {
			numArgs: 2,
			allowedInText: !0,
			argTypes: ["color", "original"]
		},
		handler(r, e) {
			var {
				parser: t
			} = r, a = L(e[0], "color-token").color, n = e[1];
			return {
				type: "color",
				mode: t.mode,
				color: a,
				body: e0(n)
			}
		},
		htmlBuilder: xa,
		mathmlBuilder: ka
	}), B({
		type: "color",
		names: ["\\color"],
		props: {
			numArgs: 1,
			allowedInText: !0,
			argTypes: ["color"]
		},
		handler(r, e) {
			var {
				parser: t,
				breakOnTokenText: a
			} = r, n = L(e[0], "color-token").color;
			t.gullet.macros.set("\\current@color", n);
			var i = t.parseExpression(!0, a);
			return {
				type: "color",
				mode: t.mode,
				color: n,
				body: i
			}
		},
		htmlBuilder: xa,
		mathmlBuilder: ka
	}), B({
		type: "cr",
		names: ["\\\\"],
		props: {
			numArgs: 0,
			numOptionalArgs: 0,
			allowedInText: !0
		},
		handler(r, e, t) {
			var {
				parser: a
			} = r, n = a.gullet.future().text === "[" ? a.parseSizeGroup(!0) : null, i = !a.settings.displayMode || !a.settings.useStrictBehavior("newLineInDisplayMode", "In LaTeX, \\\\ or \\newline does nothing in display mode");
			return {
				type: "cr",
				mode: a.mode,
				newLine: i,
				size: n && L(n, "size").value
			}
		},
		htmlBuilder(r, e) {
			var t = y.makeSpan(["mspace"], [], e);
			return r.newLine && (t.classes.push("newline"), r.size && (t.style.marginTop = A(Z(r.size, e)))), t
		},
		mathmlBuilder(r, e) {
			var t = new S.MathNode("mspace");
			return r.newLine && (t.setAttribute("linebreak", "newline"), r.size && t.setAttribute("height", A(Z(r.size, e)))), t
		}
	});
	var Xt = {
			"\\global": "\\global",
			"\\long": "\\\\globallong",
			"\\\\globallong": "\\\\globallong",
			"\\def": "\\gdef",
			"\\gdef": "\\gdef",
			"\\edef": "\\xdef",
			"\\xdef": "\\xdef",
			"\\let": "\\\\globallet",
			"\\futurelet": "\\\\globalfuture"
		},
		Sa = r => {
			var e = r.text;
			if (/^(?:[\\{}$&#^_]|EOF)$/.test(e)) throw new M("Expected a control sequence", r);
			return e
		},
		yi = r => {
			var e = r.gullet.popToken();
			return e.text === "=" && (e = r.gullet.popToken(), e.text === " " && (e = r.gullet.popToken())), e
		},
		Ma = (r, e, t, a) => {
			var n = r.gullet.macros.get(t.text);
			n == null && (t.noexpand = !0, n = {
				tokens: [t],
				numArgs: 0,
				unexpandable: !r.gullet.isExpandable(t.text)
			}), r.gullet.macros.set(e, n, a)
		};
	B({
		type: "internal",
		names: ["\\global", "\\long", "\\\\globallong"],
		props: {
			numArgs: 0,
			allowedInText: !0
		},
		handler(r) {
			var {
				parser: e,
				funcName: t
			} = r;
			e.consumeSpaces();
			var a = e.fetch();
			if (Xt[a.text]) return (t === "\\global" || t === "\\\\globallong") && (a.text = Xt[a.text]), L(e.parseFunction(), "internal");
			throw new M("Invalid token after macro prefix", a)
		}
	}), B({
		type: "internal",
		names: ["\\def", "\\gdef", "\\edef", "\\xdef"],
		props: {
			numArgs: 0,
			allowedInText: !0,
			primitive: !0
		},
		handler(r) {
			var {
				parser: e,
				funcName: t
			} = r, a = e.gullet.popToken(), n = a.text;
			if (/^(?:[\\{}$&#^_]|EOF)$/.test(n)) throw new M("Expected a control sequence", a);
			for (var i = 0, o, u = [
					[]
				]; e.gullet.future().text !== "{";)
				if (a = e.gullet.popToken(), a.text === "#") {
					if (e.gullet.future().text === "{") {
						o = e.gullet.future(), u[i].push("{");
						break
					}
					if (a = e.gullet.popToken(), !/^[1-9]$/.test(a.text)) throw new M('Invalid argument number "' + a.text + '"');
					if (parseInt(a.text) !== i + 1) throw new M('Argument number "' + a.text + '" out of order');
					i++, u.push([])
				} else {
					if (a.text === "EOF") throw new M("Expected a macro definition");
					u[i].push(a.text)
				} var {
				tokens: m
			} = e.gullet.consumeArg();
			return o && m.unshift(o), (t === "\\edef" || t === "\\xdef") && (m = e.gullet.expandTokens(m), m.reverse()), e.gullet.macros.set(n, {
				tokens: m,
				numArgs: i,
				delimiters: u
			}, t === Xt[t]), {
				type: "internal",
				mode: e.mode
			}
		}
	}), B({
		type: "internal",
		names: ["\\let", "\\\\globallet"],
		props: {
			numArgs: 0,
			allowedInText: !0,
			primitive: !0
		},
		handler(r) {
			var {
				parser: e,
				funcName: t
			} = r, a = Sa(e.gullet.popToken());
			e.gullet.consumeSpaces();
			var n = yi(e);
			return Ma(e, a, n, t === "\\\\globallet"), {
				type: "internal",
				mode: e.mode
			}
		}
	}), B({
		type: "internal",
		names: ["\\futurelet", "\\\\globalfuture"],
		props: {
			numArgs: 0,
			allowedInText: !0,
			primitive: !0
		},
		handler(r) {
			var {
				parser: e,
				funcName: t
			} = r, a = Sa(e.gullet.popToken()), n = e.gullet.popToken(), i = e.gullet.popToken();
			return Ma(e, a, i, t === "\\\\globalfuture"), e.gullet.pushToken(i), e.gullet.pushToken(n), {
				type: "internal",
				mode: e.mode
			}
		}
	});
	var Oe = function(e, t, a) {
			var n = W.math[e] && W.math[e].replace,
				i = Dt(n || e, t, a);
			if (!i) throw new Error("Unsupported symbol " + e + " and font size " + t + ".");
			return i
		},
		Zt = function(e, t, a, n) {
			var i = a.havingBaseStyle(t),
				o = y.makeSpan(n.concat(i.sizingClasses(a)), [e], a),
				u = i.sizeMultiplier / a.sizeMultiplier;
			return o.height *= u, o.depth *= u, o.maxFontSize = i.sizeMultiplier, o
		},
		za = function(e, t, a) {
			var n = t.havingBaseStyle(a),
				i = (1 - t.sizeMultiplier / n.sizeMultiplier) * t.fontMetrics().axisHeight;
			e.classes.push("delimcenter"), e.style.top = A(i), e.height -= i, e.depth += i
		},
		wi = function(e, t, a, n, i, o) {
			var u = y.makeSymbol(e, "Main-Regular", i, n),
				m = Zt(u, t, n, o);
			return a && za(m, n, t), m
		},
		xi = function(e, t, a, n) {
			return y.makeSymbol(e, "Size" + t + "-Regular", a, n)
		},
		Aa = function(e, t, a, n, i, o) {
			var u = xi(e, t, i, n),
				m = Zt(y.makeSpan(["delimsizing", "size" + t], [u], n), N.TEXT, n, o);
			return a && za(m, n, N.TEXT), m
		},
		Kt = function(e, t, a) {
			var n;
			t === "Size1-Regular" ? n = "delim-size1" : n = "delim-size4";
			var i = y.makeSpan(["delimsizinginner", n], [y.makeSpan([], [y.makeSymbol(e, t, a)])]);
			return {
				type: "elem",
				elem: i
			}
		},
		Jt = function(e, t, a) {
			var n = q0["Size4-Regular"][e.charCodeAt(0)] ? q0["Size4-Regular"][e.charCodeAt(0)][4] : q0["Size1-Regular"][e.charCodeAt(0)][4],
				i = new Z0("inner", Tn(e, Math.round(1e3 * t))),
				o = new H0([i], {
					width: A(n),
					height: A(t),
					style: "width:" + A(n),
					viewBox: "0 0 " + 1e3 * n + " " + Math.round(1e3 * t),
					preserveAspectRatio: "xMinYMin"
				}),
				u = y.makeSvgSpan([], [o], a);
			return u.height = t, u.style.height = A(t), u.style.width = A(n), {
				type: "elem",
				elem: u
			}
		},
		_t = .008,
		ut = {
			type: "kern",
			size: -1 * _t
		},
		ki = ["|", "\\lvert", "\\rvert", "\\vert"],
		Si = ["\\|", "\\lVert", "\\rVert", "\\Vert"],
		Ta = function(e, t, a, n, i, o) {
			var u, m, p, v, b = "",
				x = 0;
			u = p = v = e, m = null;
			var w = "Size1-Regular";
			e === "\\uparrow" ? p = v = "\u23D0" : e === "\\Uparrow" ? p = v = "\u2016" : e === "\\downarrow" ? u = p = "\u23D0" : e === "\\Downarrow" ? u = p = "\u2016" : e === "\\updownarrow" ? (u = "\\uparrow", p = "\u23D0", v = "\\downarrow") : e === "\\Updownarrow" ? (u = "\\Uparrow", p = "\u2016", v = "\\Downarrow") : R.contains(ki, e) ? (p = "\u2223", b = "vert", x = 333) : R.contains(Si, e) ? (p = "\u2225", b = "doublevert", x = 556) : e === "[" || e === "\\lbrack" ? (u = "\u23A1", p = "\u23A2", v = "\u23A3", w = "Size4-Regular", b = "lbrack", x = 667) : e === "]" || e === "\\rbrack" ? (u = "\u23A4", p = "\u23A5", v = "\u23A6", w = "Size4-Regular", b = "rbrack", x = 667) : e === "\\lfloor" || e === "\u230A" ? (p = u = "\u23A2", v = "\u23A3", w = "Size4-Regular", b = "lfloor", x = 667) : e === "\\lceil" || e === "\u2308" ? (u = "\u23A1", p = v = "\u23A2", w = "Size4-Regular", b = "lceil", x = 667) : e === "\\rfloor" || e === "\u230B" ? (p = u = "\u23A5", v = "\u23A6", w = "Size4-Regular", b = "rfloor", x = 667) : e === "\\rceil" || e === "\u2309" ? (u = "\u23A4", p = v = "\u23A5", w = "Size4-Regular", b = "rceil", x = 667) : e === "(" || e === "\\lparen" ? (u = "\u239B", p = "\u239C", v = "\u239D", w = "Size4-Regular", b = "lparen", x = 875) : e === ")" || e === "\\rparen" ? (u = "\u239E", p = "\u239F", v = "\u23A0", w = "Size4-Regular", b = "rparen", x = 875) : e === "\\{" || e === "\\lbrace" ? (u = "\u23A7", m = "\u23A8", v = "\u23A9", p = "\u23AA", w = "Size4-Regular") : e === "\\}" || e === "\\rbrace" ? (u = "\u23AB", m = "\u23AC", v = "\u23AD", p = "\u23AA", w = "Size4-Regular") : e === "\\lgroup" || e === "\u27EE" ? (u = "\u23A7", v = "\u23A9", p = "\u23AA", w = "Size4-Regular") : e === "\\rgroup" || e === "\u27EF" ? (u = "\u23AB", v = "\u23AD", p = "\u23AA", w = "Size4-Regular") : e === "\\lmoustache" || e === "\u23B0" ? (u = "\u23A7", v = "\u23AD", p = "\u23AA", w = "Size4-Regular") : (e === "\\rmoustache" || e === "\u23B1") && (u = "\u23AB", v = "\u23A9", p = "\u23AA", w = "Size4-Regular");
			var z = Oe(u, w, i),
				T = z.height + z.depth,
				C = Oe(p, w, i),
				D = C.height + C.depth,
				I = Oe(v, w, i),
				O = I.height + I.depth,
				G = 0,
				F = 1;
			if (m !== null) {
				var V = Oe(m, w, i);
				G = V.height + V.depth, F = 2
			}
			var P = T + O + G,
				J = Math.max(0, Math.ceil((t - P) / (F * D))),
				j = P + J * F * D,
				W0 = n.fontMetrics().axisHeight;
			a && (W0 *= n.sizeMultiplier);
			var h0 = j / 2 - W0,
				i0 = [];
			if (b.length > 0) {
				var de = j - T - O,
					f0 = Math.round(j * 1e3),
					E0 = Bn(b, Math.round(de * 1e3)),
					ae = new Z0(b, E0),
					Te = (x / 1e3).toFixed(3) + "em",
					Be = (f0 / 1e3).toFixed(3) + "em",
					Cr = new H0([ae], {
						width: Te,
						height: Be,
						viewBox: "0 0 " + x + " " + f0
					}),
					ne = y.makeSvgSpan([], [Cr], n);
				ne.height = f0 / 1e3, ne.style.width = Te, ne.style.height = Be, i0.push({
					type: "elem",
					elem: ne
				})
			} else {
				if (i0.push(Kt(v, w, i)), i0.push(ut), m === null) {
					var ie = j - T - O + 2 * _t;
					i0.push(Jt(p, ie, n))
				} else {
					var A0 = (j - T - O - G) / 2 + 2 * _t;
					i0.push(Jt(p, A0, n)), i0.push(ut), i0.push(Kt(m, w, i)), i0.push(ut), i0.push(Jt(p, A0, n))
				}
				i0.push(ut), i0.push(Kt(u, w, i))
			}
			var Ge = n.havingBaseStyle(N.TEXT),
				Dr = y.makeVList({
					positionType: "bottom",
					positionData: h0,
					children: i0
				}, Ge);
			return Zt(y.makeSpan(["delimsizing", "mult"], [Dr], Ge), N.TEXT, n, o)
		},
		Qt = 80,
		er = .08,
		tr = function(e, t, a, n, i) {
			var o = An(e, n, a),
				u = new Z0(e, o),
				m = new H0([u], {
					width: "400em",
					height: A(t),
					viewBox: "0 0 400000 " + a,
					preserveAspectRatio: "xMinYMin slice"
				});
			return y.makeSvgSpan(["hide-tail"], [m], i)
		},
		Mi = function(e, t) {
			var a = t.havingBaseSizing(),
				n = Da("\\surd", e * a.sizeMultiplier, Ca, a),
				i = a.sizeMultiplier,
				o = Math.max(0, t.minRuleThickness - t.fontMetrics().sqrtRuleThickness),
				u, m = 0,
				p = 0,
				v = 0,
				b;
			return n.type === "small" ? (v = 1e3 + 1e3 * o + Qt, e < 1 ? i = 1 : e < 1.4 && (i = .7), m = (1 + o + er) / i, p = (1 + o) / i, u = tr("sqrtMain", m, v, o, t), u.style.minWidth = "0.853em", b = .833 / i) : n.type === "large" ? (v = (1e3 + Qt) * Le[n.size], p = (Le[n.size] + o) / i, m = (Le[n.size] + o + er) / i, u = tr("sqrtSize" + n.size, m, v, o, t), u.style.minWidth = "1.02em", b = 1 / i) : (m = e + o + er, p = e + o, v = Math.floor(1e3 * e + o) + Qt, u = tr("sqrtTall", m, v, o, t), u.style.minWidth = "0.742em", b = 1.056), u.height = p, u.style.height = A(m), {
				span: u,
				advanceWidth: b,
				ruleWidth: (t.fontMetrics().sqrtRuleThickness + o) * i
			}
		},
		Ba = ["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "\u230A", "\u230B", "\\lceil", "\\rceil", "\u2308", "\u2309", "\\surd"],
		zi = ["\\uparrow", "\\downarrow", "\\updownarrow", "\\Uparrow", "\\Downarrow", "\\Updownarrow", "|", "\\|", "\\vert", "\\Vert", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "\u27EE", "\u27EF", "\\lmoustache", "\\rmoustache", "\u23B0", "\u23B1"],
		Ea = ["<", ">", "\\langle", "\\rangle", "/", "\\backslash", "\\lt", "\\gt"],
		Le = [0, 1.2, 1.8, 2.4, 3],
		Ai = function(e, t, a, n, i) {
			if (e === "<" || e === "\\lt" || e === "\u27E8" ? e = "\\langle" : (e === ">" || e === "\\gt" || e === "\u27E9") && (e = "\\rangle"), R.contains(Ba, e) || R.contains(Ea, e)) return Aa(e, t, !1, a, n, i);
			if (R.contains(zi, e)) return Ta(e, Le[t], !1, a, n, i);
			throw new M("Illegal delimiter: '" + e + "'")
		},
		Ti = [{
			type: "small",
			style: N.SCRIPTSCRIPT
		}, {
			type: "small",
			style: N.SCRIPT
		}, {
			type: "small",
			style: N.TEXT
		}, {
			type: "large",
			size: 1
		}, {
			type: "large",
			size: 2
		}, {
			type: "large",
			size: 3
		}, {
			type: "large",
			size: 4
		}],
		Bi = [{
			type: "small",
			style: N.SCRIPTSCRIPT
		}, {
			type: "small",
			style: N.SCRIPT
		}, {
			type: "small",
			style: N.TEXT
		}, {
			type: "stack"
		}],
		Ca = [{
			type: "small",
			style: N.SCRIPTSCRIPT
		}, {
			type: "small",
			style: N.SCRIPT
		}, {
			type: "small",
			style: N.TEXT
		}, {
			type: "large",
			size: 1
		}, {
			type: "large",
			size: 2
		}, {
			type: "large",
			size: 3
		}, {
			type: "large",
			size: 4
		}, {
			type: "stack"
		}],
		Ei = function(e) {
			if (e.type === "small") return "Main-Regular";
			if (e.type === "large") return "Size" + e.size + "-Regular";
			if (e.type === "stack") return "Size4-Regular";
			throw new Error("Add support for delim type '" + e.type + "' here.")
		},
		Da = function(e, t, a, n) {
			for (var i = Math.min(2, 3 - n.style.size), o = i; o < a.length && a[o].type !== "stack"; o++) {
				var u = Oe(e, Ei(a[o]), "math"),
					m = u.height + u.depth;
				if (a[o].type === "small") {
					var p = n.havingBaseStyle(a[o].style);
					m *= p.sizeMultiplier
				}
				if (m > t) return a[o]
			}
			return a[a.length - 1]
		},
		Na = function(e, t, a, n, i, o) {
			e === "<" || e === "\\lt" || e === "\u27E8" ? e = "\\langle" : (e === ">" || e === "\\gt" || e === "\u27E9") && (e = "\\rangle");
			var u;
			R.contains(Ea, e) ? u = Ti : R.contains(Ba, e) ? u = Ca : u = Bi;
			var m = Da(e, t, u, n);
			return m.type === "small" ? wi(e, m.style, a, n, i, o) : m.type === "large" ? Aa(e, m.size, a, n, i, o) : Ta(e, t, a, n, i, o)
		},
		Ci = function(e, t, a, n, i, o) {
			var u = n.fontMetrics().axisHeight * n.sizeMultiplier,
				m = 901,
				p = 5 / n.fontMetrics().ptPerEm,
				v = Math.max(t - u, a + u),
				b = Math.max(v / 500 * m, 2 * v - p);
			return Na(e, b, !0, n, i, o)
		},
		U0 = {
			sqrtImage: Mi,
			sizedDelim: Ai,
			sizeToMaxHeight: Le,
			customSizedDelim: Na,
			leftRightDelim: Ci
		},
		qa = {
			"\\bigl": {
				mclass: "mopen",
				size: 1
			},
			"\\Bigl": {
				mclass: "mopen",
				size: 2
			},
			"\\biggl": {
				mclass: "mopen",
				size: 3
			},
			"\\Biggl": {
				mclass: "mopen",
				size: 4
			},
			"\\bigr": {
				mclass: "mclose",
				size: 1
			},
			"\\Bigr": {
				mclass: "mclose",
				size: 2
			},
			"\\biggr": {
				mclass: "mclose",
				size: 3
			},
			"\\Biggr": {
				mclass: "mclose",
				size: 4
			},
			"\\bigm": {
				mclass: "mrel",
				size: 1
			},
			"\\Bigm": {
				mclass: "mrel",
				size: 2
			},
			"\\biggm": {
				mclass: "mrel",
				size: 3
			},
			"\\Biggm": {
				mclass: "mrel",
				size: 4
			},
			"\\big": {
				mclass: "mord",
				size: 1
			},
			"\\Big": {
				mclass: "mord",
				size: 2
			},
			"\\bigg": {
				mclass: "mord",
				size: 3
			},
			"\\Bigg": {
				mclass: "mord",
				size: 4
			}
		},
		Di = ["(", "\\lparen", ")", "\\rparen", "[", "\\lbrack", "]", "\\rbrack", "\\{", "\\lbrace", "\\}", "\\rbrace", "\\lfloor", "\\rfloor", "\u230A", "\u230B", "\\lceil", "\\rceil", "\u2308", "\u2309", "<", ">", "\\langle", "\u27E8", "\\rangle", "\u27E9", "\\lt", "\\gt", "\\lvert", "\\rvert", "\\lVert", "\\rVert", "\\lgroup", "\\rgroup", "\u27EE", "\u27EF", "\\lmoustache", "\\rmoustache", "\u23B0", "\u23B1", "/", "\\backslash", "|", "\\vert", "\\|", "\\Vert", "\\uparrow", "\\Uparrow", "\\downarrow", "\\Downarrow", "\\updownarrow", "\\Updownarrow", "."];

	function ht(r, e) {
		var t = lt(r);
		if (t && R.contains(Di, t.text)) return t;
		throw t ? new M("Invalid delimiter '" + t.text + "' after '" + e.funcName + "'", r) : new M("Invalid delimiter type '" + r.type + "'", r)
	}
	B({
		type: "delimsizing",
		names: ["\\bigl", "\\Bigl", "\\biggl", "\\Biggl", "\\bigr", "\\Bigr", "\\biggr", "\\Biggr", "\\bigm", "\\Bigm", "\\biggm", "\\Biggm", "\\big", "\\Big", "\\bigg", "\\Bigg"],
		props: {
			numArgs: 1,
			argTypes: ["primitive"]
		},
		handler: (r, e) => {
			var t = ht(e[0], r);
			return {
				type: "delimsizing",
				mode: r.parser.mode,
				size: qa[r.funcName].size,
				mclass: qa[r.funcName].mclass,
				delim: t.text
			}
		},
		htmlBuilder: (r, e) => r.delim === "." ? y.makeSpan([r.mclass]) : U0.sizedDelim(r.delim, r.size, e, r.mode, [r.mclass]),
		mathmlBuilder: r => {
			var e = [];
			r.delim !== "." && e.push(M0(r.delim, r.mode));
			var t = new S.MathNode("mo", e);
			r.mclass === "mopen" || r.mclass === "mclose" ? t.setAttribute("fence", "true") : t.setAttribute("fence", "false"), t.setAttribute("stretchy", "true");
			var a = A(U0.sizeToMaxHeight[r.size]);
			return t.setAttribute("minsize", a), t.setAttribute("maxsize", a), t
		}
	});

	function Ra(r) {
		if (!r.body) throw new Error("Bug: The leftright ParseNode wasn't fully parsed.")
	}
	B({
		type: "leftright-right",
		names: ["\\right"],
		props: {
			numArgs: 1,
			primitive: !0
		},
		handler: (r, e) => {
			var t = r.parser.gullet.macros.get("\\current@color");
			if (t && typeof t != "string") throw new M("\\current@color set to non-string in \\right");
			return {
				type: "leftright-right",
				mode: r.parser.mode,
				delim: ht(e[0], r).text,
				color: t
			}
		}
	}), B({
		type: "leftright",
		names: ["\\left"],
		props: {
			numArgs: 1,
			primitive: !0
		},
		handler: (r, e) => {
			var t = ht(e[0], r),
				a = r.parser;
			++a.leftrightDepth;
			var n = a.parseExpression(!1);
			--a.leftrightDepth, a.expect("\\right", !1);
			var i = L(a.parseFunction(), "leftright-right");
			return {
				type: "leftright",
				mode: a.mode,
				body: n,
				left: t.text,
				right: i.delim,
				rightColor: i.color
			}
		},
		htmlBuilder: (r, e) => {
			Ra(r);
			for (var t = a0(r.body, e, !0, ["mopen", "mclose"]), a = 0, n = 0, i = !1, o = 0; o < t.length; o++) t[o].isMiddle ? i = !0 : (a = Math.max(t[o].height, a), n = Math.max(t[o].depth, n));
			a *= e.sizeMultiplier, n *= e.sizeMultiplier;
			var u;
			if (r.left === "." ? u = $e(e, ["mopen"]) : u = U0.leftRightDelim(r.left, a, n, e, r.mode, ["mopen"]), t.unshift(u), i)
				for (var m = 1; m < t.length; m++) {
					var p = t[m],
						v = p.isMiddle;
					v && (t[m] = U0.leftRightDelim(v.delim, a, n, v.options, r.mode, []))
				}
			var b;
			if (r.right === ".") b = $e(e, ["mclose"]);
			else {
				var x = r.rightColor ? e.withColor(r.rightColor) : e;
				b = U0.leftRightDelim(r.right, a, n, x, r.mode, ["mclose"])
			}
			return t.push(b), y.makeSpan(["minner"], t, e)
		},
		mathmlBuilder: (r, e) => {
			Ra(r);
			var t = c0(r.body, e);
			if (r.left !== ".") {
				var a = new S.MathNode("mo", [M0(r.left, r.mode)]);
				a.setAttribute("fence", "true"), t.unshift(a)
			}
			if (r.right !== ".") {
				var n = new S.MathNode("mo", [M0(r.right, r.mode)]);
				n.setAttribute("fence", "true"), r.rightColor && n.setAttribute("mathcolor", r.rightColor), t.push(n)
			}
			return jt(t)
		}
	}), B({
		type: "middle",
		names: ["\\middle"],
		props: {
			numArgs: 1,
			primitive: !0
		},
		handler: (r, e) => {
			var t = ht(e[0], r);
			if (!r.parser.leftrightDepth) throw new M("\\middle without preceding \\left", t);
			return {
				type: "middle",
				mode: r.parser.mode,
				delim: t.text
			}
		},
		htmlBuilder: (r, e) => {
			var t;
			if (r.delim === ".") t = $e(e, []);
			else {
				t = U0.sizedDelim(r.delim, 1, e, r.mode, []);
				var a = {
					delim: r.delim,
					options: e
				};
				t.isMiddle = a
			}
			return t
		},
		mathmlBuilder: (r, e) => {
			var t = r.delim === "\\vert" || r.delim === "|" ? M0("|", "text") : M0(r.delim, r.mode),
				a = new S.MathNode("mo", [t]);
			return a.setAttribute("fence", "true"), a.setAttribute("lspace", "0.05em"), a.setAttribute("rspace", "0.05em"), a
		}
	});
	var rr = (r, e) => {
			var t = y.wrapFragment(H(r.body, e), e),
				a = r.label.slice(1),
				n = e.sizeMultiplier,
				i, o = 0,
				u = R.isCharacterBox(r.body);
			if (a === "sout") i = y.makeSpan(["stretchy", "sout"]), i.height = e.fontMetrics().defaultRuleThickness / n, o = -.5 * e.fontMetrics().xHeight;
			else if (a === "phase") {
				var m = Z({
						number: .6,
						unit: "pt"
					}, e),
					p = Z({
						number: .35,
						unit: "ex"
					}, e),
					v = e.havingBaseSizing();
				n = n / v.sizeMultiplier;
				var b = t.height + t.depth + m + p;
				t.style.paddingLeft = A(b / 2 + m);
				var x = Math.floor(1e3 * b * n),
					w = Mn(x),
					z = new H0([new Z0("phase", w)], {
						width: "400em",
						height: A(x / 1e3),
						viewBox: "0 0 400000 " + x,
						preserveAspectRatio: "xMinYMin slice"
					});
				i = y.makeSvgSpan(["hide-tail"], [z], e), i.style.height = A(b), o = t.depth + m + p
			} else {
				/cancel/.test(a) ? u || t.classes.push("cancel-pad") : a === "angl" ? t.classes.push("anglpad") : t.classes.push("boxpad");
				var T = 0,
					C = 0,
					D = 0;
				/box/.test(a) ? (D = Math.max(e.fontMetrics().fboxrule, e.minRuleThickness), T = e.fontMetrics().fboxsep + (a === "colorbox" ? 0 : D), C = T) : a === "angl" ? (D = Math.max(e.fontMetrics().defaultRuleThickness, e.minRuleThickness), T = 4 * D, C = Math.max(0, .25 - t.depth)) : (T = u ? .2 : 0, C = T), i = j0.encloseSpan(t, a, T, C, e), /fbox|boxed|fcolorbox/.test(a) ? (i.style.borderStyle = "solid", i.style.borderWidth = A(D)) : a === "angl" && D !== .049 && (i.style.borderTopWidth = A(D), i.style.borderRightWidth = A(D)), o = t.depth + C, r.backgroundColor && (i.style.backgroundColor = r.backgroundColor, r.borderColor && (i.style.borderColor = r.borderColor))
			}
			var I;
			if (r.backgroundColor) I = y.makeVList({
				positionType: "individualShift",
				children: [{
					type: "elem",
					elem: i,
					shift: o
				}, {
					type: "elem",
					elem: t,
					shift: 0
				}]
			}, e);
			else {
				var O = /cancel|phase/.test(a) ? ["svg-align"] : [];
				I = y.makeVList({
					positionType: "individualShift",
					children: [{
						type: "elem",
						elem: t,
						shift: 0
					}, {
						type: "elem",
						elem: i,
						shift: o,
						wrapperClasses: O
					}]
				}, e)
			}
			return /cancel/.test(a) && (I.height = t.height, I.depth = t.depth), /cancel/.test(a) && !u ? y.makeSpan(["mord", "cancel-lap"], [I], e) : y.makeSpan(["mord"], [I], e)
		},
		ar = (r, e) => {
			var t = 0,
				a = new S.MathNode(r.label.indexOf("colorbox") > -1 ? "mpadded" : "menclose", [U(r.body, e)]);
			switch (r.label) {
				case "\\cancel":
					a.setAttribute("notation", "updiagonalstrike");
					break;
				case "\\bcancel":
					a.setAttribute("notation", "downdiagonalstrike");
					break;
				case "\\phase":
					a.setAttribute("notation", "phasorangle");
					break;
				case "\\sout":
					a.setAttribute("notation", "horizontalstrike");
					break;
				case "\\fbox":
					a.setAttribute("notation", "box");
					break;
				case "\\angl":
					a.setAttribute("notation", "actuarial");
					break;
				case "\\fcolorbox":
				case "\\colorbox":
					if (t = e.fontMetrics().fboxsep * e.fontMetrics().ptPerEm, a.setAttribute("width", "+" + 2 * t + "pt"), a.setAttribute("height", "+" + 2 * t + "pt"), a.setAttribute("lspace", t + "pt"), a.setAttribute("voffset", t + "pt"), r.label === "\\fcolorbox") {
						var n = Math.max(e.fontMetrics().fboxrule, e.minRuleThickness);
						a.setAttribute("style", "border: " + n + "em solid " + String(r.borderColor))
					}
					break;
				case "\\xcancel":
					a.setAttribute("notation", "updiagonalstrike downdiagonalstrike");
					break
			}
			return r.backgroundColor && a.setAttribute("mathbackground", r.backgroundColor), a
		};
	B({
		type: "enclose",
		names: ["\\colorbox"],
		props: {
			numArgs: 2,
			allowedInText: !0,
			argTypes: ["color", "text"]
		},
		handler(r, e, t) {
			var {
				parser: a,
				funcName: n
			} = r, i = L(e[0], "color-token").color, o = e[1];
			return {
				type: "enclose",
				mode: a.mode,
				label: n,
				backgroundColor: i,
				body: o
			}
		},
		htmlBuilder: rr,
		mathmlBuilder: ar
	}), B({
		type: "enclose",
		names: ["\\fcolorbox"],
		props: {
			numArgs: 3,
			allowedInText: !0,
			argTypes: ["color", "color", "text"]
		},
		handler(r, e, t) {
			var {
				parser: a,
				funcName: n
			} = r, i = L(e[0], "color-token").color, o = L(e[1], "color-token").color, u = e[2];
			return {
				type: "enclose",
				mode: a.mode,
				label: n,
				backgroundColor: o,
				borderColor: i,
				body: u
			}
		},
		htmlBuilder: rr,
		mathmlBuilder: ar
	}), B({
		type: "enclose",
		names: ["\\fbox"],
		props: {
			numArgs: 1,
			argTypes: ["hbox"],
			allowedInText: !0
		},
		handler(r, e) {
			var {
				parser: t
			} = r;
			return {
				type: "enclose",
				mode: t.mode,
				label: "\\fbox",
				body: e[0]
			}
		}
	}), B({
		type: "enclose",
		names: ["\\cancel", "\\bcancel", "\\xcancel", "\\sout", "\\phase"],
		props: {
			numArgs: 1
		},
		handler(r, e) {
			var {
				parser: t,
				funcName: a
			} = r, n = e[0];
			return {
				type: "enclose",
				mode: t.mode,
				label: a,
				body: n
			}
		},
		htmlBuilder: rr,
		mathmlBuilder: ar
	}), B({
		type: "enclose",
		names: ["\\angl"],
		props: {
			numArgs: 1,
			argTypes: ["hbox"],
			allowedInText: !1
		},
		handler(r, e) {
			var {
				parser: t
			} = r;
			return {
				type: "enclose",
				mode: t.mode,
				label: "\\angl",
				body: e[0]
			}
		}
	});
	var $a = {};

	function R0(r) {
		for (var {
				type: e,
				names: t,
				props: a,
				handler: n,
				htmlBuilder: i,
				mathmlBuilder: o
			} = r, u = {
				type: e,
				numArgs: a.numArgs || 0,
				allowedInText: !1,
				numOptionalArgs: 0,
				handler: n
			}, m = 0; m < t.length; ++m) $a[t[m]] = u;
		i && (rt[e] = i), o && (at[e] = o)
	}
	var Ia = {};

	function c(r, e) {
		Ia[r] = e
	}

	function Oa(r) {
		var e = [];
		r.consumeSpaces();
		var t = r.fetch().text;
		for (t === "\\relax" && (r.consume(), r.consumeSpaces(), t = r.fetch().text); t === "\\hline" || t === "\\hdashline";) r.consume(), e.push(t === "\\hdashline"), r.consumeSpaces(), t = r.fetch().text;
		return e
	}
	var mt = r => {
		var e = r.parser.settings;
		if (!e.displayMode) throw new M("{" + r.envName + "} can be used only in display mode.")
	};

	function nr(r) {
		if (r.indexOf("ed") === -1) return r.indexOf("*") === -1
	}

	function _0(r, e, t) {
		var {
			hskipBeforeAndAfter: a,
			addJot: n,
			cols: i,
			arraystretch: o,
			colSeparationType: u,
			autoTag: m,
			singleRow: p,
			emptySingleRow: v,
			maxNumCols: b,
			leqno: x
		} = e;
		if (r.gullet.beginGroup(), p || r.gullet.macros.set("\\cr", "\\\\\\relax"), !o) {
			var w = r.gullet.expandMacroAsText("\\arraystretch");
			if (w == null) o = 1;
			else if (o = parseFloat(w), !o || o < 0) throw new M("Invalid \\arraystretch: " + w)
		}
		r.gullet.beginGroup();
		var z = [],
			T = [z],
			C = [],
			D = [],
			I = m != null ? [] : void 0;

		function O() {
			m && r.gullet.macros.set("\\@eqnsw", "1", !0)
		}

		function G() {
			I && (r.gullet.macros.get("\\df@tag") ? (I.push(r.subparse([new D0("\\df@tag")])), r.gullet.macros.set("\\df@tag", void 0, !0)) : I.push(!!m && r.gullet.macros.get("\\@eqnsw") === "1"))
		}
		for (O(), D.push(Oa(r));;) {
			var F = r.parseExpression(!1, p ? "\\end" : "\\\\");
			r.gullet.endGroup(), r.gullet.beginGroup(), F = {
				type: "ordgroup",
				mode: r.mode,
				body: F
			}, t && (F = {
				type: "styling",
				mode: r.mode,
				style: t,
				body: [F]
			}), z.push(F);
			var V = r.fetch().text;
			if (V === "&") {
				if (b && z.length === b) {
					if (p || u) throw new M("Too many tab characters: &", r.nextToken);
					r.settings.reportNonstrict("textEnv", "Too few columns specified in the {array} column argument.")
				}
				r.consume()
			} else if (V === "\\end") {
				G(), z.length === 1 && F.type === "styling" && F.body[0].body.length === 0 && (T.length > 1 || !v) && T.pop(), D.length < T.length + 1 && D.push([]);
				break
			} else if (V === "\\\\") {
				r.consume();
				var P = void 0;
				r.gullet.future().text !== " " && (P = r.parseSizeGroup(!0)), C.push(P ? P.value : null), G(), D.push(Oa(r)), z = [], T.push(z), O()
			} else throw new M("Expected & or \\\\ or \\cr or \\end", r.nextToken)
		}
		return r.gullet.endGroup(), r.gullet.endGroup(), {
			type: "array",
			mode: r.mode,
			addJot: n,
			arraystretch: o,
			body: T,
			cols: i,
			rowGaps: C,
			hskipBeforeAndAfter: a,
			hLinesBeforeRow: D,
			colSeparationType: u,
			tags: I,
			leqno: x
		}
	}

	function ir(r) {
		return r.slice(0, 1) === "d" ? "display" : "text"
	}
	var $0 = function(e, t) {
			var a, n, i = e.body.length,
				o = e.hLinesBeforeRow,
				u = 0,
				m = new Array(i),
				p = [],
				v = Math.max(t.fontMetrics().arrayRuleWidth, t.minRuleThickness),
				b = 1 / t.fontMetrics().ptPerEm,
				x = 5 * b;
			if (e.colSeparationType && e.colSeparationType === "small") {
				var w = t.havingStyle(N.SCRIPT).sizeMultiplier;
				x = .2778 * (w / t.sizeMultiplier)
			}
			var z = e.colSeparationType === "CD" ? Z({
					number: 3,
					unit: "ex"
				}, t) : 12 * b,
				T = 3 * b,
				C = e.arraystretch * z,
				D = .7 * C,
				I = .3 * C,
				O = 0;

			function G(St) {
				for (var Mt = 0; Mt < St.length; ++Mt) Mt > 0 && (O += .25), p.push({
					pos: O,
					isDashed: St[Mt]
				})
			}
			for (G(o[0]), a = 0; a < e.body.length; ++a) {
				var F = e.body[a],
					V = D,
					P = I;
				u < F.length && (u = F.length);
				var J = new Array(F.length);
				for (n = 0; n < F.length; ++n) {
					var j = H(F[n], t);
					P < j.depth && (P = j.depth), V < j.height && (V = j.height), J[n] = j
				}
				var W0 = e.rowGaps[a],
					h0 = 0;
				W0 && (h0 = Z(W0, t), h0 > 0 && (h0 += I, P < h0 && (P = h0), h0 = 0)), e.addJot && (P += T), J.height = V, J.depth = P, O += V, J.pos = O, O += P + h0, m[a] = J, G(o[a + 1])
			}
			var i0 = O / 2 + t.fontMetrics().axisHeight,
				de = e.cols || [],
				f0 = [],
				E0, ae, Te = [];
			if (e.tags && e.tags.some(St => St))
				for (a = 0; a < i; ++a) {
					var Be = m[a],
						Cr = Be.pos - i0,
						ne = e.tags[a],
						ie = void 0;
					ne === !0 ? ie = y.makeSpan(["eqn-num"], [], t) : ne === !1 ? ie = y.makeSpan([], [], t) : ie = y.makeSpan([], a0(ne, t, !0), t), ie.depth = Be.depth, ie.height = Be.height, Te.push({
						type: "elem",
						elem: ie,
						shift: Cr
					})
				}
			for (n = 0, ae = 0; n < u || ae < de.length; ++n, ++ae) {
				for (var A0 = de[ae] || {}, Ge = !0; A0.type === "separator";) {
					if (Ge || (E0 = y.makeSpan(["arraycolsep"], []), E0.style.width = A(t.fontMetrics().doubleRuleSep), f0.push(E0)), A0.separator === "|" || A0.separator === ":") {
						var Dr = A0.separator === "|" ? "solid" : "dashed",
							Ee = y.makeSpan(["vertical-separator"], [], t);
						Ee.style.height = A(O), Ee.style.borderRightWidth = A(v), Ee.style.borderRightStyle = Dr, Ee.style.margin = "0 " + A(-v / 2);
						var L1 = O - i0;
						L1 && (Ee.style.verticalAlign = A(-L1)), f0.push(Ee)
					} else throw new M("Invalid separator type: " + A0.separator);
					ae++, A0 = de[ae] || {}, Ge = !1
				}
				if (!(n >= u)) {
					var Ce = void 0;
					(n > 0 || e.hskipBeforeAndAfter) && (Ce = R.deflt(A0.pregap, x), Ce !== 0 && (E0 = y.makeSpan(["arraycolsep"], []), E0.style.width = A(Ce), f0.push(E0)));
					var De = [];
					for (a = 0; a < i; ++a) {
						var xt = m[a],
							kt = xt[n];
						if (kt) {
							var Ks = xt.pos - i0;
							kt.depth = xt.depth, kt.height = xt.height, De.push({
								type: "elem",
								elem: kt,
								shift: Ks
							})
						}
					}
					De = y.makeVList({
						positionType: "individualShift",
						children: De
					}, t), De = y.makeSpan(["col-align-" + (A0.align || "c")], [De]), f0.push(De), (n < u - 1 || e.hskipBeforeAndAfter) && (Ce = R.deflt(A0.postgap, x), Ce !== 0 && (E0 = y.makeSpan(["arraycolsep"], []), E0.style.width = A(Ce), f0.push(E0)))
				}
			}
			if (m = y.makeSpan(["mtable"], f0), p.length > 0) {
				for (var Js = y.makeLineSpan("hline", t, v), _s = y.makeLineSpan("hdashline", t, v), Nr = [{
						type: "elem",
						elem: m,
						shift: 0
					}]; p.length > 0;) {
					var F1 = p.pop(),
						H1 = F1.pos - i0;
					F1.isDashed ? Nr.push({
						type: "elem",
						elem: _s,
						shift: H1
					}) : Nr.push({
						type: "elem",
						elem: Js,
						shift: H1
					})
				}
				m = y.makeVList({
					positionType: "individualShift",
					children: Nr
				}, t)
			}
			if (Te.length === 0) return y.makeSpan(["mord"], [m], t);
			var qr = y.makeVList({
				positionType: "individualShift",
				children: Te
			}, t);
			return qr = y.makeSpan(["tag"], [qr], t), y.makeFragment([m, qr])
		},
		Ni = {
			c: "center ",
			l: "left ",
			r: "right "
		},
		I0 = function(e, t) {
			for (var a = [], n = new S.MathNode("mtd", [], ["mtr-glue"]), i = new S.MathNode("mtd", [], ["mml-eqn-num"]), o = 0; o < e.body.length; o++) {
				for (var u = e.body[o], m = [], p = 0; p < u.length; p++) m.push(new S.MathNode("mtd", [U(u[p], t)]));
				e.tags && e.tags[o] && (m.unshift(n), m.push(n), e.leqno ? m.unshift(i) : m.push(i)), a.push(new S.MathNode("mtr", m))
			}
			var v = new S.MathNode("mtable", a),
				b = e.arraystretch === .5 ? .1 : .16 + e.arraystretch - 1 + (e.addJot ? .09 : 0);
			v.setAttribute("rowspacing", A(b));
			var x = "",
				w = "";
			if (e.cols && e.cols.length > 0) {
				var z = e.cols,
					T = "",
					C = !1,
					D = 0,
					I = z.length;
				z[0].type === "separator" && (x += "top ", D = 1), z[z.length - 1].type === "separator" && (x += "bottom ", I -= 1);
				for (var O = D; O < I; O++) z[O].type === "align" ? (w += Ni[z[O].align], C && (T += "none "), C = !0) : z[O].type === "separator" && C && (T += z[O].separator === "|" ? "solid " : "dashed ", C = !1);
				v.setAttribute("columnalign", w.trim()), /[sd]/.test(T) && v.setAttribute("columnlines", T.trim())
			}
			if (e.colSeparationType === "align") {
				for (var G = e.cols || [], F = "", V = 1; V < G.length; V++) F += V % 2 ? "0em " : "1em ";
				v.setAttribute("columnspacing", F.trim())
			} else e.colSeparationType === "alignat" || e.colSeparationType === "gather" ? v.setAttribute("columnspacing", "0em") : e.colSeparationType === "small" ? v.setAttribute("columnspacing", "0.2778em") : e.colSeparationType === "CD" ? v.setAttribute("columnspacing", "0.5em") : v.setAttribute("columnspacing", "1em");
			var P = "",
				J = e.hLinesBeforeRow;
			x += J[0].length > 0 ? "left " : "", x += J[J.length - 1].length > 0 ? "right " : "";
			for (var j = 1; j < J.length - 1; j++) P += J[j].length === 0 ? "none " : J[j][0] ? "dashed " : "solid ";
			return /[sd]/.test(P) && v.setAttribute("rowlines", P.trim()), x !== "" && (v = new S.MathNode("menclose", [v]), v.setAttribute("notation", x.trim())), e.arraystretch && e.arraystretch < 1 && (v = new S.MathNode("mstyle", [v]), v.setAttribute("scriptlevel", "1")), v
		},
		La = function(e, t) {
			e.envName.indexOf("ed") === -1 && mt(e);
			var a = [],
				n = e.envName.indexOf("at") > -1 ? "alignat" : "align",
				i = e.envName === "split",
				o = _0(e.parser, {
					cols: a,
					addJot: !0,
					autoTag: i ? void 0 : nr(e.envName),
					emptySingleRow: !0,
					colSeparationType: n,
					maxNumCols: i ? 2 : void 0,
					leqno: e.parser.settings.leqno
				}, "display"),
				u, m = 0,
				p = {
					type: "ordgroup",
					mode: e.mode,
					body: []
				};
			if (t[0] && t[0].type === "ordgroup") {
				for (var v = "", b = 0; b < t[0].body.length; b++) {
					var x = L(t[0].body[b], "textord");
					v += x.text
				}
				u = Number(v), m = u * 2
			}
			var w = !m;
			o.body.forEach(function(D) {
				for (var I = 1; I < D.length; I += 2) {
					var O = L(D[I], "styling"),
						G = L(O.body[0], "ordgroup");
					G.body.unshift(p)
				}
				if (w) m < D.length && (m = D.length);
				else {
					var F = D.length / 2;
					if (u < F) throw new M("Too many math in a row: " + ("expected " + u + ", but got " + F), D[0])
				}
			});
			for (var z = 0; z < m; ++z) {
				var T = "r",
					C = 0;
				z % 2 === 1 ? T = "l" : z > 0 && w && (C = 1), a[z] = {
					type: "align",
					align: T,
					pregap: C,
					postgap: 0
				}
			}
			return o.colSeparationType = w ? "align" : "alignat", o
		};
	R0({
		type: "array",
		names: ["array", "darray"],
		props: {
			numArgs: 1
		},
		handler(r, e) {
			var t = lt(e[0]),
				a = t ? [e[0]] : L(e[0], "ordgroup").body,
				n = a.map(function(o) {
					var u = Wt(o),
						m = u.text;
					if ("lcr".indexOf(m) !== -1) return {
						type: "align",
						align: m
					};
					if (m === "|") return {
						type: "separator",
						separator: "|"
					};
					if (m === ":") return {
						type: "separator",
						separator: ":"
					};
					throw new M("Unknown column alignment: " + m, o)
				}),
				i = {
					cols: n,
					hskipBeforeAndAfter: !0,
					maxNumCols: n.length
				};
			return _0(r.parser, i, ir(r.envName))
		},
		htmlBuilder: $0,
		mathmlBuilder: I0
	}), R0({
		type: "array",
		names: ["matrix", "pmatrix", "bmatrix", "Bmatrix", "vmatrix", "Vmatrix", "matrix*", "pmatrix*", "bmatrix*", "Bmatrix*", "vmatrix*", "Vmatrix*"],
		props: {
			numArgs: 0
		},
		handler(r) {
			var e = {
					matrix: null,
					pmatrix: ["(", ")"],
					bmatrix: ["[", "]"],
					Bmatrix: ["\\{", "\\}"],
					vmatrix: ["|", "|"],
					Vmatrix: ["\\Vert", "\\Vert"]
				} [r.envName.replace("*", "")],
				t = "c",
				a = {
					hskipBeforeAndAfter: !1,
					cols: [{
						type: "align",
						align: t
					}]
				};
			if (r.envName.charAt(r.envName.length - 1) === "*") {
				var n = r.parser;
				if (n.consumeSpaces(), n.fetch().text === "[") {
					if (n.consume(), n.consumeSpaces(), t = n.fetch().text, "lcr".indexOf(t) === -1) throw new M("Expected l or c or r", n.nextToken);
					n.consume(), n.consumeSpaces(), n.expect("]"), n.consume(), a.cols = [{
						type: "align",
						align: t
					}]
				}
			}
			var i = _0(r.parser, a, ir(r.envName)),
				o = Math.max(0, ...i.body.map(u => u.length));
			return i.cols = new Array(o).fill({
				type: "align",
				align: t
			}), e ? {
				type: "leftright",
				mode: r.mode,
				body: [i],
				left: e[0],
				right: e[1],
				rightColor: void 0
			} : i
		},
		htmlBuilder: $0,
		mathmlBuilder: I0
	}), R0({
		type: "array",
		names: ["smallmatrix"],
		props: {
			numArgs: 0
		},
		handler(r) {
			var e = {
					arraystretch: .5
				},
				t = _0(r.parser, e, "script");
			return t.colSeparationType = "small", t
		},
		htmlBuilder: $0,
		mathmlBuilder: I0
	}), R0({
		type: "array",
		names: ["subarray"],
		props: {
			numArgs: 1
		},
		handler(r, e) {
			var t = lt(e[0]),
				a = t ? [e[0]] : L(e[0], "ordgroup").body,
				n = a.map(function(o) {
					var u = Wt(o),
						m = u.text;
					if ("lc".indexOf(m) !== -1) return {
						type: "align",
						align: m
					};
					throw new M("Unknown column alignment: " + m, o)
				});
			if (n.length > 1) throw new M("{subarray} can contain only one column");
			var i = {
				cols: n,
				hskipBeforeAndAfter: !1,
				arraystretch: .5
			};
			if (i = _0(r.parser, i, "script"), i.body.length > 0 && i.body[0].length > 1) throw new M("{subarray} can contain only one column");
			return i
		},
		htmlBuilder: $0,
		mathmlBuilder: I0
	}), R0({
		type: "array",
		names: ["cases", "dcases", "rcases", "drcases"],
		props: {
			numArgs: 0
		},
		handler(r) {
			var e = {
					arraystretch: 1.2,
					cols: [{
						type: "align",
						align: "l",
						pregap: 0,
						postgap: 1
					}, {
						type: "align",
						align: "l",
						pregap: 0,
						postgap: 0
					}]
				},
				t = _0(r.parser, e, ir(r.envName));
			return {
				type: "leftright",
				mode: r.mode,
				body: [t],
				left: r.envName.indexOf("r") > -1 ? "." : "\\{",
				right: r.envName.indexOf("r") > -1 ? "\\}" : ".",
				rightColor: void 0
			}
		},
		htmlBuilder: $0,
		mathmlBuilder: I0
	}), R0({
		type: "array",
		names: ["align", "align*", "aligned", "split"],
		props: {
			numArgs: 0
		},
		handler: La,
		htmlBuilder: $0,
		mathmlBuilder: I0
	}), R0({
		type: "array",
		names: ["gathered", "gather", "gather*"],
		props: {
			numArgs: 0
		},
		handler(r) {
			R.contains(["gather", "gather*"], r.envName) && mt(r);
			var e = {
				cols: [{
					type: "align",
					align: "c"
				}],
				addJot: !0,
				colSeparationType: "gather",
				autoTag: nr(r.envName),
				emptySingleRow: !0,
				leqno: r.parser.settings.leqno
			};
			return _0(r.parser, e, "display")
		},
		htmlBuilder: $0,
		mathmlBuilder: I0
	}), R0({
		type: "array",
		names: ["alignat", "alignat*", "alignedat"],
		props: {
			numArgs: 1
		},
		handler: La,
		htmlBuilder: $0,
		mathmlBuilder: I0
	}), R0({
		type: "array",
		names: ["equation", "equation*"],
		props: {
			numArgs: 0
		},
		handler(r) {
			mt(r);
			var e = {
				autoTag: nr(r.envName),
				emptySingleRow: !0,
				singleRow: !0,
				maxNumCols: 1,
				leqno: r.parser.settings.leqno
			};
			return _0(r.parser, e, "display")
		},
		htmlBuilder: $0,
		mathmlBuilder: I0
	}), R0({
		type: "array",
		names: ["CD"],
		props: {
			numArgs: 0
		},
		handler(r) {
			return mt(r), bi(r.parser)
		},
		htmlBuilder: $0,
		mathmlBuilder: I0
	}), c("\\nonumber", "\\gdef\\@eqnsw{0}"), c("\\notag", "\\nonumber"), B({
		type: "text",
		names: ["\\hline", "\\hdashline"],
		props: {
			numArgs: 0,
			allowedInText: !0,
			allowedInMath: !0
		},
		handler(r, e) {
			throw new M(r.funcName + " valid only within array environment")
		}
	});
	var Fa = $a;
	B({
		type: "environment",
		names: ["\\begin", "\\end"],
		props: {
			numArgs: 1,
			argTypes: ["text"]
		},
		handler(r, e) {
			var {
				parser: t,
				funcName: a
			} = r, n = e[0];
			if (n.type !== "ordgroup") throw new M("Invalid environment name", n);
			for (var i = "", o = 0; o < n.body.length; ++o) i += L(n.body[o], "textord").text;
			if (a === "\\begin") {
				if (!Fa.hasOwnProperty(i)) throw new M("No such environment: " + i, n);
				var u = Fa[i],
					{
						args: m,
						optArgs: p
					} = t.parseArguments("\\begin{" + i + "}", u),
					v = {
						mode: t.mode,
						envName: i,
						parser: t
					},
					b = u.handler(v, m, p);
				t.expect("\\end", !1);
				var x = t.nextToken,
					w = L(t.parseFunction(), "environment");
				if (w.name !== i) throw new M("Mismatch: \\begin{" + i + "} matched by \\end{" + w.name + "}", x);
				return b
			}
			return {
				type: "environment",
				mode: t.mode,
				name: i,
				nameGroup: n
			}
		}
	});
	var Ha = (r, e) => {
			var t = r.font,
				a = e.withFont(t);
			return H(r.body, a)
		},
		Pa = (r, e) => {
			var t = r.font,
				a = e.withFont(t);
			return U(r.body, a)
		},
		Ga = {
			"\\Bbb": "\\mathbb",
			"\\bold": "\\mathbf",
			"\\frak": "\\mathfrak",
			"\\bm": "\\boldsymbol"
		};
	B({
		type: "font",
		names: ["\\mathrm", "\\mathit", "\\mathbf", "\\mathnormal", "\\mathbb", "\\mathcal", "\\mathfrak", "\\mathscr", "\\mathsf", "\\mathtt", "\\Bbb", "\\bold", "\\frak"],
		props: {
			numArgs: 1,
			allowedInArgument: !0
		},
		handler: (r, e) => {
			var {
				parser: t,
				funcName: a
			} = r, n = nt(e[0]), i = a;
			return i in Ga && (i = Ga[i]), {
				type: "font",
				mode: t.mode,
				font: i.slice(1),
				body: n
			}
		},
		htmlBuilder: Ha,
		mathmlBuilder: Pa
	}), B({
		type: "mclass",
		names: ["\\boldsymbol", "\\bm"],
		props: {
			numArgs: 1
		},
		handler: (r, e) => {
			var {
				parser: t
			} = r, a = e[0], n = R.isCharacterBox(a);
			return {
				type: "mclass",
				mode: t.mode,
				mclass: ot(a),
				body: [{
					type: "font",
					mode: t.mode,
					font: "boldsymbol",
					body: a
				}],
				isCharacterBox: n
			}
		}
	}), B({
		type: "font",
		names: ["\\rm", "\\sf", "\\tt", "\\bf", "\\it", "\\cal"],
		props: {
			numArgs: 0,
			allowedInText: !0
		},
		handler: (r, e) => {
			var {
				parser: t,
				funcName: a,
				breakOnTokenText: n
			} = r, {
				mode: i
			} = t, o = t.parseExpression(!0, n), u = "math" + a.slice(1);
			return {
				type: "font",
				mode: i,
				font: u,
				body: {
					type: "ordgroup",
					mode: t.mode,
					body: o
				}
			}
		},
		htmlBuilder: Ha,
		mathmlBuilder: Pa
	});
	var Va = (r, e) => {
			var t = e;
			return r === "display" ? t = t.id >= N.SCRIPT.id ? t.text() : N.DISPLAY : r === "text" && t.size === N.DISPLAY.size ? t = N.TEXT : r === "script" ? t = N.SCRIPT : r === "scriptscript" && (t = N.SCRIPTSCRIPT), t
		},
		lr = (r, e) => {
			var t = Va(r.size, e.style),
				a = t.fracNum(),
				n = t.fracDen(),
				i;
			i = e.havingStyle(a);
			var o = H(r.numer, i, e);
			if (r.continued) {
				var u = 8.5 / e.fontMetrics().ptPerEm,
					m = 3.5 / e.fontMetrics().ptPerEm;
				o.height = o.height < u ? u : o.height, o.depth = o.depth < m ? m : o.depth
			}
			i = e.havingStyle(n);
			var p = H(r.denom, i, e),
				v, b, x;
			r.hasBarLine ? (r.barSize ? (b = Z(r.barSize, e), v = y.makeLineSpan("frac-line", e, b)) : v = y.makeLineSpan("frac-line", e), b = v.height, x = v.height) : (v = null, b = 0, x = e.fontMetrics().defaultRuleThickness);
			var w, z, T;
			t.size === N.DISPLAY.size || r.size === "display" ? (w = e.fontMetrics().num1, b > 0 ? z = 3 * x : z = 7 * x, T = e.fontMetrics().denom1) : (b > 0 ? (w = e.fontMetrics().num2, z = x) : (w = e.fontMetrics().num3, z = 3 * x), T = e.fontMetrics().denom2);
			var C;
			if (v) {
				var I = e.fontMetrics().axisHeight;
				w - o.depth - (I + .5 * b) < z && (w += z - (w - o.depth - (I + .5 * b))), I - .5 * b - (p.height - T) < z && (T += z - (I - .5 * b - (p.height - T)));
				var O = -(I - .5 * b);
				C = y.makeVList({
					positionType: "individualShift",
					children: [{
						type: "elem",
						elem: p,
						shift: T
					}, {
						type: "elem",
						elem: v,
						shift: O
					}, {
						type: "elem",
						elem: o,
						shift: -w
					}]
				}, e)
			} else {
				var D = w - o.depth - (p.height - T);
				D < z && (w += .5 * (z - D), T += .5 * (z - D)), C = y.makeVList({
					positionType: "individualShift",
					children: [{
						type: "elem",
						elem: p,
						shift: T
					}, {
						type: "elem",
						elem: o,
						shift: -w
					}]
				}, e)
			}
			i = e.havingStyle(t), C.height *= i.sizeMultiplier / e.sizeMultiplier, C.depth *= i.sizeMultiplier / e.sizeMultiplier;
			var G;
			t.size === N.DISPLAY.size ? G = e.fontMetrics().delim1 : t.size === N.SCRIPTSCRIPT.size ? G = e.havingStyle(N.SCRIPT).fontMetrics().delim2 : G = e.fontMetrics().delim2;
			var F, V;
			return r.leftDelim == null ? F = $e(e, ["mopen"]) : F = U0.customSizedDelim(r.leftDelim, G, !0, e.havingStyle(t), r.mode, ["mopen"]), r.continued ? V = y.makeSpan([]) : r.rightDelim == null ? V = $e(e, ["mclose"]) : V = U0.customSizedDelim(r.rightDelim, G, !0, e.havingStyle(t), r.mode, ["mclose"]), y.makeSpan(["mord"].concat(i.sizingClasses(e)), [F, y.makeSpan(["mfrac"], [C]), V], e)
		},
		sr = (r, e) => {
			var t = new S.MathNode("mfrac", [U(r.numer, e), U(r.denom, e)]);
			if (!r.hasBarLine) t.setAttribute("linethickness", "0px");
			else if (r.barSize) {
				var a = Z(r.barSize, e);
				t.setAttribute("linethickness", A(a))
			}
			var n = Va(r.size, e.style);
			if (n.size !== e.style.size) {
				t = new S.MathNode("mstyle", [t]);
				var i = n.size === N.DISPLAY.size ? "true" : "false";
				t.setAttribute("displaystyle", i), t.setAttribute("scriptlevel", "0")
			}
			if (r.leftDelim != null || r.rightDelim != null) {
				var o = [];
				if (r.leftDelim != null) {
					var u = new S.MathNode("mo", [new S.TextNode(r.leftDelim.replace("\\", ""))]);
					u.setAttribute("fence", "true"), o.push(u)
				}
				if (o.push(t), r.rightDelim != null) {
					var m = new S.MathNode("mo", [new S.TextNode(r.rightDelim.replace("\\", ""))]);
					m.setAttribute("fence", "true"), o.push(m)
				}
				return jt(o)
			}
			return t
		};
	B({
		type: "genfrac",
		names: ["\\dfrac", "\\frac", "\\tfrac", "\\dbinom", "\\binom", "\\tbinom", "\\\\atopfrac", "\\\\bracefrac", "\\\\brackfrac"],
		props: {
			numArgs: 2,
			allowedInArgument: !0
		},
		handler: (r, e) => {
			var {
				parser: t,
				funcName: a
			} = r, n = e[0], i = e[1], o, u = null, m = null, p = "auto";
			switch (a) {
				case "\\dfrac":
				case "\\frac":
				case "\\tfrac":
					o = !0;
					break;
				case "\\\\atopfrac":
					o = !1;
					break;
				case "\\dbinom":
				case "\\binom":
				case "\\tbinom":
					o = !1, u = "(", m = ")";
					break;
				case "\\\\bracefrac":
					o = !1, u = "\\{", m = "\\}";
					break;
				case "\\\\brackfrac":
					o = !1, u = "[", m = "]";
					break;
				default:
					throw new Error("Unrecognized genfrac command")
			}
			switch (a) {
				case "\\dfrac":
				case "\\dbinom":
					p = "display";
					break;
				case "\\tfrac":
				case "\\tbinom":
					p = "text";
					break
			}
			return {
				type: "genfrac",
				mode: t.mode,
				continued: !1,
				numer: n,
				denom: i,
				hasBarLine: o,
				leftDelim: u,
				rightDelim: m,
				size: p,
				barSize: null
			}
		},
		htmlBuilder: lr,
		mathmlBuilder: sr
	}), B({
		type: "genfrac",
		names: ["\\cfrac"],
		props: {
			numArgs: 2
		},
		handler: (r, e) => {
			var {
				parser: t,
				funcName: a
			} = r, n = e[0], i = e[1];
			return {
				type: "genfrac",
				mode: t.mode,
				continued: !0,
				numer: n,
				denom: i,
				hasBarLine: !0,
				leftDelim: null,
				rightDelim: null,
				size: "display",
				barSize: null
			}
		}
	}), B({
		type: "infix",
		names: ["\\over", "\\choose", "\\atop", "\\brace", "\\brack"],
		props: {
			numArgs: 0,
			infix: !0
		},
		handler(r) {
			var {
				parser: e,
				funcName: t,
				token: a
			} = r, n;
			switch (t) {
				case "\\over":
					n = "\\frac";
					break;
				case "\\choose":
					n = "\\binom";
					break;
				case "\\atop":
					n = "\\\\atopfrac";
					break;
				case "\\brace":
					n = "\\\\bracefrac";
					break;
				case "\\brack":
					n = "\\\\brackfrac";
					break;
				default:
					throw new Error("Unrecognized infix genfrac command")
			}
			return {
				type: "infix",
				mode: e.mode,
				replaceWith: n,
				token: a
			}
		}
	});
	var ja = ["display", "text", "script", "scriptscript"],
		Ua = function(e) {
			var t = null;
			return e.length > 0 && (t = e, t = t === "." ? null : t), t
		};
	B({
		type: "genfrac",
		names: ["\\genfrac"],
		props: {
			numArgs: 6,
			allowedInArgument: !0,
			argTypes: ["math", "math", "size", "text", "math", "math"]
		},
		handler(r, e) {
			var {
				parser: t
			} = r, a = e[4], n = e[5], i = nt(e[0]), o = i.type === "atom" && i.family === "open" ? Ua(i.text) : null, u = nt(e[1]), m = u.type === "atom" && u.family === "close" ? Ua(u.text) : null, p = L(e[2], "size"), v, b = null;
			p.isBlank ? v = !0 : (b = p.value, v = b.number > 0);
			var x = "auto",
				w = e[3];
			if (w.type === "ordgroup") {
				if (w.body.length > 0) {
					var z = L(w.body[0], "textord");
					x = ja[Number(z.text)]
				}
			} else w = L(w, "textord"), x = ja[Number(w.text)];
			return {
				type: "genfrac",
				mode: t.mode,
				numer: a,
				denom: n,
				continued: !1,
				hasBarLine: v,
				barSize: b,
				leftDelim: o,
				rightDelim: m,
				size: x
			}
		},
		htmlBuilder: lr,
		mathmlBuilder: sr
	}), B({
		type: "infix",
		names: ["\\above"],
		props: {
			numArgs: 1,
			argTypes: ["size"],
			infix: !0
		},
		handler(r, e) {
			var {
				parser: t,
				funcName: a,
				token: n
			} = r;
			return {
				type: "infix",
				mode: t.mode,
				replaceWith: "\\\\abovefrac",
				size: L(e[0], "size").value,
				token: n
			}
		}
	}), B({
		type: "genfrac",
		names: ["\\\\abovefrac"],
		props: {
			numArgs: 3,
			argTypes: ["math", "size", "math"]
		},
		handler: (r, e) => {
			var {
				parser: t,
				funcName: a
			} = r, n = e[0], i = un(L(e[1], "infix").size), o = e[2], u = i.number > 0;
			return {
				type: "genfrac",
				mode: t.mode,
				numer: n,
				denom: o,
				continued: !1,
				hasBarLine: u,
				barSize: i,
				leftDelim: null,
				rightDelim: null,
				size: "auto"
			}
		},
		htmlBuilder: lr,
		mathmlBuilder: sr
	});
	var Wa = (r, e) => {
			var t = e.style,
				a, n;
			r.type === "supsub" ? (a = r.sup ? H(r.sup, e.havingStyle(t.sup()), e) : H(r.sub, e.havingStyle(t.sub()), e), n = L(r.base, "horizBrace")) : n = L(r, "horizBrace");
			var i = H(n.base, e.havingBaseStyle(N.DISPLAY)),
				o = j0.svgSpan(n, e),
				u;
			if (n.isOver ? (u = y.makeVList({
					positionType: "firstBaseline",
					children: [{
						type: "elem",
						elem: i
					}, {
						type: "kern",
						size: .1
					}, {
						type: "elem",
						elem: o
					}]
				}, e), u.children[0].children[0].children[1].classes.push("svg-align")) : (u = y.makeVList({
					positionType: "bottom",
					positionData: i.depth + .1 + o.height,
					children: [{
						type: "elem",
						elem: o
					}, {
						type: "kern",
						size: .1
					}, {
						type: "elem",
						elem: i
					}]
				}, e), u.children[0].children[0].children[0].classes.push("svg-align")), a) {
				var m = y.makeSpan(["mord", n.isOver ? "mover" : "munder"], [u], e);
				n.isOver ? u = y.makeVList({
					positionType: "firstBaseline",
					children: [{
						type: "elem",
						elem: m
					}, {
						type: "kern",
						size: .2
					}, {
						type: "elem",
						elem: a
					}]
				}, e) : u = y.makeVList({
					positionType: "bottom",
					positionData: m.depth + .2 + a.height + a.depth,
					children: [{
						type: "elem",
						elem: a
					}, {
						type: "kern",
						size: .2
					}, {
						type: "elem",
						elem: m
					}]
				}, e)
			}
			return y.makeSpan(["mord", n.isOver ? "mover" : "munder"], [u], e)
		},
		qi = (r, e) => {
			var t = j0.mathMLnode(r.label);
			return new S.MathNode(r.isOver ? "mover" : "munder", [U(r.base, e), t])
		};
	B({
		type: "horizBrace",
		names: ["\\overbrace", "\\underbrace"],
		props: {
			numArgs: 1
		},
		handler(r, e) {
			var {
				parser: t,
				funcName: a
			} = r;
			return {
				type: "horizBrace",
				mode: t.mode,
				label: a,
				isOver: /^\\over/.test(a),
				base: e[0]
			}
		},
		htmlBuilder: Wa,
		mathmlBuilder: qi
	}), B({
		type: "href",
		names: ["\\href"],
		props: {
			numArgs: 2,
			argTypes: ["url", "original"],
			allowedInText: !0
		},
		handler: (r, e) => {
			var {
				parser: t
			} = r, a = e[1], n = L(e[0], "url").url;
			return t.settings.isTrusted({
				command: "\\href",
				url: n
			}) ? {
				type: "href",
				mode: t.mode,
				href: n,
				body: e0(a)
			} : t.formatUnsupportedCmd("\\href")
		},
		htmlBuilder: (r, e) => {
			var t = a0(r.body, e, !1);
			return y.makeAnchor(r.href, [], t, e)
		},
		mathmlBuilder: (r, e) => {
			var t = J0(r.body, e);
			return t instanceof S0 || (t = new S0("mrow", [t])), t.setAttribute("href", r.href), t
		}
	}), B({
		type: "href",
		names: ["\\url"],
		props: {
			numArgs: 1,
			argTypes: ["url"],
			allowedInText: !0
		},
		handler: (r, e) => {
			var {
				parser: t
			} = r, a = L(e[0], "url").url;
			if (!t.settings.isTrusted({
					command: "\\url",
					url: a
				})) return t.formatUnsupportedCmd("\\url");
			for (var n = [], i = 0; i < a.length; i++) {
				var o = a[i];
				o === "~" && (o = "\\textasciitilde"), n.push({
					type: "textord",
					mode: "text",
					text: o
				})
			}
			var u = {
				type: "text",
				mode: t.mode,
				font: "\\texttt",
				body: n
			};
			return {
				type: "href",
				mode: t.mode,
				href: a,
				body: e0(u)
			}
		}
	}), B({
		type: "hbox",
		names: ["\\hbox"],
		props: {
			numArgs: 1,
			argTypes: ["text"],
			allowedInText: !0,
			primitive: !0
		},
		handler(r, e) {
			var {
				parser: t
			} = r;
			return {
				type: "hbox",
				mode: t.mode,
				body: e0(e[0])
			}
		},
		htmlBuilder(r, e) {
			var t = a0(r.body, e, !1);
			return y.makeFragment(t)
		},
		mathmlBuilder(r, e) {
			return new S.MathNode("mrow", c0(r.body, e))
		}
	}), B({
		type: "html",
		names: ["\\htmlClass", "\\htmlId", "\\htmlStyle", "\\htmlData"],
		props: {
			numArgs: 2,
			argTypes: ["raw", "original"],
			allowedInText: !0
		},
		handler: (r, e) => {
			var {
				parser: t,
				funcName: a,
				token: n
			} = r, i = L(e[0], "raw").string, o = e[1];
			t.settings.strict && t.settings.reportNonstrict("htmlExtension", "HTML extension is disabled on strict mode");
			var u, m = {};
			switch (a) {
				case "\\htmlClass":
					m.class = i, u = {
						command: "\\htmlClass",
						class: i
					};
					break;
				case "\\htmlId":
					m.id = i, u = {
						command: "\\htmlId",
						id: i
					};
					break;
				case "\\htmlStyle":
					m.style = i, u = {
						command: "\\htmlStyle",
						style: i
					};
					break;
				case "\\htmlData": {
					for (var p = i.split(","), v = 0; v < p.length; v++) {
						var b = p[v].split("=");
						if (b.length !== 2) throw new M("Error parsing key-value for \\htmlData");
						m["data-" + b[0].trim()] = b[1].trim()
					}
					u = {
						command: "\\htmlData",
						attributes: m
					};
					break
				}
				default:
					throw new Error("Unrecognized html command")
			}
			return t.settings.isTrusted(u) ? {
				type: "html",
				mode: t.mode,
				attributes: m,
				body: e0(o)
			} : t.formatUnsupportedCmd(a)
		},
		htmlBuilder: (r, e) => {
			var t = a0(r.body, e, !1),
				a = ["enclosing"];
			r.attributes.class && a.push(...r.attributes.class.trim().split(/\s+/));
			var n = y.makeSpan(a, t, e);
			for (var i in r.attributes) i !== "class" && r.attributes.hasOwnProperty(i) && n.setAttribute(i, r.attributes[i]);
			return n
		},
		mathmlBuilder: (r, e) => J0(r.body, e)
	}), B({
		type: "htmlmathml",
		names: ["\\html@mathml"],
		props: {
			numArgs: 2,
			allowedInText: !0
		},
		handler: (r, e) => {
			var {
				parser: t
			} = r;
			return {
				type: "htmlmathml",
				mode: t.mode,
				html: e0(e[0]),
				mathml: e0(e[1])
			}
		},
		htmlBuilder: (r, e) => {
			var t = a0(r.html, e, !1);
			return y.makeFragment(t)
		},
		mathmlBuilder: (r, e) => J0(r.mathml, e)
	});
	var or = function(e) {
		if (/^[-+]? *(\d+(\.\d*)?|\.\d+)$/.test(e)) return {
			number: +e,
			unit: "bp"
		};
		var t = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(e);
		if (!t) throw new M("Invalid size: '" + e + "' in \\includegraphics");
		var a = {
			number: +(t[1] + t[2]),
			unit: t[3]
		};
		if (!Xr(a)) throw new M("Invalid unit: '" + a.unit + "' in \\includegraphics.");
		return a
	};
	B({
		type: "includegraphics",
		names: ["\\includegraphics"],
		props: {
			numArgs: 1,
			numOptionalArgs: 1,
			argTypes: ["raw", "url"],
			allowedInText: !1
		},
		handler: (r, e, t) => {
			var {
				parser: a
			} = r, n = {
				number: 0,
				unit: "em"
			}, i = {
				number: .9,
				unit: "em"
			}, o = {
				number: 0,
				unit: "em"
			}, u = "";
			if (t[0])
				for (var m = L(t[0], "raw").string, p = m.split(","), v = 0; v < p.length; v++) {
					var b = p[v].split("=");
					if (b.length === 2) {
						var x = b[1].trim();
						switch (b[0].trim()) {
							case "alt":
								u = x;
								break;
							case "width":
								n = or(x);
								break;
							case "height":
								i = or(x);
								break;
							case "totalheight":
								o = or(x);
								break;
							default:
								throw new M("Invalid key: '" + b[0] + "' in \\includegraphics.")
						}
					}
				}
			var w = L(e[0], "url").url;
			return u === "" && (u = w, u = u.replace(/^.*[\\/]/, ""), u = u.substring(0, u.lastIndexOf("."))), a.settings.isTrusted({
				command: "\\includegraphics",
				url: w
			}) ? {
				type: "includegraphics",
				mode: a.mode,
				alt: u,
				width: n,
				height: i,
				totalheight: o,
				src: w
			} : a.formatUnsupportedCmd("\\includegraphics")
		},
		htmlBuilder: (r, e) => {
			var t = Z(r.height, e),
				a = 0;
			r.totalheight.number > 0 && (a = Z(r.totalheight, e) - t);
			var n = 0;
			r.width.number > 0 && (n = Z(r.width, e));
			var i = {
				height: A(t + a)
			};
			n > 0 && (i.width = A(n)), a > 0 && (i.verticalAlign = A(-a));
			var o = new qn(r.src, r.alt, i);
			return o.height = t, o.depth = a, o
		},
		mathmlBuilder: (r, e) => {
			var t = new S.MathNode("mglyph", []);
			t.setAttribute("alt", r.alt);
			var a = Z(r.height, e),
				n = 0;
			if (r.totalheight.number > 0 && (n = Z(r.totalheight, e) - a, t.setAttribute("valign", A(-n))), t.setAttribute("height", A(a + n)), r.width.number > 0) {
				var i = Z(r.width, e);
				t.setAttribute("width", A(i))
			}
			return t.setAttribute("src", r.src), t
		}
	}), B({
		type: "kern",
		names: ["\\kern", "\\mkern", "\\hskip", "\\mskip"],
		props: {
			numArgs: 1,
			argTypes: ["size"],
			primitive: !0,
			allowedInText: !0
		},
		handler(r, e) {
			var {
				parser: t,
				funcName: a
			} = r, n = L(e[0], "size");
			if (t.settings.strict) {
				var i = a[1] === "m",
					o = n.value.unit === "mu";
				i ? (o || t.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + a + " supports only mu units, " + ("not " + n.value.unit + " units")), t.mode !== "math" && t.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + a + " works only in math mode")) : o && t.settings.reportNonstrict("mathVsTextUnits", "LaTeX's " + a + " doesn't support mu units")
			}
			return {
				type: "kern",
				mode: t.mode,
				dimension: n.value
			}
		},
		htmlBuilder(r, e) {
			return y.makeGlue(r.dimension, e)
		},
		mathmlBuilder(r, e) {
			var t = Z(r.dimension, e);
			return new S.SpaceNode(t)
		}
	}), B({
		type: "lap",
		names: ["\\mathllap", "\\mathrlap", "\\mathclap"],
		props: {
			numArgs: 1,
			allowedInText: !0
		},
		handler: (r, e) => {
			var {
				parser: t,
				funcName: a
			} = r, n = e[0];
			return {
				type: "lap",
				mode: t.mode,
				alignment: a.slice(5),
				body: n
			}
		},
		htmlBuilder: (r, e) => {
			var t;
			r.alignment === "clap" ? (t = y.makeSpan([], [H(r.body, e)]), t = y.makeSpan(["inner"], [t], e)) : t = y.makeSpan(["inner"], [H(r.body, e)]);
			var a = y.makeSpan(["fix"], []),
				n = y.makeSpan([r.alignment], [t, a], e),
				i = y.makeSpan(["strut"]);
			return i.style.height = A(n.height + n.depth), n.depth && (i.style.verticalAlign = A(-n.depth)), n.children.unshift(i), n = y.makeSpan(["thinbox"], [n], e), y.makeSpan(["mord", "vbox"], [n], e)
		},
		mathmlBuilder: (r, e) => {
			var t = new S.MathNode("mpadded", [U(r.body, e)]);
			if (r.alignment !== "rlap") {
				var a = r.alignment === "llap" ? "-1" : "-0.5";
				t.setAttribute("lspace", a + "width")
			}
			return t.setAttribute("width", "0px"), t
		}
	}), B({
		type: "styling",
		names: ["\\(", "$"],
		props: {
			numArgs: 0,
			allowedInText: !0,
			allowedInMath: !1
		},
		handler(r, e) {
			var {
				funcName: t,
				parser: a
			} = r, n = a.mode;
			a.switchMode("math");
			var i = t === "\\(" ? "\\)" : "$",
				o = a.parseExpression(!1, i);
			return a.expect(i), a.switchMode(n), {
				type: "styling",
				mode: a.mode,
				style: "text",
				body: o
			}
		}
	}), B({
		type: "text",
		names: ["\\)", "\\]"],
		props: {
			numArgs: 0,
			allowedInText: !0,
			allowedInMath: !1
		},
		handler(r, e) {
			throw new M("Mismatched " + r.funcName)
		}
	});
	var Ya = (r, e) => {
		switch (e.style.size) {
			case N.DISPLAY.size:
				return r.display;
			case N.TEXT.size:
				return r.text;
			case N.SCRIPT.size:
				return r.script;
			case N.SCRIPTSCRIPT.size:
				return r.scriptscript;
			default:
				return r.text
		}
	};
	B({
		type: "mathchoice",
		names: ["\\mathchoice"],
		props: {
			numArgs: 4,
			primitive: !0
		},
		handler: (r, e) => {
			var {
				parser: t
			} = r;
			return {
				type: "mathchoice",
				mode: t.mode,
				display: e0(e[0]),
				text: e0(e[1]),
				script: e0(e[2]),
				scriptscript: e0(e[3])
			}
		},
		htmlBuilder: (r, e) => {
			var t = Ya(r, e),
				a = a0(t, e, !1);
			return y.makeFragment(a)
		},
		mathmlBuilder: (r, e) => {
			var t = Ya(r, e);
			return J0(t, e)
		}
	});
	var Xa = (r, e, t, a, n, i, o) => {
			r = y.makeSpan([], [r]);
			var u = t && R.isCharacterBox(t),
				m, p;
			if (e) {
				var v = H(e, a.havingStyle(n.sup()), a);
				p = {
					elem: v,
					kern: Math.max(a.fontMetrics().bigOpSpacing1, a.fontMetrics().bigOpSpacing3 - v.depth)
				}
			}
			if (t) {
				var b = H(t, a.havingStyle(n.sub()), a);
				m = {
					elem: b,
					kern: Math.max(a.fontMetrics().bigOpSpacing2, a.fontMetrics().bigOpSpacing4 - b.height)
				}
			}
			var x;
			if (p && m) {
				var w = a.fontMetrics().bigOpSpacing5 + m.elem.height + m.elem.depth + m.kern + r.depth + o;
				x = y.makeVList({
					positionType: "bottom",
					positionData: w,
					children: [{
						type: "kern",
						size: a.fontMetrics().bigOpSpacing5
					}, {
						type: "elem",
						elem: m.elem,
						marginLeft: A(-i)
					}, {
						type: "kern",
						size: m.kern
					}, {
						type: "elem",
						elem: r
					}, {
						type: "kern",
						size: p.kern
					}, {
						type: "elem",
						elem: p.elem,
						marginLeft: A(i)
					}, {
						type: "kern",
						size: a.fontMetrics().bigOpSpacing5
					}]
				}, a)
			} else if (m) {
				var z = r.height - o;
				x = y.makeVList({
					positionType: "top",
					positionData: z,
					children: [{
						type: "kern",
						size: a.fontMetrics().bigOpSpacing5
					}, {
						type: "elem",
						elem: m.elem,
						marginLeft: A(-i)
					}, {
						type: "kern",
						size: m.kern
					}, {
						type: "elem",
						elem: r
					}]
				}, a)
			} else if (p) {
				var T = r.depth + o;
				x = y.makeVList({
					positionType: "bottom",
					positionData: T,
					children: [{
						type: "elem",
						elem: r
					}, {
						type: "kern",
						size: p.kern
					}, {
						type: "elem",
						elem: p.elem,
						marginLeft: A(i)
					}, {
						type: "kern",
						size: a.fontMetrics().bigOpSpacing5
					}]
				}, a)
			} else return r;
			var C = [x];
			if (m && i !== 0 && !u) {
				var D = y.makeSpan(["mspace"], [], a);
				D.style.marginRight = A(i), C.unshift(D)
			}
			return y.makeSpan(["mop", "op-limits"], C, a)
		},
		Za = ["\\smallint"],
		xe = (r, e) => {
			var t, a, n = !1,
				i;
			r.type === "supsub" ? (t = r.sup, a = r.sub, i = L(r.base, "op"), n = !0) : i = L(r, "op");
			var o = e.style,
				u = !1;
			o.size === N.DISPLAY.size && i.symbol && !R.contains(Za, i.name) && (u = !0);
			var m;
			if (i.symbol) {
				var p = u ? "Size2-Regular" : "Size1-Regular",
					v = "";
				if ((i.name === "\\oiint" || i.name === "\\oiiint") && (v = i.name.slice(1), i.name = v === "oiint" ? "\\iint" : "\\iiint"), m = y.makeSymbol(i.name, p, "math", e, ["mop", "op-symbol", u ? "large-op" : "small-op"]), v.length > 0) {
					var b = m.italic,
						x = y.staticSvg(v + "Size" + (u ? "2" : "1"), e);
					m = y.makeVList({
						positionType: "individualShift",
						children: [{
							type: "elem",
							elem: m,
							shift: 0
						}, {
							type: "elem",
							elem: x,
							shift: u ? .08 : 0
						}]
					}, e), i.name = "\\" + v, m.classes.unshift("mop"), m.italic = b
				}
			} else if (i.body) {
				var w = a0(i.body, e, !0);
				w.length === 1 && w[0] instanceof k0 ? (m = w[0], m.classes[0] = "mop") : m = y.makeSpan(["mop"], w, e)
			} else {
				for (var z = [], T = 1; T < i.name.length; T++) z.push(y.mathsym(i.name[T], i.mode, e));
				m = y.makeSpan(["mop"], z, e)
			}
			var C = 0,
				D = 0;
			return (m instanceof k0 || i.name === "\\oiint" || i.name === "\\oiiint") && !i.suppressBaseShift && (C = (m.height - m.depth) / 2 - e.fontMetrics().axisHeight, D = m.italic), n ? Xa(m, t, a, e, o, D, C) : (C && (m.style.position = "relative", m.style.top = A(C)), m)
		},
		Fe = (r, e) => {
			var t;
			if (r.symbol) t = new S0("mo", [M0(r.name, r.mode)]), R.contains(Za, r.name) && t.setAttribute("largeop", "false");
			else if (r.body) t = new S0("mo", c0(r.body, e));
			else {
				t = new S0("mi", [new Ie(r.name.slice(1))]);
				var a = new S0("mo", [M0("\u2061", "text")]);
				r.parentIsSupSub ? t = new S0("mrow", [t, a]) : t = ca([t, a])
			}
			return t
		},
		Ri = {
			"\u220F": "\\prod",
			"\u2210": "\\coprod",
			"\u2211": "\\sum",
			"\u22C0": "\\bigwedge",
			"\u22C1": "\\bigvee",
			"\u22C2": "\\bigcap",
			"\u22C3": "\\bigcup",
			"\u2A00": "\\bigodot",
			"\u2A01": "\\bigoplus",
			"\u2A02": "\\bigotimes",
			"\u2A04": "\\biguplus",
			"\u2A06": "\\bigsqcup"
		};
	B({
		type: "op",
		names: ["\\coprod", "\\bigvee", "\\bigwedge", "\\biguplus", "\\bigcap", "\\bigcup", "\\intop", "\\prod", "\\sum", "\\bigotimes", "\\bigoplus", "\\bigodot", "\\bigsqcup", "\\smallint", "\u220F", "\u2210", "\u2211", "\u22C0", "\u22C1", "\u22C2", "\u22C3", "\u2A00", "\u2A01", "\u2A02", "\u2A04", "\u2A06"],
		props: {
			numArgs: 0
		},
		handler: (r, e) => {
			var {
				parser: t,
				funcName: a
			} = r, n = a;
			return n.length === 1 && (n = Ri[n]), {
				type: "op",
				mode: t.mode,
				limits: !0,
				parentIsSupSub: !1,
				symbol: !0,
				name: n
			}
		},
		htmlBuilder: xe,
		mathmlBuilder: Fe
	}), B({
		type: "op",
		names: ["\\mathop"],
		props: {
			numArgs: 1,
			primitive: !0
		},
		handler: (r, e) => {
			var {
				parser: t
			} = r, a = e[0];
			return {
				type: "op",
				mode: t.mode,
				limits: !1,
				parentIsSupSub: !1,
				symbol: !1,
				body: e0(a)
			}
		},
		htmlBuilder: xe,
		mathmlBuilder: Fe
	});
	var $i = {
		"\u222B": "\\int",
		"\u222C": "\\iint",
		"\u222D": "\\iiint",
		"\u222E": "\\oint",
		"\u222F": "\\oiint",
		"\u2230": "\\oiiint"
	};
	B({
		type: "op",
		names: ["\\arcsin", "\\arccos", "\\arctan", "\\arctg", "\\arcctg", "\\arg", "\\ch", "\\cos", "\\cosec", "\\cosh", "\\cot", "\\cotg", "\\coth", "\\csc", "\\ctg", "\\cth", "\\deg", "\\dim", "\\exp", "\\hom", "\\ker", "\\lg", "\\ln", "\\log", "\\sec", "\\sin", "\\sinh", "\\sh", "\\tan", "\\tanh", "\\tg", "\\th"],
		props: {
			numArgs: 0
		},
		handler(r) {
			var {
				parser: e,
				funcName: t
			} = r;
			return {
				type: "op",
				mode: e.mode,
				limits: !1,
				parentIsSupSub: !1,
				symbol: !1,
				name: t
			}
		},
		htmlBuilder: xe,
		mathmlBuilder: Fe
	}), B({
		type: "op",
		names: ["\\det", "\\gcd", "\\inf", "\\lim", "\\max", "\\min", "\\Pr", "\\sup"],
		props: {
			numArgs: 0
		},
		handler(r) {
			var {
				parser: e,
				funcName: t
			} = r;
			return {
				type: "op",
				mode: e.mode,
				limits: !0,
				parentIsSupSub: !1,
				symbol: !1,
				name: t
			}
		},
		htmlBuilder: xe,
		mathmlBuilder: Fe
	}), B({
		type: "op",
		names: ["\\int", "\\iint", "\\iiint", "\\oint", "\\oiint", "\\oiiint", "\u222B", "\u222C", "\u222D", "\u222E", "\u222F", "\u2230"],
		props: {
			numArgs: 0
		},
		handler(r) {
			var {
				parser: e,
				funcName: t
			} = r, a = t;
			return a.length === 1 && (a = $i[a]), {
				type: "op",
				mode: e.mode,
				limits: !1,
				parentIsSupSub: !1,
				symbol: !0,
				name: a
			}
		},
		htmlBuilder: xe,
		mathmlBuilder: Fe
	});
	var Ka = (r, e) => {
			var t, a, n = !1,
				i;
			r.type === "supsub" ? (t = r.sup, a = r.sub, i = L(r.base, "operatorname"), n = !0) : i = L(r, "operatorname");
			var o;
			if (i.body.length > 0) {
				for (var u = i.body.map(b => {
						var x = b.text;
						return typeof x == "string" ? {
							type: "textord",
							mode: b.mode,
							text: x
						} : b
					}), m = a0(u, e.withFont("mathrm"), !0), p = 0; p < m.length; p++) {
					var v = m[p];
					v instanceof k0 && (v.text = v.text.replace(/\u2212/, "-").replace(/\u2217/, "*"))
				}
				o = y.makeSpan(["mop"], m, e)
			} else o = y.makeSpan(["mop"], [], e);
			return n ? Xa(o, t, a, e, e.style, 0, 0) : o
		},
		Ii = (r, e) => {
			for (var t = c0(r.body, e.withFont("mathrm")), a = !0, n = 0; n < t.length; n++) {
				var i = t[n];
				if (!(i instanceof S.SpaceNode))
					if (i instanceof S.MathNode) switch (i.type) {
						case "mi":
						case "mn":
						case "ms":
						case "mspace":
						case "mtext":
							break;
						case "mo": {
							var o = i.children[0];
							i.children.length === 1 && o instanceof S.TextNode ? o.text = o.text.replace(/\u2212/, "-").replace(/\u2217/, "*") : a = !1;
							break
						}
						default:
							a = !1
					} else a = !1
			}
			if (a) {
				var u = t.map(v => v.toText()).join("");
				t = [new S.TextNode(u)]
			}
			var m = new S.MathNode("mi", t);
			m.setAttribute("mathvariant", "normal");
			var p = new S.MathNode("mo", [M0("\u2061", "text")]);
			return r.parentIsSupSub ? new S.MathNode("mrow", [m, p]) : S.newDocumentFragment([m, p])
		};
	B({
		type: "operatorname",
		names: ["\\operatorname@", "\\operatornamewithlimits"],
		props: {
			numArgs: 1
		},
		handler: (r, e) => {
			var {
				parser: t,
				funcName: a
			} = r, n = e[0];
			return {
				type: "operatorname",
				mode: t.mode,
				body: e0(n),
				alwaysHandleSupSub: a === "\\operatornamewithlimits",
				limits: !1,
				parentIsSupSub: !1
			}
		},
		htmlBuilder: Ka,
		mathmlBuilder: Ii
	}), c("\\operatorname", "\\@ifstar\\operatornamewithlimits\\operatorname@"), ue({
		type: "ordgroup",
		htmlBuilder(r, e) {
			return r.semisimple ? y.makeFragment(a0(r.body, e, !1)) : y.makeSpan(["mord"], a0(r.body, e, !0), e)
		},
		mathmlBuilder(r, e) {
			return J0(r.body, e, !0)
		}
	}), B({
		type: "overline",
		names: ["\\overline"],
		props: {
			numArgs: 1
		},
		handler(r, e) {
			var {
				parser: t
			} = r, a = e[0];
			return {
				type: "overline",
				mode: t.mode,
				body: a
			}
		},
		htmlBuilder(r, e) {
			var t = H(r.body, e.havingCrampedStyle()),
				a = y.makeLineSpan("overline-line", e),
				n = e.fontMetrics().defaultRuleThickness,
				i = y.makeVList({
					positionType: "firstBaseline",
					children: [{
						type: "elem",
						elem: t
					}, {
						type: "kern",
						size: 3 * n
					}, {
						type: "elem",
						elem: a
					}, {
						type: "kern",
						size: n
					}]
				}, e);
			return y.makeSpan(["mord", "overline"], [i], e)
		},
		mathmlBuilder(r, e) {
			var t = new S.MathNode("mo", [new S.TextNode("\u203E")]);
			t.setAttribute("stretchy", "true");
			var a = new S.MathNode("mover", [U(r.body, e), t]);
			return a.setAttribute("accent", "true"), a
		}
	}), B({
		type: "phantom",
		names: ["\\phantom"],
		props: {
			numArgs: 1,
			allowedInText: !0
		},
		handler: (r, e) => {
			var {
				parser: t
			} = r, a = e[0];
			return {
				type: "phantom",
				mode: t.mode,
				body: e0(a)
			}
		},
		htmlBuilder: (r, e) => {
			var t = a0(r.body, e.withPhantom(), !1);
			return y.makeFragment(t)
		},
		mathmlBuilder: (r, e) => {
			var t = c0(r.body, e);
			return new S.MathNode("mphantom", t)
		}
	}), B({
		type: "hphantom",
		names: ["\\hphantom"],
		props: {
			numArgs: 1,
			allowedInText: !0
		},
		handler: (r, e) => {
			var {
				parser: t
			} = r, a = e[0];
			return {
				type: "hphantom",
				mode: t.mode,
				body: a
			}
		},
		htmlBuilder: (r, e) => {
			var t = y.makeSpan([], [H(r.body, e.withPhantom())]);
			if (t.height = 0, t.depth = 0, t.children)
				for (var a = 0; a < t.children.length; a++) t.children[a].height = 0, t.children[a].depth = 0;
			return t = y.makeVList({
				positionType: "firstBaseline",
				children: [{
					type: "elem",
					elem: t
				}]
			}, e), y.makeSpan(["mord"], [t], e)
		},
		mathmlBuilder: (r, e) => {
			var t = c0(e0(r.body), e),
				a = new S.MathNode("mphantom", t),
				n = new S.MathNode("mpadded", [a]);
			return n.setAttribute("height", "0px"), n.setAttribute("depth", "0px"), n
		}
	}), B({
		type: "vphantom",
		names: ["\\vphantom"],
		props: {
			numArgs: 1,
			allowedInText: !0
		},
		handler: (r, e) => {
			var {
				parser: t
			} = r, a = e[0];
			return {
				type: "vphantom",
				mode: t.mode,
				body: a
			}
		},
		htmlBuilder: (r, e) => {
			var t = y.makeSpan(["inner"], [H(r.body, e.withPhantom())]),
				a = y.makeSpan(["fix"], []);
			return y.makeSpan(["mord", "rlap"], [t, a], e)
		},
		mathmlBuilder: (r, e) => {
			var t = c0(e0(r.body), e),
				a = new S.MathNode("mphantom", t),
				n = new S.MathNode("mpadded", [a]);
			return n.setAttribute("width", "0px"), n
		}
	}), B({
		type: "raisebox",
		names: ["\\raisebox"],
		props: {
			numArgs: 2,
			argTypes: ["size", "hbox"],
			allowedInText: !0
		},
		handler(r, e) {
			var {
				parser: t
			} = r, a = L(e[0], "size").value, n = e[1];
			return {
				type: "raisebox",
				mode: t.mode,
				dy: a,
				body: n
			}
		},
		htmlBuilder(r, e) {
			var t = H(r.body, e),
				a = Z(r.dy, e);
			return y.makeVList({
				positionType: "shift",
				positionData: -a,
				children: [{
					type: "elem",
					elem: t
				}]
			}, e)
		},
		mathmlBuilder(r, e) {
			var t = new S.MathNode("mpadded", [U(r.body, e)]),
				a = r.dy.number + r.dy.unit;
			return t.setAttribute("voffset", a), t
		}
	}), B({
		type: "internal",
		names: ["\\relax"],
		props: {
			numArgs: 0,
			allowedInText: !0
		},
		handler(r) {
			var {
				parser: e
			} = r;
			return {
				type: "internal",
				mode: e.mode
			}
		}
	}), B({
		type: "rule",
		names: ["\\rule"],
		props: {
			numArgs: 2,
			numOptionalArgs: 1,
			argTypes: ["size", "size", "size"]
		},
		handler(r, e, t) {
			var {
				parser: a
			} = r, n = t[0], i = L(e[0], "size"), o = L(e[1], "size");
			return {
				type: "rule",
				mode: a.mode,
				shift: n && L(n, "size").value,
				width: i.value,
				height: o.value
			}
		},
		htmlBuilder(r, e) {
			var t = y.makeSpan(["mord", "rule"], [], e),
				a = Z(r.width, e),
				n = Z(r.height, e),
				i = r.shift ? Z(r.shift, e) : 0;
			return t.style.borderRightWidth = A(a), t.style.borderTopWidth = A(n), t.style.bottom = A(i), t.width = a, t.height = n + i, t.depth = -i, t.maxFontSize = n * 1.125 * e.sizeMultiplier, t
		},
		mathmlBuilder(r, e) {
			var t = Z(r.width, e),
				a = Z(r.height, e),
				n = r.shift ? Z(r.shift, e) : 0,
				i = e.color && e.getColor() || "black",
				o = new S.MathNode("mspace");
			o.setAttribute("mathbackground", i), o.setAttribute("width", A(t)), o.setAttribute("height", A(a));
			var u = new S.MathNode("mpadded", [o]);
			return n >= 0 ? u.setAttribute("height", A(n)) : (u.setAttribute("height", A(n)), u.setAttribute("depth", A(-n))), u.setAttribute("voffset", A(n)), u
		}
	});

	function Ja(r, e, t) {
		for (var a = a0(r, e, !1), n = e.sizeMultiplier / t.sizeMultiplier, i = 0; i < a.length; i++) {
			var o = a[i].classes.indexOf("sizing");
			o < 0 ? Array.prototype.push.apply(a[i].classes, e.sizingClasses(t)) : a[i].classes[o + 1] === "reset-size" + e.size && (a[i].classes[o + 1] = "reset-size" + t.size), a[i].height *= n, a[i].depth *= n
		}
		return y.makeFragment(a)
	}
	var _a = ["\\tiny", "\\sixptsize", "\\scriptsize", "\\footnotesize", "\\small", "\\normalsize", "\\large", "\\Large", "\\LARGE", "\\huge", "\\Huge"],
		Oi = (r, e) => {
			var t = e.havingSize(r.size);
			return Ja(r.body, t, e)
		};
	B({
		type: "sizing",
		names: _a,
		props: {
			numArgs: 0,
			allowedInText: !0
		},
		handler: (r, e) => {
			var {
				breakOnTokenText: t,
				funcName: a,
				parser: n
			} = r, i = n.parseExpression(!1, t);
			return {
				type: "sizing",
				mode: n.mode,
				size: _a.indexOf(a) + 1,
				body: i
			}
		},
		htmlBuilder: Oi,
		mathmlBuilder: (r, e) => {
			var t = e.havingSize(r.size),
				a = c0(r.body, t),
				n = new S.MathNode("mstyle", a);
			return n.setAttribute("mathsize", A(t.sizeMultiplier)), n
		}
	}), B({
		type: "smash",
		names: ["\\smash"],
		props: {
			numArgs: 1,
			numOptionalArgs: 1,
			allowedInText: !0
		},
		handler: (r, e, t) => {
			var {
				parser: a
			} = r, n = !1, i = !1, o = t[0] && L(t[0], "ordgroup");
			if (o)
				for (var u = "", m = 0; m < o.body.length; ++m) {
					var p = o.body[m];
					if (u = p.text, u === "t") n = !0;
					else if (u === "b") i = !0;
					else {
						n = !1, i = !1;
						break
					}
				} else n = !0, i = !0;
			var v = e[0];
			return {
				type: "smash",
				mode: a.mode,
				body: v,
				smashHeight: n,
				smashDepth: i
			}
		},
		htmlBuilder: (r, e) => {
			var t = y.makeSpan([], [H(r.body, e)]);
			if (!r.smashHeight && !r.smashDepth) return t;
			if (r.smashHeight && (t.height = 0, t.children))
				for (var a = 0; a < t.children.length; a++) t.children[a].height = 0;
			if (r.smashDepth && (t.depth = 0, t.children))
				for (var n = 0; n < t.children.length; n++) t.children[n].depth = 0;
			var i = y.makeVList({
				positionType: "firstBaseline",
				children: [{
					type: "elem",
					elem: t
				}]
			}, e);
			return y.makeSpan(["mord"], [i], e)
		},
		mathmlBuilder: (r, e) => {
			var t = new S.MathNode("mpadded", [U(r.body, e)]);
			return r.smashHeight && t.setAttribute("height", "0px"), r.smashDepth && t.setAttribute("depth", "0px"), t
		}
	}), B({
		type: "sqrt",
		names: ["\\sqrt"],
		props: {
			numArgs: 1,
			numOptionalArgs: 1
		},
		handler(r, e, t) {
			var {
				parser: a
			} = r, n = t[0], i = e[0];
			return {
				type: "sqrt",
				mode: a.mode,
				body: i,
				index: n
			}
		},
		htmlBuilder(r, e) {
			var t = H(r.body, e.havingCrampedStyle());
			t.height === 0 && (t.height = e.fontMetrics().xHeight), t = y.wrapFragment(t, e);
			var a = e.fontMetrics(),
				n = a.defaultRuleThickness,
				i = n;
			e.style.id < N.TEXT.id && (i = e.fontMetrics().xHeight);
			var o = n + i / 4,
				u = t.height + t.depth + o + n,
				{
					span: m,
					ruleWidth: p,
					advanceWidth: v
				} = U0.sqrtImage(u, e),
				b = m.height - p;
			b > t.height + t.depth + o && (o = (o + b - t.height - t.depth) / 2);
			var x = m.height - t.height - o - p;
			t.style.paddingLeft = A(v);
			var w = y.makeVList({
				positionType: "firstBaseline",
				children: [{
					type: "elem",
					elem: t,
					wrapperClasses: ["svg-align"]
				}, {
					type: "kern",
					size: -(t.height + x)
				}, {
					type: "elem",
					elem: m
				}, {
					type: "kern",
					size: p
				}]
			}, e);
			if (r.index) {
				var z = e.havingStyle(N.SCRIPTSCRIPT),
					T = H(r.index, z, e),
					C = .6 * (w.height - w.depth),
					D = y.makeVList({
						positionType: "shift",
						positionData: -C,
						children: [{
							type: "elem",
							elem: T
						}]
					}, e),
					I = y.makeSpan(["root"], [D]);
				return y.makeSpan(["mord", "sqrt"], [I, w], e)
			} else return y.makeSpan(["mord", "sqrt"], [w], e)
		},
		mathmlBuilder(r, e) {
			var {
				body: t,
				index: a
			} = r;
			return a ? new S.MathNode("mroot", [U(t, e), U(a, e)]) : new S.MathNode("msqrt", [U(t, e)])
		}
	});
	var Qa = {
		display: N.DISPLAY,
		text: N.TEXT,
		script: N.SCRIPT,
		scriptscript: N.SCRIPTSCRIPT
	};
	B({
		type: "styling",
		names: ["\\displaystyle", "\\textstyle", "\\scriptstyle", "\\scriptscriptstyle"],
		props: {
			numArgs: 0,
			allowedInText: !0,
			primitive: !0
		},
		handler(r, e) {
			var {
				breakOnTokenText: t,
				funcName: a,
				parser: n
			} = r, i = n.parseExpression(!0, t), o = a.slice(1, a.length - 5);
			return {
				type: "styling",
				mode: n.mode,
				style: o,
				body: i
			}
		},
		htmlBuilder(r, e) {
			var t = Qa[r.style],
				a = e.havingStyle(t).withFont("");
			return Ja(r.body, a, e)
		},
		mathmlBuilder(r, e) {
			var t = Qa[r.style],
				a = e.havingStyle(t),
				n = c0(r.body, a),
				i = new S.MathNode("mstyle", n),
				o = {
					display: ["0", "true"],
					text: ["0", "false"],
					script: ["1", "false"],
					scriptscript: ["2", "false"]
				},
				u = o[r.style];
			return i.setAttribute("scriptlevel", u[0]), i.setAttribute("displaystyle", u[1]), i
		}
	});
	var Li = function(e, t) {
		var a = e.base;
		if (a)
			if (a.type === "op") {
				var n = a.limits && (t.style.size === N.DISPLAY.size || a.alwaysHandleSupSub);
				return n ? xe : null
			} else if (a.type === "operatorname") {
			var i = a.alwaysHandleSupSub && (t.style.size === N.DISPLAY.size || a.limits);
			return i ? Ka : null
		} else {
			if (a.type === "accent") return R.isCharacterBox(a.base) ? Yt : null;
			if (a.type === "horizBrace") {
				var o = !e.sub;
				return o === a.isOver ? Wa : null
			} else return null
		} else return null
	};
	ue({
		type: "supsub",
		htmlBuilder(r, e) {
			var t = Li(r, e);
			if (t) return t(r, e);
			var {
				base: a,
				sup: n,
				sub: i
			} = r, o = H(a, e), u, m, p = e.fontMetrics(), v = 0, b = 0, x = a && R.isCharacterBox(a);
			if (n) {
				var w = e.havingStyle(e.style.sup());
				u = H(n, w, e), x || (v = o.height - w.fontMetrics().supDrop * w.sizeMultiplier / e.sizeMultiplier)
			}
			if (i) {
				var z = e.havingStyle(e.style.sub());
				m = H(i, z, e), x || (b = o.depth + z.fontMetrics().subDrop * z.sizeMultiplier / e.sizeMultiplier)
			}
			var T;
			e.style === N.DISPLAY ? T = p.sup1 : e.style.cramped ? T = p.sup3 : T = p.sup2;
			var C = e.sizeMultiplier,
				D = A(.5 / p.ptPerEm / C),
				I = null;
			if (m) {
				var O = r.base && r.base.type === "op" && r.base.name && (r.base.name === "\\oiint" || r.base.name === "\\oiiint");
				(o instanceof k0 || O) && (I = A(-o.italic))
			}
			var G;
			if (u && m) {
				v = Math.max(v, T, u.depth + .25 * p.xHeight), b = Math.max(b, p.sub2);
				var F = p.defaultRuleThickness,
					V = 4 * F;
				if (v - u.depth - (m.height - b) < V) {
					b = V - (v - u.depth) + m.height;
					var P = .8 * p.xHeight - (v - u.depth);
					P > 0 && (v += P, b -= P)
				}
				var J = [{
					type: "elem",
					elem: m,
					shift: b,
					marginRight: D,
					marginLeft: I
				}, {
					type: "elem",
					elem: u,
					shift: -v,
					marginRight: D
				}];
				G = y.makeVList({
					positionType: "individualShift",
					children: J
				}, e)
			} else if (m) {
				b = Math.max(b, p.sub1, m.height - .8 * p.xHeight);
				var j = [{
					type: "elem",
					elem: m,
					marginLeft: I,
					marginRight: D
				}];
				G = y.makeVList({
					positionType: "shift",
					positionData: b,
					children: j
				}, e)
			} else if (u) v = Math.max(v, T, u.depth + .25 * p.xHeight), G = y.makeVList({
				positionType: "shift",
				positionData: -v,
				children: [{
					type: "elem",
					elem: u,
					marginRight: D
				}]
			}, e);
			else throw new Error("supsub must have either sup or sub.");
			var W0 = Gt(o, "right") || "mord";
			return y.makeSpan([W0], [o, y.makeSpan(["msupsub"], [G])], e)
		},
		mathmlBuilder(r, e) {
			var t = !1,
				a, n;
			r.base && r.base.type === "horizBrace" && (n = !!r.sup, n === r.base.isOver && (t = !0, a = r.base.isOver)), r.base && (r.base.type === "op" || r.base.type === "operatorname") && (r.base.parentIsSupSub = !0);
			var i = [U(r.base, e)];
			r.sub && i.push(U(r.sub, e)), r.sup && i.push(U(r.sup, e));
			var o;
			if (t) o = a ? "mover" : "munder";
			else if (r.sub)
				if (r.sup) {
					var p = r.base;
					p && p.type === "op" && p.limits && e.style === N.DISPLAY || p && p.type === "operatorname" && p.alwaysHandleSupSub && (e.style === N.DISPLAY || p.limits) ? o = "munderover" : o = "msubsup"
				} else {
					var m = r.base;
					m && m.type === "op" && m.limits && (e.style === N.DISPLAY || m.alwaysHandleSupSub) || m && m.type === "operatorname" && m.alwaysHandleSupSub && (m.limits || e.style === N.DISPLAY) ? o = "munder" : o = "msub"
				}
			else {
				var u = r.base;
				u && u.type === "op" && u.limits && (e.style === N.DISPLAY || u.alwaysHandleSupSub) || u && u.type === "operatorname" && u.alwaysHandleSupSub && (u.limits || e.style === N.DISPLAY) ? o = "mover" : o = "msup"
			}
			return new S.MathNode(o, i)
		}
	}), ue({
		type: "atom",
		htmlBuilder(r, e) {
			return y.mathsym(r.text, r.mode, e, ["m" + r.family])
		},
		mathmlBuilder(r, e) {
			var t = new S.MathNode("mo", [M0(r.text, r.mode)]);
			if (r.family === "bin") {
				var a = Ut(r, e);
				a === "bold-italic" && t.setAttribute("mathvariant", a)
			} else r.family === "punct" ? t.setAttribute("separator", "true") : (r.family === "open" || r.family === "close") && t.setAttribute("stretchy", "false");
			return t
		}
	});
	var e1 = {
		mi: "italic",
		mn: "normal",
		mtext: "normal"
	};
	ue({
		type: "mathord",
		htmlBuilder(r, e) {
			return y.makeOrd(r, e, "mathord")
		},
		mathmlBuilder(r, e) {
			var t = new S.MathNode("mi", [M0(r.text, r.mode, e)]),
				a = Ut(r, e) || "italic";
			return a !== e1[t.type] && t.setAttribute("mathvariant", a), t
		}
	}), ue({
		type: "textord",
		htmlBuilder(r, e) {
			return y.makeOrd(r, e, "textord")
		},
		mathmlBuilder(r, e) {
			var t = M0(r.text, r.mode, e),
				a = Ut(r, e) || "normal",
				n;
			return r.mode === "text" ? n = new S.MathNode("mtext", [t]) : /[0-9]/.test(r.text) ? n = new S.MathNode("mn", [t]) : r.text === "\\prime" ? n = new S.MathNode("mo", [t]) : n = new S.MathNode("mi", [t]), a !== e1[n.type] && n.setAttribute("mathvariant", a), n
		}
	});
	var ur = {
			"\\nobreak": "nobreak",
			"\\allowbreak": "allowbreak"
		},
		hr = {
			" ": {},
			"\\ ": {},
			"~": {
				className: "nobreak"
			},
			"\\space": {},
			"\\nobreakspace": {
				className: "nobreak"
			}
		};
	ue({
		type: "spacing",
		htmlBuilder(r, e) {
			if (hr.hasOwnProperty(r.text)) {
				var t = hr[r.text].className || "";
				if (r.mode === "text") {
					var a = y.makeOrd(r, e, "textord");
					return a.classes.push(t), a
				} else return y.makeSpan(["mspace", t], [y.mathsym(r.text, r.mode, e)], e)
			} else {
				if (ur.hasOwnProperty(r.text)) return y.makeSpan(["mspace", ur[r.text]], [], e);
				throw new M('Unknown type of space "' + r.text + '"')
			}
		},
		mathmlBuilder(r, e) {
			var t;
			if (hr.hasOwnProperty(r.text)) t = new S.MathNode("mtext", [new S.TextNode("\xA0")]);
			else {
				if (ur.hasOwnProperty(r.text)) return new S.MathNode("mspace");
				throw new M('Unknown type of space "' + r.text + '"')
			}
			return t
		}
	});
	var t1 = () => {
		var r = new S.MathNode("mtd", []);
		return r.setAttribute("width", "50%"), r
	};
	ue({
		type: "tag",
		mathmlBuilder(r, e) {
			var t = new S.MathNode("mtable", [new S.MathNode("mtr", [t1(), new S.MathNode("mtd", [J0(r.body, e)]), t1(), new S.MathNode("mtd", [J0(r.tag, e)])])]);
			return t.setAttribute("width", "100%"), t
		}
	});
	var r1 = {
			"\\text": void 0,
			"\\textrm": "textrm",
			"\\textsf": "textsf",
			"\\texttt": "texttt",
			"\\textnormal": "textrm"
		},
		a1 = {
			"\\textbf": "textbf",
			"\\textmd": "textmd"
		},
		Fi = {
			"\\textit": "textit",
			"\\textup": "textup"
		},
		n1 = (r, e) => {
			var t = r.font;
			return t ? r1[t] ? e.withTextFontFamily(r1[t]) : a1[t] ? e.withTextFontWeight(a1[t]) : e.withTextFontShape(Fi[t]) : e
		};
	B({
		type: "text",
		names: ["\\text", "\\textrm", "\\textsf", "\\texttt", "\\textnormal", "\\textbf", "\\textmd", "\\textit", "\\textup"],
		props: {
			numArgs: 1,
			argTypes: ["text"],
			allowedInArgument: !0,
			allowedInText: !0
		},
		handler(r, e) {
			var {
				parser: t,
				funcName: a
			} = r, n = e[0];
			return {
				type: "text",
				mode: t.mode,
				body: e0(n),
				font: a
			}
		},
		htmlBuilder(r, e) {
			var t = n1(r, e),
				a = a0(r.body, t, !0);
			return y.makeSpan(["mord", "text"], a, t)
		},
		mathmlBuilder(r, e) {
			var t = n1(r, e);
			return J0(r.body, t)
		}
	}), B({
		type: "underline",
		names: ["\\underline"],
		props: {
			numArgs: 1,
			allowedInText: !0
		},
		handler(r, e) {
			var {
				parser: t
			} = r;
			return {
				type: "underline",
				mode: t.mode,
				body: e[0]
			}
		},
		htmlBuilder(r, e) {
			var t = H(r.body, e),
				a = y.makeLineSpan("underline-line", e),
				n = e.fontMetrics().defaultRuleThickness,
				i = y.makeVList({
					positionType: "top",
					positionData: t.height,
					children: [{
						type: "kern",
						size: n
					}, {
						type: "elem",
						elem: a
					}, {
						type: "kern",
						size: 3 * n
					}, {
						type: "elem",
						elem: t
					}]
				}, e);
			return y.makeSpan(["mord", "underline"], [i], e)
		},
		mathmlBuilder(r, e) {
			var t = new S.MathNode("mo", [new S.TextNode("\u203E")]);
			t.setAttribute("stretchy", "true");
			var a = new S.MathNode("munder", [U(r.body, e), t]);
			return a.setAttribute("accentunder", "true"), a
		}
	}), B({
		type: "vcenter",
		names: ["\\vcenter"],
		props: {
			numArgs: 1,
			argTypes: ["original"],
			allowedInText: !1
		},
		handler(r, e) {
			var {
				parser: t
			} = r;
			return {
				type: "vcenter",
				mode: t.mode,
				body: e[0]
			}
		},
		htmlBuilder(r, e) {
			var t = H(r.body, e),
				a = e.fontMetrics().axisHeight,
				n = .5 * (t.height - a - (t.depth + a));
			return y.makeVList({
				positionType: "shift",
				positionData: n,
				children: [{
					type: "elem",
					elem: t
				}]
			}, e)
		},
		mathmlBuilder(r, e) {
			return new S.MathNode("mpadded", [U(r.body, e)], ["vcenter"])
		}
	}), B({
		type: "verb",
		names: ["\\verb"],
		props: {
			numArgs: 0,
			allowedInText: !0
		},
		handler(r, e, t) {
			throw new M("\\verb ended by end of line instead of matching delimiter")
		},
		htmlBuilder(r, e) {
			for (var t = i1(r), a = [], n = e.havingStyle(e.style.text()), i = 0; i < t.length; i++) {
				var o = t[i];
				o === "~" && (o = "\\textasciitilde"), a.push(y.makeSymbol(o, "Typewriter-Regular", r.mode, n, ["mord", "texttt"]))
			}
			return y.makeSpan(["mord", "text"].concat(n.sizingClasses(e)), y.tryCombineChars(a), n)
		},
		mathmlBuilder(r, e) {
			var t = new S.TextNode(i1(r)),
				a = new S.MathNode("mtext", [t]);
			return a.setAttribute("mathvariant", "monospace"), a
		}
	});
	var i1 = r => r.body.replace(/ /g, r.star ? "\u2423" : "\xA0"),
		Q0 = ua,
		l1 = `[ \r
	]`,
		Hi = "\\\\[a-zA-Z@]+",
		Pi = "\\\\[^\uD800-\uDFFF]",
		Gi = "(" + Hi + ")" + l1 + "*",
		Vi = `\\\\(
|[ \r	]+
?)[ \r	]*`,
		mr = "[\u0300-\u036F]",
		ji = new RegExp(mr + "+$"),
		Ui = "(" + l1 + "+)|" + (Vi + "|") + "([!-\\[\\]-\u2027\u202A-\uD7FF\uF900-\uFFFF]" + (mr + "*") + "|[\uD800-\uDBFF][\uDC00-\uDFFF]" + (mr + "*") + "|\\\\verb\\*([^]).*?\\4|\\\\verb([^*a-zA-Z]).*?\\5" + ("|" + Gi) + ("|" + Pi + ")");
	class s1 {
		constructor(e, t) {
			this.input = void 0, this.settings = void 0, this.tokenRegex = void 0, this.catcodes = void 0, this.input = e, this.settings = t, this.tokenRegex = new RegExp(Ui, "g"), this.catcodes = {
				"%": 14,
				"~": 13
			}
		}
		setCatcode(e, t) {
			this.catcodes[e] = t
		}
		lex() {
			var e = this.input,
				t = this.tokenRegex.lastIndex;
			if (t === e.length) return new D0("EOF", new p0(this, t, t));
			var a = this.tokenRegex.exec(e);
			if (a === null || a.index !== t) throw new M("Unexpected character: '" + e[t] + "'", new D0(e[t], new p0(this, t, t + 1)));
			var n = a[6] || a[3] || (a[2] ? "\\ " : " ");
			if (this.catcodes[n] === 14) {
				var i = e.indexOf(`
`, this.tokenRegex.lastIndex);
				return i === -1 ? (this.tokenRegex.lastIndex = e.length, this.settings.reportNonstrict("commentAtEnd", "% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)")) : this.tokenRegex.lastIndex = i + 1, this.lex()
			}
			return new D0(n, new p0(this, t, this.tokenRegex.lastIndex))
		}
	}
	class Wi {
		constructor(e, t) {
			e === void 0 && (e = {}), t === void 0 && (t = {}), this.current = void 0, this.builtins = void 0, this.undefStack = void 0, this.current = t, this.builtins = e, this.undefStack = []
		}
		beginGroup() {
			this.undefStack.push({})
		}
		endGroup() {
			if (this.undefStack.length === 0) throw new M("Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug");
			var e = this.undefStack.pop();
			for (var t in e) e.hasOwnProperty(t) && (e[t] == null ? delete this.current[t] : this.current[t] = e[t])
		}
		endGroups() {
			for (; this.undefStack.length > 0;) this.endGroup()
		}
		has(e) {
			return this.current.hasOwnProperty(e) || this.builtins.hasOwnProperty(e)
		}
		get(e) {
			return this.current.hasOwnProperty(e) ? this.current[e] : this.builtins[e]
		}
		set(e, t, a) {
			if (a === void 0 && (a = !1), a) {
				for (var n = 0; n < this.undefStack.length; n++) delete this.undefStack[n][e];
				this.undefStack.length > 0 && (this.undefStack[this.undefStack.length - 1][e] = t)
			} else {
				var i = this.undefStack[this.undefStack.length - 1];
				i && !i.hasOwnProperty(e) && (i[e] = this.current[e])
			}
			t == null ? delete this.current[e] : this.current[e] = t
		}
	}
	var Yi = Ia;
	c("\\noexpand", function(r) {
		var e = r.popToken();
		return r.isExpandable(e.text) && (e.noexpand = !0, e.treatAsRelax = !0), {
			tokens: [e],
			numArgs: 0
		}
	}), c("\\expandafter", function(r) {
		var e = r.popToken();
		return r.expandOnce(!0), {
			tokens: [e],
			numArgs: 0
		}
	}), c("\\@firstoftwo", function(r) {
		var e = r.consumeArgs(2);
		return {
			tokens: e[0],
			numArgs: 0
		}
	}), c("\\@secondoftwo", function(r) {
		var e = r.consumeArgs(2);
		return {
			tokens: e[1],
			numArgs: 0
		}
	}), c("\\@ifnextchar", function(r) {
		var e = r.consumeArgs(3);
		r.consumeSpaces();
		var t = r.future();
		return e[0].length === 1 && e[0][0].text === t.text ? {
			tokens: e[1],
			numArgs: 0
		} : {
			tokens: e[2],
			numArgs: 0
		}
	}), c("\\@ifstar", "\\@ifnextchar *{\\@firstoftwo{#1}}"), c("\\TextOrMath", function(r) {
		var e = r.consumeArgs(2);
		return r.mode === "text" ? {
			tokens: e[0],
			numArgs: 0
		} : {
			tokens: e[1],
			numArgs: 0
		}
	});
	var o1 = {
		0: 0,
		1: 1,
		2: 2,
		3: 3,
		4: 4,
		5: 5,
		6: 6,
		7: 7,
		8: 8,
		9: 9,
		a: 10,
		A: 10,
		b: 11,
		B: 11,
		c: 12,
		C: 12,
		d: 13,
		D: 13,
		e: 14,
		E: 14,
		f: 15,
		F: 15
	};
	c("\\char", function(r) {
		var e = r.popToken(),
			t, a = "";
		if (e.text === "'") t = 8, e = r.popToken();
		else if (e.text === '"') t = 16, e = r.popToken();
		else if (e.text === "`")
			if (e = r.popToken(), e.text[0] === "\\") a = e.text.charCodeAt(1);
			else {
				if (e.text === "EOF") throw new M("\\char` missing argument");
				a = e.text.charCodeAt(0)
			}
		else t = 10;
		if (t) {
			if (a = o1[e.text], a == null || a >= t) throw new M("Invalid base-" + t + " digit " + e.text);
			for (var n;
				(n = o1[r.future().text]) != null && n < t;) a *= t, a += n, r.popToken()
		}
		return "\\@char{" + a + "}"
	});
	var cr = (r, e, t) => {
		var a = r.consumeArg().tokens;
		if (a.length !== 1) throw new M("\\newcommand's first argument must be a macro name");
		var n = a[0].text,
			i = r.isDefined(n);
		if (i && !e) throw new M("\\newcommand{" + n + "} attempting to redefine " + (n + "; use \\renewcommand"));
		if (!i && !t) throw new M("\\renewcommand{" + n + "} when command " + n + " does not yet exist; use \\newcommand");
		var o = 0;
		if (a = r.consumeArg().tokens, a.length === 1 && a[0].text === "[") {
			for (var u = "", m = r.expandNextToken(); m.text !== "]" && m.text !== "EOF";) u += m.text, m = r.expandNextToken();
			if (!u.match(/^\s*[0-9]+\s*$/)) throw new M("Invalid number of arguments: " + u);
			o = parseInt(u), a = r.consumeArg().tokens
		}
		return r.macros.set(n, {
			tokens: a,
			numArgs: o
		}), ""
	};
	c("\\newcommand", r => cr(r, !1, !0)), c("\\renewcommand", r => cr(r, !0, !1)), c("\\providecommand", r => cr(r, !0, !0)), c("\\message", r => {
		var e = r.consumeArgs(1)[0];
		return console.log(e.reverse().map(t => t.text).join("")), ""
	}), c("\\errmessage", r => {
		var e = r.consumeArgs(1)[0];
		return console.error(e.reverse().map(t => t.text).join("")), ""
	}), c("\\show", r => {
		var e = r.popToken(),
			t = e.text;
		return console.log(e, r.macros.get(t), Q0[t], W.math[t], W.text[t]), ""
	}), c("\\bgroup", "{"), c("\\egroup", "}"), c("~", "\\nobreakspace"), c("\\lq", "`"), c("\\rq", "'"), c("\\aa", "\\r a"), c("\\AA", "\\r A"), c("\\textcopyright", "\\html@mathml{\\textcircled{c}}{\\char`\xA9}"), c("\\copyright", "\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}"), c("\\textregistered", "\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`\xAE}"), c("\u212C", "\\mathscr{B}"), c("\u2130", "\\mathscr{E}"), c("\u2131", "\\mathscr{F}"), c("\u210B", "\\mathscr{H}"), c("\u2110", "\\mathscr{I}"), c("\u2112", "\\mathscr{L}"), c("\u2133", "\\mathscr{M}"), c("\u211B", "\\mathscr{R}"), c("\u212D", "\\mathfrak{C}"), c("\u210C", "\\mathfrak{H}"), c("\u2128", "\\mathfrak{Z}"), c("\\Bbbk", "\\Bbb{k}"), c("\xB7", "\\cdotp"), c("\\llap", "\\mathllap{\\textrm{#1}}"), c("\\rlap", "\\mathrlap{\\textrm{#1}}"), c("\\clap", "\\mathclap{\\textrm{#1}}"), c("\\mathstrut", "\\vphantom{(}"), c("\\underbar", "\\underline{\\text{#1}}"), c("\\not", '\\html@mathml{\\mathrel{\\mathrlap\\@not}}{\\char"338}'), c("\\neq", "\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`\u2260}}"), c("\\ne", "\\neq"), c("\u2260", "\\neq"), c("\\notin", "\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`\u2209}}"), c("\u2209", "\\notin"), c("\u2258", "\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`\u2258}}"), c("\u2259", "\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`\u2258}}"), c("\u225A", "\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`\u225A}}"), c("\u225B", "\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`\u225B}}"), c("\u225D", "\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`\u225D}}"), c("\u225E", "\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`\u225E}}"), c("\u225F", "\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`\u225F}}"), c("\u27C2", "\\perp"), c("\u203C", "\\mathclose{!\\mkern-0.8mu!}"), c("\u220C", "\\notni"), c("\u231C", "\\ulcorner"), c("\u231D", "\\urcorner"), c("\u231E", "\\llcorner"), c("\u231F", "\\lrcorner"), c("\xA9", "\\copyright"), c("\xAE", "\\textregistered"), c("\uFE0F", "\\textregistered"), c("\\ulcorner", '\\html@mathml{\\@ulcorner}{\\mathop{\\char"231c}}'), c("\\urcorner", '\\html@mathml{\\@urcorner}{\\mathop{\\char"231d}}'), c("\\llcorner", '\\html@mathml{\\@llcorner}{\\mathop{\\char"231e}}'), c("\\lrcorner", '\\html@mathml{\\@lrcorner}{\\mathop{\\char"231f}}'), c("\\vdots", "\\mathord{\\varvdots\\rule{0pt}{15pt}}"), c("\u22EE", "\\vdots"), c("\\varGamma", "\\mathit{\\Gamma}"), c("\\varDelta", "\\mathit{\\Delta}"), c("\\varTheta", "\\mathit{\\Theta}"), c("\\varLambda", "\\mathit{\\Lambda}"), c("\\varXi", "\\mathit{\\Xi}"), c("\\varPi", "\\mathit{\\Pi}"), c("\\varSigma", "\\mathit{\\Sigma}"), c("\\varUpsilon", "\\mathit{\\Upsilon}"), c("\\varPhi", "\\mathit{\\Phi}"), c("\\varPsi", "\\mathit{\\Psi}"), c("\\varOmega", "\\mathit{\\Omega}"), c("\\substack", "\\begin{subarray}{c}#1\\end{subarray}"), c("\\colon", "\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu\\relax"), c("\\boxed", "\\fbox{$\\displaystyle{#1}$}"), c("\\iff", "\\DOTSB\\;\\Longleftrightarrow\\;"), c("\\implies", "\\DOTSB\\;\\Longrightarrow\\;"), c("\\impliedby", "\\DOTSB\\;\\Longleftarrow\\;");
	var u1 = {
		",": "\\dotsc",
		"\\not": "\\dotsb",
		"+": "\\dotsb",
		"=": "\\dotsb",
		"<": "\\dotsb",
		">": "\\dotsb",
		"-": "\\dotsb",
		"*": "\\dotsb",
		":": "\\dotsb",
		"\\DOTSB": "\\dotsb",
		"\\coprod": "\\dotsb",
		"\\bigvee": "\\dotsb",
		"\\bigwedge": "\\dotsb",
		"\\biguplus": "\\dotsb",
		"\\bigcap": "\\dotsb",
		"\\bigcup": "\\dotsb",
		"\\prod": "\\dotsb",
		"\\sum": "\\dotsb",
		"\\bigotimes": "\\dotsb",
		"\\bigoplus": "\\dotsb",
		"\\bigodot": "\\dotsb",
		"\\bigsqcup": "\\dotsb",
		"\\And": "\\dotsb",
		"\\longrightarrow": "\\dotsb",
		"\\Longrightarrow": "\\dotsb",
		"\\longleftarrow": "\\dotsb",
		"\\Longleftarrow": "\\dotsb",
		"\\longleftrightarrow": "\\dotsb",
		"\\Longleftrightarrow": "\\dotsb",
		"\\mapsto": "\\dotsb",
		"\\longmapsto": "\\dotsb",
		"\\hookrightarrow": "\\dotsb",
		"\\doteq": "\\dotsb",
		"\\mathbin": "\\dotsb",
		"\\mathrel": "\\dotsb",
		"\\relbar": "\\dotsb",
		"\\Relbar": "\\dotsb",
		"\\xrightarrow": "\\dotsb",
		"\\xleftarrow": "\\dotsb",
		"\\DOTSI": "\\dotsi",
		"\\int": "\\dotsi",
		"\\oint": "\\dotsi",
		"\\iint": "\\dotsi",
		"\\iiint": "\\dotsi",
		"\\iiiint": "\\dotsi",
		"\\idotsint": "\\dotsi",
		"\\DOTSX": "\\dotsx"
	};
	c("\\dots", function(r) {
		var e = "\\dotso",
			t = r.expandAfterFuture().text;
		return t in u1 ? e = u1[t] : (t.slice(0, 4) === "\\not" || t in W.math && R.contains(["bin", "rel"], W.math[t].group)) && (e = "\\dotsb"), e
	});
	var dr = {
		")": !0,
		"]": !0,
		"\\rbrack": !0,
		"\\}": !0,
		"\\rbrace": !0,
		"\\rangle": !0,
		"\\rceil": !0,
		"\\rfloor": !0,
		"\\rgroup": !0,
		"\\rmoustache": !0,
		"\\right": !0,
		"\\bigr": !0,
		"\\biggr": !0,
		"\\Bigr": !0,
		"\\Biggr": !0,
		$: !0,
		";": !0,
		".": !0,
		",": !0
	};
	c("\\dotso", function(r) {
		var e = r.future().text;
		return e in dr ? "\\ldots\\," : "\\ldots"
	}), c("\\dotsc", function(r) {
		var e = r.future().text;
		return e in dr && e !== "," ? "\\ldots\\," : "\\ldots"
	}), c("\\cdots", function(r) {
		var e = r.future().text;
		return e in dr ? "\\@cdots\\," : "\\@cdots"
	}), c("\\dotsb", "\\cdots"), c("\\dotsm", "\\cdots"), c("\\dotsi", "\\!\\cdots"), c("\\dotsx", "\\ldots\\,"), c("\\DOTSI", "\\relax"), c("\\DOTSB", "\\relax"), c("\\DOTSX", "\\relax"), c("\\tmspace", "\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax"), c("\\,", "\\tmspace+{3mu}{.1667em}"), c("\\thinspace", "\\,"), c("\\>", "\\mskip{4mu}"), c("\\:", "\\tmspace+{4mu}{.2222em}"), c("\\medspace", "\\:"), c("\\;", "\\tmspace+{5mu}{.2777em}"), c("\\thickspace", "\\;"), c("\\!", "\\tmspace-{3mu}{.1667em}"), c("\\negthinspace", "\\!"), c("\\negmedspace", "\\tmspace-{4mu}{.2222em}"), c("\\negthickspace", "\\tmspace-{5mu}{.277em}"), c("\\enspace", "\\kern.5em "), c("\\enskip", "\\hskip.5em\\relax"), c("\\quad", "\\hskip1em\\relax"), c("\\qquad", "\\hskip2em\\relax"), c("\\tag", "\\@ifstar\\tag@literal\\tag@paren"), c("\\tag@paren", "\\tag@literal{({#1})}"), c("\\tag@literal", r => {
		if (r.macros.get("\\df@tag")) throw new M("Multiple \\tag");
		return "\\gdef\\df@tag{\\text{#1}}"
	}), c("\\bmod", "\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}"), c("\\pod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)"), c("\\pmod", "\\pod{{\\rm mod}\\mkern6mu#1}"), c("\\mod", "\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1"), c("\\newline", "\\\\\\relax"), c("\\TeX", "\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}");
	var h1 = A(q0["Main-Regular"]["T".charCodeAt(0)][1] - .7 * q0["Main-Regular"]["A".charCodeAt(0)][1]);
	c("\\LaTeX", "\\textrm{\\html@mathml{" + ("L\\kern-.36em\\raisebox{" + h1 + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{LaTeX}}"), c("\\KaTeX", "\\textrm{\\html@mathml{" + ("K\\kern-.17em\\raisebox{" + h1 + "}{\\scriptstyle A}") + "\\kern-.15em\\TeX}{KaTeX}}"), c("\\hspace", "\\@ifstar\\@hspacer\\@hspace"), c("\\@hspace", "\\hskip #1\\relax"), c("\\@hspacer", "\\rule{0pt}{0pt}\\hskip #1\\relax"), c("\\ordinarycolon", ":"), c("\\vcentcolon", "\\mathrel{\\mathop\\ordinarycolon}"), c("\\dblcolon", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}}{\\mathop{\\char"2237}}'), c("\\coloneqq", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2254}}'), c("\\Coloneqq", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}}{\\mathop{\\char"2237\\char"3d}}'), c("\\coloneq", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"3a\\char"2212}}'), c("\\Coloneq", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}}{\\mathop{\\char"2237\\char"2212}}'), c("\\eqqcolon", '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2255}}'), c("\\Eqqcolon", '\\html@mathml{\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"3d\\char"2237}}'), c("\\eqcolon", '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}}{\\mathop{\\char"2239}}'), c("\\Eqcolon", '\\html@mathml{\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}}{\\mathop{\\char"2212\\char"2237}}'), c("\\colonapprox", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"3a\\char"2248}}'), c("\\Colonapprox", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}}{\\mathop{\\char"2237\\char"2248}}'), c("\\colonsim", '\\html@mathml{\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"3a\\char"223c}}'), c("\\Colonsim", '\\html@mathml{\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}}{\\mathop{\\char"2237\\char"223c}}'), c("\u2237", "\\dblcolon"), c("\u2239", "\\eqcolon"), c("\u2254", "\\coloneqq"), c("\u2255", "\\eqqcolon"), c("\u2A74", "\\Coloneqq"), c("\\ratio", "\\vcentcolon"), c("\\coloncolon", "\\dblcolon"), c("\\colonequals", "\\coloneqq"), c("\\coloncolonequals", "\\Coloneqq"), c("\\equalscolon", "\\eqqcolon"), c("\\equalscoloncolon", "\\Eqqcolon"), c("\\colonminus", "\\coloneq"), c("\\coloncolonminus", "\\Coloneq"), c("\\minuscolon", "\\eqcolon"), c("\\minuscoloncolon", "\\Eqcolon"), c("\\coloncolonapprox", "\\Colonapprox"), c("\\coloncolonsim", "\\Colonsim"), c("\\simcolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}"), c("\\simcoloncolon", "\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}"), c("\\approxcolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}"), c("\\approxcoloncolon", "\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}"), c("\\notni", "\\html@mathml{\\not\\ni}{\\mathrel{\\char`\u220C}}"), c("\\limsup", "\\DOTSB\\operatorname*{lim\\,sup}"), c("\\liminf", "\\DOTSB\\operatorname*{lim\\,inf}"), c("\\injlim", "\\DOTSB\\operatorname*{inj\\,lim}"), c("\\projlim", "\\DOTSB\\operatorname*{proj\\,lim}"), c("\\varlimsup", "\\DOTSB\\operatorname*{\\overline{lim}}"), c("\\varliminf", "\\DOTSB\\operatorname*{\\underline{lim}}"), c("\\varinjlim", "\\DOTSB\\operatorname*{\\underrightarrow{lim}}"), c("\\varprojlim", "\\DOTSB\\operatorname*{\\underleftarrow{lim}}"), c("\\gvertneqq", "\\html@mathml{\\@gvertneqq}{\u2269}"), c("\\lvertneqq", "\\html@mathml{\\@lvertneqq}{\u2268}"), c("\\ngeqq", "\\html@mathml{\\@ngeqq}{\u2271}"), c("\\ngeqslant", "\\html@mathml{\\@ngeqslant}{\u2271}"), c("\\nleqq", "\\html@mathml{\\@nleqq}{\u2270}"), c("\\nleqslant", "\\html@mathml{\\@nleqslant}{\u2270}"), c("\\nshortmid", "\\html@mathml{\\@nshortmid}{\u2224}"), c("\\nshortparallel", "\\html@mathml{\\@nshortparallel}{\u2226}"), c("\\nsubseteqq", "\\html@mathml{\\@nsubseteqq}{\u2288}"), c("\\nsupseteqq", "\\html@mathml{\\@nsupseteqq}{\u2289}"), c("\\varsubsetneq", "\\html@mathml{\\@varsubsetneq}{\u228A}"), c("\\varsubsetneqq", "\\html@mathml{\\@varsubsetneqq}{\u2ACB}"), c("\\varsupsetneq", "\\html@mathml{\\@varsupsetneq}{\u228B}"), c("\\varsupsetneqq", "\\html@mathml{\\@varsupsetneqq}{\u2ACC}"), c("\\imath", "\\html@mathml{\\@imath}{\u0131}"), c("\\jmath", "\\html@mathml{\\@jmath}{\u0237}"), c("\\llbracket", "\\html@mathml{\\mathopen{[\\mkern-3.2mu[}}{\\mathopen{\\char`\u27E6}}"), c("\\rrbracket", "\\html@mathml{\\mathclose{]\\mkern-3.2mu]}}{\\mathclose{\\char`\u27E7}}"), c("\u27E6", "\\llbracket"), c("\u27E7", "\\rrbracket"), c("\\lBrace", "\\html@mathml{\\mathopen{\\{\\mkern-3.2mu[}}{\\mathopen{\\char`\u2983}}"), c("\\rBrace", "\\html@mathml{\\mathclose{]\\mkern-3.2mu\\}}}{\\mathclose{\\char`\u2984}}"), c("\u2983", "\\lBrace"), c("\u2984", "\\rBrace"), c("\\minuso", "\\mathbin{\\html@mathml{{\\mathrlap{\\mathchoice{\\kern{0.145em}}{\\kern{0.145em}}{\\kern{0.1015em}}{\\kern{0.0725em}}\\circ}{-}}}{\\char`\u29B5}}"), c("\u29B5", "\\minuso"), c("\\darr", "\\downarrow"), c("\\dArr", "\\Downarrow"), c("\\Darr", "\\Downarrow"), c("\\lang", "\\langle"), c("\\rang", "\\rangle"), c("\\uarr", "\\uparrow"), c("\\uArr", "\\Uparrow"), c("\\Uarr", "\\Uparrow"), c("\\N", "\\mathbb{N}"), c("\\R", "\\mathbb{R}"), c("\\Z", "\\mathbb{Z}"), c("\\alef", "\\aleph"), c("\\alefsym", "\\aleph"), c("\\Alpha", "\\mathrm{A}"), c("\\Beta", "\\mathrm{B}"), c("\\bull", "\\bullet"), c("\\Chi", "\\mathrm{X}"), c("\\clubs", "\\clubsuit"), c("\\cnums", "\\mathbb{C}"), c("\\Complex", "\\mathbb{C}"), c("\\Dagger", "\\ddagger"), c("\\diamonds", "\\diamondsuit"), c("\\empty", "\\emptyset"), c("\\Epsilon", "\\mathrm{E}"), c("\\Eta", "\\mathrm{H}"), c("\\exist", "\\exists"), c("\\harr", "\\leftrightarrow"), c("\\hArr", "\\Leftrightarrow"), c("\\Harr", "\\Leftrightarrow"), c("\\hearts", "\\heartsuit"), c("\\image", "\\Im"), c("\\infin", "\\infty"), c("\\Iota", "\\mathrm{I}"), c("\\isin", "\\in"), c("\\Kappa", "\\mathrm{K}"), c("\\larr", "\\leftarrow"), c("\\lArr", "\\Leftarrow"), c("\\Larr", "\\Leftarrow"), c("\\lrarr", "\\leftrightarrow"), c("\\lrArr", "\\Leftrightarrow"), c("\\Lrarr", "\\Leftrightarrow"), c("\\Mu", "\\mathrm{M}"), c("\\natnums", "\\mathbb{N}"), c("\\Nu", "\\mathrm{N}"), c("\\Omicron", "\\mathrm{O}"), c("\\plusmn", "\\pm"), c("\\rarr", "\\rightarrow"), c("\\rArr", "\\Rightarrow"), c("\\Rarr", "\\Rightarrow"), c("\\real", "\\Re"), c("\\reals", "\\mathbb{R}"), c("\\Reals", "\\mathbb{R}"), c("\\Rho", "\\mathrm{P}"), c("\\sdot", "\\cdot"), c("\\sect", "\\S"), c("\\spades", "\\spadesuit"), c("\\sub", "\\subset"), c("\\sube", "\\subseteq"), c("\\supe", "\\supseteq"), c("\\Tau", "\\mathrm{T}"), c("\\thetasym", "\\vartheta"), c("\\weierp", "\\wp"), c("\\Zeta", "\\mathrm{Z}"), c("\\argmin", "\\DOTSB\\operatorname*{arg\\,min}"), c("\\argmax", "\\DOTSB\\operatorname*{arg\\,max}"), c("\\plim", "\\DOTSB\\mathop{\\operatorname{plim}}\\limits"), c("\\bra", "\\mathinner{\\langle{#1}|}"), c("\\ket", "\\mathinner{|{#1}\\rangle}"), c("\\braket", "\\mathinner{\\langle{#1}\\rangle}"), c("\\Bra", "\\left\\langle#1\\right|"), c("\\Ket", "\\left|#1\\right\\rangle");
	var m1 = r => e => {
		var t = e.consumeArg().tokens,
			a = e.consumeArg().tokens,
			n = e.consumeArg().tokens,
			i = e.consumeArg().tokens,
			o = e.macros.get("|"),
			u = e.macros.get("\\|");
		e.macros.beginGroup();
		var m = b => x => {
			r && (x.macros.set("|", o), n.length && x.macros.set("\\|", u));
			var w = b;
			if (!b && n.length) {
				var z = x.future();
				z.text === "|" && (x.popToken(), w = !0)
			}
			return {
				tokens: w ? n : a,
				numArgs: 0
			}
		};
		e.macros.set("|", m(!1)), n.length && e.macros.set("\\|", m(!0));
		var p = e.consumeArg().tokens,
			v = e.expandTokens([...i, ...p, ...t]);
		return e.macros.endGroup(), {
			tokens: v.reverse(),
			numArgs: 0
		}
	};
	c("\\bra@ket", m1(!1)), c("\\bra@set", m1(!0)), c("\\Braket", "\\bra@ket{\\left\\langle}{\\,\\middle\\vert\\,}{\\,\\middle\\vert\\,}{\\right\\rangle}"), c("\\Set", "\\bra@set{\\left\\{\\:}{\\;\\middle\\vert\\;}{\\;\\middle\\Vert\\;}{\\:\\right\\}}"), c("\\set", "\\bra@set{\\{\\,}{\\mid}{}{\\,\\}}"), c("\\angln", "{\\angl n}"), c("\\blue", "\\textcolor{##6495ed}{#1}"), c("\\orange", "\\textcolor{##ffa500}{#1}"), c("\\pink", "\\textcolor{##ff00af}{#1}"), c("\\red", "\\textcolor{##df0030}{#1}"), c("\\green", "\\textcolor{##28ae7b}{#1}"), c("\\gray", "\\textcolor{gray}{#1}"), c("\\purple", "\\textcolor{##9d38bd}{#1}"), c("\\blueA", "\\textcolor{##ccfaff}{#1}"), c("\\blueB", "\\textcolor{##80f6ff}{#1}"), c("\\blueC", "\\textcolor{##63d9ea}{#1}"), c("\\blueD", "\\textcolor{##11accd}{#1}"), c("\\blueE", "\\textcolor{##0c7f99}{#1}"), c("\\tealA", "\\textcolor{##94fff5}{#1}"), c("\\tealB", "\\textcolor{##26edd5}{#1}"), c("\\tealC", "\\textcolor{##01d1c1}{#1}"), c("\\tealD", "\\textcolor{##01a995}{#1}"), c("\\tealE", "\\textcolor{##208170}{#1}"), c("\\greenA", "\\textcolor{##b6ffb0}{#1}"), c("\\greenB", "\\textcolor{##8af281}{#1}"), c("\\greenC", "\\textcolor{##74cf70}{#1}"), c("\\greenD", "\\textcolor{##1fab54}{#1}"), c("\\greenE", "\\textcolor{##0d923f}{#1}"), c("\\goldA", "\\textcolor{##ffd0a9}{#1}"), c("\\goldB", "\\textcolor{##ffbb71}{#1}"), c("\\goldC", "\\textcolor{##ff9c39}{#1}"), c("\\goldD", "\\textcolor{##e07d10}{#1}"), c("\\goldE", "\\textcolor{##a75a05}{#1}"), c("\\redA", "\\textcolor{##fca9a9}{#1}"), c("\\redB", "\\textcolor{##ff8482}{#1}"), c("\\redC", "\\textcolor{##f9685d}{#1}"), c("\\redD", "\\textcolor{##e84d39}{#1}"), c("\\redE", "\\textcolor{##bc2612}{#1}"), c("\\maroonA", "\\textcolor{##ffbde0}{#1}"), c("\\maroonB", "\\textcolor{##ff92c6}{#1}"), c("\\maroonC", "\\textcolor{##ed5fa6}{#1}"), c("\\maroonD", "\\textcolor{##ca337c}{#1}"), c("\\maroonE", "\\textcolor{##9e034e}{#1}"), c("\\purpleA", "\\textcolor{##ddd7ff}{#1}"), c("\\purpleB", "\\textcolor{##c6b9fc}{#1}"), c("\\purpleC", "\\textcolor{##aa87ff}{#1}"), c("\\purpleD", "\\textcolor{##7854ab}{#1}"), c("\\purpleE", "\\textcolor{##543b78}{#1}"), c("\\mintA", "\\textcolor{##f5f9e8}{#1}"), c("\\mintB", "\\textcolor{##edf2df}{#1}"), c("\\mintC", "\\textcolor{##e0e5cc}{#1}"), c("\\grayA", "\\textcolor{##f6f7f7}{#1}"), c("\\grayB", "\\textcolor{##f0f1f2}{#1}"), c("\\grayC", "\\textcolor{##e3e5e6}{#1}"), c("\\grayD", "\\textcolor{##d6d8da}{#1}"), c("\\grayE", "\\textcolor{##babec2}{#1}"), c("\\grayF", "\\textcolor{##888d93}{#1}"), c("\\grayG", "\\textcolor{##626569}{#1}"), c("\\grayH", "\\textcolor{##3b3e40}{#1}"), c("\\grayI", "\\textcolor{##21242c}{#1}"), c("\\kaBlue", "\\textcolor{##314453}{#1}"), c("\\kaGreen", "\\textcolor{##71B307}{#1}");
	var c1 = {
		"^": !0,
		_: !0,
		"\\limits": !0,
		"\\nolimits": !0
	};
	class Xi {
		constructor(e, t, a) {
			this.settings = void 0, this.expansionCount = void 0, this.lexer = void 0, this.macros = void 0, this.stack = void 0, this.mode = void 0, this.settings = t, this.expansionCount = 0, this.feed(e), this.macros = new Wi(Yi, t.macros), this.mode = a, this.stack = []
		}
		feed(e) {
			this.lexer = new s1(e, this.settings)
		}
		switchMode(e) {
			this.mode = e
		}
		beginGroup() {
			this.macros.beginGroup()
		}
		endGroup() {
			this.macros.endGroup()
		}
		endGroups() {
			this.macros.endGroups()
		}
		future() {
			return this.stack.length === 0 && this.pushToken(this.lexer.lex()), this.stack[this.stack.length - 1]
		}
		popToken() {
			return this.future(), this.stack.pop()
		}
		pushToken(e) {
			this.stack.push(e)
		}
		pushTokens(e) {
			this.stack.push(...e)
		}
		scanArgument(e) {
			var t, a, n;
			if (e) {
				if (this.consumeSpaces(), this.future().text !== "[") return null;
				t = this.popToken(), {
					tokens: n,
					end: a
				} = this.consumeArg(["]"])
			} else({
				tokens: n,
				start: t,
				end: a
			} = this.consumeArg());
			return this.pushToken(new D0("EOF", a.loc)), this.pushTokens(n), t.range(a, "")
		}
		consumeSpaces() {
			for (;;) {
				var e = this.future();
				if (e.text === " ") this.stack.pop();
				else break
			}
		}
		consumeArg(e) {
			var t = [],
				a = e && e.length > 0;
			a || this.consumeSpaces();
			var n = this.future(),
				i, o = 0,
				u = 0;
			do {
				if (i = this.popToken(), t.push(i), i.text === "{") ++o;
				else if (i.text === "}") {
					if (--o, o === -1) throw new M("Extra }", i)
				} else if (i.text === "EOF") throw new M("Unexpected end of input in a macro argument, expected '" + (e && a ? e[u] : "}") + "'", i);
				if (e && a)
					if ((o === 0 || o === 1 && e[u] === "{") && i.text === e[u]) {
						if (++u, u === e.length) {
							t.splice(-u, u);
							break
						}
					} else u = 0
			} while (o !== 0 || a);
			return n.text === "{" && t[t.length - 1].text === "}" && (t.pop(), t.shift()), t.reverse(), {
				tokens: t,
				start: n,
				end: i
			}
		}
		consumeArgs(e, t) {
			if (t) {
				if (t.length !== e + 1) throw new M("The length of delimiters doesn't match the number of args!");
				for (var a = t[0], n = 0; n < a.length; n++) {
					var i = this.popToken();
					if (a[n] !== i.text) throw new M("Use of the macro doesn't match its definition", i)
				}
			}
			for (var o = [], u = 0; u < e; u++) o.push(this.consumeArg(t && t[u + 1]).tokens);
			return o
		}
		expandOnce(e) {
			var t = this.popToken(),
				a = t.text,
				n = t.noexpand ? null : this._getExpansion(a);
			if (n == null || e && n.unexpandable) {
				if (e && n == null && a[0] === "\\" && !this.isDefined(a)) throw new M("Undefined control sequence: " + a);
				return this.pushToken(t), !1
			}
			if (this.expansionCount++, this.expansionCount > this.settings.maxExpand) throw new M("Too many expansions: infinite loop or need to increase maxExpand setting");
			var i = n.tokens,
				o = this.consumeArgs(n.numArgs, n.delimiters);
			if (n.numArgs) {
				i = i.slice();
				for (var u = i.length - 1; u >= 0; --u) {
					var m = i[u];
					if (m.text === "#") {
						if (u === 0) throw new M("Incomplete placeholder at end of macro body", m);
						if (m = i[--u], m.text === "#") i.splice(u + 1, 1);
						else if (/^[1-9]$/.test(m.text)) i.splice(u, 2, ...o[+m.text - 1]);
						else throw new M("Not a valid argument number", m)
					}
				}
			}
			return this.pushTokens(i), i.length
		}
		expandAfterFuture() {
			return this.expandOnce(), this.future()
		}
		expandNextToken() {
			for (;;)
				if (this.expandOnce() === !1) {
					var e = this.stack.pop();
					return e.treatAsRelax && (e.text = "\\relax"), e
				} throw new Error
		}
		expandMacro(e) {
			return this.macros.has(e) ? this.expandTokens([new D0(e)]) : void 0
		}
		expandTokens(e) {
			var t = [],
				a = this.stack.length;
			for (this.pushTokens(e); this.stack.length > a;)
				if (this.expandOnce(!0) === !1) {
					var n = this.stack.pop();
					n.treatAsRelax && (n.noexpand = !1, n.treatAsRelax = !1), t.push(n)
				} return t
		}
		expandMacroAsText(e) {
			var t = this.expandMacro(e);
			return t && t.map(a => a.text).join("")
		}
		_getExpansion(e) {
			var t = this.macros.get(e);
			if (t == null) return t;
			if (e.length === 1) {
				var a = this.lexer.catcodes[e];
				if (a != null && a !== 13) return
			}
			var n = typeof t == "function" ? t(this) : t;
			if (typeof n == "string") {
				var i = 0;
				if (n.indexOf("#") !== -1)
					for (var o = n.replace(/##/g, ""); o.indexOf("#" + (i + 1)) !== -1;) ++i;
				for (var u = new s1(n, this.settings), m = [], p = u.lex(); p.text !== "EOF";) m.push(p), p = u.lex();
				m.reverse();
				var v = {
					tokens: m,
					numArgs: i
				};
				return v
			}
			return n
		}
		isDefined(e) {
			return this.macros.has(e) || Q0.hasOwnProperty(e) || W.math.hasOwnProperty(e) || W.text.hasOwnProperty(e) || c1.hasOwnProperty(e)
		}
		isExpandable(e) {
			var t = this.macros.get(e);
			return t != null ? typeof t == "string" || typeof t == "function" || !t.unexpandable : Q0.hasOwnProperty(e) && !Q0[e].primitive
		}
	}
	var d1 = /^[₊₋₌₍₎₀₁₂₃₄₅₆₇₈₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜᵤᵥₓᵦᵧᵨᵩᵪ]/,
		ct = Object.freeze({
			"\u208A": "+",
			"\u208B": "-",
			"\u208C": "=",
			"\u208D": "(",
			"\u208E": ")",
			"\u2080": "0",
			"\u2081": "1",
			"\u2082": "2",
			"\u2083": "3",
			"\u2084": "4",
			"\u2085": "5",
			"\u2086": "6",
			"\u2087": "7",
			"\u2088": "8",
			"\u2089": "9",
			"\u2090": "a",
			"\u2091": "e",
			"\u2095": "h",
			"\u1D62": "i",
			"\u2C7C": "j",
			"\u2096": "k",
			"\u2097": "l",
			"\u2098": "m",
			"\u2099": "n",
			"\u2092": "o",
			"\u209A": "p",
			"\u1D63": "r",
			"\u209B": "s",
			"\u209C": "t",
			"\u1D64": "u",
			"\u1D65": "v",
			"\u2093": "x",
			"\u1D66": "\u03B2",
			"\u1D67": "\u03B3",
			"\u1D68": "\u03C1",
			"\u1D69": "\u03D5",
			"\u1D6A": "\u03C7",
			"\u207A": "+",
			"\u207B": "-",
			"\u207C": "=",
			"\u207D": "(",
			"\u207E": ")",
			"\u2070": "0",
			"\xB9": "1",
			"\xB2": "2",
			"\xB3": "3",
			"\u2074": "4",
			"\u2075": "5",
			"\u2076": "6",
			"\u2077": "7",
			"\u2078": "8",
			"\u2079": "9",
			"\u1D2C": "A",
			"\u1D2E": "B",
			"\u1D30": "D",
			"\u1D31": "E",
			"\u1D33": "G",
			"\u1D34": "H",
			"\u1D35": "I",
			"\u1D36": "J",
			"\u1D37": "K",
			"\u1D38": "L",
			"\u1D39": "M",
			"\u1D3A": "N",
			"\u1D3C": "O",
			"\u1D3E": "P",
			"\u1D3F": "R",
			"\u1D40": "T",
			"\u1D41": "U",
			"\u2C7D": "V",
			"\u1D42": "W",
			"\u1D43": "a",
			"\u1D47": "b",
			"\u1D9C": "c",
			"\u1D48": "d",
			"\u1D49": "e",
			"\u1DA0": "f",
			"\u1D4D": "g",
			\u02B0: "h",
			"\u2071": "i",
			\u02B2: "j",
			"\u1D4F": "k",
			\u02E1: "l",
			"\u1D50": "m",
			\u207F: "n",
			"\u1D52": "o",
			"\u1D56": "p",
			\u02B3: "r",
			\u02E2: "s",
			"\u1D57": "t",
			"\u1D58": "u",
			"\u1D5B": "v",
			\u02B7: "w",
			\u02E3: "x",
			\u02B8: "y",
			"\u1DBB": "z",
			"\u1D5D": "\u03B2",
			"\u1D5E": "\u03B3",
			"\u1D5F": "\u03B4",
			"\u1D60": "\u03D5",
			"\u1D61": "\u03C7",
			"\u1DBF": "\u03B8"
		}),
		fr = {
			"\u0301": {
				text: "\\'",
				math: "\\acute"
			},
			"\u0300": {
				text: "\\`",
				math: "\\grave"
			},
			"\u0308": {
				text: '\\"',
				math: "\\ddot"
			},
			"\u0303": {
				text: "\\~",
				math: "\\tilde"
			},
			"\u0304": {
				text: "\\=",
				math: "\\bar"
			},
			"\u0306": {
				text: "\\u",
				math: "\\breve"
			},
			"\u030C": {
				text: "\\v",
				math: "\\check"
			},
			"\u0302": {
				text: "\\^",
				math: "\\hat"
			},
			"\u0307": {
				text: "\\.",
				math: "\\dot"
			},
			"\u030A": {
				text: "\\r",
				math: "\\mathring"
			},
			"\u030B": {
				text: "\\H"
			},
			"\u0327": {
				text: "\\c"
			}
		},
		f1 = {
			\u00E1: "a\u0301",
			\u00E0: "a\u0300",
			\u00E4: "a\u0308",
			\u01DF: "a\u0308\u0304",
			\u00E3: "a\u0303",
			\u0101: "a\u0304",
			\u0103: "a\u0306",
			\u1EAF: "a\u0306\u0301",
			\u1EB1: "a\u0306\u0300",
			\u1EB5: "a\u0306\u0303",
			\u01CE: "a\u030C",
			\u00E2: "a\u0302",
			\u1EA5: "a\u0302\u0301",
			\u1EA7: "a\u0302\u0300",
			\u1EAB: "a\u0302\u0303",
			\u0227: "a\u0307",
			\u01E1: "a\u0307\u0304",
			\u00E5: "a\u030A",
			\u01FB: "a\u030A\u0301",
			\u1E03: "b\u0307",
			\u0107: "c\u0301",
			\u1E09: "c\u0327\u0301",
			\u010D: "c\u030C",
			\u0109: "c\u0302",
			\u010B: "c\u0307",
			\u00E7: "c\u0327",
			\u010F: "d\u030C",
			\u1E0B: "d\u0307",
			\u1E11: "d\u0327",
			\u00E9: "e\u0301",
			\u00E8: "e\u0300",
			\u00EB: "e\u0308",
			\u1EBD: "e\u0303",
			\u0113: "e\u0304",
			\u1E17: "e\u0304\u0301",
			\u1E15: "e\u0304\u0300",
			\u0115: "e\u0306",
			\u1E1D: "e\u0327\u0306",
			\u011B: "e\u030C",
			\u00EA: "e\u0302",
			\u1EBF: "e\u0302\u0301",
			\u1EC1: "e\u0302\u0300",
			\u1EC5: "e\u0302\u0303",
			\u0117: "e\u0307",
			\u0229: "e\u0327",
			\u1E1F: "f\u0307",
			\u01F5: "g\u0301",
			\u1E21: "g\u0304",
			\u011F: "g\u0306",
			\u01E7: "g\u030C",
			\u011D: "g\u0302",
			\u0121: "g\u0307",
			\u0123: "g\u0327",
			\u1E27: "h\u0308",
			\u021F: "h\u030C",
			\u0125: "h\u0302",
			\u1E23: "h\u0307",
			\u1E29: "h\u0327",
			\u00ED: "i\u0301",
			\u00EC: "i\u0300",
			\u00EF: "i\u0308",
			\u1E2F: "i\u0308\u0301",
			\u0129: "i\u0303",
			\u012B: "i\u0304",
			\u012D: "i\u0306",
			\u01D0: "i\u030C",
			\u00EE: "i\u0302",
			\u01F0: "j\u030C",
			\u0135: "j\u0302",
			\u1E31: "k\u0301",
			\u01E9: "k\u030C",
			\u0137: "k\u0327",
			\u013A: "l\u0301",
			\u013E: "l\u030C",
			\u013C: "l\u0327",
			\u1E3F: "m\u0301",
			\u1E41: "m\u0307",
			\u0144: "n\u0301",
			\u01F9: "n\u0300",
			\u00F1: "n\u0303",
			\u0148: "n\u030C",
			\u1E45: "n\u0307",
			\u0146: "n\u0327",
			\u00F3: "o\u0301",
			\u00F2: "o\u0300",
			\u00F6: "o\u0308",
			\u022B: "o\u0308\u0304",
			\u00F5: "o\u0303",
			\u1E4D: "o\u0303\u0301",
			\u1E4F: "o\u0303\u0308",
			\u022D: "o\u0303\u0304",
			\u014D: "o\u0304",
			\u1E53: "o\u0304\u0301",
			\u1E51: "o\u0304\u0300",
			\u014F: "o\u0306",
			\u01D2: "o\u030C",
			\u00F4: "o\u0302",
			\u1ED1: "o\u0302\u0301",
			\u1ED3: "o\u0302\u0300",
			\u1ED7: "o\u0302\u0303",
			\u022F: "o\u0307",
			\u0231: "o\u0307\u0304",
			\u0151: "o\u030B",
			\u1E55: "p\u0301",
			\u1E57: "p\u0307",
			\u0155: "r\u0301",
			\u0159: "r\u030C",
			\u1E59: "r\u0307",
			\u0157: "r\u0327",
			\u015B: "s\u0301",
			\u1E65: "s\u0301\u0307",
			\u0161: "s\u030C",
			\u1E67: "s\u030C\u0307",
			\u015D: "s\u0302",
			\u1E61: "s\u0307",
			\u015F: "s\u0327",
			\u1E97: "t\u0308",
			\u0165: "t\u030C",
			\u1E6B: "t\u0307",
			\u0163: "t\u0327",
			\u00FA: "u\u0301",
			\u00F9: "u\u0300",
			\u00FC: "u\u0308",
			\u01D8: "u\u0308\u0301",
			\u01DC: "u\u0308\u0300",
			\u01D6: "u\u0308\u0304",
			\u01DA: "u\u0308\u030C",
			\u0169: "u\u0303",
			\u1E79: "u\u0303\u0301",
			\u016B: "u\u0304",
			\u1E7B: "u\u0304\u0308",
			\u016D: "u\u0306",
			\u01D4: "u\u030C",
			\u00FB: "u\u0302",
			\u016F: "u\u030A",
			\u0171: "u\u030B",
			\u1E7D: "v\u0303",
			\u1E83: "w\u0301",
			\u1E81: "w\u0300",
			\u1E85: "w\u0308",
			\u0175: "w\u0302",
			\u1E87: "w\u0307",
			\u1E98: "w\u030A",
			\u1E8D: "x\u0308",
			\u1E8B: "x\u0307",
			\u00FD: "y\u0301",
			\u1EF3: "y\u0300",
			\u00FF: "y\u0308",
			\u1EF9: "y\u0303",
			\u0233: "y\u0304",
			\u0177: "y\u0302",
			\u1E8F: "y\u0307",
			\u1E99: "y\u030A",
			\u017A: "z\u0301",
			\u017E: "z\u030C",
			\u1E91: "z\u0302",
			\u017C: "z\u0307",
			\u00C1: "A\u0301",
			\u00C0: "A\u0300",
			\u00C4: "A\u0308",
			\u01DE: "A\u0308\u0304",
			\u00C3: "A\u0303",
			\u0100: "A\u0304",
			\u0102: "A\u0306",
			\u1EAE: "A\u0306\u0301",
			\u1EB0: "A\u0306\u0300",
			\u1EB4: "A\u0306\u0303",
			\u01CD: "A\u030C",
			\u00C2: "A\u0302",
			\u1EA4: "A\u0302\u0301",
			\u1EA6: "A\u0302\u0300",
			\u1EAA: "A\u0302\u0303",
			\u0226: "A\u0307",
			\u01E0: "A\u0307\u0304",
			\u00C5: "A\u030A",
			\u01FA: "A\u030A\u0301",
			\u1E02: "B\u0307",
			\u0106: "C\u0301",
			\u1E08: "C\u0327\u0301",
			\u010C: "C\u030C",
			\u0108: "C\u0302",
			\u010A: "C\u0307",
			\u00C7: "C\u0327",
			\u010E: "D\u030C",
			\u1E0A: "D\u0307",
			\u1E10: "D\u0327",
			\u00C9: "E\u0301",
			\u00C8: "E\u0300",
			\u00CB: "E\u0308",
			\u1EBC: "E\u0303",
			\u0112: "E\u0304",
			\u1E16: "E\u0304\u0301",
			\u1E14: "E\u0304\u0300",
			\u0114: "E\u0306",
			\u1E1C: "E\u0327\u0306",
			\u011A: "E\u030C",
			\u00CA: "E\u0302",
			\u1EBE: "E\u0302\u0301",
			\u1EC0: "E\u0302\u0300",
			\u1EC4: "E\u0302\u0303",
			\u0116: "E\u0307",
			\u0228: "E\u0327",
			\u1E1E: "F\u0307",
			\u01F4: "G\u0301",
			\u1E20: "G\u0304",
			\u011E: "G\u0306",
			\u01E6: "G\u030C",
			\u011C: "G\u0302",
			\u0120: "G\u0307",
			\u0122: "G\u0327",
			\u1E26: "H\u0308",
			\u021E: "H\u030C",
			\u0124: "H\u0302",
			\u1E22: "H\u0307",
			\u1E28: "H\u0327",
			\u00CD: "I\u0301",
			\u00CC: "I\u0300",
			\u00CF: "I\u0308",
			\u1E2E: "I\u0308\u0301",
			\u0128: "I\u0303",
			\u012A: "I\u0304",
			\u012C: "I\u0306",
			\u01CF: "I\u030C",
			\u00CE: "I\u0302",
			\u0130: "I\u0307",
			\u0134: "J\u0302",
			\u1E30: "K\u0301",
			\u01E8: "K\u030C",
			\u0136: "K\u0327",
			\u0139: "L\u0301",
			\u013D: "L\u030C",
			\u013B: "L\u0327",
			\u1E3E: "M\u0301",
			\u1E40: "M\u0307",
			\u0143: "N\u0301",
			\u01F8: "N\u0300",
			\u00D1: "N\u0303",
			\u0147: "N\u030C",
			\u1E44: "N\u0307",
			\u0145: "N\u0327",
			\u00D3: "O\u0301",
			\u00D2: "O\u0300",
			\u00D6: "O\u0308",
			\u022A: "O\u0308\u0304",
			\u00D5: "O\u0303",
			\u1E4C: "O\u0303\u0301",
			\u1E4E: "O\u0303\u0308",
			\u022C: "O\u0303\u0304",
			\u014C: "O\u0304",
			\u1E52: "O\u0304\u0301",
			\u1E50: "O\u0304\u0300",
			\u014E: "O\u0306",
			\u01D1: "O\u030C",
			\u00D4: "O\u0302",
			\u1ED0: "O\u0302\u0301",
			\u1ED2: "O\u0302\u0300",
			\u1ED6: "O\u0302\u0303",
			\u022E: "O\u0307",
			\u0230: "O\u0307\u0304",
			\u0150: "O\u030B",
			\u1E54: "P\u0301",
			\u1E56: "P\u0307",
			\u0154: "R\u0301",
			\u0158: "R\u030C",
			\u1E58: "R\u0307",
			\u0156: "R\u0327",
			\u015A: "S\u0301",
			\u1E64: "S\u0301\u0307",
			\u0160: "S\u030C",
			\u1E66: "S\u030C\u0307",
			\u015C: "S\u0302",
			\u1E60: "S\u0307",
			\u015E: "S\u0327",
			\u0164: "T\u030C",
			\u1E6A: "T\u0307",
			\u0162: "T\u0327",
			\u00DA: "U\u0301",
			\u00D9: "U\u0300",
			\u00DC: "U\u0308",
			\u01D7: "U\u0308\u0301",
			\u01DB: "U\u0308\u0300",
			\u01D5: "U\u0308\u0304",
			\u01D9: "U\u0308\u030C",
			\u0168: "U\u0303",
			\u1E78: "U\u0303\u0301",
			\u016A: "U\u0304",
			\u1E7A: "U\u0304\u0308",
			\u016C: "U\u0306",
			\u01D3: "U\u030C",
			\u00DB: "U\u0302",
			\u016E: "U\u030A",
			\u0170: "U\u030B",
			\u1E7C: "V\u0303",
			\u1E82: "W\u0301",
			\u1E80: "W\u0300",
			\u1E84: "W\u0308",
			\u0174: "W\u0302",
			\u1E86: "W\u0307",
			\u1E8C: "X\u0308",
			\u1E8A: "X\u0307",
			\u00DD: "Y\u0301",
			\u1EF2: "Y\u0300",
			\u0178: "Y\u0308",
			\u1EF8: "Y\u0303",
			\u0232: "Y\u0304",
			\u0176: "Y\u0302",
			\u1E8E: "Y\u0307",
			\u0179: "Z\u0301",
			\u017D: "Z\u030C",
			\u1E90: "Z\u0302",
			\u017B: "Z\u0307",
			\u03AC: "\u03B1\u0301",
			\u1F70: "\u03B1\u0300",
			\u1FB1: "\u03B1\u0304",
			\u1FB0: "\u03B1\u0306",
			\u03AD: "\u03B5\u0301",
			\u1F72: "\u03B5\u0300",
			\u03AE: "\u03B7\u0301",
			\u1F74: "\u03B7\u0300",
			\u03AF: "\u03B9\u0301",
			\u1F76: "\u03B9\u0300",
			\u03CA: "\u03B9\u0308",
			\u0390: "\u03B9\u0308\u0301",
			\u1FD2: "\u03B9\u0308\u0300",
			\u1FD1: "\u03B9\u0304",
			\u1FD0: "\u03B9\u0306",
			\u03CC: "\u03BF\u0301",
			\u1F78: "\u03BF\u0300",
			\u03CD: "\u03C5\u0301",
			\u1F7A: "\u03C5\u0300",
			\u03CB: "\u03C5\u0308",
			\u03B0: "\u03C5\u0308\u0301",
			\u1FE2: "\u03C5\u0308\u0300",
			\u1FE1: "\u03C5\u0304",
			\u1FE0: "\u03C5\u0306",
			\u03CE: "\u03C9\u0301",
			\u1F7C: "\u03C9\u0300",
			\u038E: "\u03A5\u0301",
			\u1FEA: "\u03A5\u0300",
			\u03AB: "\u03A5\u0308",
			\u1FE9: "\u03A5\u0304",
			\u1FE8: "\u03A5\u0306",
			\u038F: "\u03A9\u0301",
			\u1FFA: "\u03A9\u0300"
		};
	class He {
		constructor(e, t) {
			this.mode = void 0, this.gullet = void 0, this.settings = void 0, this.leftrightDepth = void 0, this.nextToken = void 0, this.mode = "math", this.gullet = new Xi(e, t, this.mode), this.settings = t, this.leftrightDepth = 0
		}
		expect(e, t) {
			if (t === void 0 && (t = !0), this.fetch().text !== e) throw new M("Expected '" + e + "', got '" + this.fetch().text + "'", this.fetch());
			t && this.consume()
		}
		consume() {
			this.nextToken = null
		}
		fetch() {
			return this.nextToken == null && (this.nextToken = this.gullet.expandNextToken()), this.nextToken
		}
		switchMode(e) {
			this.mode = e, this.gullet.switchMode(e)
		}
		parse() {
			this.settings.globalGroup || this.gullet.beginGroup(), this.settings.colorIsTextColor && this.gullet.macros.set("\\color", "\\textcolor");
			try {
				var e = this.parseExpression(!1);
				return this.expect("EOF"), this.settings.globalGroup || this.gullet.endGroup(), e
			} finally {
				this.gullet.endGroups()
			}
		}
		subparse(e) {
			var t = this.nextToken;
			this.consume(), this.gullet.pushToken(new D0("}")), this.gullet.pushTokens(e);
			var a = this.parseExpression(!1);
			return this.expect("}"), this.nextToken = t, a
		}
		parseExpression(e, t) {
			for (var a = [];;) {
				this.mode === "math" && this.consumeSpaces();
				var n = this.fetch();
				if (He.endOfExpression.indexOf(n.text) !== -1 || t && n.text === t || e && Q0[n.text] && Q0[n.text].infix) break;
				var i = this.parseAtom(t);
				if (i) {
					if (i.type === "internal") continue
				} else break;
				a.push(i)
			}
			return this.mode === "text" && this.formLigatures(a), this.handleInfixNodes(a)
		}
		handleInfixNodes(e) {
			for (var t = -1, a, n = 0; n < e.length; n++)
				if (e[n].type === "infix") {
					if (t !== -1) throw new M("only one infix operator per group", e[n].token);
					t = n, a = e[n].replaceWith
				} if (t !== -1 && a) {
				var i, o, u = e.slice(0, t),
					m = e.slice(t + 1);
				u.length === 1 && u[0].type === "ordgroup" ? i = u[0] : i = {
					type: "ordgroup",
					mode: this.mode,
					body: u
				}, m.length === 1 && m[0].type === "ordgroup" ? o = m[0] : o = {
					type: "ordgroup",
					mode: this.mode,
					body: m
				};
				var p;
				return a === "\\\\abovefrac" ? p = this.callFunction(a, [i, e[t], o], []) : p = this.callFunction(a, [i, o], []), [p]
			} else return e
		}
		handleSupSubscript(e) {
			var t = this.fetch(),
				a = t.text;
			this.consume(), this.consumeSpaces();
			var n = this.parseGroup(e);
			if (!n) throw new M("Expected group after '" + a + "'", t);
			return n
		}
		formatUnsupportedCmd(e) {
			for (var t = [], a = 0; a < e.length; a++) t.push({
				type: "textord",
				mode: "text",
				text: e[a]
			});
			var n = {
					type: "text",
					mode: this.mode,
					body: t
				},
				i = {
					type: "color",
					mode: this.mode,
					color: this.settings.errorColor,
					body: [n]
				};
			return i
		}
		parseAtom(e) {
			var t = this.parseGroup("atom", e);
			if (this.mode === "text") return t;
			for (var a, n;;) {
				this.consumeSpaces();
				var i = this.fetch();
				if (i.text === "\\limits" || i.text === "\\nolimits") {
					if (t && t.type === "op") {
						var o = i.text === "\\limits";
						t.limits = o, t.alwaysHandleSupSub = !0
					} else if (t && t.type === "operatorname") t.alwaysHandleSupSub && (t.limits = i.text === "\\limits");
					else throw new M("Limit controls must follow a math operator", i);
					this.consume()
				} else if (i.text === "^") {
					if (a) throw new M("Double superscript", i);
					a = this.handleSupSubscript("superscript")
				} else if (i.text === "_") {
					if (n) throw new M("Double subscript", i);
					n = this.handleSupSubscript("subscript")
				} else if (i.text === "'") {
					if (a) throw new M("Double superscript", i);
					var u = {
							type: "textord",
							mode: this.mode,
							text: "\\prime"
						},
						m = [u];
					for (this.consume(); this.fetch().text === "'";) m.push(u), this.consume();
					this.fetch().text === "^" && m.push(this.handleSupSubscript("superscript")), a = {
						type: "ordgroup",
						mode: this.mode,
						body: m
					}
				} else if (ct[i.text]) {
					var p = ct[i.text],
						v = d1.test(i.text);
					for (this.consume();;) {
						var b = this.fetch().text;
						if (!ct[b] || d1.test(b) !== v) break;
						this.consume(), p += ct[b]
					}
					var x = new He(p, this.settings).parse();
					v ? n = {
						type: "ordgroup",
						mode: "math",
						body: x
					} : a = {
						type: "ordgroup",
						mode: "math",
						body: x
					}
				} else break
			}
			return a || n ? {
				type: "supsub",
				mode: this.mode,
				base: t,
				sup: a,
				sub: n
			} : t
		}
		parseFunction(e, t) {
			var a = this.fetch(),
				n = a.text,
				i = Q0[n];
			if (!i) return null;
			if (this.consume(), t && t !== "atom" && !i.allowedInArgument) throw new M("Got function '" + n + "' with no arguments" + (t ? " as " + t : ""), a);
			if (this.mode === "text" && !i.allowedInText) throw new M("Can't use function '" + n + "' in text mode", a);
			if (this.mode === "math" && i.allowedInMath === !1) throw new M("Can't use function '" + n + "' in math mode", a);
			var {
				args: o,
				optArgs: u
			} = this.parseArguments(n, i);
			return this.callFunction(n, o, u, a, e)
		}
		callFunction(e, t, a, n, i) {
			var o = {
					funcName: e,
					parser: this,
					token: n,
					breakOnTokenText: i
				},
				u = Q0[e];
			if (u && u.handler) return u.handler(o, t, a);
			throw new M("No function handler for " + e)
		}
		parseArguments(e, t) {
			var a = t.numArgs + t.numOptionalArgs;
			if (a === 0) return {
				args: [],
				optArgs: []
			};
			for (var n = [], i = [], o = 0; o < a; o++) {
				var u = t.argTypes && t.argTypes[o],
					m = o < t.numOptionalArgs;
				(t.primitive && u == null || t.type === "sqrt" && o === 1 && i[0] == null) && (u = "primitive");
				var p = this.parseGroupOfType("argument to '" + e + "'", u, m);
				if (m) i.push(p);
				else if (p != null) n.push(p);
				else throw new M("Null argument, please report this as a bug")
			}
			return {
				args: n,
				optArgs: i
			}
		}
		parseGroupOfType(e, t, a) {
			switch (t) {
				case "color":
					return this.parseColorGroup(a);
				case "size":
					return this.parseSizeGroup(a);
				case "url":
					return this.parseUrlGroup(a);
				case "math":
				case "text":
					return this.parseArgumentGroup(a, t);
				case "hbox": {
					var n = this.parseArgumentGroup(a, "text");
					return n != null ? {
						type: "styling",
						mode: n.mode,
						body: [n],
						style: "text"
					} : null
				}
				case "raw": {
					var i = this.parseStringGroup("raw", a);
					return i != null ? {
						type: "raw",
						mode: "text",
						string: i.text
					} : null
				}
				case "primitive": {
					if (a) throw new M("A primitive argument cannot be optional");
					var o = this.parseGroup(e);
					if (o == null) throw new M("Expected group as " + e, this.fetch());
					return o
				}
				case "original":
				case null:
				case void 0:
					return this.parseArgumentGroup(a);
				default:
					throw new M("Unknown group type as " + e, this.fetch())
			}
		}
		consumeSpaces() {
			for (; this.fetch().text === " ";) this.consume()
		}
		parseStringGroup(e, t) {
			var a = this.gullet.scanArgument(t);
			if (a == null) return null;
			for (var n = "", i;
				(i = this.fetch()).text !== "EOF";) n += i.text, this.consume();
			return this.consume(), a.text = n, a
		}
		parseRegexGroup(e, t) {
			for (var a = this.fetch(), n = a, i = "", o;
				(o = this.fetch()).text !== "EOF" && e.test(i + o.text);) n = o, i += n.text, this.consume();
			if (i === "") throw new M("Invalid " + t + ": '" + a.text + "'", a);
			return a.range(n, i)
		}
		parseColorGroup(e) {
			var t = this.parseStringGroup("color", e);
			if (t == null) return null;
			var a = /^(#[a-f0-9]{3}|#?[a-f0-9]{6}|[a-z]+)$/i.exec(t.text);
			if (!a) throw new M("Invalid color: '" + t.text + "'", t);
			var n = a[0];
			return /^[0-9a-f]{6}$/i.test(n) && (n = "#" + n), {
				type: "color-token",
				mode: this.mode,
				color: n
			}
		}
		parseSizeGroup(e) {
			var t, a = !1;
			if (this.gullet.consumeSpaces(), !e && this.gullet.future().text !== "{" ? t = this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/, "size") : t = this.parseStringGroup("size", e), !t) return null;
			!e && t.text.length === 0 && (t.text = "0pt", a = !0);
			var n = /([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(t.text);
			if (!n) throw new M("Invalid size: '" + t.text + "'", t);
			var i = {
				number: +(n[1] + n[2]),
				unit: n[3]
			};
			if (!Xr(i)) throw new M("Invalid unit: '" + i.unit + "'", t);
			return {
				type: "size",
				mode: this.mode,
				value: i,
				isBlank: a
			}
		}
		parseUrlGroup(e) {
			this.gullet.lexer.setCatcode("%", 13), this.gullet.lexer.setCatcode("~", 12);
			var t = this.parseStringGroup("url", e);
			if (this.gullet.lexer.setCatcode("%", 14), this.gullet.lexer.setCatcode("~", 13), t == null) return null;
			var a = t.text.replace(/\\([#$%&~_^{}])/g, "$1");
			return {
				type: "url",
				mode: this.mode,
				url: a
			}
		}
		parseArgumentGroup(e, t) {
			var a = this.gullet.scanArgument(e);
			if (a == null) return null;
			var n = this.mode;
			t && this.switchMode(t), this.gullet.beginGroup();
			var i = this.parseExpression(!1, "EOF");
			this.expect("EOF"), this.gullet.endGroup();
			var o = {
				type: "ordgroup",
				mode: this.mode,
				loc: a.loc,
				body: i
			};
			return t && this.switchMode(n), o
		}
		parseGroup(e, t) {
			var a = this.fetch(),
				n = a.text,
				i;
			if (n === "{" || n === "\\begingroup") {
				this.consume();
				var o = n === "{" ? "}" : "\\endgroup";
				this.gullet.beginGroup();
				var u = this.parseExpression(!1, o),
					m = this.fetch();
				this.expect(o), this.gullet.endGroup(), i = {
					type: "ordgroup",
					mode: this.mode,
					loc: p0.range(a, m),
					body: u,
					semisimple: n === "\\begingroup" || void 0
				}
			} else if (i = this.parseFunction(t, e) || this.parseSymbol(), i == null && n[0] === "\\" && !c1.hasOwnProperty(n)) {
				if (this.settings.throwOnError) throw new M("Undefined control sequence: " + n, a);
				i = this.formatUnsupportedCmd(n), this.consume()
			}
			return i
		}
		formLigatures(e) {
			for (var t = e.length - 1, a = 0; a < t; ++a) {
				var n = e[a],
					i = n.text;
				i === "-" && e[a + 1].text === "-" && (a + 1 < t && e[a + 2].text === "-" ? (e.splice(a, 3, {
					type: "textord",
					mode: "text",
					loc: p0.range(n, e[a + 2]),
					text: "---"
				}), t -= 2) : (e.splice(a, 2, {
					type: "textord",
					mode: "text",
					loc: p0.range(n, e[a + 1]),
					text: "--"
				}), t -= 1)), (i === "'" || i === "`") && e[a + 1].text === i && (e.splice(a, 2, {
					type: "textord",
					mode: "text",
					loc: p0.range(n, e[a + 1]),
					text: i + i
				}), t -= 1)
			}
		}
		parseSymbol() {
			var e = this.fetch(),
				t = e.text;
			if (/^\\verb[^a-zA-Z]/.test(t)) {
				this.consume();
				var a = t.slice(5),
					n = a.charAt(0) === "*";
				if (n && (a = a.slice(1)), a.length < 2 || a.charAt(0) !== a.slice(-1)) throw new M(`\\verb assertion failed --
                    please report what input caused this bug`);
				return a = a.slice(1, -1), {
					type: "verb",
					mode: "text",
					body: a,
					star: n
				}
			}
			f1.hasOwnProperty(t[0]) && !W[this.mode][t[0]] && (this.settings.strict && this.mode === "math" && this.settings.reportNonstrict("unicodeTextInMathMode", 'Accented Unicode text character "' + t[0] + '" used in math mode', e), t = f1[t[0]] + t.slice(1));
			var i = ji.exec(t);
			i && (t = t.substring(0, i.index), t === "i" ? t = "\u0131" : t === "j" && (t = "\u0237"));
			var o;
			if (W[this.mode][t]) {
				this.settings.strict && this.mode === "math" && Ft.indexOf(t) >= 0 && this.settings.reportNonstrict("unicodeTextInMathMode", 'Latin-1/Unicode text character "' + t[0] + '" used in math mode', e);
				var u = W[this.mode][t].group,
					m = p0.range(e),
					p;
				if (In.hasOwnProperty(u)) {
					var v = u;
					p = {
						type: "atom",
						mode: this.mode,
						family: v,
						loc: m,
						text: t
					}
				} else p = {
					type: u,
					mode: this.mode,
					loc: m,
					text: t
				};
				o = p
			} else if (t.charCodeAt(0) >= 128) this.settings.strict && (Vr(t.charCodeAt(0)) ? this.mode === "math" && this.settings.reportNonstrict("unicodeTextInMathMode", 'Unicode text character "' + t[0] + '" used in math mode', e) : this.settings.reportNonstrict("unknownSymbol", 'Unrecognized Unicode character "' + t[0] + '"' + (" (" + t.charCodeAt(0) + ")"), e)), o = {
				type: "textord",
				mode: "text",
				loc: p0.range(e),
				text: t
			};
			else return null;
			if (this.consume(), i)
				for (var b = 0; b < i[0].length; b++) {
					var x = i[0][b];
					if (!fr[x]) throw new M("Unknown accent ' " + x + "'", e);
					var w = fr[x][this.mode] || fr[x].text;
					if (!w) throw new M("Accent " + x + " unsupported in " + this.mode + " mode", e);
					o = {
						type: "accent",
						mode: this.mode,
						loc: p0.range(e),
						label: w,
						isStretchy: !1,
						isShifty: !0,
						base: o
					}
				}
			return o
		}
	}
	He.endOfExpression = ["}", "\\endgroup", "\\end", "\\right", "&"];
	var pr = function(e, t) {
			if (!(typeof e == "string" || e instanceof String)) throw new TypeError("KaTeX can only parse string typed expression");
			var a = new He(e, t);
			delete a.gullet.macros.current["\\df@tag"];
			var n = a.parse();
			if (delete a.gullet.macros.current["\\current@color"], delete a.gullet.macros.current["\\color"], a.gullet.macros.get("\\df@tag")) {
				if (!t.displayMode) throw new M("\\tag works only in display equations");
				n = [{
					type: "tag",
					mode: "text",
					body: n,
					tag: a.subparse([new D0("\\df@tag")])
				}]
			}
			return n
		},
		p1 = function(e, t, a) {
			t.textContent = "";
			var n = vr(e, a).toNode();
			t.appendChild(n)
		};
	typeof document < "u" && document.compatMode !== "CSS1Compat" && (typeof console < "u" && console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype."), p1 = function() {
		throw new M("KaTeX doesn't work in quirks mode.")
	});
	var Zi = function(e, t) {
			var a = vr(e, t).toMarkup();
			return a
		},
		Ki = function(e, t) {
			var a = new Bt(t);
			return pr(e, a)
		},
		v1 = function(e, t, a) {
			if (a.throwOnError || !(e instanceof M)) throw e;
			var n = y.makeSpan(["katex-error"], [new k0(t)]);
			return n.setAttribute("title", e.toString()), n.setAttribute("style", "color:" + a.errorColor), n
		},
		vr = function(e, t) {
			var a = new Bt(t);
			try {
				var n = pr(e, a);
				return ii(n, e, a)
			} catch (i) {
				return v1(i, e, a)
			}
		},
		Ji = function(e, t) {
			var a = new Bt(t);
			try {
				var n = pr(e, a);
				return li(n, e, a)
			} catch (i) {
				return v1(i, e, a)
			}
		},
		_i = {
			version: "0.16.9",
			render: p1,
			renderToString: Zi,
			ParseError: M,
			SETTINGS_SCHEMA: Ue,
			__parse: Ki,
			__renderToDomTree: vr,
			__renderToHTMLTree: Ji,
			__setFontMetrics: En,
			__defineSymbol: l,
			__defineFunction: B,
			__defineMacro: c,
			__domTree: {
				Span: Re,
				Anchor: Rt,
				SymbolNode: k0,
				SvgNode: H0,
				PathNode: Z0,
				LineNode: $t
			}
		};
	const {
		preferences: Qi
	} = C0, {
		capitalize: el
	} = l0, dt = {
		log: "#ffbded",
		info: "#c2daff",
		warn: "#fff1a8",
		error: "#ffbdbf",
		debug: "#e2c2ff"
	}, gr = ({
		background: r,
		bold: e
	} = {}) => {
		const t = ["border-radius: 5px", "text-shadow: 3px 2px 8px #0000004d", "color: black"];
		return (e ?? !0) && t.push("font-weight: bold"), t.push(`background: ${r??dt.log}`), t.join("; ")
	}, ke = new Proxy(console, {
		get(r, e) {
			return Qi.get("logger") ? function(...t) {
				return r[e].call(console, `%c SparxSolver %c %c ${el(String(e))} `, gr(), "", gr({
					background: dt[e] ?? dt.log,
					bold: !1
				}), ...t)
			} : function() {}
		}
	});
	var g1 = Object.freeze({
		__proto__: null,
		colors: dt,
		default: ke,
		title: gr
	});
	const n0 = {
			vector: /\\vector{((?:[^}$]|\\$[^$]*\\$)*)}{((?:[^}$]|\\$[^$]*\\$)*)}/g,
			degrees: /\\degrees/g,
			numberComma: /(\d,)(?=\d\d\d)/g,
			unescapedPercent: /([^\\]|^)%/g,
			ungroupedQuestion: /([^{?]|^)([?]+)([^}?]|$)/g,
			uscore: /\\uscore{(\d+)}/g,
			pound: /\\pound/g,
			euro: /\\euro/g,
			gap: /\\gap/g,
			newLine: /\\n(?![a-zA-Z])/g,
			nonBreakingSpace: /~/g,
			ampersand: /&/g,
			leftAngledBracket: /</g,
			apostrophe: /'/g,
			quotation: /"/g,
			hazardousComma: /(?<!\s)\\,/g,
			hazardousCharacters: /[&<>"']/,
			maths: /\$|(?:\\.|[^$])+/g,
			bold: /\*\*(.*)\*\*/g
		},
		Se = {
			openingAngledLeft: "<",
			closingAngledLeft: "</",
			closingAngledRight: ">",
			openingCurly: "{",
			closingCurly: "}"
		},
		br = {
			"\\textbf{": "b",
			"\\textit{": "i",
			"}": ""
		},
		b1 = r => r ? (r = String(r), n0.hazardousCharacters.test(r) ? r.replace(n0.ampersand, "&amp;").replace(n0.leftAngledBracket, "&lt;").replace(n0.apostrophe, "&apos;").replace(n0.quotation, "&quot;") : r) : "",
		y1 = {
			text: new Map([
				[n0.nonBreakingSpace, "\xA0"],
				[n0.newLine, "<br/>"],
				[n0.bold, "<strong>$1</strong>"]
			]),
			maths: new Map([
				[n0.vector, "{$1 \\choose $2}"],
				[n0.degrees, "^\\circ"],
				[n0.numberComma, "$1\\!"],
				[n0.unescapedPercent, "$1\\%"],
				[n0.ungroupedQuestion, "$1{$2}$3"],
				[n0.uscore, "\\rule{$1em}{0.03em}"],
				[n0.pound, "\\pounds"],
				[n0.euro, "\u20AC"],
				[n0.gap, "\\text{\\textunderscore}"],
				[n0.hazardousComma, ""]
			])
		},
		tl = r => {
			if (!r) return "";
			for (const [e, t] of y1.text) r = r.replace(e, t);
			return r
		},
		rl = r => {
			if (!r) return "";
			for (const [e, t] of y1.maths) r = r.replace(e, t);
			return `{${r}}`
		},
		al = (r, e) => {
			const t = [];
			let a = r;
			for (; a;) {
				const n = Object.keys(br).find(o => a.includes(o));
				if (!n) {
					t.push(a);
					break
				}
				const i = a.indexOf(n);
				if (t.push(a.substring(0, i)), a = a.substring(i + n.length), n === Se.closingCurly) {
					const o = e.pop();
					t.push(o ? `${Se.closingAngledLeft}${o}${Se.closingAngledRight}` : Se.closingCurly)
				} else t.push(`${Se.openingAngledLeft}${br[n]}${Se.closingAngledRight}`), e.push(br[n])
			}
			return t.join("")
		},
		nl = (r, e) => _i.renderToString(rl(r), e),
		il = (r, e) => {
			const t = [],
				a = r.match(n0.maths);
			if (a?.length < 1) return "";
			let n = !1;
			for (let i = 0; i < a.length; i++) {
				if (a[i] === "$") {
					n = !n, a[i] = "";
					continue
				}
				if (n) try {
					a[i] = nl(a[i])
				} catch (o) {
					a[i] = `<code class="invalid-math">${b1(a[i])}</code>`, e || ke.warn(o, "Invalid Maths:", a[i])
				} else a[i] = b1(a[i].replace("\\$", "$")), a[i] = al(a[i], t)
			}
			return tl(a.join(""))
		},
		{
			React: ll
		} = le.common,
		ft = ({
			text: r,
			element: e = "p",
			...t
		}) => ll.createElement(e, {
			dangerouslySetInnerHTML: {
				__html: il(r, !1)
			},
			...t
		});
	var sl = Object.freeze({
		__proto__: null,
		TextWithMaths: ft
	});
	const {
		React: yr
	} = le.common, wr = ({
		text: r,
		trailing: e = null,
		className: t = "",
		onClick: a,
		...n
	}) => yr.createElement("div", {
		className: t,
		onClick: a,
		style: {
			...n.style ?? {},
			userSelect: "none"
		},
		...n
	}, r, e && " ", e), w1 = r => yr.createElement(wr, {
		...r,
		className: "_ButtonBase_10evl_1 _FocusTarget_1nxry_1 _ButtonMd_10evl_27 _ButtonBlue_10evl_51 _ButtonContained_10evl_81 " + (r.className ?? "")
	});
	var ol = Object.freeze({
		__proto__: null,
		BaseButton: wr,
		DropdownButton: r => yr.createElement(wr, {
			...r,
			className: "_DropdownMenuItem_tgmt4_59 " + (r.className ?? "")
		}),
		SolidButton: w1
	});
	const {
		React: g0
	} = t0, {
		merge: ul,
		styles: hl
	} = w0({
		common: {
			paddingInline: "1em",
			paddingBlock: "0.25em"
		}
	}), Me = ({
		label: r,
		sublabel: e,
		trailing: t,
		extra: a,
		centerTrailing: n = !0,
		backgroundColor: i = "lightest"
	}) => g0.createElement(g0.Fragment, null, g0.createElement("div", {
		style: X.merge(o => [o.flex, o.row, hl.common, {
			justifyContent: "space-between",
			background: `var(--raw-${i})`
		}])
	}, g0.createElement("div", {
		style: {
			marginBlock: "0.5em",
			flexGrow: 1,
			flexBasis: 0
		}
	}, typeof r == "string" ? g0.createElement(ft, {
		text: r,
		element: "h4"
	}) : r, typeof e == "string" ? g0.createElement(ft, {
		text: e,
		style: {
			margin: 0,
			padding: 0
		}
	}) : e), g0.createElement("div", {
		style: n ? X.merge(o => [o.flex, o.column, o.justify]) : {}
	}, t)), a && g0.createElement(g0.Fragment, null, g0.createElement(je.Small, null), g0.createElement("div", {
		style: ul(o => [o.common, {
			background: `var(--raw-${i})`
		}])
	}, a))), ml = ({
		option: r,
		extra: e,
		...t
	}) => {
		const [a, n] = ve(r, "preferences");
		return g0.createElement(Me, {
			trailing: g0.createElement(w1, {
				text: a ? "Disable" : "Enable",
				onClick: () => n(i => !i)
			}),
			extra: a && e,
			...t
		})
	};
	var cl = "SparxSolver",
		dl = "5.2.1",
		fl = "Sparx with QOL and NO BOOKWORK CODES",
		pl = 3,
		vl = "C0lide",
		gl = ["*://www.sparxmaths.uk/*", "https://auth.sparxmaths.uk/*"],
		bl = {
			128: "assets/logo.png"
		},
		yl = {
			default_icon: {
				128: "assets/logo.png"
			},
			default_title: "SparxSolver"
		},
		wl = ["activeTab", "storage", "downloads"],
		xl = [{
			js: ["index.js"],
			css: ["styles.css"],
			matches: ["https://*.sparxmaths.uk/*"],
			run_at: "document_start"
		}],
		kl = [{
			resources: ["main.js"],
			matches: ["<all_urls>"]
		}],
		pt = {
			name: cl,
			version: dl,
			description: fl,
			manifest_version: pl,
			author: vl,
			host_permissions: gl,
			icons: bl,
			action: yl,
			permissions: wl,
			content_scripts: xl,
			web_accessible_resources: kl
		};
	const {
		React: ee
	} = t0, {
		repository: xr
	} = l0;
	var Sl = () => ee.createElement(Me, {
		label: ee.createElement(ee.Fragment, null, ee.createElement("h4", null, "Written by", " ", ee.createElement("a", {
			href: xr.user,
			target: "blank"
		}, pt.author), ". Version ", pt.version),),
		extra: ee.createElement("h4", null, "Thank you for installing ", pt.name, "	")
	});
	const b0 = {
		...ol,
		...sl,
		..._1,
		Row: Me,
		Dividers: je
	};
	var Ml = Object.freeze({
		__proto__: null,
		components: b0,
		default: b0
	});
	const {
		React: kr
	} = t0, {
		styles: Sr
	} = w0({
		container: {
			width: "100%",
			marginBlock: "0.5em"
		},
		label: {
			marginRight: "1rem",
			marginBlock: "0.4rem",
			flexGrow: 1,
			width: "min-content"
		},
		input: {
			borderRadius: "100em",
			height: "var(--spx-unit-10)"
		}
	});
	var x1 = ({
		type: r,
		label: e,
		placeholder: t
	}) => {
		const [a, n] = ve(r, "preferences");
		return kr.createElement("div", {
			style: X.merge(i => [i.flex, i.justify, i.align, Sr.container])
		}, kr.createElement("p", {
			style: Sr.label
		}, e), kr.createElement("input", {
			type: "text",
			className: "_Search_juc87_90",
			style: Sr.input,
			placeholder: t,
			value: a,
			onChange: i => n(i.target.value)
		}))
	};
	const {
		React: Mr
	} = t0, {
		name: k1
	} = l0;
	var zl = () => Mr.createElement("div", {
		style: X.merge(r => [r.flex, r.justify, r.wrap])
	}, Mr.createElement(x1, {
		type: "betterFirstName",
		label: "First",
		placeholder: k1.defaults.firstName
	}), Mr.createElement(x1, {
		type: "betterLastName",
		label: "Last",
		placeholder: k1.defaults.lastName
	}));
	const {
		React: ze
	} = t0, Al = [{
		label: "Logger",
		sublabel: "Toggles SparxSolver's custom Logger in the Developer console.",
		option: "logger"
	}, {
		label: "Anonymize Name",
		sublabel: "Allows you to set your own custom first and last name.",
		option: "shouldUseName",
		extra() {
			return ze.createElement(zl, null)
		}
	}], Tl = () => Al.map(({
		extra: r,
		...e
	}, t, a) => ze.createElement(ze.Fragment, null, ze.createElement(ml, {
		...e,
		extra: r && ze.createElement(r, null)
	}), t !== a.length - 1 && ze.createElement(b0.Dividers.Large, null))), {
		React: Ae
	} = t0, {
		Section: Bl,
		SolidButton: El
	} = b0, {
		getImage: Cl,
		navigate: Dl
	} = l0, {
		styles: Nl
	} = w0({
		section: {
			marginTop: "1.5em",
			marginBottom: "0.5em"
		}
	});
	var ql = () => Ae.createElement(Bl, {
			collapsable: !1,
			style: Nl.section
		}, Ae.createElement(Me, {
			label: Ae.createElement("div", {
				style: X.merge(r => [r.flex, r.align])
			}, Ae.createElement("h1", null, "Welcome to SparxSolver!"), Ae.createElement(El, {
				text: "Back",
				style: {
					marginLeft: 10
				},
				onClick: () => Dl(-1, null)
			})),
			sublabel: pt.description,
			trailing: Ae.createElement("img", {
				src: Cl("logo.png"),
				style: {
					width: "4em"
				},
				alt: "Sparx Maths"
			})
		})),
		Rl = [{
			name: "Blue",
			colors: {
				raw: {
					darkest: "#404b5e",
					dark: "#72809d",
					medium: "#859ed1",
					light: "#afc2de",
					lightest: "#dbeaff",
					shine: "#ebf3ff"
				},
				tint: {
					hue: "150deg",
					intensity: "0.8"
				},
				shadow: {
					small: "#d2daf880",
					medium: "#d2daf899",
					large: "#d2daf8cc"
				}
			}
		}, {
			name: "Aqua",
			colors: {
				raw: {
					darkest: "#405e58",
					dark: "#729d96",
					medium: "#85d1c4",
					light: "#afded3",
					lightest: "#d9fff6",
					shine: "#edfffb"
				},
				tint: {
					hue: "125deg",
					intensity: "0.8"
				},
				shadow: {
					small: "#d2f8ed80",
					medium: "#d2f8ed99",
					large: "#d2f8edcc"
				}
			}
		}, {
			name: "Green",
			colors: {
				raw: {
					darkest: "#415e40",
					dark: "#729d72",
					medium: "#85d185",
					light: "#b2deaf",
					lightest: "#d9ffd6",
					shine: "#ecffeb"
				},
				tint: {
					hue: "80deg",
					intensity: "0.8"
				},
				shadow: {
					small: "#daf8d280",
					medium: "#daf8d299",
					large: "#daf8d2cc"
				}
			}
		}, {
			name: "Creme",
			colors: {
				raw: {
					darkest: "#5e4940",
					dark: "#9d7f72",
					medium: "#d19e85",
					light: "#debdaf",
					lightest: "#ffe8de",
					shine: "#fff3ed"
				},
				tint: {
					hue: "330deg",
					intensity: "0.8"
				},
				shadow: {
					small: "#f8e6d280",
					medium: "#f8e6d299",
					large: "#f8e6d2cc"
				}
			}
		}, {
			name: "Dusk",
			colors: {
				raw: {
					darkest: "#030303",
					dark: "#3b3b3b",
					medium: "#5e5e5e",
					light: "#2e2e2e",
					lightest: "#bfbfbf",
					shine: "#e3e3e3"
				},
				tint: {
					hue: "0deg",
					intensity: "0"
				},
				text: {
					light: "#f5f5f5",
					dark: "#1a1a1a"
				},
				shadow: {
					small: "#00000010",
					medium: "#00000029",
					large: "#0000005c"
				}
			}
		}],
		$l = Object.defineProperty,
		Il = (r, e, t) => e in r ? $l(r, e, {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: t
		}) : r[e] = t,
		Ol = (r, e, t) => (Il(r, typeof e != "symbol" ? e + "" : e, t), t);
	const {
		preferences: Ll,
		colors: Fl
	} = C0, vt = {
		raw: ["darkest", "dark", "medium", "light", "lightest", "shine"],
		tint: ["hue", "intensity"],
		shadow: ["small", "medium", "large"]
	};
	let z0 = class {
		static get index() {
			return Ll.get("themeIndex") ?? 0
		}
		static get theme() {
			return this.themes[this.index]
		}
		static applyLabel(e) {
			e && (e.textContent = `${e?.textContent?.split("|")[0]} | ${this.theme.name}`)
		}
		static setTheme() {
			Object.entries(this.theme.colors).forEach(([e, t]) => {
				if (e === "tint") {
					const a = t.hue || "280deg",
						n = t.intensity !== 0 && !t.intensity ? "0.8" : t.intensity,
						i = `sepia(1) hue-rotate(${a}) saturate(${n})`;
					return document.documentElement.style.setProperty(`--${e}`, i)
				}
				Object.entries(t).forEach(([a, n]) => {
					document.documentElement.style.setProperty(`--${e}-${a}`, n)
				})
			})
		}
	};
	Ol(z0, "themes", [...Rl, {
		name: "Custom",
		get colors() {
			return Object.keys(vt).reduce((r, e) => ({
				...r,
				[e]: vt[e].reduce((t, a) => ({
					...t,
					[a]: Fl.get(`${e}-${a}`)
				}), {})
			}), {})
		}
	}]);
	const {
		React: zr
	} = t0, {
		styles: Hl
	} = w0({
		selector: {
			borderRadius: "100em",
			height: "var(--spx-unit-10)",
			width: "auto",
			paddingRight: "2em",
			marginLeft: "0.5em",
			color: "var(--raw-darkest)"
		}
	});
	var Pl = ({
		label: r,
		selected: e,
		setSelected: t
	}) => (zr.useEffect(() => {
		z0.setTheme(), z0.applyLabel(r)
	}, [e]), zr.createElement("select", {
		value: e,
		className: "_SelectTrigger_g2nok_1",
		style: Hl.selector,
		onChange: a => {
			const n = Number(a.target.value);
			t(z0.themes[n] ? n : 0)
		}
	}, z0.themes.map((a, n) => zr.createElement("option", {
		value: n
	}, a.name))));
	const {
		React: te
	} = t0, {
		capitalize: Gl
	} = l0, {
		merge: Vl,
		styles: jl
	} = w0({
		input: {
			borderRadius: "100em",
			height: "var(--spx-unit-8)",
			marginInline: "1em"
		},
		color: {
			width: "1.5rem",
			height: "1.5rem",
			marginTop: "0.25rem",
			borderRadius: "0.5rem",
			border: "1px solid #00000020"
		}
	});
	var Ul = ({
		label: r,
		color: e,
		colorKey: t,
		colorType: a,
		backgroundColor: n
	}) => {
		const i = te.useMemo(() => e.toLowerCase().includes("tint"), []),
			o = te.useMemo(() => z0.themes[0].colors, []),
			[u, m] = ve(e, "colors");
		return te.useEffect(() => {
			z0.setTheme(), z0.applyLabel(r)
		}, [u]), te.createElement(Me, {
			label: Gl(t),
			backgroundColor: n,
			trailing: te.createElement("div", {
				style: X.merge(p => [p.flex, p.align])
			}, te.createElement("input", {
				className: "_Search_juc87_90",
				style: jl.input,
				placeholder: o[a][t],
				value: u,
				onChange: p => m(p.target.value)
			}), te.createElement("div", {
				style: X.merge(p => [p.flex, p.column])
			}, te.createElement("div", {
				style: Vl(p => [p.color, {
					backgroundColor: i ? "#ff6d1f" : u || `var(--${e})`,
					filter: i ? "var(--tint)" : null
				}])
			})))
		})
	};
	const {
		React: d0
	} = t0, {
		colors: Wl
	} = C0, {
		capitalize: Yl
	} = l0, {
		styles: Ar
	} = w0({
		title: {
			marginBlock: 0
		},
		button: {
			marginLeft: 10
		},
		fallback: {
			maxWidth: "75%"
		}
	});
	var Xl = ({
		selected: r,
		setSelected: e,
		label: t
	}) => {
		const a = d0.useMemo(() => z0.themes[r].name === "Custom", [r]);
		return d0.createElement(d0.Fragment, null, d0.createElement("div", {
			style: X.merge(n => [n.flex, n.justify, n.align, {
				marginTop: "0.5em"
			}])
		}, d0.createElement("h2", {
			style: X.merge(n => [n.textCenter, Ar.title])
		}, "Custom values"), a && d0.createElement(b0.SolidButton, {
			text: "Clear colors",
			style: Ar.button,
			onClick: () => {
				Wl.clear(), e(0), setTimeout(() => e(z0.themes.findIndex(n => n.name === "Custom")))
			}
		})), d0.createElement("div", {
			style: a ? {} : X.merge(n => [n.flex, n.justify])
		}, a ? Object.keys(vt).map(n => d0.createElement(pe, {
			title: Yl(n)
		}, vt[n].map((i, o, u) => d0.createElement(d0.Fragment, null, d0.createElement(Ul, {
			label: t,
			color: `${n}-${i}`,
			colorType: n,
			colorKey: i,
			backgroundColor: o % 2 === 0 ? "shine" : "lightest"
		}), o !== u.length - 1 && d0.createElement(je.Small, null))))) : d0.createElement("p", {
			style: X.merge(n => [n.textCenter, Ar.fallback])
		}, "Select the ", d0.createElement("strong", null, "Custom"), " theme from the dropdown above for these colors to be editable!")))
	};
	const {
		React: he
	} = t0;
	var Zl = () => {
		const [r] = he.useState(document.querySelector('[class*="_XPCount_g7mut_"]')), [e, t] = ve("themeIndex", "preferences");
		return he.createElement(Me, {
			label: he.createElement("div", {
				style: X.merge(a => [a.flex, a.align])
			}, he.createElement("h3", {
				style: {
					fontWeight: 700
				}
			}, "Selected theme:"), he.createElement(Pl, {
				label: r,
				selected: e,
				setSelected: t
			})),
			trailing: he.createElement(b0.SolidButton, {
				text: "Cycle Theme",
				onClick: () => t(a => z0.themes[a + 1] ? a + 1 : 0)
			}),
			extra: he.createElement(Xl, {
				selected: e,
				setSelected: t,
				label: r
			})
		})
	};
	const {
		React: O0
	} = t0;
	var Kl = () => O0.createElement(O0.Fragment, null, O0.createElement(ql, null), O0.createElement(je.Large, null), O0.createElement(pe, {
			title: "Preferences",
			style: {
				marginTop: "1em"
			}
		}, O0.createElement(Tl, null)), O0.createElement(pe, {
			title: "Themes"
		}, O0.createElement(Zl, null)), O0.createElement(pe, {
			title: "About"
		}, O0.createElement(Sl, null))),
		Jl = Object.defineProperty,
		_l = (r, e, t) => e in r ? Jl(r, e, {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: t
		}) : r[e] = t,
		S1 = (r, e, t) => (_l(r, typeof e != "symbol" ? e + "" : e, t), t);
	const {
		React: Ql
	} = t0, {
		navigate: es
	} = l0, M1 = "/SparxSolver/settings";
	var ts = {
		Item: class {
			constructor() {
				S1(this, "text", "Settings")
			}
			callback() {
				es(M1)
			}
		},
		Route: class {
			constructor() {
				S1(this, "path", M1)
			}
			component() {
				return Ql.createElement(Kl, null)
			}
		}
	};
	const {
		React: gt
	} = t0;
	var rs = ({
		enabled: r,
		setEnabled: e
	}) => gt.createElement("div", {
		style: X.merge(t => [t.flex, t.align, {
			marginBottom: "0"
		}])
	}, gt.createElement("h3", {
		style: {
			marginRight: "0.5em"
		}
	}, "Autobookwork (", gt.createElement("strong", null, r ? "Enabled" : "Disabled"), ")"), gt.createElement(b0.SolidButton, {
		text: r ? "Disable" : "Enable",
		onClick: () => e(t => !t)
	}));
	const bt = {
			Theming: z0,
			StorageHandler: Ve,
			storages: C0
		},
		{
			React: y0
		} = t0,
		{
			storages: {
				bookwork: as
			}
		} = bt,
		{
			Section: ns,
			SectionBody: is,
			Row: z1,
			Dividers: A1
		} = b0,
		{
			styles: ls
		} = w0({
			fallback: {
				marginInline: "2em",
				paddingBlock: "1em",
				background: "var(--raw-lightest)"
			}
		});

	function ss([r], [e]) {
		const t = Number(r.slice(0, -1)),
			a = Number(e.slice(0, -1)),
			n = r.slice(-1),
			i = e.slice(-1);
		return t !== a ? t - a : n.localeCompare(i)
	}
	var os = ({
		query: r,
		force: e
	}) => {
		const t = y0.useMemo(() => Object.entries(as.list()).filter(([a]) => a.toLowerCase().includes(r.toLowerCase())), [r, e]);
		return t.length > 0 ? t.sort(ss).map(([a, n]) => n.length > 0 && y0.createElement(ns, {
			title: a
		}, n.filter(i => i.answers.length > 0).sort((i, o) => o.date - i.date).map((i, o, u) => {
			const m = i.answers.length > 1 ? "s" : "",
				p = i.answers.map(v => isNaN(+v) ? v : `$${v}$`).join("$,\\;\\;$");
			return y0.createElement(y0.Fragment, null, y0.createElement(z1, {
				label: "Question:",
				sublabel: i.id,
				trailing: y0.createElement("div", {
					style: {
						marginTop: "0.5em",
						marginRight: "0.5em",
						marginLeft: "1em"
					}
				}, y0.createElement("h6", {
					style: {
						color: "var(--raw-dark)"
					}
				}, "Date stored:"), y0.createElement("h4", {
					style: {
						fontWeight: "normal"
					}
				}, new Date(i.date).toLocaleString())),
				centerTrailing: !1
			}), y0.createElement(A1.Small, null), y0.createElement(z1, {
				label: `Answer${m}:`,
				sublabel: p
			}), o !== u.length - 1 && y0.createElement(A1.Large, null))
		}))) : y0.createElement(is, {
			style: ls.fallback
		}, y0.createElement("h2", {
			style: X.merge(a => [a.flex, a.justify, a.align, a.textCenter])
		}, "No bookwork codes found :("))
	};
	const {
		React: Q
	} = t0, {
		navigate: us
	} = l0, {
		bookwork: hs
	} = C0, {
		merge: ms,
		styles: me
	} = w0({
		common: {
			marginLeft: "1em"
		},
		input: {
			borderRadius: "10em",
			height: "auto"
		},
		message: {
			marginInline: "2em",
			background: "var(--raw-lightest)"
		},
		navigation: {
			marginBlock: "1em"
		},
		collapsable: {
			overflow: "hidden",
			transition: "max-height 300ms ease, opacity 300ms ease"
		}
	});
	var cs = () => {
			const [r, e] = ve("autoBookwork", "preferences"), [t, a] = Q.useState(""), [n, i] = Q.useState({});
			return Q.createElement(Q.Fragment, null, Q.createElement("div", {
				style: X.merge(o => [o.flex, o.justify, o.row, me.navigation])
			}, Q.createElement("div", {
				style: me.common
			}, Q.createElement("input", {
				placeholder: "Search for code...",
				value: t,
				onChange: o => a(o.target.value),
				maxLength: 2,
				className: "_Search_juc87_90",
				style: me.input
			})), Q.createElement("div", {
				style: X.merge(o => [o.flex, me.common])
			}, Q.createElement(rs, {
				enabled: r,
				setEnabled: e
			})), Q.createElement("div", {
				style: X.merge(o => [me.common, o.column, o.justify, o.flex])
			}, Q.createElement(b0.SolidButton, {
				text: "Clear",
				onClick: () => {
					hs.clear(), i({})
				}
			})), Q.createElement("div", {
				style: X.merge(o => [me.common, o.column, o.justify, o.flex])
			}, Q.createElement(b0.SolidButton, {
				text: "Back",
				onClick: () => us(-1, null)
			}))), Q.createElement("div", {
				style: ms(o => [o.collapsable, {
					maxHeight: r ? "0" : "100%",
					opacity: r ? "0" : "1"
				}])
			}, Q.createElement(b0.SectionBody, {
				style: X.merge(o => [o.textCenter, me.message])
			}, Q.createElement("p", null, "With Auto-bookwork disabled, ", Q.createElement("strong", null, "Answers will no longer be selected automatically"), " if the answer provided matches a bookwork-check option."), Q.createElement(b0.Dividers.Small, null), Q.createElement("p", null, "They will still be ", Q.createElement("strong", null, "saved"), " and ", Q.createElement("strong", null, "displayed in bookwork checks"), " for you to choose manually."))), Q.createElement(os, {
				query: t,
				force: n
			}))
		},
		ds = Object.defineProperty,
		fs = (r, e, t) => e in r ? ds(r, e, {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: t
		}) : r[e] = t,
		T1 = (r, e, t) => (fs(r, typeof e != "symbol" ? e + "" : e, t), t);
	const {
		React: ps
	} = t0, {
		navigate: vs
	} = l0, B1 = "/SparxSolver/bookwork";
	var gs = {
			Item: class {
				constructor() {
					T1(this, "text", "Bookwork")
				}
				callback() {
					vs(B1)
				}
			},
			Route: class {
				constructor() {
					T1(this, "path", B1)
				}
				component() {
					return ps.createElement(cs, null)
				}
			}
		},
		E1 = {
			settings: ts,
			bookwork: gs
		};
	const C1 = ["a", "b", "i"],
		ce = new Map;

	function bs(r, e, t, a, n) {
		const i = ce.get(e)?.[r];
		if (!i) return n ? Reflect.construct(e[r], t, a) : e[r].apply(a, t);
		for (const u of i.b.values()) {
			const m = u.call(a, t);
			Array.isArray(m) && (t = m)
		}
		let o = [...i.i.values()].reduce((u, m) => (...p) => m.call(a, p, u), (...u) => n ? Reflect.construct(i.o, u, a) : i.o.apply(a, u))(...t);
		for (const u of i.a.values()) o = u.call(a, t, o) ?? o;
		return o
	}

	function D1(r, e, t, a) {
		const n = ce.get(r),
			i = n?.[e];
		return i?.[a].has(t) ? (i[a].delete(t), C1.every(o => i[o].size === 0) && (Reflect.defineProperty(r, e, {
			value: i.o,
			writable: !0,
			configurable: !0
		}) || (r[e] = i.o), delete n[e]), Object.keys(n).length == 0 && ce.delete(r), !0) : !1
	}

	function ys() {
		for (const [r, e] of ce.entries())
			for (const t in e)
				for (const a of C1)
					for (const n of e[t]?.[a].keys() ?? []) D1(r, t, n, a)
	}
	var Tr = r => (e, t, a, n = !1) => {
		if (typeof t[e] != "function") throw new Error(`${e} is not a function in ${t.constructor.name}`);
		ce.has(t) || ce.set(t, {});
		const i = ce.get(t);
		if (!i[e]) {
			const m = t[e];
			i[e] = {
				o: m,
				b: new Map,
				i: new Map,
				a: new Map
			};
			const p = (x, w, z) => {
					const T = bs(e, t, w, x, z);
					return n && u(), T
				},
				v = new Proxy(m, {
					apply: (x, w, z) => p(w, z, !1),
					construct: (x, w) => p(m, w, !0),
					get: (x, w, z) => w == "toString" ? m.toString.bind(m) : Reflect.get(x, w, z)
				});
			Reflect.defineProperty(t, e, {
				value: v,
				configurable: !0,
				writable: !0
			}) || (t[e] = v)
		}
		const o = Symbol(),
			u = () => D1(t, e, o, r);
		return i[e][r].set(o, a), u
	};
	const ws = Tr("b"),
		xs = Tr("i"),
		ks = Tr("a");
	var Pe = Object.freeze({
		__proto__: null,
		after: ks,
		before: ws,
		instead: xs,
		unpatchAll: ys
	});
	const {
		lazyDefine: Ss
	} = l0;
	async function Ms() {
		const r = await Ss(() => le.common.React, e => typeof e.useContext == "function" && typeof e.createElement == "function");
		Pe.after("useContext", r, (e, t) => {
			t && t.router && t.navigator && (SparxSolver.navigation = t, Object.values(E1).filter(a => a.Route).map(a => new a.Route).forEach(a => {
				t.router.routes[0].children.find(n => n.path === a.path) || t.router.routes[0].children.push({
					path: a.path,
					element: r.createElement("div", {
						style: {
							background: "var(--raw-shine)",
							height: "100%",
							overflowY: "auto"
						},
						children: r.createElement(a.component)
					}),
					hasErrorBoundary: !1,
					children: void 0,
					id: `0-${t.router.routes[0].children.length}`
				})
			}), t.router._internalSetRoutes(t.router.routes))
		})
	}
	const {
		lazyDefine: N1,
		findReact: zs,
		findInReactTree: As
	} = l0, {
		Theming: Ts
	} = bt, {
		React: Bs
	} = le.common;
	async function Es() {
		const r = await N1(() => document.querySelector('[class*="_XPCount_g7mut_"]')),
			e = await N1(() => document.querySelector('[class*="_DropdownMenuContent_"][role="menu"]'), void 0, 1 / 0),
			t = zs(e);
		return Pe.before("render", t.type, a => {
			Ts.applyLabel(r);
			const n = As(a[0], i => Array.isArray(i.children) && i.className.includes("_DropdownMenuContent_"));
			n && Object.values(E1).filter(i => i.Item).map(i => new i.Item).forEach(i => {
				for (const u of n.children)
					if (u?.props?.text === i.text) return;
				const o = n.children.findIndex(u => u?.props?.children === "Logout");
				n.children.splice(o === -1 ? 1 : o, 0, Bs.createElement(b0.DropdownButton, {
					text: i.text,
					onClick: i.callback
				}))
			})
		})
	}
	const {
		findReact: q1,
		findInTree: R1,
		findInReactTree: Cs,
		isEmpty: Br
	} = l0, {
		bookwork: $1
	} = C0;

	function Ds(r) {
		const e = [];
		return Br(r.number_fields) || Object.values(r.number_fields).forEach(t => t.value && e.push(t.value)), Br(r.cards) || Object.values(r.cards).forEach(t => t.slot_ref && e.push(t.content[0].text)), Br(r.choices) || Object.values(r.choices).forEach(t => t.selected && e.push(t.content[0].text)), e
	}

	function yt() {
		const r = document.querySelector('[class*="_QuestionWrapper_"]'),
			e = document.querySelector('[class*="_QuestionInfo_"]');
		if (!r || !e) {
			ke.debug("", {
				question: r,
				info: e
			});
			return
		}
		const t = q1(r),
			a = q1(e),
			n = Cs(t.memoizedProps.children, v => v.layout && v.input),
			i = R1(n.layout, v => v.type.includes("question-text"), {
				walkable: ["content"]
			}),
			o = R1(i, v => v.element === "text", {
				walkable: ["content"]
			})?.text,
			u = a.memoizedProps.bookworkCode,
			m = Ds(n.input);
		if (!o || !u || !m) {
			ke.debug("Answers failed to parse:", {
				id: o,
				code: u,
				answers: m
			});
			return
		}
		const p = v => v.replace(/\$.*?\$/g, "").replace(/ +/g, " ");
		$1.set(u, [...$1.get(u)?.filter(v => p(v.id) !== p(o)) ?? [], {
			id: o,
			answers: m,
			date: Date.now()
		}])
	}
	async function Ns() {
		return document.addEventListener("pointerdown", yt, {
			capture: !0
		}), document.addEventListener("keydown", yt, {
			capture: !0
		}), () => {
			document.removeEventListener("pointerdown", yt, {
				capture: !0
			}), document.removeEventListener("keydown", yt, {
				capture: !0
			})
		}
	}
	const {
		findReact: qs,
		findInReactTree: Er,
		lazyDefine: Rs
	} = l0, {
		bookwork: $s,
		preferences: Is
	} = C0, {
		React: re
	} = t0, {
		styles: Os
	} = w0({
		item: {
			backgroundColor: "var(--colours-selected)",
			color: "var(--palette-white)",
			width: "fit-content",
			paddingBlock: "0.4em",
			paddingInline: "0.6em",
			borderRadius: "4px"
		}
	}), Ls = ({
		answers: r
	}) => re.createElement("div", {
		id: "SparxSolver-wac-content",
		style: X.merge(e => [e.textCenter, {
			marginInline: "6em"
		}])
	}, re.createElement("h3", {
		style: {
			marginInline: "2em"
		}
	}, "The three most recent answers for this code are shown below:"), re.createElement("div", {
		style: X.merge(e => [e.flex, e.row, {
			justifyContent: "space-around"
		}])
	}, r.filter(e => e.answers?.length > 0).sort((e, t) => t.date - e.date).slice(0, 3).map(e => re.createElement("div", {
		style: {
			marginBlock: "2em"
		}
	}, re.createElement("div", {
		style: Os.item
	}, re.createElement("h6", {
		style: X.merge(t => [t.flex, t.justify, {
			fontWeight: "bold",
			color: "var(--palette-white)"
		}])
	}, "(", new Date(e.date).toLocaleString(), ")"), re.createElement(ft, {
		text: e.answers.map(t => isNaN(+t) ? t : `$${t}$`).join(", "),
		element: "h4",
		style: {
			color: "var(--palette-white)"
		}
	}))))));

	function Fs() {
		const r = document.querySelector('[class*="_WACContainer_"]');
		if (!r) return;
		const e = qs(r);
		if (!e) return ke.debug("Failed to find React Fiber of WAC:", e);
		const t = Er(e.memoizedProps, a => a.children === "Submit" && a.onClick);
		Pe.after("render", e.type, (a, {
			props: {
				children: n
			}
		}) => {
			!t.isDisabled && t.onClick();
			const i = Er(n, b => b?.find(x => x.props.className.includes("Bookwork"))),
				o = i?.find(b => b.props?.className?.includes("Bookwork"))?.props?.children,
				u = Er(n, b => b.props.choices && b.props.option);
			if (!o) return;
			const m = o[1],
				p = $s.get(m) ?? [],
				v = Array.isArray(p) ? p.filter(b => Array.isArray(b.answers)) : [];
			if (i.find(b => b.props.SparxSolver) || i.push(re.createElement(Ls, {
					answers: v,
					SparxSolver: !0
				})), !Is.get("autoBookwork")) return ke.info("Autobookwork is disabled.");
			u?.props?.choices.forEach(({
				element: {
					props: b
				},
				onSelect: x
			}) => {
				const w = b.markup.replace(/<[^>]+>/g, "").replace(/^\$|\$$/g, "");
				v.forEach(z => {
					z.answers?.join("").replace(/^\$|\$$/g, "") === w && x()
				})
			})
		})
	}
	async function Hs() {
		const r = await Rs(() => document.querySelector('[id="root"]'), void 0, 1 / 0),
			e = new MutationObserver(function(t) {
				t.forEach(function(a) {
					a.type === "childList" && Fs()
				})
			});
		return e.observe(r, {
			childList: !0,
			subtree: !0
		}), () => e.disconnect()
	}
	const Ps = Promise.allSettled([Es(), Ns(), Hs()]),
		Gs = {
			modules: le,
			components: Ml,
			handlers: bt,
			utilities: l0,
			patches: Ps,
			patcher: Pe,
			hooks: Q1,
			navigation: null
		};

	function Vs() {
		window.SparxSolver = Gs, window.__sparxweb && (window.__sparxweb.environment = "development"), window.location.href.includes("SparxSolver") && (window.location.href = window.location.href.replace(/SparxSolver\/.*/g, ""))
	}
	const {
		name: I1,
		lazyDefine: js
	} = l0, {
		Theming: O1,
		storages: {
			preferences: wt
		}
	} = bt, Us = {
		themeIndex: 0,
		autoBookwork: !0,
		shouldUseName: !1,
		logger: !0
	};
	async function Ws() {
		Object.entries(Us).forEach(([e, t]) => {
			wt.get(e) ?? wt.set(e, t)
		}), Pe.after("defineProperty", Object, (e, t) => {
			if (t.data?.student && ["firstName", "lastName"].every(a => a in t.data?.student)) {
				const {
					student: a
				} = t.data;
				wt.set("firstName", a.firstName), wt.set("lastName", a.lastName), a.firstName = I1.firstName, a.lastName = I1.lastName
			}
		});
		const r = await js(() => document.querySelector('[class*="_XPCount_g7mut_"]'));
		O1.setTheme(), O1.applyLabel(r)
	}
	const {
		lazyDefine: Ys,
		getImage: Xs
	} = l0;
	async function Zs() {
		const r = (await Ys(() => document.querySelector('[class*="_SMLogo_g7mut_"]'))).childNodes[0];
		r.src = Xs("logo.png"), r.style.width = "50px"
	}
	Promise.allSettled([Ms(), Vs(), Ws(), Zs()])
})();
