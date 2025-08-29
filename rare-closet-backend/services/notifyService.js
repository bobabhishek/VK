import dotenv from "dotenv";
dotenv.config();

let twilioClient = null;
const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
if (sid && token) {
  try {
    const twilio = await import("twilio");
    twilioClient = twilio.default(sid, token);
  } catch (err) {
    console.warn("[notify] Twilio not available:", err?.message || err);
  }
}

const adminPhone = process.env.ADMIN_PHONE; // E.164, e.g., +91XXXXXXXXXX
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM; // e.g., whatsapp:+14155238886
const smsFrom = process.env.TWILIO_SMS_FROM; // e.g., +1XXXXXXXXXX

export const sendOrderAlert = async ({ orderId, totalPrice, user }) => {
  const customerName = user?.name || "Customer";
  const customerEmail = user?.email || "";
  const customerPhone = user?.phone || "";
  const text = `New Order: ${orderId}\nBy: ${customerName} (${customerEmail} ${customerPhone})\nTotal: ₹${totalPrice}`;

  // Always log to server for visibility
  console.log("[notify]", text);

  if (!twilioClient || !adminPhone) return;

  try {
    if (whatsappFrom) {
      await twilioClient.messages.create({
        from: whatsappFrom.startsWith("whatsapp:") ? whatsappFrom : `whatsapp:${whatsappFrom}`,
        to: adminPhone.startsWith("whatsapp:") ? adminPhone : `whatsapp:${adminPhone}`,
        body: text,
      });
      return;
    }
  } catch (err) {
    console.warn("[notify] WhatsApp failed:", err?.message || err);
  }

  try {
    if (smsFrom) {
      await twilioClient.messages.create({ from: smsFrom, to: adminPhone, body: text });
    }
  } catch (err) {
    console.warn("[notify] SMS failed:", err?.message || err);
  }
};


