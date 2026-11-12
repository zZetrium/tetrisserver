"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tetris_1 = require("./tetris");
const node_fs_1 = __importDefault(require("node:fs"));
const os_1 = __importDefault(require("os"));
let TEAM_COUNT = 4;
const UPDATE_INTERVAL = 600;
let TICK_INTERVAL = 600;
let freeze = true;
let games = (() => {
    let games = [];
    for (let i = 0; i < 4; i++) {
        games.push(new tetris_1.Game());
    }
    return games;
})();
let tick_counter = 0;
let SAVE_INTERVAL = 30_000;
let save_counter = 0;
setInterval(async () => {
    if (freeze) {
        return;
    }
    tick_counter += UPDATE_INTERVAL;
    save_counter += UPDATE_INTERVAL;
    if (save_counter >= SAVE_INTERVAL) {
        tick_counter %= TICK_INTERVAL;
        node_fs_1.default.writeFile(os_1.default.tmpdir() + "\\jamasoauto.json", JSON.stringify(games), err => {
            if (err) {
                console.error(err);
            }
            else {
                // file written successfully
            }
        });
    }
    let tick_count = Math.floor(tick_counter / TICK_INTERVAL);
    tick_counter %= TICK_INTERVAL;
    for (let i = 0; i < TEAM_COUNT; i++) {
        for (let j = 0; j < tick_count; j++) {
            games[i].tick();
            //games[i] = await fetch(`http://localhost:3000/?game_id=${i}`).then((response) => response.text()).then(JSON.parse);
        }
        //updates[i](games[i]);
    }
}, UPDATE_INTERVAL);
const handler = async (req, res) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    const parsedURL = new URL(req.url ?? "", `http://${req.headers.host}`);
    //const keyword = parsedURL.searchParams.get("keyword");
    /*console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Host:", req.headers.host);
    console.log("Parsed URL:", parsedURL);*/
    /*if (req.method !== "GET" || parsedURL.pathname === "/favicon.ico") {
        res.writeHead(404, "Not Found");
        res.end();
        return;
    }*/
    console.log(parsedURL.pathname);
    let game_id = parseInt(parsedURL.searchParams.get("game_id") ?? "0");
    let game = games[game_id];
    // chyby neexistují
    res.writeHead(200, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "*" });
    main_block: switch (req.method) {
        case "GET": {
            res.write(JSON.stringify(game));
            break;
        }
        case "PUT": {
            res.write(TEAM_COUNT.toString());
            break;
        }
        case "POST": {
            let action = parsedURL.searchParams.get("action") ?? "";
            console.log(`action ${action}`);
            switch (action) {
                case "": {
                    break main_block;
                }
                case "right": {
                    if (!freeze)
                        game.move_right();
                    break;
                }
                case "left": {
                    if (!freeze)
                        game.move_left();
                    break;
                }
                case "down": {
                    if (!freeze)
                        game.move_down();
                    break;
                }
                case "rotccw": {
                    if (!freeze)
                        game.rotate_ccw();
                    break;
                }
                case "rotcw": {
                    if (!freeze)
                        game.rotate_cw();
                    break;
                }
                case "freeze": {
                    freeze = true;
                    break;
                }
                case "unfreeze": {
                    freeze = false;
                    //console.log(os.tmpdir());
                    break;
                }
                case "setteam": {
                    let count = parseInt(parsedURL.searchParams.get("count") ?? "0");
                    TEAM_COUNT = count;
                    // RESETS (NO BREAK!)
                }
                case "reset": {
                    freeze = true;
                    games = [];
                    for (let i = 0; i < TEAM_COUNT; i++) {
                        games.push(new tetris_1.Game());
                    }
                    break;
                }
                case "addactions": {
                    let count = parseInt(parsedURL.searchParams.get("count") ?? "0");
                    game.actions += count;
                }
                case "save": {
                    node_fs_1.default.writeFile(os_1.default.tmpdir() + "\\jamaso.json", JSON.stringify(games), err => {
                        if (err) {
                            console.error(err);
                        }
                        else {
                            // file written successfully
                        }
                    });
                    break;
                }
                case "load": {
                    node_fs_1.default.readFile(os_1.default.tmpdir() + "\\jamaso.json", 'utf8', (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        let content = JSON.parse(data);
                        games = [];
                        for (let i = 0; i < content.length; i++) {
                            games.push(Object.assign(new tetris_1.Game(), content[i]));
                        }
                    });
                    break;
                }
                case "loadauto": {
                    node_fs_1.default.readFile(os_1.default.tmpdir() + "\\jamasoauto.json", 'utf8', (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        let content = JSON.parse(data);
                        games = [];
                        for (let i = 0; i < content.length; i++) {
                            games.push(Object.assign(new tetris_1.Game(), content[i]));
                        }
                    });
                    break;
                }
                case "settick": {
                    let count = parseInt(parsedURL.searchParams.get("count") ?? "0");
                    TICK_INTERVAL = count;
                    break;
                }
                case "setsave": {
                    let count = parseInt(parsedURL.searchParams.get("count") ?? "0");
                    SAVE_INTERVAL += count;
                    break;
                }
            }
            break;
        }
    }
    //res.writeHead(200, { "Content-Type": "text/plain" ,"Access-Control-Allow-Origin": "*"});
    // res.write(keyword ? `Hello, ${keyword}` : "Hello, HTTP");
    res.end();
};
exports.handler = handler;
