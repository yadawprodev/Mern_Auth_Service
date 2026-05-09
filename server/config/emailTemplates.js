export const welcomeTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Yadaw</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f4f7fb;
      font-family: Arial, sans-serif;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="padding: 40px 0"
    >
      <tr>
        <td align="center">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            "
          >
            <!-- Header -->
            <tr>
              <td
                align="center"
                style="
                  background: linear-gradient(135deg, #2563eb, #7c3aed);
                  padding: 45px 20px;
                  color: white;
                "
              >
                <h1 style="margin: 0; font-size: 32px">
                  Welcome, {{USERNAME}} 🎉
                </h1>

                <p style="margin-top: 12px; opacity: 0.9; font-size: 16px">
                  Your account has been successfully created
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 40px 35px; color: #333333">
                <p style="font-size: 16px; line-height: 1.7">
                  Hi {{USERNAME}},
                </p>

                <p style="font-size: 16px; line-height: 1.7">
                  Welcome to <strong>Yadaw</strong>! We're excited to have you
                  join our community.
                </p>

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    margin: 30px 0;
                    background: #f9fafb;
                    border-radius: 10px;
                    padding: 20px;
                  "
                >
                  <tr>
                    <td>
                      <p
                        style="
                          margin: 0;
                          font-size: 14px;
                          color: #6b7280;
                        "
                      >
                        Registered Email
                      </p>

                      <p
                        style="
                          margin-top: 8px;
                          font-size: 18px;
                          font-weight: bold;
                          color: #111827;
                        "
                      >
                        {{EMAIL}}
                      </p>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 16px; line-height: 1.7">
                  You can now securely access your account and explore the
                  platform.
                </p>

                <div style="text-align: center; margin: 40px 0">
                  <a
                    href="https://yourwebsite.com"
                    style="
                      display: inline-block;
                      background: #2563eb;
                      color: white;
                      text-decoration: none;
                      padding: 14px 32px;
                      border-radius: 999px;
                      font-size: 16px;
                      font-weight: bold;
                    "
                  >
                    Get Started
                  </a>
                </div>

                <p
                  style="
                    font-size: 14px;
                    color: #6b7280;
                    line-height: 1.6;
                  "
                >
                  If you did not create this account, please contact support
                  immediately.
                </p>

                <p style="margin-top: 35px; font-size: 16px">
                  — The Yadaw Team
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                align="center"
                style="
                  background: #f9fafb;
                  padding: 20px;
                  color: #9ca3af;
                  font-size: 12px;
                "
              >
                © ${new Date().getFullYear()} Yadaw. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export const generateOtpTemplate = ({
  title,
  message,
  otp,
  accentColor,
  warningMessage,
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f4f7fb;
          font-family: Arial, sans-serif;
        "
      >
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="padding: 40px 0"
        >
          <tr>
            <td align="center">
              <table
                width="600"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                "
              >
                <!-- Header -->
                <tr>
                  <td
                    align="center"
                    style="
                      background: ${accentColor};
                      padding: 40px 20px;
                      color: white;
                    "
                  >
                    <h1 style="margin: 0; font-size: 28px">
                      ${title}
                    </h1>

                    <p style="margin-top: 10px; opacity: 0.9">
                      ${message}
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 35px; color: #333333">
                    <p style="font-size: 16px; line-height: 1.6">
                      Hi there,
                    </p>

                    <p style="font-size: 16px; line-height: 1.6">
                      ${message}
                    </p>

                    <!-- OTP BOX -->
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="margin: 30px 0"
                    >
                      <tr>
                        <td align="center">
                          <div
                            style="
                              display: inline-block;
                              background: #f3f4f6;
                              border: 2px dashed ${accentColor};
                              border-radius: 10px;
                              padding: 18px 35px;
                              font-size: 32px;
                              font-weight: bold;
                              letter-spacing: 8px;
                              color: ${accentColor};
                            "
                          >
                            ${otp}
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p
                      style="
                        font-size: 14px;
                        color: #666666;
                        line-height: 1.6;
                      "
                    >
                      This OTP will expire in
                      <strong>10 minutes</strong>.
                    </p>

                    <p
                      style="
                        font-size: 14px;
                        color: #666666;
                        line-height: 1.6;
                      "
                    >
                      ${warningMessage}
                    </p>

                    <p style="margin-top: 35px; font-size: 16px">
                      — Yadaw's Team
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    align="center"
                    style="
                      background: #f9fafb;
                      padding: 20px;
                      color: #9ca3af;
                      font-size: 12px;
                    "
                  >
                    © ${new Date().getFullYear()} Yadaw App. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};
