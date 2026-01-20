import { useState } from "react";

const AdminSettings = () => {
  /* ================= PROFILE ================= */
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [adminProfile, setAdminProfile] = useState({
    name: "Admin User",
    email: "admin@company.com",
    phone: "+1 234-567-8900",
    role: "Admin",
  });

  /* ================= PASSWORD (OTP ONLY) ================= */
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  /* ================= HANDLERS ================= */

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminProfile({ ...adminProfile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    console.log("Profile updated:", adminProfile);
    alert("Profile updated successfully");
  };

  const sendOtp = () => {
    setOtpSent(true);
    setOtpVerified(false);
    alert("OTP sent to admin email address");
  };

  const verifyOtp = () => {
    if (otp.length === 6) {
      setOtpVerified(true);
      alert("OTP verified successfully");
    } else {
      alert("Invalid OTP");
    }
  };

  const savePassword = () => {
    if (!otpVerified) {
      alert("OTP verification required");
      return;
    }

    console.log("Password updated:", passwords);

    setIsEditingPassword(false);
    setPasswords({ oldPassword: "", newPassword: "" });
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);

    alert("Password updated successfully");
  };

  return (
    <div className="page">
      {/* ================= HEADER ================= */}
      <div className="page-header">
        <div>
          <h2>Admin Settings</h2>
          <p className="page-subtitle">
            Manage admin profile and authentication
          </p>
        </div>
      </div>

      {/* ================= PROFILE SETTINGS ================= */}
      <div className="card">
        <h3>Profile</h3>

        <div style={{ display: "grid", gap: 14, marginTop: 12 }}>
          <div>
            <div className="text-muted">Admin Name</div>
            <div>{adminProfile.name}</div>
          </div>

          <div>
            <div className="text-muted">Admin Email</div>
            <input
              className="input"
              name="email"
              value={adminProfile.email}
              onChange={handleProfileChange}
            />
          </div>

          <div>
            <div className="text-muted">Admin Phone Number</div>
            <input
              className="input"
              name="phone"
              value={adminProfile.phone}
              onChange={handleProfileChange}
            />
          </div>

          <div>
            <div className="text-muted">Role</div>
            <div>{adminProfile.role}</div>
          </div>

          <div>
            <div className="text-muted">Password</div>
            <div>••••••••</div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
          <button className="btn primary" onClick={saveProfile}>
            Save Profile
          </button>

          {!isEditingPassword && (
            <button
              className="btn"
              onClick={() => setIsEditingPassword(true)}
            >
              Change Password
            </button>
          )}
        </div>

        {/* ================= PASSWORD SECTION ================= */}
        {isEditingPassword && (
          <>
            <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
              <div>
                <label className="text-muted">Old Password</label>
                <input
                  className="input"
                  type="password"
                  name="oldPassword"
                  value={passwords.oldPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div>
                <label className="text-muted">New Password</label>
                <input
                  className="input"
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            {/* OTP */}
            <div style={{ marginTop: 16 }}>
              {!otpSent ? (
                <button className="btn success" onClick={sendOtp}>
                  Send OTP to Email
                </button>
              ) : (
                <>
                  <label className="text-muted">Enter OTP</label>
                  <input
                    className="input"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />

                  <button
                    className="btn success"
                    style={{ marginTop: 8 }}
                    onClick={verifyOtp}
                  >
                    Verify OTP
                  </button>
                </>
              )}
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              <button
                className="btn success"
                disabled={!otpVerified}
                onClick={savePassword}
              >
                Save Password
              </button>

              <button
                className="btn"
                onClick={() => setIsEditingPassword(false)}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {/* ================= DANGER ZONE ================= */}
      <div
        className="card"
        style={{ border: "1px solid #fecaca", background: "#fff1f2" }}
      >
        <h3 style={{ color: "#b91c1c" }}>Danger Zone</h3>

        <p style={{ color: "#7f1d1d" }}>
          These actions are irreversible. Please proceed with caution.
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="btn"
            style={{ borderColor: "#ef4444", color: "#ef4444" }}
          >
            Clear All Data
          </button>

          <button
            className="btn"
            style={{
              background: "#ef4444",
              borderColor: "#ef4444",
              color: "#fff",
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;












































