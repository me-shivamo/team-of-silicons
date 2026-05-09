// Problem-discovery funnel for the team-of-silicons landing page.
// 3-step state machine, vanilla JS, no framework.
//   step 1 — combined: pick category(s) + check problems across categories
//   step 2 — show how silicon handles each picked problem (grouped)
//   step 3 — capture an email, then push to telegram
// State persists in localStorage (key: silicon_funnel_state) and is
// reflected in the URL hash (#step=N) so the back button works.
(function () {
    var STORAGE_KEY = 'silicon_funnel_state';
    var TG_URL = 'https://t.me/Welcome_to_Silicon_bot?text=Hi%2C+I%27m+interested+in+Silicon%21';
    var MAX_STEP = 3;

    var root = document.getElementById('funnel-root');
    if (!root) return;

    var problems = window.SILICON_PROBLEMS || [];
    var firstCategoryKey = problems.length ? problems[0].key : null;

    // ---- state -------------------------------------------------------------
    // checkedByCategory: { [catKey]: [problemText, ...] }
    var defaultState = {
        step: 1,
        currentCategory: firstCategoryKey,
        checkedByCategory: {},
        email: '',
        emailSubmitted: false
    };

    function migrateLegacy(parsed) {
        // v1 shape: { step, category, checked, email, emailSubmitted }
        // v2 shape: { step, currentCategory, checkedByCategory, email, emailSubmitted }
        if (parsed && !parsed.checkedByCategory) {
            var migrated = {
                step: 1,
                currentCategory: parsed.category || firstCategoryKey,
                checkedByCategory: {},
                email: parsed.email || '',
                emailSubmitted: !!parsed.emailSubmitted
            };
            if (parsed.category && Array.isArray(parsed.checked) && parsed.checked.length) {
                migrated.checkedByCategory[parsed.category] = parsed.checked.slice();
            }
            // collapse old step numbers: 1+2 -> 1, 3 -> 2, 4 -> 3, 5 -> 4
            var oldStep = parseInt(parsed.step, 10);
            if (oldStep === 1 || oldStep === 2) migrated.step = 1;
            else if (oldStep === 3) migrated.step = 2;
            else if (oldStep === 4) migrated.step = 3;
            else if (oldStep === 5) migrated.step = 4;
            return migrated;
        }
        return parsed;
    }

    function loadState() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return Object.assign({}, defaultState);
            var parsed = JSON.parse(raw);
            parsed = migrateLegacy(parsed);
            var merged = Object.assign({}, defaultState, parsed);
            // ensure currentCategory points at a real key
            if (!findCategory(merged.currentCategory)) {
                merged.currentCategory = firstCategoryKey;
            }
            if (!merged.checkedByCategory || typeof merged.checkedByCategory !== 'object') {
                merged.checkedByCategory = {};
            }
            return merged;
        } catch (e) {
            return Object.assign({}, defaultState);
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) { /* private mode etc — ignore */ }
    }

    // ---- helpers (defined before loadState uses findCategory) -------------
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

    function totalChecked() {
        var n = 0;
        for (var k in state.checkedByCategory) {
            if (Object.prototype.hasOwnProperty.call(state.checkedByCategory, k)) {
                n += (state.checkedByCategory[k] || []).length;
            }
        }
        return n;
    }

    function categoriesWithSelections() {
        var keys = [];
        // preserve the canonical category order from the catalog
        problems.forEach(function (cat) {
            var arr = state.checkedByCategory[cat.key];
            if (arr && arr.length) keys.push(cat.key);
        });
        return keys;
    }

    function checkedFor(catKey) {
        return (state.checkedByCategory[catKey] || []).slice();
    }

    function setChecked(catKey, text, on) {
        var arr = state.checkedByCategory[catKey] || [];
        var idx = arr.indexOf(text);
        if (on && idx === -1) arr.push(text);
        else if (!on && idx !== -1) arr.splice(idx, 1);
        if (arr.length) state.checkedByCategory[catKey] = arr;
        else delete state.checkedByCategory[catKey];
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
            el('i', { class: 'ph ph-arrow-left funnel-back-arrow', 'aria-hidden': 'true' }),
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
        var rect = root.getBoundingClientRect();
        if (rect.top < 0 || rect.top > 80) {
            var top = window.pageYOffset + rect.top - 16;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
    }

    // ---- step 1: combined picker ------------------------------------------
    function renderStep1() {
        var heading = el('h1', {
            class: 'funnel-headline',
            id: 'funnel-headline',
            text: 'hey Boss!! what problem are you facing right now?'
        });

        // chip row — every category, first selected by default if none chosen
        var chips = el('div', {
            class: 'funnel-chips',
            role: 'tablist',
            'aria-label': 'problem categories'
        });

        // panel that holds the active category's problems; replaceable
        var panel = el('div', {
            class: 'funnel-checklist-panel',
            id: 'funnel-checklist-panel',
            'aria-live': 'polite'
        });

        var continueBtn = el('button', {
            type: 'button',
            class: 'cta-btn funnel-cta',
            disabled: totalChecked() === 0 ? 'disabled' : false,
            onclick: function () {
                if (totalChecked() > 0) goTo(2);
            }
        }, 'continue');

        var counter = el('span', {
            class: 'funnel-count',
            'aria-live': 'polite'
        });

        function refreshContinue() {
            var n = totalChecked();
            continueBtn.disabled = n === 0;
            if (n === 0) {
                counter.textContent = '';
            } else {
                var cats = categoriesWithSelections().length;
                counter.textContent =
                    n + ' problem' + (n === 1 ? '' : 's') +
                    ' across ' + cats + ' categor' + (cats === 1 ? 'y' : 'ies');
            }
        }

        function renderPanel(catKey, animate) {
            var cat = findCategory(catKey);
            if (!cat) return;
            var prevList = panel.firstElementChild;

            var list = el('ul', { class: 'funnel-checklist', role: 'list' });
            var checked = checkedFor(catKey);
            cat.problems.forEach(function (p, i) {
                var id = 'p-' + catKey + '-' + i;
                var isChecked = checked.indexOf(p.text) !== -1;
                var input = el('input', {
                    type: 'checkbox',
                    id: id,
                    class: 'funnel-checkbox',
                    checked: isChecked ? 'checked' : false,
                    onchange: function () {
                        setChecked(catKey, p.text, input.checked);
                        saveState();
                        li.classList.toggle('is-checked', input.checked);
                        refreshContinue();
                        refreshChips();
                    }
                });
                var box = el('span', { class: 'funnel-checkbox-box', 'aria-hidden': 'true' });
                var label = el('label', { class: 'funnel-check-label', for: id }, [
                    input,
                    box,
                    el('span', { class: 'funnel-check-text', text: p.text })
                ]);
                var li = el('li', { class: 'funnel-check-item' + (isChecked ? ' is-checked' : '') }, label);
                list.appendChild(li);
            });

            if (animate && prevList) {
                prevList.classList.add('funnel-checklist-leave');
                setTimeout(function () {
                    if (prevList.parentNode) prevList.parentNode.removeChild(prevList);
                }, 160);
                list.classList.add('funnel-checklist-enter');
                panel.appendChild(list);
                // reflow, then reveal
                // eslint-disable-next-line no-unused-expressions
                list.offsetHeight;
                list.classList.remove('funnel-checklist-enter');
            } else {
                panel.innerHTML = '';
                panel.appendChild(list);
            }
        }

        function chipLabel(cat) {
            var n = (state.checkedByCategory[cat.key] || []).length;
            return cat.label.toLowerCase() + (n > 0 ? ' (' + n + ')' : '');
        }

        function refreshChips() {
            Array.prototype.forEach.call(chips.children, function (c) {
                var key = c.getAttribute('data-key');
                var cat = findCategory(key);
                if (cat) c.textContent = chipLabel(cat);
            });
        }

        problems.forEach(function (cat) {
            var isActive = state.currentCategory === cat.key;
            var chip = el('button', {
                type: 'button',
                role: 'tab',
                'aria-selected': isActive ? 'true' : 'false',
                class: 'funnel-chip' + (isActive ? ' is-selected' : ''),
                'data-key': cat.key,
                onclick: function () {
                    if (state.currentCategory === cat.key) return;
                    state.currentCategory = cat.key;
                    saveState();
                    // update chips
                    Array.prototype.forEach.call(chips.children, function (c) {
                        var on = c.getAttribute('data-key') === cat.key;
                        c.classList.toggle('is-selected', on);
                        c.setAttribute('aria-selected', on ? 'true' : 'false');
                    });
                    renderPanel(cat.key, true);
                }
            }, chipLabel(cat));
            chips.appendChild(chip);
        });

        // initial panel
        renderPanel(state.currentCategory, false);
        refreshContinue();

        var actions = el('div', { class: 'funnel-actions funnel-actions-sticky' }, [
            continueBtn,
            counter
        ]);

        return el('section', {
            class: 'funnel-step funnel-step-1',
            'aria-labelledby': 'funnel-headline',
            'data-step': '1'
        }, [heading, chips, panel, actions]);
    }

    // ---- step 2: solutions, grouped by category ---------------------------
    function renderStep2() {
        if (totalChecked() === 0) { goTo(1, { replaceHash: true }); return el('section'); }

        var N = totalChecked();
        var TOTAL_CATALOG = 88;
        var X = Math.floor((TOTAL_CATALOG - N) / 10) * 10;

        var heading = el('h1', {
            class: 'funnel-headline funnel-step2-headline',
            text: 'the ' + N + ' problem' + (N === 1 ? '' : 's') +
                  ' you selected, and ' + X +
                  '+ others, are problems silicon has already worked on and solved with our clients.'
        });

        var groups = el('div', { class: 'funnel-solution-groups' });
        var groupsWrap = el('div', { class: 'funnel-groups-wrap' });
        groupsWrap.appendChild(groups);

        categoriesWithSelections().forEach(function (catKey) {
            var cat = findCategory(catKey);
            if (!cat) return;
            var checked = checkedFor(catKey);
            if (!checked.length) return;

            var subhead = el('h2', {
                class: 'funnel-solution-group-label',
                text: cat.label.toLowerCase()
            });
            var grid = el('div', { class: 'funnel-solution-grid' });
            checked.forEach(function (text) {
                var p = findProblem(catKey, text);
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
                grid.appendChild(card);
            });
            groups.appendChild(el('section', { class: 'funnel-solution-group' }, [subhead, grid]));
        });

        var bottomCta = el('div', { class: 'funnel-step2-bottom-cta' }, [
            el('p', {
                class: 'funnel-step2-bottom-text',
                text: 'try silicon and see how this would work for your team.'
            }),
            el('button', {
                type: 'button',
                class: 'cta-btn funnel-cta',
                onclick: function () { goTo(3); }
            }, 'try silicon')
        ]);
        groupsWrap.appendChild(bottomCta);

        var toggleBtn = el('button', {
            type: 'button',
            class: 'cta-btn cta-btn-ghost funnel-cta',
            onclick: function () {
                groupsWrap.classList.add('funnel-groups-wrap--open');
            }
        }, 'see how this works');

        var tryBtn = el('button', {
            type: 'button',
            class: 'cta-btn funnel-cta',
            onclick: function () { goTo(3); }
        }, 'try silicon');

        var buttonRow = el('div', { class: 'funnel-actions funnel-step2-buttons' }, [toggleBtn, tryBtn]);

        return el('section', {
            class: 'funnel-step funnel-step-2',
            'data-step': '2'
        }, [
            backLink(1, 'edit my answers'),
            heading,
            buttonRow,
            groupsWrap
        ]);
    }

    // ---- step 3: email ---------------------------------------------------
    function renderStep3() {
        if (totalChecked() === 0) { goTo(1, { replaceHash: true }); return el('section'); }

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

        function buildTgUrl() {
            var allProblems = [];
            categoriesWithSelections().forEach(function (catKey) {
                checkedFor(catKey).forEach(function (t) { allProblems.push('- ' + t); });
            });
            if (allProblems.length) {
                var msg = 'Hey Silicon. These are the things I want to fix\n\n' + allProblems.join('\n');
                return 'https://t.me/Welcome_to_Silicon_bot?text=' + encodeURIComponent(msg);
            }
            return TG_URL;
        }

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

                console.log('silicon_lead_email_captured:', val, {
                    checkedByCategory: state.checkedByCategory
                });

                window.open(buildTgUrl(), '_blank', 'noopener');
            }
        }, [
            el('div', { class: 'funnel-email-row' }, [input, submit]),
            error
        ]);

        var skip = el('button', {
            type: 'button',
            class: 'funnel-text-link',
            onclick: function () { window.open(buildTgUrl(), '_blank', 'noopener'); }
        }, 'skip — just take me to telegram');

        return el('section', {
            class: 'funnel-step funnel-step-3',
            'data-step': '3'
        }, [
            backLink(2, 'back'),
            heading,
            sub,
            form,
            el('div', { class: 'funnel-actions' }, [skip])
        ]);
    }

    var renderers = {
        1: renderStep1,
        2: renderStep2,
        3: renderStep3
    };

    function clampStep() {
        // can't be on step 2+ without any checked problems anywhere
        if (state.step >= 2 && totalChecked() === 0) state.step = 1;
        if (state.step < 1) state.step = 1;
        if (state.step > MAX_STEP) state.step = MAX_STEP;
    }

    function render() {
        clampStep();
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
