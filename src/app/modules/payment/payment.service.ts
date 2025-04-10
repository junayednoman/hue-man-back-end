import Payment from "./payment.model";
import QueryBuilder from "../../classes/queryBuilder";

const getAllPayments = async (query: Record<string, any>) => {
  const searchableFields = [
    "amount",
    "purpose",
    "status",
    "transaction_id"
  ];
  const userQuery = new QueryBuilder(
    Payment.find(),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await userQuery.countTotal();
  const result = await userQuery.queryModel.populate("user", "name email");
  return { data: result, meta };
};

const getSinglePayment = async (id: string) => {
  const result = await Payment.findOne({ _id: id }).populate("user", "name email");
  return result;
}

export const paymentServices = {
  getAllPayments,
  getSinglePayment
}