import { ISSLCommerz } from "./sslc.interface";
import { env } from "../../config";
import axios from "axios";

const sslPaymentInitialization = async (payload: ISSLCommerz) => {
  const data = {
    store_id: env.ssl_store_id,
    store_passwd: env.ssl_store_pass,
    total_amount: payload.amount,
    currency: "BDT",
    tran_id: payload.transactionId,
    success_url: `${env.ssl_success_backend_url}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
    fail_url: `${env.ssl_fail_backend_url}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
    cancel_url: `${env.ssl_cancel_backend_url}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
    shipping_method: "N/A",
    product_name: "Tour",
    product_category: "Service",
    product_profile: "general",
    cus_name: payload.name,
    cus_email: payload.email,
    cus_add1: payload.address,
    cus_add2: "N/A",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: payload.phoneNumber,
    cus_fax: "01711111111",
    ship_name: "N/A",
    ship_add1: "N/A",
    ship_add2: "N/A",
    ship_city: "N/A",
    ship_state: "N/A",
    ship_postcode: 1000,
    ship_country: "N/A",
  };

  // communication with SSLCommerz API
  const response = await axios({
    method: "POST",
    url: env.ssl_payment_api,
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const sllcData = response.data;

  if (sllcData?.status === "SUCCESS") {
    return sllcData;
  } else {
    throw new Error("SSLCommerz Payment Initialization Failed");
  }
};

export const SSLCommerzService = {
  sslPaymentInitialization,
};
