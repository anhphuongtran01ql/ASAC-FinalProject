const nodemailer = require("nodemailer");

const emailTemplateReject = (name = "") => {
    return `<div style="font-family: Poppins;">
    <!--   HEADER   -->
    <table role="header" width="100%">
      <tr>
        <td
          bgcolor="#45c3d2"
          style="padding: 40px 64px; font-size: 14px;"
          align="center"
        >
          <h2 style="font-weight: 700; color: #fff; padding-top: 10px;">
            [ASAC] CONFIRM AN APPOINTMENT
          </h2>
        </td>
      </tr>
    </table>
  
    <!--   CONTENT   -->
    <table
      role="content"
      style="
        padding: 100px 64px;
        color: #363740;
        display: flex;
        justify-content: center;
      "
      ,
    >
      <tr>
        <td style="padding-bottom: 30px;">
          Dear Mr/Ms ${name},
        </td>
      </tr>
  
      <tr>
        <td style="padding-bottom: 15px;">
          You received this email because you booked an online medical appointment
          on ASAC web.
          <br />
          <br />
          <i
            >Your scheduled appointment was <b>canceled</b> due to some
            mistakes.</i
          >
          We really regret this event. You may continue to schedule another
          appointment on our website.
          <br />
          <br />
          Thank you for trusting and using our service!
        </td>
      </tr>
  
      <tr>
        <td style="line-height: 30px;">
          <span>Yours truly,</span> <br />
          <span style="font-weight: 600;">The ASAC</span>
        </td>
      </tr>
    </table>
  
    <!--    FOOTER    -->
    <table role="footer" width="100%">
      <tr align="center">
        <td style="background: #45c3d2; padding: 40px 0;">
          <div style="color: #fff; font-weight: 300; padding-bottom: 15px;">
            <span>
              © 2022, ASAC . All rights reserved.
            </span>
          </div>
  
          <div style="color: #fff; font-weight: 300;">
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
  </div>
  `
}

const emailTemplateSuccess = (name = "", doctorName = "", date = "", time = "", clinicAddress = "") => {
    return `<div style="font-family: Poppins">
  <!--   HEADER   -->
  <table role="header" width="100%">
    <tr>
      <td
        bgcolor="#45c3d2"
        style="padding: 40px 64px; font-size: 14px"
        align="center"
      >
        <h2 style="font-weight: 700; color: #fff; padding-top: 10px">
          [ASAC] CONFIRM AN APPOINTMENT
        </h2>
      </td>
    </tr>
  </table>

  <!--   CONTENT   -->
  <table
    role="content"
    style="
      padding: 40px 64px;
      color: #363740;
      display: flex;
      justify-content: center;
    "
    ,
  >
    <tr>
      <td style="padding-bottom: 30px">Dear Mr/Ms ${name},</td>
    </tr>

    <tr>
      <td style="padding-bottom: 15px">
        You received this email because you booked an online medical appointment
        on ASAC web.
        <br />
        <br />
        Your appointment had been confirmed <b>successfully</b>.
        <br />
        <br />
        <i>Here is the information of your appointment.</i>
        <br />
        Doctor: ${doctorName}
        <br />
        Date: <b>${date}</b>
        <br />
        Time: <b>${time}</b>
        <br />
        Address clinic: <b>${clinicAddress}</b>
        <br />
        <br />
        <br />
        Thank you for trusting and using our service!
      </td>
    </tr>

    <tr>
      <td style="line-height: 30px">
        <span>Yours truly,</span> <br />
        <span style="font-weight: 600">The ASAC</span>
      </td>
    </tr>
  </table>

  <!--    FOOTER    -->
  <table role="footer" width="100%">
    <tr align="center">
      <td style="background: #45c3d2; padding: 40px 0">
        <div style="color: #fff; font-weight: 300; padding-bottom: 15px">
          <span> © 2022, ASAC . All rights reserved. </span>
        </div>

        <div style="color: #fff; font-weight: 300">
          <a href="#" style="text-decoration: none; color: #fff"
            >Privacy Policy</a
          >
          <span style="padding: 0 16px">|</span>
          <a href="#" style="text-decoration: none; color: #fff">Help Center</a>
        </div>
      </td>
    </tr>
  </table>
</div>
`
}

exports.sendMail = async (email, type, name = "", doctorName = "", date = "", time = "", clinicAddress = "") => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "phuongtagcd19842@fpt.edu.vn",
            pass: "31082001ql"
        }
    });

    await transporter.sendMail({
        from: 'Quang dz',
        to: email,
        subject: 'Thanks for booking Schedule',
        html: type === "success" ? emailTemplateSuccess(name, doctorName, date, time, clinicAddress) : emailTemplateReject(name)
    });
}
// create transporter object with smtp server details
