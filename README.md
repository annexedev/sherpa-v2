CENIA PWA Theme (compatible to pwa-studio 11)

# Instalation sur windows:
# Le projet doit etre sur le C: et pas sur le U: (important!)

## Versions:

### npm: 9.8.1  ( npm install -g npm@9.8.1 )
### node: 16.18.1
### yarn: 1.22.19 ( npm install --global yarn@1.22.19 )

## Copier le dossier .env sur la racine

## Changements directment sur le node_modules:

### Aller sur le fichier \node_modules\@magento\pwa-buildpack\lib\WebpackTools\plugins\LocalizationPlugin.js et changer: 

# const importerFactory = `function () {
#            return async function getLocale(locale) {
#                ${Object.keys(locales)
#                    .map(locale => {
#                        return `if (locale === "${locale}") {
#                        return import(/* webpackChunkName: "i18n-${locale}" */'${
#                           mergedLocalesPaths[locale]
#                        }');
#                    }`.replace(/\\/g, "\\\\");
#                    })
#                    .join('')}
#                throw new Error('Unable to locate locale ' + locale + ' within generated dist directory.');
#            }
#        }`;
#
### Aller dans le fichier \node_modules\@magento\pwa-buildpack\lib\WebpackTools\plugins\RootComponentsPlugin.js et changer la partie:

# importerSources[
#        key
#    ] = `function () { return import(/* webpackChunkName: "${key}" */'.\\${relative(
#        context,
#        rootComponentFile
#    )}')}`.replace(/\\/g, "\\\\");

### Commandes: 

# npm install
# npm run build
# yarn run watch
# et le projet va ouvrir dans la port: http://localhost:10000/

