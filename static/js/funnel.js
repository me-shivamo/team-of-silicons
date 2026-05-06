// Problem-discovery funnel for the team-of-silicons landing page.
// 5-step state machine, vanilla JS, no framework.
//   step 1 — pick a category
//   step 2 — check the problems that resonate
//   step 3 — show how silicon handles each picked problem
//   step 4 — capture an email
//   step 5 — push to telegram
// State persists in localStorage (key: silicon_funnel_state) and is
// reflected in the URL hash (#step=N) so the back button works.
(function () {
    var STORAGE_KEY = 'silicon_funnel_state';
    var TG_URL = 'https://t.me/Welcome_to_Silicon_bot';
    var MAX_STEP = 5;

    var root = document.getElementById('funnel-root');
    if (!root) return;

    var problems = window.SILICON_PROBLEMS || [];

    // ---- state -------------------------------------------------------------
    var defaultState = {
        step: 1,
        category: null,        // category key
        checked: [],           // array of problem texts
        email: '',
        emailSubmitted: false
    };

    function loadState() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return Object.assign({}, defaultState);
            var parsed = JSON.parse(raw);
            return Object.assign({}, defaultState, parsed);
        } catch (e) {
            return Object.assign({}, defaultState);
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) { /* private mode etc — ignore */ }
    }

    var state = loadState();

    // sync with URL hash on first load — hash takes precedence for step
    function readHashStep() {
        var m = /#step=(\d)/.exec(window.location.hash || '');
        if (!m) return null;
        var n = parseInt(m[1], 10);
        return (n >= 1 && n <= MAX_STEP) ? n : null;
    }

    function writeHashStep(step, replace) {
        var hash = '#step=' + step;
        if (window.location.hash === hash) return;
        if (replace && history.replaceState) {
            history.replaceState(null, '', hash);
        } else {
            window.location.hash = hash;
        }
    }

    // ---- helpers -----------------------------------------------------------
    function findCategory(key) {
        for (var i = 0; i < problems.length; i++) {
            if (problems[i].key === key) return problems[i];
        }
        return null;
    }

    function findProblem(catKey, text) {
        var cat = findCategory(catKey);
        if (!cat) return null;
        for (var i = 0; i < cat.problems.length; i++) {
            if (cat.problems[i].text === text) return cat.problems[i];
        }
        return null;
    }

    function el(tag, attrs, children) {
        var node = document.createElement(tag);
        if (attrs) {
            for (var k in attrs) {
                if (k === 'class') node.className = attrs[k];
                else if (k === 'text') node.textContent = attrs[k];
                else if (k === 'html') node.innerHTML = attrs[k];
                else if (k.indexOf('on') === 0 && typeof attrs[k] === 'function') {
                    node.addEventListener(k.slice(2), attrs[k]);
                } else if (attrs[k] === true) node.setAttribute(k, '');
                else if (attrs[k] !== false && attrs[k] != null) node.setAttribute(k, attrs[k]);
            }
        }
        if (children) {
            (Array.isArray(children) ? children : [children]).forEach(function (c) {
                if (c == null || c === false) return;
                if (typeof c === 'string') node.appendChild(document.createTextNode(c));
                else node.appendChild(c);
            });
        }
        return node;
    }

    function backLink(targetStep, label) {
        return el('button', {
            class: 'funnel-back',
            type: 'button',
            'aria-label': 'go back',
            onclick: function () { goTo(targetStep); }
        }, [
            el('span', { class: 'funnel-back-arrow', 'aria-hidden': 'true', text: '←' }),
            ' ' + (label || 'back')
        ]);
    }

    function isValidEmail(s) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || '').trim());
    }

    // ---- transitions -------------------------------------------------------
    var stage = null;

    function ensureStage() {
        if (stage && stage.parentNode === root) return stage;
        root.innerHTML = '';
        stage = el('div', { class: 'funnel-stage', id: 'funnel-stage' });
        root.appendChild(stage);
        return stage;
    }

    function swap(buildNext) {
        ensureStage();
        var current = stage.firstElementChild;
        var next = buildNext();
        next.classList.add('funnel-step-enter');
        if (current) {
            current.classList.add('funnel-step-leave');
            setTimeout(function () {
                if (current.parentNode) current.parentNode.removeChild(current);
            }, 220);
        }
        stage.appendChild(next);
        // force reflow then reveal
        // eslint-disable-next-line no-unused-expressions
        next.offsetHeight;
        next.classList.remove('funnel-step-enter');
    }

    function goTo(step, opts) {
        opts = opts || {};
        if (step < 1) step = 1;
        if (step > MAX_STEP) step = MAX_STEP;
        var changed = state.step !== step;
        state.step = step;
        saveState();
        writeHashStep(step, opts.replaceHash);
        render();
        if (changed && !opts.noScroll) scrollFunnelIntoView();
    }

    function scrollFunnelIntoView() {
        // bring the funnel back into view after a step swap so the user
        // doesn't land mid-content. respect the sticky header.
        var rect = root.getBoundingClientRect();
        if (rect.top < 0 || rect.top > 80) {
            var top = window.pageYOffset + rect.top - 16;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
    }

    // ---- step renderers ----------------------------------------------------
    function renderStep1() {
        var heading = el('h1', {
            class: 'funnel-headline',
            text: 'hey company founder, what problem are you facing right now?'
        });
        var sub = el('p', {
            class: 'funnel-sub',
            text: 'pick the area where it hurts most. silicon meets you there.'
        });

        var chips = el('div', {
            class: 'funnel-chips',
            role: 'radiogroup',
            'aria-label': 'problem categories'
        });
        problems.forEach(function (cat) {
            var chip = el('button', {
                type: 'button',
                role: 'radio',
                'aria-checked': state.category === cat.key ? 'true' : 'false',
                class: 'funnel-chip' + (state.category === cat.key ? ' is-selected' : ''),
                'data-key': cat.key,
                onclick: function () {
                    state.category = cat.key;
                    state.checked = []; // reset checked list when category changes
                    saveState();
                    goTo(2);
                }
            }, cat.label.toLowerCase());
            chips.appendChild(chip);
        });

        return el('section', {
            class: 'funnel-step funnel-step-1',
            'aria-labelledby': 'funnel-headline',
            'data-step': '1'
        }, [heading, sub, chips]);
    }

    function renderStep2() {
        var cat = findCategory(state.category);
        if (!cat) { goTo(1, { replaceHash: true }); return el('section'); }

        var heading = el('h1', {
            class: 'funnel-headline',
            text: 'which of these sound like you?'
        });
        var sub = el('p', {
            class: 'funnel-sub',
            text: 'check anything that hits. you can pick more than one.'
        });

        var chosenLabel = el('div', { class: 'funnel-pill-row' }, [
            el('span', { class: 'funnel-pill-label', text: 'category' }),
            el('span', { class: 'funnel-pill-value', text: cat.label.toLowerCase() })
        ]);

        var list = el('ul', { class: 'funnel-checklist', role: 'list' });
        cat.problems.forEach(function (p, i) {
            var id = 'p-' + state.category + '-' + i;
            var checked = state.checked.indexOf(p.text) !== -1;
            var input = el('input', {
                type: 'checkbox',
                id: id,
                class: 'funnel-checkbox',
                checked: checked ? 'checked' : false,
                onchange: function () {
                    var idx = state.checked.indexOf(p.text);
                    if (input.checked && idx === -1) state.checked.push(p.text);
                    else if (!input.checked && idx !== -1) state.checked.splice(idx, 1);
                    saveState();
                    continueBtn.disabled = state.checked.length === 0;
                    li.classList.toggle('is-checked', input.checked);
                }
            });
            var box = el('span', { class: 'funnel-checkbox-box', 'aria-hidden': 'true' });
            var label = el('label', { class: 'funnel-check-label', for: id }, [
                input,
                box,
                el('span', { class: 'funnel-check-text', text: p.text })
            ]);
            var li = el('li', { class: 'funnel-check-item' + (checked ? ' is-checked' : '') }, label);
            list.appendChild(li);
        });

        var continueBtn = el('button', {
            type: 'button',
            class: 'cta-btn funnel-cta',
            disabled: state.checked.length === 0 ? 'disabled' : false,
            onclick: function () { if (state.checked.length > 0) goTo(3); }
        }, 'continue');

        var change = el('button', {
            type: 'button',
            class: 'funnel-text-link',
            onclick: function () { goTo(1); }
        }, 'pick a different category');

        var actions = el('div', { class: 'funnel-actions' }, [continueBtn, change]);

        return el('section', {
            class: 'funnel-step funnel-step-2',
            'data-step': '2'
        }, [
            backLink(1, 'back to categories'),
            heading,
            sub,
            chosenLabel,
            list,
            actions
        ]);
    }

    function renderStep3() {
        var cat = findCategory(state.category);
        if (!cat || state.checked.length === 0) { goTo(1, { replaceHash: true }); return el('section'); }

        var heading = el('h1', {
            class: 'funnel-headline',
            text: "here's how silicon already solves these for our clients."
        });
        var sub = el('p', {
            class: 'funnel-sub',
            text: 'no roadmap. no waitlist. these run today.'
        });

        var quote = el('blockquote', { class: 'funnel-quote-card' }, [
            el('span', { class: 'funnel-quote-mark', 'aria-hidden': 'true', text: '“' }),
            el('p', { class: 'funnel-quote-body', text: 'client quote — to be added.' }),
            el('span', { class: 'funnel-quote-author', text: '— placeholder for shivam to drop in real testimonials' })
        ]);

        var cards = el('div', { class: 'funnel-solution-grid' });
        state.checked.forEach(function (text) {
            var p = findProblem(state.category, text);
            if (!p) return;
            var card = el('article', { class: 'funnel-solution-card' }, [
                el('div', { class: 'funnel-solution-problem' }, [
                    el('span', { class: 'funnel-solution-label', text: 'problem' }),
                    el('p', { text: p.text })
                ]),
                el('div', { class: 'funnel-solution-answer' }, [
                    el('span', { class: 'funnel-solution-label', text: 'silicon' }),
                    el('p', { text: p.solution })
                ])
            ]);
            cards.appendChild(card);
        });

        var continueBtn = el('button', {
            type: 'button',
            class: 'cta-btn funnel-cta',
            onclick: function () { goTo(4); }
        }, 'continue');

        var actions = el('div', { class: 'funnel-actions' }, [continueBtn]);

        return el('section', {
            class: 'funnel-step funnel-step-3',
            'data-step': '3'
        }, [
            backLink(2, 'edit my answers'),
            heading,
            sub,
            quote,
            cards,
            actions
        ]);
    }

    function renderStep4() {
        if (state.checked.length === 0) { goTo(1, { replaceHash: true }); return el('section'); }

        var heading = el('h1', {
            class: 'funnel-headline',
            text: 'want us to walk you through how this would work for your team?'
        });
        var sub = el('p', {
            class: 'funnel-sub',
            text: 'drop your email. we’ll set up a 30-minute call to scope which silicons fit.'
        });

        var input = el('input', {
            type: 'email',
            class: 'funnel-email-input',
            id: 'funnel-email',
            name: 'email',
            placeholder: 'you@company.com',
            autocomplete: 'email',
            'aria-label': 'your email address',
            value: state.email || ''
        });
        var error = el('p', { class: 'funnel-email-error', role: 'alert', 'aria-live': 'polite' });
        var submit = el('button', {
            type: 'submit',
            class: 'cta-btn funnel-cta',
            text: state.emailSubmitted ? 'sent — continue' : 'submit'
        });

        var form = el('form', {
            class: 'funnel-email-form',
            novalidate: 'true',
            onsubmit: function (e) {
                e.preventDefault();
                var val = (input.value || '').trim();
                if (!isValidEmail(val)) {
                    error.textContent = 'please enter a valid email address.';
                    input.focus();
                    return;
                }
                error.textContent = '';
                state.email = val;
                state.emailSubmitted = true;
                saveState();

                // TODO: POST { email, category, checked } to the lead-capture
                // endpoint here. Shivam will wire this up later.
                console.log('silicon_lead_email_captured:', val, {
                    category: state.category,
                    checked: state.checked
                });

                goTo(5);
            }
        }, [
            el('div', { class: 'funnel-email-row' }, [input, submit]),
            error
        ]);

        var skip = el('button', {
            type: 'button',
            class: 'funnel-text-link',
            onclick: function () { goTo(5); }
        }, 'skip — just take me to telegram');

        return el('section', {
            class: 'funnel-step funnel-step-4',
            'data-step': '4'
        }, [
            backLink(3, 'back'),
            heading,
            sub,
            form,
            el('div', { class: 'funnel-actions' }, [skip])
        ]);
    }

    function renderStep5() {
        var cat = findCategory(state.category);

        var heading = el('h1', {
            class: 'funnel-headline',
            text: 'last step — try silicon yourself.'
        });
        var sub = el('p', {
            class: 'funnel-sub',
            text: 'silicon lives in telegram. say hi, ask anything, see how it feels.'
        });

        var thanks = state.emailSubmitted
            ? 'thanks. we’ll be in touch at ' + state.email + '.'
            : 'no email needed to try — jump straight in.';

        var thanksEl = el('p', { class: 'funnel-thanks', text: thanks });

        var echoChildren = [];
        if (cat) {
            echoChildren.push(el('div', { class: 'funnel-echo-row' }, [
                el('span', { class: 'funnel-echo-label', text: 'your area' }),
                el('span', { class: 'funnel-echo-value', text: cat.label.toLowerCase() })
            ]));
        }
        if (state.checked.length) {
            var problemList = el('ul', { class: 'funnel-echo-list' });
            state.checked.forEach(function (t) {
                problemList.appendChild(el('li', { text: t }));
            });
            echoChildren.push(el('div', { class: 'funnel-echo-row funnel-echo-row-stack' }, [
                el('span', { class: 'funnel-echo-label', text: 'what we’ll help with' }),
                problemList
            ]));
        }
        var echo = el('div', { class: 'funnel-echo' }, echoChildren);

        var bigCta = el('a', {
            href: TG_URL,
            target: '_blank',
            rel: 'noopener',
            class: 'cta-btn funnel-cta funnel-cta-big'
        }, 'try silicon on telegram');

        var pricingLink = el('a', {
            href: '#pricing',
            class: 'funnel-text-link',
            onclick: function () {
                // smooth scroll handled by html { scroll-behavior: smooth }
            }
        }, 'or, see pricing');

        var startOver = el('button', {
            type: 'button',
            class: 'funnel-text-link funnel-text-link-muted',
            onclick: function () {
                state = Object.assign({}, defaultState);
                saveState();
                goTo(1);
            }
        }, 'start over');

        var actions = el('div', { class: 'funnel-actions' }, [bigCta]);
        var secondary = el('div', { class: 'funnel-actions funnel-actions-secondary' }, [pricingLink, startOver]);

        return el('section', {
            class: 'funnel-step funnel-step-5',
            'data-step': '5'
        }, [
            backLink(4, 'back'),
            heading,
            sub,
            thanksEl,
            echo,
            actions,
            secondary
        ]);
    }

    var renderers = {
        1: renderStep1,
        2: renderStep2,
        3: renderStep3,
        4: renderStep4,
        5: renderStep5
    };

    function clampStep() {
        // can't be on step 2+ without a chosen category, can't be on
        // step 3+ without any checked problems
        if (state.step >= 2 && !state.category) state.step = 1;
        if (state.step >= 3 && state.checked.length === 0) state.step = 2;
        if (state.step < 1) state.step = 1;
        if (state.step > MAX_STEP) state.step = MAX_STEP;
    }

    function render() {
        clampStep();
        // keep hash in sync with the actually-rendered step
        writeHashStep(state.step, true);
        saveState();
        var fn = renderers[state.step] || renderStep1;
        swap(fn);
    }

    // ---- url hash sync -----------------------------------------------------
    window.addEventListener('hashchange', function () {
        var s = readHashStep();
        if (s == null) return;
        if (s !== state.step) {
            state.step = s;
            saveState();
            render();
        }
    });

    // initial step from hash if present, otherwise from saved state
    var hashStep = readHashStep();
    if (hashStep != null) state.step = hashStep;

    render();
})();
