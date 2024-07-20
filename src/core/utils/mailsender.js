
import transporter from "../config/nodemailer.js";
import { config } from "../config/env.js";

export const verifyDriver = async (driverDetails) => {
  const mailOptions = {
    from: '"RidePal Admin" <no-reply@ridepal.com>', // sender address
    to: "config.admin.email",
    subject: "New Driver Registration - Verification Required", // Subject line
    text: `A new driver has registered and requires verification. Details: ${JSON.stringify(
      driverDetails,
      null,
      2
    )}`, // plain text body
    html: `<p>A new driver has registered and requires verification. Details:</p><pre>${JSON.stringify(
      driverDetails,
      null,
      2
    )}</pre>`, // html body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to admin.");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};


export const verifyPassenger = async (passengerDetails) => {
  const mailOptions = {
    from: '"RidePal Admin" <no-reply@ridepal.com>', // sender address
    to: config.admin.email,
    subject: "A new passenger Registration - Verification Required", // Subject line
    text: `A new passenger has registered and requires verification. Details: ${JSON.stringify(
      passengerDetails,
      null,
      2
    )}`, // plain text body
    html: `<p>A new passenger has registered and requires verification. Details:</p><pre>${JSON.stringify(
      passengerDetails,
      null,
      2
    )}</pre>`, // html body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to admin.");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
