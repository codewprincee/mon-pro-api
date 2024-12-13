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
exports.deleteAccount = exports.getMe = void 0;
const asyncHandler_1 = require("../../../utils/asyncHandler");
const User_1 = require("../../../models/User");
const ApiResponse_1 = require("../../../utils/ApiResponse");
const getMe = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield User_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)
        .select('-password -tokenVersion')
        .lean();
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    res.status(200).json({
        success: true,
        data: Object.assign(Object.assign({}, user), { _id: user._id.toString(), fullName: `${user.firstName} ${user.lastName}`, accountStatus: user.isActive ? 'Active' : 'Inactive', subscription: {
                trialStatus: new Date(user.trialEndsAt) > new Date() ? 'Active' : 'Expired',
                trialEndsAt: user.trialEndsAt
            } })
    });
}));
exports.getMe = getMe;
const deleteAccount = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return ApiResponse_1.ApiResponse.error(res, 'Unauthorized', 401);
    }
    const { _id } = req.user;
    const deletedUser = yield User_1.User.findByIdAndDelete(_id);
    if (!deletedUser) {
        return ApiResponse_1.ApiResponse.error(res, 'User not found', 404);
    }
    return ApiResponse_1.ApiResponse.success(res, 'Account deleted successfully', null);
}));
exports.deleteAccount = deleteAccount;
const updateUser = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return ApiResponse_1.ApiResponse.error(res, 'Unauthorized', 401);
    }
    const { _id } = req.user;
    // Ensure req.body is a valid update object
    if (!req.body || typeof req.body !== 'object') {
        return ApiResponse_1.ApiResponse.error(res, 'Invalid update data', 400);
    }
    const updateData = req.body;
    const updatedUser = yield User_1.User.findByIdAndUpdate(_id, updateData, { new: true }).select('-password -tokenVersion');
    if (!updatedUser) {
        return ApiResponse_1.ApiResponse.error(res, 'User not found', 404);
    }
    return ApiResponse_1.ApiResponse.success(res, 'User updated successfully', updatedUser);
}));
