# MovieHawk Web

The web app over the [MovieHawk API](https://github.com/ElonMuskOfficial/moviehawk): a site's
posts, a post's links, a link's files, a file's downloads.

```bash
cp .env.example .env.local   # MOVIEHAWK_API_URL: the API this app reads
npm install
npm run dev                  # http://localhost:3000 (the API's default port too: npm run dev -- -p 3001)
npm run lint
npm run build
```

Next.js 16 (App Router, JavaScript), Tailwind CSS 4, shadcn/ui (`radix-vega`, `neutral`, JSX).
Deployed on Vercel, with `MOVIEHAWK_API_URL` set in its environment to the API's deployment,
https://moviehawk.vercel.app (also on Vercel). Each project's settings choose its functions'
region; the two are best in one.

## Pages

Each step of the API is a page, rendered on the server. The browser never calls the API, so the API
needs no CORS.

| URL | Step | API |
|---|---|---|
| `/` | redirects to `/hdhub4u` | |
| `/[site]?page=` | 0. A site's posts | `GET /v1/sites/{site}/posts?pageToken=` |
| `/[site]/search?q=&page=` | 0. Its search | `GET /v1/sites/{site}/search?q=&pageToken=` |
| `/[site]/[post]` | 1. A post and its links | `GET /v1/sites/{site}/posts/{post}` |
| `/links/[link]` | 2. What a link opens: files to choose from, a file's downloads, or another site's page | `GET /v1/links/{link}` |

An API name is the app's path (`links/...` → `/links/...`); a post's drops `sites/` and `posts/`
(`sites/hdhub4u/posts/slug` → `/hdhub4u/slug`): `lib/sites.js`.

## Reading the API (`lib/api.js`)

- **`cache: "no-store"`, always.** The API keeps each answer as long as it stays true. Next's
  default would keep a page that reads no request-time API (a post, a file) for good, and a file's
  downloads expire.
- **Every API failure is returned**, a 404 too, `{ error: { status, code, detail } }`, and the
  page shows it with `ApiError`: its detail names the site that answered. In production Next hides a thrown error's message, so
  `app/error.js` is for bugs only.
- A route with `loading.js` streams, so its not-found and redirects answer HTTP 200 (with
  `noindex`, and a refresh to the redirect's target): Next's own behaviour.

## Design system

**Tokens** (`app/globals.css`): shadcn's neutral, dark only (`<html class="dark">`; the light
tokens stay for a toggle later). One accent: `--primary` and `--ring` are amber-500,
`oklch(0.769 0.188 70.08)`. Font: Geist.

**Components**: `components/ui/` is shadcn's (button, card, badge, skeleton), never edited for one
page. The app's own are built from them: `PostGrid` and `Poster`, `RowList`, `Pager`, `SiteTabs`,
`SearchBox`, `ApiError`, `EmptyState`, `CopyButton`, `ExternalRedirect` (a link to another site's
page: "Opening Streamtape…" while the browser goes there, with the link in case it stays).

**Rules**

- **One amber button a page**: its main action. Everything else is `outline`, `secondary` or
  `ghost`.
- **Loading is a skeleton of the content's shape** (a route's `loading.js`), never a spinner; a
  step that takes seconds says so under it.
- **An error says what happened and what to do**: `ApiError` by the API's `code`, with *Try again*
  only when a second try can pass (`transient`, `unrecognized`), and *Back* for a page the site
  removed (`notFound`: "It's no longer on the site", "vcloud.beer answered HTTP 404"), to choose
  another server where it was listed.
- **Nothing found is an empty state with the next thing to try**, not a blank page.
- **The sites' words as they are**: a link's label, a file's name, a server's label.
- **Mobile first**: the grid is 2, 3, 4 then 6 columns (`sm`, `md`, `lg`); a touch target is at
  least 36 px high; row actions share the row's width on a phone.
- **Icons go with text**, from lucide, `aria-hidden`.
- **Posters are plain `<img>`**, not `next/image`: they come from many hosts, and Vercel's image
  optimization would count each one.
- **Links are plain `<a>`**, not `next/link`: every click loads its page from the server, as a
  browser does; nothing is prefetched.
- **Downloads**: a `direct` one has *Download*, *Copy link* and *Open in VLC* (most files are MKV
  with DD5.1 audio, which browsers do not play); a `page` one opens in a new tab. *VLC* is a link
  where one opens VLC (`VlcLink`): on Android an `intent:` URL to `org.videolan.vlc`, on iOS
  `vlc://`; a desktop has none, so there it is left out (copy, then paste into VLC).
