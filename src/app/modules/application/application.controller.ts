import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import applicationServices from "./application.service";

const createApplication = handleAsyncRequest(async (req: any, res) => {
  const email = req?.user?.email
  const payload = req.body;
  const result = await applicationServices.createApplication(payload, email);
  successResponse(res, {
    message: "Application created successfully!",
    data: result,
    status: 201,
  });
});

const getApplications = handleAsyncRequest(async (req: any, res) => {
  const result = await applicationServices.getApplications();
  successResponse(res, {
    message: "Applications retrieved successfully!",
    data: result,
  });
});

const getApplication = handleAsyncRequest(async (req: any, res) => {
  const id = req.params.id;
  const result = await applicationServices.getApplication(id);
  successResponse(res, {
    message: "Application retrieved successfully!",
    data: result,
  });
});

export const applicationControllers = {
  createApplication,
  getApplications,
  getApplication
};