define(function(require, exports, module) {
    main.consumes = [
        "Plugin", "ui", "commands", "menus", "preferences", "settings", "fs"
    ];
    main.provides = ["codeflows"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var ui = imports.ui;
        var menus = imports.menus;
        var fs = imports.fs;
        var commands = imports.commands;
        var settings = imports.settings;
        var prefs = imports.preferences;
        
        /***** Initialization *****/
        
        var plugin = new Plugin("Ajax.org", main.consumes);
        var emit = plugin.getEmitter();
        
        var showing;
        var flowStart;
        var config;
        
        function load() {
            commands.addCommand({
                name: "mycommand",
                bindKey: { mac: "Command-I", win: "Ctrl-I" },
                isAvailable: function(){ return true; },
                exec: function() {
                    showing ? hide() : show();
                }
            }, plugin);
            
            commands.addCommand({
                name: "codeflows_start",
                bindKey: { mac: "Command-Shift-,", win: "Ctrl-Shift-," },
                isAvailable: function() { return true; },
                exec: function(editor) {
                    start(editor);
                }
            }, plugin);
            
            commands.addCommand({
                name: "codeflows_end",
                bindKey: { mac: "Command-Shift-.", win: "Ctrl-Shift-." },
                isAvailable: function() { return true; },
                exec: function(editor) {
                    end(editor);
                }
            }, plugin);
            
            commands.addCommand({
                name: "codeflows_follow",
                bindKey: { mac: "Command-.", win: "Ctrl-." },
                isAvailable: function() { return true; },
                exec: function() {
                    hide();
                }
            }, plugin);
            
            menus.addItemByPath("Tools/My Menu Item", new ui.item({
                command: "mycommand"
            }), 300, plugin);
            
            settings.on("read", function(e){
                settings.setDefaults("user/my-plugin", [
                    ["first", "1"],
                    ["second", "all"]
                ]);
            });
            
            prefs.add({
                "Example" : {
                    position: 450,
                    "My Plugin" : {
                        position: 100,
                        "First Setting": {
                            type: "checkbox",
                            setting: "user/my-plugin/@first",
                            position: 100
                        },
                        "Second Setting": {
                            type: "dropdown",
                            setting: "user/my-plugin/@second",
                            width: "185",
                            position: 200,
                            items: [
                                { value: "you", caption: "You" },
                                { value: "me", caption: "Me" },
                                { value: "all", caption: "All" }
                            ]
                        }
                    }
                }
            }, plugin);
            
            loadFlows();
        }
        
        var drawn = false;
        function draw() {
            if (drawn) return;
            drawn = true;
            
            // Insert HTML
            var markup = require("text!./plugin.html");
            ui.insertHtml(document.body, markup, plugin);
            
            // Insert CSS
            ui.insertCss(require("text!./style.css"), options.staticPrefix, plugin);
        
            emit("draw");
        }
        
        /***** Methods *****/
        
        function show() {
            draw();
            
            var div = document.querySelector(".helloworld");
            div.style.display = "block";
            div.innerHTML = settings.get("user/my-plugin/@second");
            
            emit("show");
            showing = true;
        }
        
        function hide() {
            if (!drawn) return;
            
            document.querySelector(".helloworld").style.display = "none";
            
            emit("hide");
            showing = false;
        }
        
        function start(editor) {
            var file = editor.activeDocument.tab.path
            var selection = editor.ace.selection.selectionLead;
            // Could get word with editor.ace.selection.selectAWord() but don't want it to expand out and back in.
            
            flowStart = {file: file, column: selection.column, row: selection.row}; 
        }
        
        function end(editor) {
            var file = editor.activeDocument.tab.path
            var selection = editor.ace.selection.selectionLead;
            
            endFlow(file, selection.column, selection.row);
        }
        
        function endFlow(file, column, row, text) {
            if (!flowStart) return;
            
            var flowEnd = {file: file, column: column, row: row};
            insertFlow(flowStart, flowEnd)
        }
        
        function insertFlow(start, end) {
            config.flows.total = config.flows.total + 1;
            var flowNum = config.flows.total;
            config.flows[flowNum] = {
                start: start, 
                end: end
            };
            saveFlows();
        }
        
        function loadFlows() {
            fs.readFile("/.codeflows", function (err, contents) {
                if (err) {
                    if (err.code == "ENOENT") {
                        config = {flows: {total: 0}, files: {}};        
                        return saveFlows();
                    }
                    return console.error(err);
                }
                
                try {
                    config = JSON.parse(contents);
                } catch (e) {
                    console.error("Could not parse .codeflows config file");
                }
            });
            
        }
        
        function saveFlows() {
            var flowsEncoded = JSON.stringify(config);
            fs.writeFile("/.codeflows", flowsEncoded, function (err) {
                if (err) return console.error(err);
                
                console.log("Successfully saved flows");
            });
        }
        
        function follow() {
            
        }
        
        /***** Lifecycle *****/
        
        plugin.on("load", function() {
            load();
        });
        plugin.on("unload", function() {
            drawn = false;
            showing = false;
            flowStart = null;
            config = null;
        });
        
        /***** Register and define API *****/
        
        /**
         * This is an example of an implementation of a plugin.
         * @singleton
         */
        plugin.freezePublicAPI({
            /**
             * @property showing whether this plugin is being shown
             */
            get showing(){ return showing; },
            
            _events: [
                /**
                 * @event show The plugin is shown
                 */
                "show",
                
                /**
                 * @event hide The plugin is hidden
                 */
                "hide"
            ],
            
            /**
             * Show the plugin
             */
            show: show,
            
            /**
             * Hide the plugin
             */
            hide: hide,
        });
        
        register(null, {
            "codeflows": plugin
        });
    }
});