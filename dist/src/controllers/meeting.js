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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startMeeting = void 0;
const generateMeetingId_1 = require("../utils/generateMeetingId");
const prisma_1 = __importDefault(require("../utils/prisma"));
const startMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description } = req.body;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "user id not found" });
        return;
    }
    const meeting = yield prisma_1.default.meeting.create({
        data: {
            isRecordingEnabled: false,
            accessCode: yield (0, generateMeetingId_1.generateRandomString)(),
            meetingLink: yield (0, generateMeetingId_1.generateRandomString)(),
            title: title,
            description: description,
            startTime: new Date(Date.now()),
            endTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            hostId: userId,
            maxParticipants: 2,
            status: "ONGOING",
        },
    });
    res.status(200).json(Object.assign(Object.assign({}, meeting), { message: "meeting created successfully" }));
});
exports.startMeeting = startMeeting;
// export const joinMeeting: RequestHandler = async (
//   req: RequestWithUser,
//   res: Response
// ) => {
//   const userId = req.userId;
//   const { accessCode, meetingId } = req.body;
//   if (!accessCode || !meetingId)
//     res.status(203).json({
//       message: "accessCode is required",
//     });
//   if (!userId) {
//     res.status(401).json({
//       message: "user id not found",
//     });
//   }
//   const user = await prismaClient.user.findFirst({
//     where: {
//       id: userId,
//     },
//   });
//   if (!user) {
//     res.status(404).json({
//       message: "user not found",
//     });
//     return;
//   }
//   const meeting = await prismaClient.meeting.findFirst({
//     where: {
//       accessCode: accessCode,
//     },
//   });
//   if (!meeting || !meeting) {
//     res.status(404).json({
//       message: "meeting not found",
//     });
//     return;
//   }
//   const participants = await prismaClient.participant.create({
//     data: {
//       meetingId: meeting.id,
//       joinedAt: new Date(),
//       userId: user.id,
//     },
//   });
//   await prismaClient.meeting.update({
//     where: {
//       id: meeting.id,
//     },
//     data: {
//       participants: [...meeting.participants, participants],
//     },
//   });
//   res.status(200).json({
//     message: "meeting joined successfully",
//     meeting,
//   });
// };
