import status from "http-status";
import catchAsync from "../../utils/catch.async";
import { sendResponse } from "../../utils/send.response";
import { authService } from "./auth.service";

const credintialsLogin = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authService.credintialsLogin(payload);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "user login successfull",
    data: result,
  });
});

export const authController = {
  credintialsLogin,
};
