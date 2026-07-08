import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const servicesPath = path.join(process.cwd(), "services.json");
const services = JSON.parse(fs.readFileSync(servicesPath, "utf-8"));

function findService(userMessage) {
  const message = userMessage.toLowerCase();

  for (const service of services) {
    const allKeywords = [...service.keywords_ar, ...service.keywords_en];

    for (const keyword of allKeywords) {
      if (message.includes(keyword.toLowerCase())) {
        return service;
      }
    }
  }

  return null;
}

function detectLanguage(text) {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text) ? "ar" : "en";
}

const systemPrompt = `
أنت مساعد بنكي ذكي داخل تطبيق بنك.
مهمتك فقط مساعدة العميل في الوصول إلى الخدمات البنكية داخل التطبيق.

قواعد الأمان:
- لا تطلب الرقم السري.
- لا تطلب رمز OTP.
- لا تطلب رقم البطاقة كامل.
- لا تنفذ أي عملية مالية.
- فقط أرشد المستخدم إلى مكان الخدمة داخل التطبيق.

إذا كانت رسالة المستخدم بالعربية، أجب بالعربية فقط.
إذا كانت رسالة المستخدم بالإنجليزية، أجب بالإنجليزية فقط.
اجعل الرد مختصرًا وواضحًا.
`;

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
  const language = detectLanguage(userMessage);
  const msg = userMessage.toLowerCase();
if (
    msg.includes("مدى") ||
    msg.includes("فيزا") ||
    msg.includes("visa") ||
    msg.includes("الجاري") ||
    msg.includes("الادخار") ||
    msg.includes("تمويل")
  ) {
    return res.json({
      reply: getLocalReply(userMessage),
    });
  }

    const matchedService = findService(userMessage);

  if (matchedService) {
    return res.json({
      type: "service_steps",
      service: matchedService,
      language,
    });
  }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `${systemPrompt}

رسالة العميل:
${userMessage}`,
    });

    return res.json({
      reply: response.text,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      reply: getLocalReply(req.body.message),
    });
  }
});

function getLocalReply(message) {
  const msg = message.toLowerCase();

  if (msg.includes("تحويل") || msg.includes("احول") || msg.includes("فلوس")) {
    return `تحويل الأموال

اتبع الخطوات التالية لإتمام عملية التحويل:

1. افتح تطبيق البنك.
2. انتقل إلى قائمة "التحويلات".
3. اختر نوع التحويل المناسب.
4. حدد المستفيد.
5. أدخل مبلغ التحويل.
6. راجع البيانات ثم أكد العملية.

ملاحظة:
قد يطلب منك التطبيق التحقق من العملية باستخدام رمز التحقق.`;
  }

  if (msg.includes("مستفيد")) {
    return `إضافة مستفيد

لإضافة مستفيد جديد:

1. افتح قائمة "المستفيدون".
2. اختر "إضافة مستفيد".
3. أدخل بيانات المستفيد المطلوبة.
4. تحقق من صحة البيانات.
5. قم بتفعيل المستفيد.
6. بعد التفعيل يمكنك البدء بإجراء التحويلات إليه.`;
  }


  if ((msg.includes("مدى") && msg.includes("فيزا")) || msg.includes("visa")) {
  return `الفرق بين بطاقة مدى وبطاقة فيزا

بطاقة مدى

• مرتبطة مباشرة بالحساب الجاري.

• يتم خصم قيمة العمليات مباشرة من رصيد الحساب.

• مناسبة للمشتريات والسحب داخل المملكة.


بطاقة فيزا

• يمكن استخدامها محليًا ودوليًا.

• تدعم الشراء عبر الإنترنت والمتاجر العالمية.

• مناسبة للسفر والعمليات الدولية.


يمكنك اختيار البطاقة المناسبة حسب احتياجك للاستخدام اليومي أو الدولي.`;
}

  if (msg.includes("الجاري") || msg.includes("الادخار")) {
  return `الفرق بين الحساب الجاري وحساب الادخار

الحساب الجاري
----------------
• مناسب للعمليات اليومية.
• يدعم الإيداع والسحب والتحويل.
• يستخدم لاستقبال الرواتب والمدفوعات.

حساب الادخار
----------------
• مخصص لتوفير الأموال.
• يساعد على تنظيم وتنمية المدخرات.
• قد يقدم مزايا أو عوائد وفق سياسة البنك.

اختر الحساب الجاري إذا كنت تحتاجه للاستخدام اليومي، واختر حساب الادخار إذا كان هدفك الادخار.`;
}

  if (msg.includes("تمويل")) {
 return `أنواع التمويل

يوفر البنك عدة أنواع من التمويل:

1. التمويل الشخصي
مناسب لتغطية الاحتياجات الشخصية المختلفة.

2. التمويل العقاري
مخصص لشراء أو بناء العقارات.

3. تمويل المركبات
يساعد على شراء سيارة جديدة أو مستعملة.

4. تمويل الأعمال
مخصص لدعم المشاريع والأنشطة التجارية.

يمكنك الاطلاع على الشروط والتفاصيل من خلال قسم "التمويل" داخل التطبيق.`;
}

if (msg.includes("كشف") || msg.includes("الحساب") || msg.includes("العمليات")) {
    return `كشف الحساب

للاطلاع على كشف الحساب:

1. افتح قائمة "الحسابات".
2. اختر الحساب المطلوب.
3. اضغط على "كشف الحساب".
4. حدد الفترة الزمنية.
5. اعرض أو قم بتنزيل كشف الحساب إذا كان متاحًا.`;
  }

  return `عذرًا، لم أتمكن من فهم طلبك.

يمكنني مساعدتك في الاستفسارات المتعلقة بـ:
- التحويلات
- الحسابات
- البطاقات
- التمويل
- كشف الحساب
- إضافة المستفيدين`;
}

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});