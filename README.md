# esag-2018

> Erstsemester Seite:
- PWA (Offline-fähig wenn über HTTPS)
- Mobile-First (auf Mobilgeräte optimiert)
- Prerendered SPA (um die Initial Load Time zu reduzieren, wird die Seite über headless Chrome als HTML gerendert, SSR wäre Overkill)
- Lighthouse-Rating: Performance ~ 75 / 100; Accessibility: 100 / 100; SEO: 100 / 100; PWA: >60 / 100; Best Practices: >60 / 100
- Browser-Support: Firefox, Chrome, Safari - nicht unterstützt: IE
- Frontend-Framework: Vue2
- Build&Bundle: Webpack2
- package-manager: npm

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Ziele

- Daten weniger statisch in HTML und häufiger vom Backend fetchen
- Edge besser unterstützen
- Homepage auf HTTPS umstellen
