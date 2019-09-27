// const fs = require("fs");
const path = require("path");

module.exports = {
    options: {
        debug: true,
        removeUnusedKeys: true,
        nsSeparator: false,
        keySeparator: false,
        func: {
            list: ["Translation.translate", "Translator.t"],
            extensions: [".js", ".ts", ".tsx"]
        },
        lngs: [/*"1025", "1026", "1027", "1028", "1029", "1030", */"1031",/* "1032", */"1033",/* "1035", */"1036",/* "1037", "1038",
            "1040", "1041", "1042", */"1043"/*, "1044", "1045", "1046", "1048", "1049", "1050", "1051", "1053", "1054", "1055", "1057", "1058",
            "1060", "1061", "1062", "1063", "1066", "1069", "1081", "1086", "1087", "1110",
            "2052", "2070", "2074",
            "3076", "3082", "3098"*/],
        resource: {
            loadPath: path.resolve("src/translation/locales/{{lng}}.json"),
            savePath: path.resolve("src/translation/locales/{{lng}}.json")
        }
    }/*,
    transform: function customTransform(file, enc, done) {
        "use strict";
        const parser = this.parser;
        const content = fs.readFileSync(file.path, enc);

        parser.parseFuncFromString(content, { list: ["Translation._"] }, (key, options) => {
            parser.set(key, Object.assign({}, options, {
                nsSeparator: false,
                keySeparator: false
            }));
        });

        done();
    }*/
};
