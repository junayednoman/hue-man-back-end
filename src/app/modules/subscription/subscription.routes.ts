import { Router } from 'express';
import express from 'express';
import {
  paymentController,
   
  subscriptionController,
} from './subscription.controller';
import authVerify from '../../middlewares/authVerify';

export const subscriptionRoutes = Router();

subscriptionRoutes.post(
  '/',
  express.raw({ type: 'application/json' }),
  subscriptionController.manageSubscriptions,
);

// payment routes
export const paymentRoutes = Router();
paymentRoutes.get('/', authVerify(['admin']), paymentController.getPayments);
paymentRoutes.get(
  '/:id',
  authVerify(['admin']),
  paymentController.getSinglePayment,
);
