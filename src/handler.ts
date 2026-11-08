import { IncomingMessage, ServerResponse } from "http";
import { Game } from "./tetris";
import fs from 'node:fs';
import os from 'os';

let TEAM_COUNT = 4;
const UPDATE_INTERVAL = 600;
let TICK_INTERVAL = 600;
let freeze = false;

let games: Game[] = (() => {
    let games = [];
    for (let i = 0; i < 4; i++) {
        games.push(new Game());
    }
    return games;
})();
let tick_counter = 0;

setInterval(async () => {
    if (freeze) {
        return;
    }
    tick_counter += UPDATE_INTERVAL;
    /*while (tick_counter >= TICK_INTERVAL) {
      tick_counter -= TICK_INTERVAL;
      games[i].tick();
    }*/
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



export const handler = async (req: IncomingMessage, res: ServerResponse) => {
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
    res.writeHead(200, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" });
    main_block: switch (req.method) {
        case "GET": {

            res.write(JSON.stringify(game));
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
                    freeze = true
                    break;
                }
                case "unfreeze": {
                    freeze = false;
                    console.log(os.tmpdir());
                    break;


                }
                case "save": {
                    fs.writeFile(os.tmpdir() + "\\jamaso.json", JSON.stringify(games), err => {
                        if (err) {
                            console.error(err);
                        } else {
                            // file written successfully
                        }
                    });
                    break;
                }
                case "load": {
                    fs.readFile(os.tmpdir() + "\\jamaso.json", 'utf8', (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        let content = JSON.parse(data);
                        games = [];
                        for (let i = 0;i<content.length;i++) {
                            games.push(Object.assign(new Game(),content[i]));
                        }
                        
                    });
                }

            }
            break;
        }
    }

    //res.writeHead(200, { "Content-Type": "text/plain" ,"Access-Control-Allow-Origin": "*"});
    // res.write(keyword ? `Hello, ${keyword}` : "Hello, HTTP");
    res.end();
};

