---
title: "Stamping CSP nonces with a custom Django template loader"
date: 2026-09-14
slug: hx-csp-django-template-loader
---

I spent today putting a real Content Security Policy on [Budgeter](https://getbudgeter.com), a
Django and htmx app. The interesting part was not the policy. It was realizing that a nonce-based
`script-src` protects your scripts and does nothing at all for your htmx attributes, and then
working out how to fix that without hand-editing several hundred elements.

## htmx attributes are executable

A CSP with `script-src 'self' 'nonce-abc123'` tells the browser to run a script only if it carries
the matching nonce. That stops an attacker who manages to inject `<script>` into your page, because
they cannot guess the nonce.

It does not stop them from injecting this:

```html
<div hx-get="/admin/users" hx-trigger="load" hx-target="body"></div>
```

There is no `<script>` tag here. The browser sees inert markup and CSP has no opinion about it.
But htmx will scan the DOM, find those attributes, and issue the request. Your library has become
the attacker's script engine, and the policy you carefully configured never gets consulted.

The [hx-csp extension](https://four.htmx.org/extensions/hx-csp/) closes this. It requires every
htmx-powered element to carry `hx-nonce` matching the page nonce. Anything without it gets its
htmx attributes stripped and sits there doing nothing. Injected markup cannot guess the nonce, so
injected markup cannot make requests.

That is exactly the right design. It also means every single element with an `hx-*` attribute now
needs a nonce, by hand, forever.

## Stamp the source, not the output

The obvious fix is middleware: render the page, then run a regex over the HTML and add
`hx-nonce` everywhere it belongs. This is wrong, and wrong in the specific way that matters.

By the time middleware sees the response, user-supplied data has already been interpolated into
the markup. A comment body, a project name, anything that came from a database row is now
indistinguishable from markup you wrote. Stamping the output hands a valid nonce to the attacker's
injected element. You would have built an elaborate mechanism for defeating your own policy.

So stamp earlier. Django reads template source from disk, compiles it into a node tree, and only
then renders context into it. If you add the nonce attributes to the source text, before
compilation, then the guarantee falls out for free: only markup literally written in a template
file gets a nonce. Everything arriving through a context variable is rendered afterward and is
never eligible.

Django's loaders are the right seam. A loader's `get_contents` returns the raw source string, and
subclassing it takes four lines:

```python
class NonceStampingMixin:
    """Stamp nonce attributes onto template source as it is read from disk."""

    def get_contents(self, origin):
        return stamp_nonces(super().get_contents(origin))


class FilesystemLoader(NonceStampingMixin, filesystem.Loader):
    pass


class AppDirectoriesLoader(NonceStampingMixin, app_directories.Loader):
    pass
```

Wire them up in settings, keeping the cached loader on the outside so the stamping cost is paid
once per template rather than once per request:

```python
TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "OPTIONS": {
        "loaders": [(
            "django.template.loaders.cached.Loader",
            [
                "app.template_loaders.FilesystemLoader",
                "app.template_loaders.AppDirectoriesLoader",
            ],
        )],
        "context_processors": [
            ...,
            "django.template.context_processors.csp",
        ],
    },
}]
```

Note that `APP_DIRS` has to go. Django refuses to start if you set both `APP_DIRS` and an explicit
`loaders` list, which is a good error message to receive once and never think about again.

The policy itself uses Django 6's built-in CSP support, so there are no third-party packages
involved:

```python
SECURE_CSP = {
    "script-src": [CSP.SELF, CSP.NONCE, "https://cdn.jsdelivr.net"],
    "object-src": [CSP.NONE],
    "base-uri": [CSP.SELF],
}
```

`CSP.NONCE` makes the middleware generate a per-request nonce, put it in the header, and expose it
to templates as `csp_nonce` through that context processor. The stamper emits the literal text
`{{ csp_nonce }}`, which means the value resolves at render time like any other variable. The
stamper never sees or handles an actual nonce.

## Writing a scanner instead of a regex

The stamping function itself is where the work is. My first instinct was one regex over start tags.
That falls apart quickly, because Django templates are not HTML.

```html
<a {% if editable %}hx-get="/edit/{{ id }}"{% endif %} title="a > b">
```

A regex looking for `>` finds the one inside the `title` attribute. A regex looking for `hx-`
attribute names finds `hx-get` inside what is arguably a conditional. Template tokens can appear
anywhere, including in the middle of a tag, including containing quotes and angle brackets.

So the final version is a small scanner. It walks the source, jumping between the things that
matter, and copies everything else through untouched:

- A template token (`{% %}`, `{{ }}`, `{# #}`) is opaque. Skip to its closer, copy verbatim.
- An HTML comment is opaque. Skip to `-->`.
- A start tag gets parsed properly: find the real closing `>` by tracking quote state and skipping
  template tokens, then collect attribute names while stepping over their values.
- A `<script>` body is copied verbatim, because JavaScript legitimately contains `<` and strings
  that look like HTML, and nothing in there should be stamped.

Then each tag gets at most two additions: `nonce="{{ csp_nonce }}"` if it is a script without one,
and `hx-nonce="{{ csp_nonce }}"` if it has any attribute starting with `hx-` or `data-hx-` and does
not already have a nonce.

One detail worth stealing: the stamper never inserts a newline. Attributes are added inline, so
every line of the stamped source still corresponds to the same line of the file on disk. Template
error messages keep pointing at the right place. Debugging a template system whose line numbers lie
to you is a miserable afternoon, and it is avoidable with a little care about whitespace.

The whole thing is 196 lines including docstrings, and it has no dependencies beyond `re`.

## The part I did not plan for

A nonce-based `script-src` blocks inline event handlers outright. Not just `<script>` blocks.
Every `onclick=` in the codebase stops working, silently, because the browser declines to compile
the handler.

I had 42 of them across 21 templates.

The fix was mechanical but unavoidable: convert every `onclick="..."` to `hx-on:click="..."`. The
code inside is identical, `this` and `event` still work, and htmx evaluates it through its own
`safeEval` path rather than the browser's inline-handler compiler. Since the result is an `hx-`
attribute, the loader stamps it automatically and hx-csp gates it. Injected markup still cannot use
it.

That requires opting in explicitly:

```html
<meta name="htmx-config" content="safeEval:true" />
```

If you are adding CSP to an existing htmx codebase, grep for `onclick` before you start. It is the
difference between a two-hour job and a five-hour one.

## Testing that it actually holds

Two things are worth asserting, and neither is obvious from reading the code.

The first is that every htmx element and every script on a real rendered page carries a nonce
matching the response header. Not a unit test on the stamper, an end-to-end sweep over actual pages
that parses the HTML and checks agreement with the `Content-Security-Policy` header. That catches
the case where some template bypasses the loaders entirely.

The second is the negative test, and it is the one that proves the design. Inject a
`mark_safe("<button hx-post='/x'>")` through a context variable, render, and assert the button
comes back with no nonce. If that test ever starts failing, someone has moved the stamping to the
output side and quietly removed the whole security property.

I also added browser-level checks that nothing logs a CSP violation on load, that a swapped-in
partial survives the nonce gate, and that a converted `hx-on:click` still fires.

For partial responses, one more piece is needed. An htmx swap brings in markup rendered during a
different request, carrying a different nonce than the page. The hx-csp extension handles this by
reading the response's nonce from the CSP header and rewriting it to the page nonce as it swaps.
That works, but it is worth knowing it is happening rather than being surprised by it later.

The code is in the [Budgeter repo](https://github.com/mulleady1/getbudgeter.com) if you want to
read the scanner in full.
