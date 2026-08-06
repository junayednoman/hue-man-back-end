import QueryBuilder from "../../classes/queryBuilder";
import AuthModel from "../auth/auth.model";
import Subscription from "./subscription.model";

const expireOutdatedSubscriptions = async (userId?: string) => {
  await Subscription.updateMany(
    {
      ...(userId ? { user: userId } : {}),
      status: "active",
      end_date: { $lte: new Date() },
    },
    { status: "expired" },
  );
};

const getAllSubscriptions = async (query: Record<string, any>) => {
  await expireOutdatedSubscriptions();
  const userQuery = new QueryBuilder(Subscription.find(), query)
    .filter()
    .sort()
    .paginate()
    .selectFields();
  const meta = await userQuery.countTotal();
  const result = await userQuery.queryModel
    .populate("user", "name email")
    .populate("package");
  return { data: result, meta };
};

const getSingleSubscription = async (id: string) => {
  const result = await Subscription.findById(id)
    .populate("user", "name email")
    .populate("package");
  return result;
};

const getMySubscription = async (id: string, web: boolean) => {
  await expireOutdatedSubscriptions(id);
  const subscription = await Subscription.findOne({
    user: id,
    status: "active",
    end_date: { $gt: new Date() },
    web,
  }).populate("package");
  if (!subscription) return null;

  const used = await AuthModel.countDocuments({
    parent_id: id,
    is_deleted: false,
    is_blocked: false,
  });
  const packageItem = subscription.package as any;
  const limit = packageItem?.sub_user_limit ?? 0;
  return {
    ...subscription.toObject(),
    sub_users: {
      used,
      limit,
      remaining: Math.max(0, limit - used),
    },
  };
};

const subscriptionServices = {
  getAllSubscriptions,
  getSingleSubscription,
  getMySubscription,
};

export default subscriptionServices;
