import { defineConfig } from "vitepress";

const base = "/gridsy/";

function rewriteDemoIndex(url: string | undefined): string | undefined {
  if (!url) {
    return url;
  }

  const [pathname, query] = url.split("?", 2);

  if (!["/demo", "/demo/", "/gridsy/demo", "/gridsy/demo/"].includes(pathname)) {
    return url;
  }

  const indexPath = pathname.endsWith("/")
    ? `${pathname}index.html`
    : `${pathname}/index.html`;

  return query ? `${indexPath}?${query}` : indexPath;
}

export default defineConfig({
  base,
  title: "gridsy",
  description: "Render and export high-DPI image grids in the browser.",
  cleanUrls: true,
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: `${base}gridsy-icon.svg` }],
    ["meta", { name: "theme-color", content: "#ea580c" }]
  ],
  vite: {
    publicDir: ".generated-public",
    plugins: [
      {
        name: "serve-gridsy-demo-index",
        configureServer(server) {
          server.middlewares.use((request, _response, next) => {
            request.url = rewriteDemoIndex(request.url);
            next();
          });
        },
        configurePreviewServer(server) {
          server.middlewares.use((request, _response, next) => {
            request.url = rewriteDemoIndex(request.url);
            next();
          });
        }
      }
    ]
  },
  themeConfig: {
    logo: "/gridsy-icon.svg",
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Examples", link: "/examples/community-mosaics" },
      { text: "API", link: "/api/" },
      { text: "Demo", link: "/demo/", target: "_self" }
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting started", link: "/guide/getting-started" },
          { text: "Layouts", link: "/guide/layouts" },
          { text: "Images and exports", link: "/guide/images-and-exports" }
        ]
      },
      {
        text: "Examples",
        items: [{ text: "Community mosaics", link: "/examples/community-mosaics" }]
      },
      {
        text: "Reference",
        items: [
          { text: "API", link: "/api/" },
          { text: "Development", link: "/development" }
        ]
      }
    ],
    search: {
      provider: "local"
    },
    socialLinks: [{ icon: "github", link: "https://github.com/ahmetomerv/gridsy" }],
    editLink: {
      pattern: "https://github.com/ahmetomerv/gridsy/edit/main/docs/:path"
    },
    footer: {
      message: "Released under the MIT License."
    }
  }
});
