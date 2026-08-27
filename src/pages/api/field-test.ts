import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TO_ADDRESS = 'sam@thomasmarketing.solutions';
const FROM_ADDRESS = 'field-test@yonahbaits.com'; // swap for a domain verified in your Resend account when ready

export const POST: APIRoute = async ({ request }) => {
  console.log('Received a POST request');
  try {
    const body = await request.json();
    const { name, email, social, favoriteFlatside } = body ?? {};

    if (!name || !email || !favoriteFlatside || !social) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Name, email, and message are required.' }),
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Please enter a valid email address.' }),
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: TO_ADDRESS,
      replyTo: email,
      subject: `🎣 ${name} Got Reeled In — Razor Field Test`,
      html:  buildEmailHtml({ name, email, favoriteFlatside, social }),
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({ ok: false, error: 'Something went wrong. Please try again.' }),
        { status: 502 }
      );
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Something went wrong. Please try again.' }),
      { status: 500 }
    );
  }
};


function escapeHtml(value: string) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildEmailHtml({
  name,
  email,
  favoriteFlatside,
  social
}: {
  name: string;
  email: string;
  favoriteFlatside: string;
  social: string;
}) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeFlatside = escapeHtml(favoriteFlatside);
  const safeSocial = escapeHtml(social);

  const firstName = escapeHtml(
    name.trim().split(/\s+/)[0] || "there"
  );

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />

  <title>${safeName} Got Reeled In</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background-color:#111111;
    font-family:Arial, Helvetica, sans-serif;
    color:#F5F5F0;
  "
