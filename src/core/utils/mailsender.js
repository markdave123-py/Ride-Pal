import transporter from "../config/nodemailer.js";
import { config } from "../config/env.js";

// export const verifyDriver = async (driverDetails) => {
//   const mailOptions = {
//     from: '"RidePal Admin" <no-reply@ridepal.com>', // sender address
//     to: "config.admin.email",
//     subject: "New Driver Registration - Verification Required", // Subject line
//     text: `A new driver has registered and requires verification. Details: ${JSON.stringify(
//       driverDetails,
//       null,
//       2
//     )}`, // plain text body
//     html: `<p>A new driver has registered and requires verification. Details:</p><pre>${JSON.stringify(
//       driverDetails,
//       null,
//       2
//     )}</pre>`, // html body
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Verification email sent to admin.");
//   } catch (error) {
//     console.error("Error sending verification email:", error);
//   }
// };

export const verifyUser = async (details, token) => {
  const link = `https://ride-pal-1.onrender.com/api/admin/verify-user?token=${token}`;
  const mailOptions1 = {
    from: '"RidePal Admin" <no-reply@ridepal.com>', // sender address
    to: config.admin.email,
    subject: "A new passenger Registration - Verification Required", // Subject line
    text: `A new passenger has registered and requires verification. Details: ${JSON.stringify(
      details,
      null,
      2
    )}`, // plain text body
    html: `<p>A new passenger has registered and requires verification. Details:</p><pre>${JSON.stringify(
      details,
      null,
      2
    )}</pre>, // html body
    <p><a href="${link}">Click here to verify this user</a></p>`
  };

  const mailOptions2 = {
    from: '"RidePal Admin" <no-reply@ridepal.com>', // sender address
    to: config.admin.email,
    subject: "New Driver Registration - Verification Required", // Subject line
    text: `A new driver has registered and requires verification. Details: ${JSON.stringify(
      details,
      null,
      2
    )}`, // plain text body
    html: `<p>A new driver has registered and requires verification. Details:</p><pre>${JSON.stringify(
      details,
      null,
      2
    )}</pre>, // html body
    <p><a href="${link}">Click here to verify this user</a></p>`
  };

  let mailOptions = details.vehicle ? mailOptions2 : mailOptions1;

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to admin.");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export const notifyUser = async (email) => {
  const mailOptions = {
    from: '"RidePal Admin" <no-reply@ridepal.com>', // sender address
    to: email,
    subject: "Account Verification Successful", // Subject line
    text: `You Ride pal account have successfully been verified!!, vist`, // plain text body
    html: `You Ride pal account have successfully been verified!!, visit your account to start enjoying our services`, // html body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to user.");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
