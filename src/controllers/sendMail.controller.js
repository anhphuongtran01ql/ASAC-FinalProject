const nodemailer = require("nodemailer");

const emailTemplate = (name) =>{
    return `<div style="font-family: Poppins;">
  <!--   HEADER   -->
  <table role="header" width="100%">
    <tr>
      <td bgcolor="#003BB3" style="padding: 40px 64px; font-size: 14px;">
        <h2 style="font-weight: 700; color: #fff;">
          [Devplus] Thank you letter
        </h2>
      </td>
    </tr>
  </table>

  <!--   CONTENT   -->
  <table role="content" style="padding: 80px 64px; color: #363740;">
    <tr>
      <td style="padding-bottom: 30px;">
        Dear Mr/Ms ${name},
      </td>
    </tr>

    <tr>
      <td style="padding-bottom: 15px;">
        Thank you for the interest you’ve shown in a career opportunity with our
        firm.
        <br />
        <br />
        We were fortunate to have interviewed a number of applicants with strong
        backgrounds such as yours, making our selection process difficult. Be
        assured that your résumé has received our full attention. While your
        background is interesting, unfortunately we have no openings that are a
        match for your skills and experience.<br />
        <br />We would like to again thank you for your interest in our firm and
        wish you continued success in pursuit of your career objectives.
      </td>
    </tr>

    <tr>
      <td style="line-height: 30px;">
        <span>Yours truly,</span> <br />
        <span style="font-weight: 600;">The DEVPLUS Team</span>
      </td>
    </tr>
  </table>

  <!--    FOOTER    -->
  <table role="footer" width="100%">
    <tr align="center">
      <td style="background: #003bb3; padding: 40px 0;">
        <div style="padding-bottom: 34px;">
          <a href="#">
            <img
              style="padding-right: 40px;"
              src="https://res.cloudinary.com/dtsjiqrgd/image/upload/v1636711876/facebook_yl5wto.png"
              alt="facebook-icon"
            />
          </a>
          <a href="#">
            <img
              style="padding-right: 40px;"
              src="https://res.cloudinary.com/dtsjiqrgd/image/upload/v1636711926/instagram_vfnpyx.png"
              alt="instagram-icon"
            />
          </a>
          <a href="#">
            <img
              style="padding-right: 40px;"
              src="https://res.cloudinary.com/dtsjiqrgd/image/upload/v1636712047/twitter_kfu6bd.png"
              alt="twitter-icon"
            />
          </a>
          <a href="#">
            <img
              src="https://res.cloudinary.com/dtsjiqrgd/image/upload/v1636712011/linked-in_gkbnuo.png"
              alt="linked-in-icon"
            />
          </a>
        </div>

        <div style="color: #fff; font-weight: 300; padding-bottom: 34px;">
          <span
            >You are receiving this email because you are opted into DEVPLUS
            updates. <br />
            © 2022, DEVPLUS . All rights reserved.
          </span>
        </div>

        <div style="color: #fff; font-weight: 300;">
          <a href="#" style="text-decoration: none; color: #fff;"
            >Unsubscribe</a
          >
          <span style="padding: 0 16px;">|</span>
          <a href="#" style="text-decoration: none; color: #fff;"
            >Privacy Policy</a
          >
          <span style="padding: 0 16px;">|</span>
          <a href="#" style="text-decoration: none; color: #fff;"
            >Help Center</a
          >
        </div>
      </td>
    </tr>
  </table>
</div>`
}

exports.sendMail= async (email, name) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "quang.nguyen@stunited.vn",
            pass: "thanhngu."
        }
    });

    await transporter.sendMail({
        from: 'Quang dz',
        to: email,
        subject: 'Thanks for booking Schedule',
        html: emailTemplate(name)
    });
}
// create transporter object with smtp server details
