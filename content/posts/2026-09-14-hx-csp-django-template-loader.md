---
title: 'Stamping CSP nonces with a custom Django template loader'
date: 2026-09-14
slug: hx-csp-django-template-loader
---

As the CEO of htmx I've been having a blast seeing all the cool things I can build
with server rendered html, and I'm not talking about NextJS. Revisiting template engines
like Django's and adding the lovely `hx-` attributes to see a website built the old fashioned
way go toe to toe with all the modern JS-heavy toolkits like React, MUI, Vite, etc. is a trip.
Like, click around [Budgeter](https://getbudgeter.com). You can't tell it's not a JS-focused SPA.
You'd never guess clicking a button to pull up a dialog is making a call to the server and the
server is returning a `<dialog>` (`<wa-dialog>` actually, but the Web Awesome post will be written
soon). The speed is there. The animation is there. The styling is there. htmx is amazing.

htmx 4 was released recently. I've been exploring the new features and extensions.
Adding a Content Security Policy to the site and using the [hx-csp extension](https://four.htmx.org/extensions/hx-csp/)
was today's experiment.

And about ten minutes in I hit the thing I didn't see coming: a nonce-based CSP does a great
job protecting your scripts and absolutely nothing for your htmx attributes.

## Your hx- attributes are basically scripts

Say you set up `script-src 'self' 'nonce-abc123'`. Now the browser only runs a script if it
carries that nonce. Somebody sneaks a `<script>` into your page, they're out of luck, they
can't guess it.

But they can still sneak in this:

```html
<div hx-get="/admin/users" hx-trigger="load" hx-target="body"></div>
```

No `<script>` tag anywhere. The browser looks at that and sees a boring empty div. CSP doesn't
care, and why would it. But htmx cares! htmx scans the DOM, finds those attributes, and happily
fires the request on load. Congrats, your favorite library is now the attacker's script engine
and that policy you carefully wrote never even got asked.

That's the hole [hx-csp](https://four.htmx.org/extensions/hx-csp/) plugs. Every htmx-powered
element has to carry an `hx-nonce` matching the page nonce. No nonce, no htmx. The extension
strips the attributes and the element just sits there being a div. Injected markup can't guess
the nonce, so injected markup can't do anything.

Great design. It also means every single element with an `hx-` attribute needs a nonce now. By
hand. Forever. In every template. You see the problem.

## Don't stamp the output, stamp the source

My first idea was middleware. Render the page, regex the HTML, add `hx-nonce` wherever it
belongs, ship it, go get lunch.

This is wrong, and it's wrong in the worst possible way, which is that it looks like it works.

Think about when middleware runs. The page is already rendered. Every context variable is
already interpolated into the markup. That comment body out of the database? That user-supplied
project name? By then it's just markup, completely indistinguishable from the stuff you wrote
yourself. So your nice middleware cheerfully stamps a valid nonce onto the attacker's injected
element and hands them the keys. You'd have built an elaborate machine for defeating your own
CSP, and every test you wrote would still be green.

So go earlier. Django reads template source off disk, compiles it into a node tree, and only
then renders your context into it. Stamp the source text before compilation and the guarantee
just falls out: only markup literally written in a template file gets a nonce. Anything arriving
through a context variable shows up afterward and is never eligible. There's nothing to enforce,
it's structural.

Django's loaders are the perfect seam for this. `get_contents` hands you the raw source string.
Subclassing it is four lines:

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

Wire it up in settings. Keep the cached loader on the outside so you pay the stamping cost once
per template instead of once per request:

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

Heads up, `APP_DIRS` has to go. Django flat out won't start if you set both that and an explicit
`loaders` list. It's a good error message though, you'll only hit it once.

The policy itself is Django 6's built-in CSP support, so no third-party packages:

```python
SECURE_CSP = {
    "script-src": [CSP.SELF, CSP.NONCE, "https://cdn.jsdelivr.net"],
    "object-src": [CSP.NONE],
    "base-uri": [CSP.SELF],
}
```

`CSP.NONCE` tells the middleware to generate a nonce per request, drop it in the header, and hand
it to templates as `csp_nonce`. My stamper just writes the literal text `{{ csp_nonce }}` into the
source, so it resolves at render time like any other variable. The stamper never touches a real
nonce value, which I like a lot.

## Turns out you can't regex this

The stamping function is where the actual work is. I started with one regex over start tags,
obviously.

It falls apart about as fast as you'd expect, because Django templates aren't HTML.

```html
<a {% if editable %}hx-get="/edit/{{ id }}" {% endif %} title="a > b"></a>
```

Look for `>` to find the end of the tag and you hit the one inside `title`. Look for `hx-`
attribute names and you find `hx-get` sitting inside a conditional that might not even render.
Template tokens can show up anywhere, including the middle of a tag, including stuffed with
quotes and angle brackets.

So it turned into a small scanner. It walks the source, jumps between the things that matter,
and copies everything else straight through:

- Template token (`{% %}`, `{{ }}`, `{# #}`)? Opaque. Skip to the closer, copy verbatim.
- HTML comment? Opaque. Skip to `-->`.
- Start tag? Parse it for real. Track quote state and skip template tokens to find the actual
  closing `>`, then collect attribute names while stepping over their values.
- `<script>` body? Copy verbatim. JS legitimately contains `<` and HTML-looking strings and none
  of that should get stamped.

Then each tag gets at most two additions: `nonce="{{ csp_nonce }}"` if it's a script that doesn't
have one, and `hx-nonce="{{ csp_nonce }}"` if it has any attribute starting with `hx-` or
`data-hx-` and doesn't already have a nonce.

One detail I'm weirdly proud of: the stamper never inserts a newline. Attributes get added inline,
so every line of stamped source still lines up with the same line of the file on disk, and
template error messages keep pointing at the right place. Debugging a template system that lies
to you about line numbers is a genuinely miserable afternoon, and it's completely avoidable if
you're just a little careful with whitespace.

196 lines with docstrings, no dependencies beyond `re`.

## The part that ate my afternoon

Here's what I didn't plan for. A nonce-based `script-src` doesn't only block `<script>` blocks.
It blocks inline event handlers. All of them. Every `onclick=` in your codebase stops working,
silently, because the browser quietly declines to compile the handler.

I had 42 of them across 21 templates.

The fix is mechanical at least: every `onclick="..."` becomes `hx-on:click="..."`. Same code
inside, `this` and `event` still work, htmx runs it through its own `safeEval` instead of the
browser's inline-handler compiler. And because the result is an `hx-` attribute, my loader stamps
it automatically and hx-csp gates it. Injected markup still can't use it. Nice little bonus for
what started as a chore.

You do have to opt in:

```html
<meta name="htmx-config" content="safeEval:true" />
```

If you're adding CSP to an htmx codebase that already exists, grep for `onclick` before you start.
It's the difference between a two-hour job and a five-hour one. Ask me how I know.

## Testing that it actually holds

Two tests worth writing, and neither one is obvious from reading the code.

First, every htmx element and every script on a real rendered page carries a nonce that matches
the response header. Not a unit test on the stamper, an actual end-to-end sweep over real pages
that parses the HTML and checks it against the `Content-Security-Policy` header. That's what
catches the one template that somehow bypasses the loaders entirely.

Second, and this is the one that matters, the negative test. Inject a
`mark_safe("<button hx-post='/x'>")` through a context variable, render it, and assert the button
comes back with no nonce. If that test ever goes red, somebody moved the stamping to the output
side and quietly deleted the whole security property. That test *is* the design.

I also added browser-level checks that nothing logs a CSP violation on load, that a swapped-in
partial survives the nonce gate, and that a converted `hx-on:click` still fires.

One more thing about partials, since it confused me for a minute. An htmx swap brings in markup
that was rendered during a different request, so it's carrying a different nonce than the page
it's landing in. hx-csp handles it: it reads the response's nonce out of the CSP header and
rewrites it to the page nonce as it swaps. Works great, but it's worth knowing that's happening
so it doesn't surprise you at 11pm sometime.

Code's all in the [Budgeter repo](https://github.com/mulleady1/getbudgeter.com) if you want to
read the scanner in full.
