function QuickActions({ onActionClick }) {
  return (
    <div className="quick-actions">
      <button onClick={() => onActionClick("أبي أحول فلوس")}>💸 تحويل الأموال</button>
      <button onClick={() => onActionClick("أبي أضيف مستفيد")}>👤 إضافة مستفيد</button>
      <button onClick={() => onActionClick("أبي أوقف البطاقة")}>💳 إيقاف البطاقة</button>
      <button onClick={() => onActionClick("أبي كشف حساب")}>📄 كشف الحساب</button>
    </div>
  );
}

export default QuickActions;