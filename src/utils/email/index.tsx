import { type TransportOptions, createTransport } from "nodemailer";
import { env } from "../../env/server.mjs";

import { EmailVerificationTemplate } from "./templates/email-verification";
import { TestMailDev } from "./templates/test-mail";

import { render } from "@react-email/render";
import type { ComponentProps } from "react";

export enum EmailTemplate {
  EmailVerification = "EmailVerification",
  // PasswordReset = "PasswordReset",
  TestMailDev = "TestMailDev",
  // to be added later on ..
}

/**
 * Represents a mapping of email templates to their corresponding props.
 */
export type PropsMap = {
  [EmailTemplate.EmailVerification]: ComponentProps<
    typeof EmailVerificationTemplate
  >;
  [EmailTemplate.TestMailDev]: ComponentProps<typeof TestMailDev>;
};

const getEmailTemplate = <T extends EmailTemplate>(
  template: T,
  props: PropsMap[NoInfer<T>],
) => {
  switch (template) {
    case EmailTemplate.EmailVerification:
      return {
        subject: "Verifikasi Akun Pelajar Sensus PPI Jerman",
        body: render(
          <EmailVerificationTemplate
            {...(props as PropsMap[EmailTemplate.EmailVerification])}
          />,
        ),
      };

    case EmailTemplate.TestMailDev:
      return {
        subject: "Sensus PPI Jerman Test Email",
        body: render(
          <TestMailDev {...(props as PropsMap[EmailTemplate.TestMailDev])} />,
        ),
      };
    // to be added later on ..}

    default:
      throw new Error("Invalid email template");
  }
};

const smtpConfig = {
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: env.EMAIL_PORT === 465,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
};

export const transporter = createTransport(smtpConfig as TransportOptions);

export const sendMail = async <T extends EmailTemplate>(
  to: string,
  template: T,
  props: PropsMap[NoInfer<T>],
) => {
  // if (env.NODE_ENV !== "production") {
  //   console.log(
  //     "📨 Email sent to:",
  //     to,
  //     "with template:",
  //     template,
  //     "and props:",
  //     props,
  //   );
  //   return;
  // }

  try {
    const { subject, body } = getEmailTemplate(template, props);

    const mailOptions = {
      from: env.EMAIL_FROM,
      to,
      subject,
      html: body,
    };

    return transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};
