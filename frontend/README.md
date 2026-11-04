# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Storefront navigation and search

The public header keeps the store logo and live cart count, with a permanent
band/album search field and a collapsible navigation menu below 1280px.
Search updates the catalog as you type, ignores case and accents, and combines
with the selected catalog filters. Press Enter to scroll to the results.
The clear button removes only the query; selecting Home resets the selection.
Quick navigation starts a new selection: vinyl/CD use the real product format,
new releases use `isNew`, and offers use the current pricing service discounts.
Zero-stock products remain excluded from all results. Administration is still
available at `/admin`, but is not linked from the public header.

The responsive footer uses the same catalog filters for vinyl, CD, new releases
and offers. "Ver todo" and the footer logo clear all selections and return to the
catalog. Copyright uses the current year.

The announcement bar, contacts and policies contain explicitly
labelled fictional demo content, not actual commercial commitments. Social
examples lead to the reserved `example.com` domain, not real accounts; the
fictional contact uses `.example`. Replace all demo conditions before production.
The header offsets and catalog/policy anchor margins account for the announcement.

The newsletter is a local demo, not a mailing service. A valid email and explicit
consent are required. It stores only the latest record under
`metaluxe-demo-subscription` in localStorage (email, consent, notice version
`demo-v1`, ISO consent timestamp). No subscription data is sent to a server or
mail provider. The record survives reloads and is overwritten by the next
submission. Use a fictional email. The delete control removes that key only;
clearing site data also removes it. Storage errors are displayed, never reported
as success. No backend, mailing list or actual subscription is created.

The results bar reports visible products out of the filtered total. The counter,
chip group and "Limpiar todo" share a vertically centered horizontal row, with
16px between blocks and 8px between chips. Desktop keeps this row unwrapped;
small screens allow wrapping. Sorting remains on the right.
Active
search, collection, band, genre and format selections can be removed individually
using their chips. Clear filters removes all selections without enabling disabled
filter groups or changing the selected sort order.
The catalog initially displays 9 products. Use "Ver mas productos" to append the
next 9 (or the remaining products); scrolling no longer loads additional pages.
The button is disabled while loading and hidden when all matches are visible.
Changing filters, search or sorting cancels pending loads and resets the first page.

The catalog filters are band, genre and format; there are no color or price-range
filters. Vinyl colors remain visible in product cards and edition selection in
the detail modal. Sorting by final price is still available.
The detail modal uses two columns from 768px: gallery and thumbnails on the left,
and artist, album, pricing, editions, information tabs and purchase button on the
right. Smaller screens stack these sections. Typography and interactions remain
unchanged; only the active information panel scrolls, keeping purchase accessible.
Below 1024px, "Mostrar filtros" expands the filter panel in the page flow.
On desktop the sidebar is always visible; filter groups start expanded.
The band filter always includes a local search (case/accent insensitive), shows
7 bands initially and offers an expand/collapse control with the real total.
Searching covers the entire list, not just those first 7 bands. Each band's count
is the number of catalog products with positive stock, not the sum of units or
versions; counts are independent of other active filters and pagination.
Genres use the same search, counts and 7-row expandable list, derived from
actual in-stock products. The expand control appears only above 7 genres.

## Product photography

Request square product photos with a white or transparent background. Center the
product and use the same framing and margins across photos of the same format.
Avoid baked-in grey backgrounds, uneven whitespace and cropped product edges.
The storefront uses equal square white frames with a subtle border, contained
images and a consistent display size per format: 70% for vinyl and 60% for CDs.
Images have no CSS drop shadow; the frame retains its hover shadow.
CSS does not remove backgrounds embedded in source images; those assets must be
replaced or edited separately.

## Code scaffolding

### Catalog query boundaries

`src/app/features/catalog/queries/catalog.queries.ts` owns the pure catalog
queries: product search/filtering, sorting, available bands/genres and counts.
Search normalization is shared with filter-option searching. Pricing is supplied
by callbacks to the existing pricing service; queries have no component state,
mock imports or Angular injection. Sorting returns a new array.

`CatalogService` is the product data entry point and currently returns the mock
catalog synchronously. It is the future API integration boundary; no HTTP loading
or API error handling is simulated at this stage.

`CatalogListingFacade` is provided by Home, not globally. It loads products once
per page instance, reuses the queries and pricing service, and owns sorting,
pagination, active chips and derived filter options/counts. Counts are computed
from the source catalog, independently of the current selection. Shared filter
state remains exclusively in `CatalogFilterService`; the facade reads it rather
than maintaining another copy. Filter/sort changes cancel pending page loads;
destroying the page cancels timers and unsubscribes from filter updates.

Home retains modal/cart coordination and page composition. Its template consumes
listing data directly from the facade and connects three presentation components:
`CatalogFilters`, `CatalogToolbar` and `ActiveFilters`. They receive inputs and
emit actions without injecting the facade or shared filter service. Filter panel
expansion, local option searches and sort-menu visibility belong to those
components. Bands and genres reuse the same filter-group markup and query helper.
The filter component occupies one sidebar grid cell on desktop and keeps the
mobile toggle, panel and focus restoration together.
Query rules are tested independently in `catalog.queries.spec.ts`; Home tests
retain UI and shared-filter integration coverage, while facade tests cover
listing state, source data, pagination and lifecycle cleanup.
`home.integration.spec.ts` mounts the real header, Home and footer together to
check navigation, search/chip synchronization, sorting, pagination cancellation,
detail opening/closing and the card-to-cart event. Only the cart service is
replaced by a test double to avoid writing browser storage.

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