>

  <!-- PREHEADER -->
  <div
    style="
      display:none;
      max-height:0;
      overflow:hidden;
      opacity:0;
      color:transparent;
      visibility:hidden;
    "
  >
    ${safeName} just signed up to help test the YONAH Razor.
  </div>


  <!-- OUTER WRAPPER -->
  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color:#111111;"
  >

    <tr>

      <td
        align="center"
        style="padding:32px 16px 40px;"
      >

        <!-- MAIN CARD -->
        <table
          role="presentation"
          width="600"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width:100%;
            max-width:600px;
            background-color:#191919;
            border:1px solid #2A2A2A;
          "
        >

          <!-- LOGO -->
          <tr>
            <td
              align="center"
              style="
                padding:32px 30px 26px;
                background-color:#191919;
              "
            >

              <img
                src="https://i.imgur.com/haARTNK.png"
                alt="YONAH"
                width="125"
                style="
                  display:block;
                  width:125px;
                  max-width:100%;
                  height:auto;
                  border:0;
                  outline:none;
                  text-decoration:none;
                "
              />

            </td>
          </tr>


          <!-- CHARTREUSE BAR -->
          <tr>
            <td
              style="
                height:5px;
                background-color:#B6FF00;
                font-size:0;
                line-height:0;
              "
            >
              &nbsp;
            </td>
          </tr>


          <!-- HERO -->
          <tr>
            <td
              style="
                padding:42px 36px 36px;
                background-color:#191919;
              "
            >

              <p
                style="
                  margin:0 0 14px;
                  font-size:10px;
                  line-height:1.4;
                  font-weight:700;
                  letter-spacing:0.2em;
                  text-transform:uppercase;
                  color:#B6FF00;
                "
              >
                RAZOR FIELD TEST
              </p>


              <h1
                style="
                  margin:0;
                  font-size:52px;
                  line-height:0.9;
                  font-weight:800;
                  letter-spacing:-0.06em;
                  text-transform:uppercase;
                  color:#F5F5F0;
                "
              >
                GOT<br />
                <span style="color:#B6FF00;">
                  REELED IN.
                </span>
              </h1>


              <p
                style="
                  margin:24px 0 0;
                  max-width:440px;
                  font-size:16px;
                  line-height:1.7;
                  color:#929292;
                "
              >
                A new angler just put their name on the line
                for the YONAH Razor pre-launch field test.
              </p>

            </td>
          </tr>


          <!-- ANGLER -->
          <tr>
            <td
              style="
                padding:0 36px 16px;
                background-color:#191919;
              "
            >

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background-color:#222222;
                  border:1px solid #303030;
                "
              >

                <tr>

                  <td
                    style="
                      padding:22px 24px;
                    "
                  >

                    <p
                      style="
                        margin:0 0 7px;
                        font-size:9px;
                        line-height:1.4;
                        font-weight:700;
                        letter-spacing:0.18em;
                        text-transform:uppercase;
                        color:#777777;
                      "
                    >
                      ANGLER
                    </p>

                    <p
                      style="
                        margin:0;
                        font-size:24px;
                        line-height:1.2;
                        font-weight:700;
                        letter-spacing:-0.03em;
                        color:#F5F5F0;
                      "
                    >
                      ${safeName}
                    </p>

                  </td>

                  <td
                    align="right"
                    valign="middle"
                    style="
                      padding:22px 24px;
                    "
                  >

                    <div
                      style="
                        display:inline-block;
                        padding:7px 10px;
                        background-color:#B6FF00;
                        color:#111111;
                        font-size:8px;
                        line-height:1;
                        font-weight:800;
                        letter-spacing:0.12em;
                        text-transform:uppercase;
                      "
                    >
                      ON THE LINE
                    </div>

                  </td>

                </tr>

              </table>

            </td>
          </tr>

          <!-- DETAILS -->
          <tr>
            <td
              style="
                padding:16px 36px 0;
                background-color:#191919;
              "
            >

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tr>

                  <!-- EMAIL -->
                  <td
                    width="33.33%"
                    valign="top"
                    style="
                      padding:20px 16px 20px 0;
                      border-top:1px solid #303030;
                    "
                  >

                    <p
                      style="
                        margin:0 0 7px;
                        font-size:9px;
                        line-height:1.4;
                        font-weight:700;
                        letter-spacing:0.16em;
                        text-transform:uppercase;
                        color:#777777;
                      "
                    >
                      EMAIL
                    </p>

                    <a
                      href="mailto:${safeEmail}"
                      style="
                        font-size:13px;
                        line-height:1.5;
                        color:#F5F5F0;
                        text-decoration:none;
                        word-break:break-word;
                      "
                    >
                      ${safeEmail}
                    </a>

                  </td>


                  <!-- SOCIAL -->
                  <td
                    width="33.33%"
                    valign="top"
                    style="
                      padding:20px 16px;
                      border-top:1px solid #303030;
                    "
                  >

                    <p
                      style="
                        margin:0 0 7px;
                        font-size:9px;
                        line-height:1.4;
                        font-weight:700;
                        letter-spacing:0.16em;
                        text-transform:uppercase;
                        color:#777777;
                      "
                    >
                      SOCIAL / CHANNEL
                    </p>

                    ${
                      safeSocial
                        ? `
                          <a
                            href="${safeSocial}"
                            target="_blank"
                            style="
                              font-size:13px;
                              line-height:1.5;
                              color:#B6FF00;
                              text-decoration:none;
                              word-break:break-word;
                            "
                          >
                            View Profile ↗
                          </a>
                        `
                        : `
                          <p
                            style="
                              margin:0;
                              font-size:13px;
                              line-height:1.5;
                              color:#666666;
                            "
                          >
                            Not provided
                          </p>
                        `
                    }

                  </td>


                  <!-- FAVORITE BAIT -->
                  <td
                    width="33.33%"
                    valign="top"
                    style="
                      padding:20px 0 20px 16px;
                      border-top:1px solid #303030;
                    "
                  >

                    <p
                      style="
                        margin:0 0 7px;
                        font-size:9px;
                        line-height:1.4;
                        font-weight:700;
                        letter-spacing:0.16em;
                        text-transform:uppercase;
                        color:#777777;
                      "
                    >
                      FAVORITE FLATSIDE
                    </p>

                    <p
                      style="
                        margin:0;
                        font-size:13px;
                        line-height:1.5;
                        color:#B6FF00;
                        font-weight:700;
                      "
                    >
                      ${safeFlatside}
                    </p>

                  </td>

                </tr>

              </table>

            </td>
          </tr>

          <!-- MESSAGE / NEXT STEP -->
          <tr>
            <td
              style="
                padding:10px 36px 38px;
                background-color:#191919;
              "
            >

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tr>

                  <td
                    style="
                      padding:22px 24px;
                      border-left:3px solid #B6FF00;
                      background-color:#222222;
                    "
                  >

                    <p
                      style="
                        margin:0 0 8px;
                        font-size:9px;
                        line-height:1.4;
                        font-weight:700;
                        letter-spacing:0.16em;
                        text-transform:uppercase;
                        color:#777777;
                      "
                    >
                      NEXT CAST
                    </p>

                    <p
                      style="
                        margin:0;
                        font-size:15px;
                        line-height:1.7;
                        color:#BEBEBE;
                      "
                    >
                      ${firstName} is interested in putting Razor
                      through its paces before launch.
                    </p>

                  </td>

                </tr>

              </table>


              <!-- CTA -->
              <table
                role="presentation"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="margin-top:26px;"
              >

                <tr>

                  <td>

                    <a
                      href="mailto:${safeEmail}?subject=Re%3A%20YONAH%20Razor%20Field%20Test"
                      style="
                        display:inline-block;
                        padding:15px 22px;
                        background-color:#B6FF00;
                        color:#111111;
                        font-size:11px;
                        line-height:1.2;
                        font-weight:800;
                        letter-spacing:0.12em;
                        text-transform:uppercase;
                        text-decoration:none;
                      "
                    >
                      Reply to ${firstName}
                      &nbsp;&nbsp;↗
                    </a>

                  </td>

                </tr>

              </table>

            </td>
          </tr>


          <!-- FOOTER -->
          <tr>

            <td
              style="
                padding:22px 36px;
                border-top:1px solid #303030;
                background-color:#151515;
              "
            >

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tr>

                  <td>

                    <p
                      style="
                        margin:0;
                        font-size:9px;
                        line-height:1.6;
                        font-weight:700;
                        letter-spacing:0.15em;
                        text-transform:uppercase;
                        color:#555555;
                      "
                    >
                      YONAH / RAZOR
                    </p>

                  </td>

                  <td align="right">

                    <p
                      style="
                        margin:0;
                        font-size:9px;
                        line-height:1.6;
                        color:#555555;
                      "
                    >
                      PRE-LAUNCH 2026
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

</body>
</html>
`;
}