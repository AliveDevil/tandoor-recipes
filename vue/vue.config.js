const BundleTracker = require("webpack-bundle-tracker")

const pages = {
    recipe_search_view: {
        entry: "./src/apps/RecipeSearchView/main.js",
        chunks: ["chunk-vendors"],
    },
    recipe_view: {
        entry: "./src/apps/RecipeView/main.js",
        chunks: ["chunk-vendors"],
    },
    offline_view: {
        entry: "./src/apps/OfflineView/main.js",
        chunks: ["chunk-vendors"],
    },
    import_view: {
        entry: "./src/apps/ImportView/main.js",
        chunks: ["chunk-vendors"],
    },
    import_response_view: {
        entry: "./src/apps/ImportResponseView/main.js",
        chunks: ["chunk-vendors"],
    },
    export_response_view: {
        entry: "./src/apps/ExportResponseView/main.js",
        chunks: ["chunk-vendors"],
    },
    export_view: {
        entry: "./src/apps/ExportView/main.js",
        chunks: ["chunk-vendors"],
    },
    supermarket_view: {
        entry: "./src/apps/SupermarketView/main.js",
        chunks: ["chunk-vendors"],
    },
    model_list_view: {
        entry: "./src/apps/ModelListView/main.js",
        chunks: ["chunk-vendors"],
    },
    edit_internal_recipe: {
        entry: "./src/apps/RecipeEditView/main.js",
        chunks: ["chunk-vendors"],
    },
    cookbook_view: {
        entry: "./src/apps/CookbookView/main.js",
        chunks: ["chunk-vendors"],
    },
    meal_plan_view: {
        entry: "./src/apps/MealPlanView/main.js",
        chunks: ["chunk-vendors"],
    },
    ingredient_editor_view: {
        entry: "./src/apps/IngredientEditorView/main.js",
        chunks: ["chunk-vendors"],
    },
    shopping_list_view: {
        entry: "./src/apps/ShoppingListView/main.js",
        chunks: ["chunk-vendors"],
    },
}

module.exports = {
    pages: pages,
    filenameHashing: false,
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/",
    outputDir: "../cookbook/static/vue/",
    runtimeCompiler: true,
    pwa: {
        name: "Recipes",
        themeColor: "#4DBA87",
        msTileColor: "#000000",
        appleMobileWebAppCapable: "yes",
        appleMobileWebAppStatusBarStyle: "black",

        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: "./src/sw.js",
            swDest: "../../templates/sw.js",
            manifestTransforms: [
                (originalManifest) => {
                    const result = originalManifest.map((entry) => new Object({url: "static/vue/" + entry.url}))
                    return {manifest: result, warnings: []}
                },
            ],
        },
    },
    pluginOptions: {
        i18n: {
            locale: "en",
            fallbackLocale: "en",
            localeDir: "locales",
            enableInSFC: true,
        },
    },
    chainWebpack: (config) => {
        config.optimization.splitChunks(
            {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "chunk-vendors",
                        chunks: "all",
                        priority: 1,
                    },
                },
            },
            config.optimization.minimize(true)
        )

        //TODO somehow remov them as they are also added to the manifest config of the service worker
        /*
        Object.keys(pages).forEach(page => {
            config.plugins.delete(`html-${page}`);
            config.plugins.delete(`preload-${page}`);
            config.plugins.delete(`prefetch-${page}`);
        })
        */

        config.plugin("BundleTracker").use(BundleTracker, [{relativePath: true, path: "../vue/"}])

        config.resolve.alias.set("__STATIC__", "static")

        config.devServer
            .host("localhost")
            .port(8080)
            .set('hot', 'only')
            .set('static', {watch: true})
            // old webpack dev server v3 settings
            //  .hotOnly(true)
            //   .watchOptions({ poll: 500 })
            //  .public("http://localhost:8080")
            .https(false)
            .headers({"Access-Control-Allow-Origin": ["*"]})
    },
}
