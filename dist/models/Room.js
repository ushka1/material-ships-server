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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roomSchema = new mongoose_1.Schema({
    players: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                required: true,
                ref: 'Player',
            },
        ],
        required: true,
    },
}, { autoCreate: true });
// tslint:disable-next-line: only-arrow-functions
roomSchema.methods.addToRoom = function (player) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.players.length >= 2) {
            throw new Error('Room is full already');
        }
        this.players.push(player.id);
        player.room = this.id;
        try {
            const session = yield mongoose_1.startSession();
            session.startTransaction();
            yield this.save({ session });
            yield player.save({ session });
            yield session.commitTransaction();
            session.endSession();
        }
        catch (err) {
            throw new Error('An unexpected error occurred');
        }
    });
};
roomSchema.methods.removeFromRoom = function (playerId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.players.length <= 1) {
            yield this.remove();
            return;
        }
        const playersUpdate = this.players.filter((id) => id.toString() !== playerId.toString());
        this.players = playersUpdate;
        yield this.save();
    });
};
exports.default = mongoose_1.model('Room', roomSchema);
//# sourceMappingURL=Room.js.map