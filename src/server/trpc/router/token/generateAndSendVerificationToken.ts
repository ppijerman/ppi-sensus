import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { sendEmail } from "../../../../utils/nodemailer";

const saltRounds = 10; // salt rounds for bcrypt

export const generateAndSendVerificationToken = protectedProcedure
  .input(
    z.object({
      id: z.string(), // User ID
      email: z.string().email(), // User Email
    }),
  )
  .mutation(async ({ ctx, input: { id, email } }) => {
    const now = new Date();
    const existingToken =
      await ctx.prisma.universityEmailVerificationToken.findFirst({
        where: { OR: [{ email: email }, { userId: id }] },
      });

    if (existingToken) {
      const lastSentAt = new Date(existingToken.lastSentAt);
      const timeSinceLastSent = (now.getTime() - lastSentAt.getTime()) / 1000; // seconds

      if (timeSinceLastSent < 60) {
        return {
          success: false,
          message: `Please wait ${60 - timeSinceLastSent} seconds before requesting new verification email.`,
          lastSentAt: existingToken.lastSentAt,
        };
      }
    }

    // Generate a new token and its hashed version
    const token = uuidv4();
    const hashedToken = await bcrypt.hash(token, saltRounds);
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000); // Expiry date for the token

    try {
      if (
        ctx.session &&
        ctx.session.user &&
        ctx.session.user.verification === "VERIFIED"
      ) {
        return { success: false, message: "User is already verified." };
      }
      // Check if a token already exists for the given email or user ID
      const existingToken =
        await ctx.prisma.universityEmailVerificationToken.findFirst({
          where: { OR: [{ email: email }, { userId: id }] },
        });

      if (existingToken) {
        // If an existing token is found, update it with the new hashed token and expiry

        await ctx.prisma.universityEmailVerificationToken.update({
          where: { id: existingToken.id },
          data: { token: hashedToken, expires: expires, lastSentAt: now },
        });
      } else {
        // If no existing token is found, create a new record with the hashed token and expiry
        await ctx.prisma.universityEmailVerificationToken.create({
          data: {
            userId: id,
            email: email,
            token: hashedToken,
            expires: expires,
            lastSentAt: now,
          },
        });
      }

      // Construct
      const verificationUrl = `https://sensus.ppijerman.org/auth/verify-token?token=${token}`;

      // Ssend
      await sendEmail({
        to: email,
        subject: "Verifikasi Email Sensus PPI Jerman",
        text: `Verifikasi Email anda dengan mengklik link berikut: ${verificationUrl}`,
        html: `<!--
        * This email was built using Tabular.
        * For more information, visit https://tabular.email
        -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  lang="en"
>
  <head>
    <title></title>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta name="x-apple-disable-message-reformatting" content="" />
    <meta content="target-densitydpi=device-dpi" name="viewport" />
    <meta content="true" name="HandheldFriendly" />
    <meta content="width=device-width" name="viewport" />
    <meta
      name="format-detection"
      content="telephone=no, date=no, address=no, email=no, url=no"
    />
    <style type="text/css">
      table {
        border-collapse: separate;
        table-layout: fixed;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      table td {
        border-collapse: collapse;
      }
      .ExternalClass {
        width: 100%;
      }
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
      body,
      a,
      li,
      p,
      h1,
      h2,
      h3 {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }
      html {
        -webkit-text-size-adjust: none !important;
      }
      body,
      #innerTable {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      #innerTable img + div {
        display: none;
        display: none !important;
      }
      img {
        margin: 0;
        padding: 0;
        -ms-interpolation-mode: bicubic;
      }
      h1,
      h2,
      h3,
      p,
      a {
        line-height: 1;
        overflow-wrap: normal;
        white-space: normal;
        word-break: break-word;
      }
      a {
        text-decoration: none;
      }
      h1,
      h2,
      h3,
      p {
        min-width: 100% !important;
        width: 100% !important;
        max-width: 100% !important;
        display: inline-block !important;
        border: 0;
        padding: 0;
        margin: 0;
      }
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
      a[href^="mailto"],
      a[href^="tel"],
      a[href^="sms"] {
        color: inherit;
        text-decoration: none;
      }
      img,
      p {
        margin: 0;
        margin: 0;
        font-family:
          Lato,
          BlinkMacSystemFont,
          Segoe UI,
          Helvetica Neue,
          Arial,
          sans-serif;
        line-height: 22px;
        font-weight: 400;
        font-style: normal;
        font-size: 16px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
      }
      h1 {
        margin: 0;
        margin: 0;
        font-family:
          Roboto,
          BlinkMacSystemFont,
          Segoe UI,
          Helvetica Neue,
          Arial,
          sans-serif;
        line-height: 34px;
        font-weight: 400;
        font-style: normal;
        font-size: 28px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
      }
      h2 {
        margin: 0;
        margin: 0;
        font-family:
          Lato,
          BlinkMacSystemFont,
          Segoe UI,
          Helvetica Neue,
          Arial,
          sans-serif;
        line-height: 30px;
        font-weight: 400;
        font-style: normal;
        font-size: 24px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
      }
      h3 {
        margin: 0;
        margin: 0;
        font-family:
          Lato,
          BlinkMacSystemFont,
          Segoe UI,
          Helvetica Neue,
          Arial,
          sans-serif;
        line-height: 26px;
        font-weight: 400;
        font-style: normal;
        font-size: 20px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
      }
    </style>
    <style type="text/css">
      @media (min-width: 481px) {
        .hd {
          display: none !important;
        }
      }
    </style>
    <style type="text/css">
      @media (max-width: 480px) {
        .hm {
          display: none !important;
        }
      }
    </style>
    <style type="text/css">
      [style*="Albert Sans"] {
        font-family:
          "Albert Sans",
          BlinkMacSystemFont,
          Segoe UI,
          Helvetica Neue,
          Arial,
          sans-serif !important;
      }
      [style*="Inter Tight"] {
        font-family:
          "Inter Tight",
          BlinkMacSystemFont,
          Segoe UI,
          Helvetica Neue,
          Arial,
          sans-serif !important;
      }
      @media only screen and (min-width: 481px) {
        img,
        p {
          margin: 0;
          margin: 0;
          font-family:
            Lato,
            BlinkMacSystemFont,
            Segoe UI,
            Helvetica Neue,
            Arial,
            sans-serif;
          line-height: 22px;
          font-weight: 400;
          font-style: normal;
          font-size: 16px;
          text-decoration: none;
          text-transform: none;
          letter-spacing: 0;
          direction: ltr;
          color: #333;
          text-align: left;
          mso-line-height-rule: exactly;
          mso-text-raise: 2px;
        }
        h1 {
          margin: 0;
          margin: 0;
          font-family:
            Roboto,
            BlinkMacSystemFont,
            Segoe UI,
            Helvetica Neue,
            Arial,
            sans-serif;
          line-height: 34px;
          font-weight: 400;
          font-style: normal;
          font-size: 28px;
          text-decoration: none;
          text-transform: none;
          letter-spacing: 0;
          direction: ltr;
          color: #333;
          text-align: left;
          mso-line-height-rule: exactly;
          mso-text-raise: 2px;
        }
        h2 {
          margin: 0;
          margin: 0;
          font-family:
            Lato,
            BlinkMacSystemFont,
            Segoe UI,
            Helvetica Neue,
            Arial,
            sans-serif;
          line-height: 30px;
          font-weight: 400;
          font-style: normal;
          font-size: 24px;
          text-decoration: none;
          text-transform: none;
          letter-spacing: 0;
          direction: ltr;
          color: #333;
          text-align: left;
          mso-line-height-rule: exactly;
          mso-text-raise: 2px;
        }
        h3 {
          margin: 0;
          margin: 0;
          font-family:
            Lato,
            BlinkMacSystemFont,
            Segoe UI,
            Helvetica Neue,
            Arial,
            sans-serif;
          line-height: 26px;
          font-weight: 400;
          font-style: normal;
          font-size: 20px;
          text-decoration: none;
          text-transform: none;
          letter-spacing: 0;
          direction: ltr;
          color: #333;
          text-align: left;
          mso-line-height-rule: exactly;
          mso-text-raise: 2px;
        }
        .t3,
        .t4 {
          mso-line-height-alt: 60px !important;
          line-height: 60px !important;
          display: block !important;
        }
        .t9 {
          border-radius: 8px !important;
          overflow: hidden !important;
          padding: 60px !important;
        }
        .t11 {
          padding: 60px !important;
          border-radius: 8px !important;
          overflow: hidden !important;
          width: 480px !important;
        }
        .t25,
        .t47,
        .t57,
        .t67 {
          width: 600px !important;
        }
      }
    </style>
    <style type="text/css" media="screen and (min-width:481px)">
      .moz-text-html img,
      .moz-text-html p {
        margin: 0;
        margin: 0;
        font-family:
          Lato,
          BlinkMacSystemFont,
          Segoe UI,
          Helvetica Neue,
          Arial,
          sans-serif;
        line-height: 22px;
        font-weight: 400;
        font-style: normal;
        font-size: 16px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
      }
      .moz-text-html h1 {
        margin: 0;
        margin: 0;
        font-family:
          Roboto,
          BlinkMacSystemFont,
          Segoe UI,
          Helvetica Neue,
          Arial,
          sans-serif;
        line-height: 34px;
        font-weight: 400;
        font-style: normal;
        font-size: 28px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
      }
      .moz-text-html h2 {
        margin: 0;
        margin: 0;
        font-family:
          Lato,
          BlinkMacSystemFont,
          Segoe UI,
          Helvetica Neue,
          Arial,
          sans-serif;
        line-height: 30px;
        font-weight: 400;
        font-style: normal;
        font-size: 24px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
      }
      .moz-text-html h3 {
        margin: 0;
        margin: 0;
        font-family:
          Lato,
          BlinkMacSystemFont,
          Segoe UI,
          Helvetica Neue,
          Arial,
          sans-serif;
        line-height: 26px;
        font-weight: 400;
        font-style: normal;
        font-size: 20px;
        text-decoration: none;
        text-transform: none;
        letter-spacing: 0;
        direction: ltr;
        color: #333;
        text-align: left;
        mso-line-height-rule: exactly;
        mso-text-raise: 2px;
      }
      .moz-text-html .t3,
      .moz-text-html .t4 {
        mso-line-height-alt: 60px !important;
        line-height: 60px !important;
        display: block !important;
      }
      .moz-text-html .t9 {
        border-radius: 8px !important;
        overflow: hidden !important;
        padding: 60px !important;
      }
      .moz-text-html .t11 {
        padding: 60px !important;
        border-radius: 8px !important;
        overflow: hidden !important;
        width: 480px !important;
      }
      .moz-text-html .t25,
      .moz-text-html .t47,
      .moz-text-html .t57,
      .moz-text-html .t67 {
        width: 600px !important;
      }
    </style>
    <!--[if !mso]><!-->
    <link
      href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;700;800&amp;family=Inter+Tight:wght@900&amp;display=swap"
      rel="stylesheet"
      type="text/css"
    />
    <!--<![endif]-->
    <!--[if mso]>
      <style type="text/css">
        img,
        p {
          margin: 0;
          margin: 0;
          font-family:
            Lato,
            BlinkMacSystemFont,
            Segoe UI,
            Helvetica Neue,
            Arial,
            sans-serif;
          line-height: 22px;
          font-weight: 400;
          font-style: normal;
          font-size: 16px;
          text-decoration: none;
          text-transform: none;
          letter-spacing: 0;
          direction: ltr;
          color: #333;
          text-align: left;
          mso-line-height-rule: exactly;
          mso-text-raise: 2px;
        }
        h1 {
          margin: 0;
          margin: 0;
          font-family:
            Roboto,
            BlinkMacSystemFont,
            Segoe UI,
            Helvetica Neue,
            Arial,
            sans-serif;
          line-height: 34px;
          font-weight: 400;
          font-style: normal;
          font-size: 28px;
          text-decoration: none;
          text-transform: none;
          letter-spacing: 0;
          direction: ltr;
          color: #333;
          text-align: left;
          mso-line-height-rule: exactly;
          mso-text-raise: 2px;
        }
        h2 {
          margin: 0;
          margin: 0;
          font-family:
            Lato,
            BlinkMacSystemFont,
            Segoe UI,
            Helvetica Neue,
            Arial,
            sans-serif;
          line-height: 30px;
          font-weight: 400;
          font-style: normal;
          font-size: 24px;
          text-decoration: none;
          text-transform: none;
          letter-spacing: 0;
          direction: ltr;
          color: #333;
          text-align: left;
          mso-line-height-rule: exactly;
          mso-text-raise: 2px;
        }
        h3 {
          margin: 0;
          margin: 0;
          font-family:
            Lato,
            BlinkMacSystemFont,
            Segoe UI,
            Helvetica Neue,
            Arial,
            sans-serif;
          line-height: 26px;
          font-weight: 400;
          font-style: normal;
          font-size: 20px;
          text-decoration: none;
          text-transform: none;
          letter-spacing: 0;
          direction: ltr;
          color: #333;
          text-align: left;
          mso-line-height-rule: exactly;
          mso-text-raise: 2px;
        }
        div.t3,
        div.t4 {
          mso-line-height-alt: 60px !important;
          line-height: 60px !important;
          display: block !important;
        }
        td.t9 {
          border-radius: 8px !important;
          overflow: hidden !important;
          padding: 60px !important;
        }
        td.t11 {
          padding: 60px !important;
          border-radius: 8px !important;
          overflow: hidden !important;
          width: 600px !important;
        }
        td.t25,
        td.t47,
        td.t57,
        td.t67 {
          width: 600px !important;
        }
      </style>
    <![endif]-->
    <!--[if mso]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
  </head>
  <body
    class="t0"
    style="
      min-width: 100%;
      margin: 0px;
      padding: 0px;
      background-color: #f4f4f4;
    "
  >
    <div class="t1" style="background-color: #f4f4f4">
      <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        align="center"
      >
        <tr>
          <td
            class="t2"
            style="
              font-size: 0;
              line-height: 0;
              mso-line-height-rule: exactly;
              background-color: #f4f4f4;
            "
            valign="top"
            align="center"
          >
            <!--[if mso]>
              <v:background
                xmlns:v="urn:schemas-microsoft-com:vml"
                fill="true"
                stroke="false"
              >
                <v:fill color="#F4F4F4" />
              </v:background>
            <![endif]-->
            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              align="center"
              id="innerTable"
            >
              <tr>
                <td>
                  <div
                    class="t3"
                    style="
                      mso-line-height-rule: exactly;
                      font-size: 1px;
                      display: none;
                    "
                  >
                    &nbsp;
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <table
                    class="t10"
                    role="presentation"
                    cellpadding="0"
                    cellspacing="0"
                    align="center"
                  >
                    <tr>
                      <!--[if !mso]><!-->
                      <td
                        class="t11"
                        style="
                          background-color: #ffffff;
                          width: 400px;
                          padding: 40px 40px 40px 40px;
                        "
                      >
                        <!--<![endif]-->
                        <!--[if mso]><td class="t11" style="background-color:#FFFFFF;width:480px;padding:40px 40px 40px 40px;"><![endif]-->
                        <table
                          role="presentation"
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                        >
                          <tr>
                            <td>
                              <table
                                class="t14"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                align="left"
                              >
                                <tr>
                                  <!--[if !mso]><!-->
                                  <td
                                    class="t15"
                                    style="width: 55px; padding: 0 15px 0 0"
                                  >
                                    <!--<![endif]-->
                                    <!--[if mso]><td class="t15" style="width:70px;padding:0 15px 0 0;"><![endif]-->
                                    <div style="font-size: 0px">
                                      <img
                                        class="t21"
                                        style="
                                          display: block;
                                          border: 0;
                                          height: auto;
                                          width: 100%;
                                          margin: 0;
                                          max-width: 100%;
                                        "
                                        width="55"
                                        height="55"
                                        alt=""
                                        src="https://86672bac-a392-46b5-b043-36939e3615d6.b-cdn.net/e/a909c089-08fb-4dec-8ffa-add85225e99d/2770dafc-1e1e-4af6-917b-8e920b460772.png"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div
                                class="t13"
                                style="
                                  mso-line-height-rule: exactly;
                                  mso-line-height-alt: 42px;
                                  line-height: 42px;
                                  font-size: 1px;
                                  display: block;
                                "
                              >
                                &nbsp;
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table
                                class="t24"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                align="center"
                              >
                                <tr>
                                  <!--[if !mso]><!-->
                                  <td class="t25" style="width: 480px">
                                    <!--<![endif]-->
                                    <!--[if mso]><td class="t25" style="width:480px;"><![endif]-->
                                    <h1
                                      class="t31"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family:
                                          BlinkMacSystemFont,
                                          Segoe UI,
                                          Helvetica Neue,
                                          Arial,
                                          sans-serif,
                                          &quot;Albert Sans&quot;;
                                        line-height: 41px;
                                        font-weight: 800;
                                        font-style: normal;
                                        font-size: 39px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -1.56px;
                                        direction: ltr;
                                        color: #333333;
                                        text-align: left;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 1px;
                                      "
                                    >
                                      Konfirmasi Verifikasi Akun Pelajar
                                    </h1>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div
                                class="t23"
                                style="
                                  mso-line-height-rule: exactly;
                                  mso-line-height-alt: 16px;
                                  line-height: 16px;
                                  font-size: 1px;
                                  display: block;
                                "
                              >
                                &nbsp;
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table
                                class="t46"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                align="center"
                              >
                                <tr>
                                  <!--[if !mso]><!-->
                                  <td class="t47" style="width: 480px">
                                    <!--<![endif]-->
                                    <!--[if mso]><td class="t47" style="width:480px;"><![endif]-->
                                    <p
                                      class="t53"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family:
                                          BlinkMacSystemFont,
                                          Segoe UI,
                                          Helvetica Neue,
                                          Arial,
                                          sans-serif,
                                          &quot;Albert Sans&quot;;
                                        line-height: 21px;
                                        font-weight: 400;
                                        font-style: normal;
                                        font-size: 16px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -0.64px;
                                        direction: ltr;
                                        color: #333333;
                                        text-align: left;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 2px;
                                      "
                                    >
                                      Untuk verifikasi status pelajar anda di
                                      sensus PPI Jerman, klik tombol
                                      &quot;Konfirmasi Verifikasi Sensus&quot;
                                      disini. Link ini hanya berlaku dalam waktu
                                      <span
                                        class="t76"
                                        style="
                                          margin: 0;
                                          margin: 0;
                                          mso-line-height-rule: exactly;
                                        "
                                        ><span
                                          class="t75"
                                          style="
                                            margin: 0;
                                            margin: 0;
                                            font-weight: 700;
                                            mso-line-height-rule: exactly;
                                          "
                                          >15 menit.</span
                                        ></span
                                      >
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div
                                class="t32"
                                style="
                                  mso-line-height-rule: exactly;
                                  mso-line-height-alt: 35px;
                                  line-height: 35px;
                                  font-size: 1px;
                                  display: block;
                                "
                              >
                                &nbsp;
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table
                                class="t34"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                align="left"
                              >
                                <tr>
                                  <!--[if !mso]><!-->
                                  <td
                                    class="t35"
                                    style="
                                      background-color: #ebebeb;
                                      border: 1px solid #000;
                                      overflow: hidden;
                                      width: 333px;
                                      text-align: center;
                                      line-height: 40px;
                                      mso-line-height-rule: exactly;
                                      mso-text-raise: 7px;
                                      border-radius: 40px 40px 40px 40px;
                                    "
                                  >
                                    <!--<![endif]-->
                                    <!--[if mso]><td class="t35" style="background-color:#EBEBEB;border:1px solid #000;overflow:hidden;width:335px;text-align:center;line-height:40px;mso-line-height-rule:exactly;mso-text-raise:7px;border-radius:40px 40px 40px 40px;"><![endif]-->
                                    <a
                                      class="t41"
                                      href="${verificationUrl}"
                                      style="
                                        display: block;
                                        margin: 0;
                                        margin: 0;
                                        font-family:
                                          BlinkMacSystemFont,
                                          Segoe UI,
                                          Helvetica Neue,
                                          Arial,
                                          sans-serif,
                                          &quot;Inter Tight&quot;;
                                        line-height: 40px;
                                        font-weight: 900;
                                        font-style: normal;
                                        font-size: 16px;
                                        text-decoration: none;
                                        text-transform: uppercase;
                                        letter-spacing: 1px;
                                        direction: ltr;
                                        color: #000000;
                                        text-align: center;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 7px;
                                      "
                                      target="_blank"
                                      >konfirmasi verifikasi sensus</a
                                    >
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div
                                class="t64"
                                style="
                                  mso-line-height-rule: exactly;
                                  mso-line-height-alt: 35px;
                                  line-height: 35px;
                                  font-size: 1px;
                                  display: block;
                                "
                              >
                                &nbsp;
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table
                                class="t66"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                align="center"
                              >
                                <tr>
                                  <!--[if !mso]><!-->
                                  <td class="t67" style="width: 480px">
                                    <!--<![endif]-->
                                    <!--[if mso]><td class="t67" style="width:480px;"><![endif]-->
                                    <p
                                      class="t73"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family:
                                          BlinkMacSystemFont,
                                          Segoe UI,
                                          Helvetica Neue,
                                          Arial,
                                          sans-serif,
                                          &quot;Albert Sans&quot;;
                                        line-height: 21px;
                                        font-weight: 400;
                                        font-style: normal;
                                        font-size: 16px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -0.64px;
                                        direction: ltr;
                                        color: #333333;
                                        text-align: left;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 2px;
                                      "
                                    >
                                      Email ini dikirim oleh
                                      <span
                                        class="t74"
                                        style="
                                          margin: 0;
                                          margin: 0;
                                          font-weight: 700;
                                          mso-line-height-rule: exactly;
                                        "
                                        >sensus.ppijerman.org</span
                                      >
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div
                                class="t54"
                                style="
                                  mso-line-height-rule: exactly;
                                  mso-line-height-alt: 35px;
                                  line-height: 35px;
                                  font-size: 1px;
                                  display: block;
                                "
                              >
                                &nbsp;
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table
                                class="t56"
                                role="presentation"
                                cellpadding="0"
                                cellspacing="0"
                                align="center"
                              >
                                <tr>
                                  <!--[if !mso]><!-->
                                  <td class="t57" style="width: 480px">
                                    <!--<![endif]-->
                                    <!--[if mso]><td class="t57" style="width:480px;"><![endif]-->
                                    <p
                                      class="t63"
                                      style="
                                        margin: 0;
                                        margin: 0;
                                        font-family:
                                          BlinkMacSystemFont,
                                          Segoe UI,
                                          Helvetica Neue,
                                          Arial,
                                          sans-serif,
                                          &quot;Albert Sans&quot;;
                                        line-height: 21px;
                                        font-weight: 400;
                                        font-style: normal;
                                        font-size: 16px;
                                        text-decoration: none;
                                        text-transform: none;
                                        letter-spacing: -0.64px;
                                        direction: ltr;
                                        color: #333333;
                                        text-align: left;
                                        mso-line-height-rule: exactly;
                                        mso-text-raise: 2px;
                                      "
                                    >
                                      Tidak mendaftar? Kontak kami di -&gt;
                                      it@ppijerman.org
                                    </p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    class="t4"
                    style="
                      mso-line-height-rule: exactly;
                      font-size: 1px;
                      display: none;
                    "
                  >
                    &nbsp;
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>
.
`,
      });

      // Return success response after sending the email
      return {
        success: true,
        message: "Verification token generated and email sent successfully.",
        lastSentAt: now,
      };
    } catch {
      return {
        success: false,
        message: "Failed to generate and send verification token.",
      };
    }
  });
