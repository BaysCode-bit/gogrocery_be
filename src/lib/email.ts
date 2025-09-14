import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import mjml2html from "mjml";
import { EMAIL_USER, EMAIL_PASS } from "../config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      "src",
      "templates",
      `${options.template}.mjml`
    );
    const source = fs.readFileSync(templatePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const mjmlContent = template(options.data);
    const { html } = mjml2html(mjmlContent);

    await transporter.sendMail({
      from: `"GoGrocery" <${EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
