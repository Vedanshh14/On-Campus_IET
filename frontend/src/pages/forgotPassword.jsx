// src/pages/ForgotPassword.jsx
import {useLocation} from "react-router-dom";


export default function ForgotPassword() {
  const location = useLocation();
  const mail = location.state?.email.trim() ||  "<yourmail@example.com>";
  const defaultMessage = `Hello Team OnCampus,

Please reset the password for my account associated with the email ID: ${mail ? mail : "yourmail@example.com"}

Thank you!`;

  const encodedBody = encodeURIComponent(defaultMessage);
  const mailtoLink = `mailto:vedanshupadhyay1401@gmail.com?subject=Password Reset Request - OnCampus&body=${encodedBody}`;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded text-gray-800">
      <h2 className="text-xl font-bold mb-4">Forgot Password?</h2>

      <p className="mb-4 text-sm font-thin">
        This functionality is not yet automated. For now, you can send us a
        password reset request directly from this page. You will get your new password within 24 hrs. 
        Thanks for cooperating!
      </p>

      <p className="f mb-2">📧 Recipient:</p>
      <p className="mb-4 text-sm font-thin">vedanshupadhyay1401@gmail.com</p>

      <p className=" mb-2">📄 Message Preview:</p>
      <textarea
        className="w-full p-3 border rounded bg-gray-100 text-sm"
        rows="7"
        readOnly
        value={defaultMessage}
      />

      <a
        href={mailtoLink}
        className="block mt-6 bg-blue-600 text-white px-4 py-2 text-center rounded hover:bg-blue-700 transition"
      >
        Open Mail
      </a>
    </div>
  );
}