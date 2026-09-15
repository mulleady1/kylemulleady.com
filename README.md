# kylemulleady.com

Personal site and blog. Markdown and Jinja templates compiled to static HTML by a
single Python script. No JavaScript is served, no application process runs.

## Build

    make setup     # once
    make build     # content/ -> dist/
    make serve     # preview at localhost:8000

## Writing a post

Add a Markdown file to `content/posts/` named `YYYY-MM-DD-slug.md`:

    ---
    title: "Post title"
    date: 2026-09-14
    slug: post-title
    ---

    Body in Markdown. Fenced code blocks are highlighted at build time.

Posts are sorted by `date`, newest first. The three most recent appear on the
homepage. `legacy_id` on the older posts records their ID on the 2016 site, which
nginx uses to redirect the old `/blog/<id>` URLs.

## Unpublishing a post

Move it from `content/posts/` to `content/drafts/`. The build ignores drafts, and
if the post carries a `legacy_id` the generated nginx config redirects that old
URL to the blog index instead of leaving it to 404. Move it back to republish.

## Deploy

    make deploy

Builds and rsyncs `dist/` to the server. nginx serves it as static files.

## History

The first version of this site, from 2016, was an ASP.NET Core 1.0 API with a
React 15 single-page frontend. Its backend stopped running in April 2026 when the
.NET runtime was removed from the server, and the blog was unreachable for five
months before anyone noticed. That code is tagged `v1-dotnet`.
