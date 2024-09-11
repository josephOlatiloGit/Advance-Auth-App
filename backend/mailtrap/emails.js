import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

//EMAIL VERIFICATION FUNCTION:
export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }]; //user email

  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ), //replace the verificationCode with the verificationToken
      category: "Email Verification",
    });

    console.log("Email sent successfully", res);
  } catch (error) {
    console.log("Error sending verification email", error);
    return Error(`Error sending verification email:${error}`);
  }
};

// WELCOME EMAIL:
export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "73013716-cd98-4f3e-bb3f-750a28fcb732",
      template_variables: {
        company_info_name: "Auth Service Company",
        name: name,
      },
    });

    console.log("Welcome email sent successfully", res);
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw Error(`Error sending welcome email:${error}`);
  }
};

// RESET PASSWORD EMAIL:
export const sendResetPasswordEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.error("Error sending  password rest email");
    return Error(`Error sending password reset email: ${error}`);
  }
};

// PASSWORD REST SUCCESSFULLY EMAIL:

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Rest Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
    console.log("Password reset successfully", res);
  } catch (error) {
    console.error("Error in sending reset success email", error);
    return Error(`Error sending password reset success email: ${error}`);
  }
};
