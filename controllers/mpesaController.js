import axios from "axios";
import Transaction from "../models/Mpesa";
import express from "express";
const app = express();
import { token } from "morgan";

//GETTING ACCESS TOKEN

const getAccessToken = async (req, res, next) => {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  const auth = new Buffer.from(`${key}:${secret}`).toString("base64");

  await axios
    .get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    )
    .then((res) => {
      console.log(res.data);
      token = res.data.access_token;
      next();
    })
    .catch((error) => {
      console.log(error);
    });
};

//STEP 2 // STK PUSH

app.post("/mpesa", getAccessToken, async (req, res) => {
  const phone = req.body.phone.substring(1); // formatted to 72190.......
  const amount = req.body.amount;

  const date = new Date();

  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  const shortCode = process.env.MPESA_SHORT_CODE;
  const passkey = process.env.MPESA_PASSKEY;

  const callbackurl = process.env.CALLBACK_URL;

  const password = new Buffer.from(shortCode + passkey + timestamp).toString(
    "base64"
  );

  await axios
    .post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortCode,
        Password: password,
        TimeStamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: `254${phone}`,
        CallBackURL: callbackurl,
        AccountReference: "account number",
        TransactionDesc: "any",
      },
      {
        headers: {
          Authorization: `Bearer${token}`,
        },
      }
    )
    .then((resp) => {
      res.json(resp.data);
      console.log(resp.data);
    })
    .catch((error) => {
      res.json(error);
      console.log(error.message);
    });
});
