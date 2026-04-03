import { env } from "../config";
import nodemailer, { SentMessageInfo } from "nodemailer"
import path from 'path'
import ejs from 'ejs'
import { AppError } from "../errors/app.errors";
import status from "http-status";

const transporter = nodemailer.createTransport({
  host: env.smtp_host,
  port: env.smtp_port,
  secure: true, // Start unencrypted, upgrade via STARTTLS
  auth: {
    user: env.smtp_user,
    pass: env.smtp_pass,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string,
  templateName: string,
  templateData?: Record<string, unknown>,
  attachments?: {
    filename: string,
    content: Buffer | string,
    contentType: string
  }[]
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData = {},
  attachments,
}: SendEmailOptions): Promise<SentMessageInfo> => {
  try {
    if (!templateName) {
      throw new AppError(status.BAD_REQUEST, "templateName is required")
    }

    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
    const html = (await ejs.renderFile(templatePath, templateData)) as string

    const info = await transporter.sendMail({
      from: env.smtp_from,
      to,
      subject,
      html,
      attachments: attachments?.map(at => ({
        filename: at.filename,
        content: at.content,
        contentType: at.contentType,
      })),
    })

    // eslint-disable-next-line no-console
    console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`)

    return info
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error"

    // eslint-disable-next-line no-console
    console.log("email sending error", errMsg)

    throw new AppError(status.BAD_GATEWAY, `email error: ${errMsg}`)
  }
}