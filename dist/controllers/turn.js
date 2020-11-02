"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeTurn = exports.getTurnId = exports.setTurnIds = void 0;
const Room_1 = __importDefault(require("../models/Room"));
const Player_1 = __importDefault(require("../models/Player"));
const Socket_1 = require("../utils/Socket");
exports.setTurnIds = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const room = yield Room_1.default.findById(roomId).populate('players');
    if (!room) {
        return;
    }
    let turnId = 1;
    try {
        for (var _b = __asyncValues(room.players), _c; _c = yield _b.next(), !_c.done;) {
            const player = _c.value;
            player.turnId = turnId;
            yield player.save();
            turnId++;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    const firstTurn = Math.round(Math.random() + 1);
    room.turn = firstTurn;
    yield room.save();
});
exports.getTurnId = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const player = yield Player_1.default.findById(this.playerId);
        const room = yield Room_1.default.findById(this.roomId);
        if (player && room) {
            this.turnId = player.turnId;
            const response = {
                message: `Congratulations ${player.name}, your turnId is ${player.turnId}!`,
                turnId: player.turnId,
                turn: room.turn,
            };
            this.emit('turn-controller', response);
        }
        else {
            this.error('An unexpected error occurred.');
        }
    });
};
exports.changeTurn = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const { io } = Socket_1.Socket.getInstance();
    if (!io) {
        throw new Error('Socket Error.');
    }
    const room = yield Room_1.default.findById(roomId);
    if (!room) {
        throw new Error('An unexpected error occurred.');
    }
    yield room.changeTurn();
    io.to(roomId).emit('turn-controller', {
        message: 'Congratulations to both players, the turn has changed!',
        turn: room.turn,
    });
});
//# sourceMappingURL=turn.js.map