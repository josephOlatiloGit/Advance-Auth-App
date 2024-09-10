import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
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
