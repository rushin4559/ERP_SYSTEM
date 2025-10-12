import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function isTypingInField(e) {
  return (
    e.target.tagName === "INPUT" ||
    e.target.tagName === "TEXTAREA" ||
    e.target.isContentEditable
  );
}

export default function useNavbarShortcuts({
  masterDropdown,
  adminDropdown,
  setMasterDropdown,
  setAdminDropdown,
  user,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(e) {
      if (isTypingInField(e)) return;

      const key = e.key.toLowerCase();

      // Navigate Home (no dropdown)
      if (key === "h") {
        setMasterDropdown(false);
        setAdminDropdown(false);
        navigate("/home");
      }

      // Navigate Profile (no dropdown)
      if (key === "p") {
        setMasterDropdown(false);
        setAdminDropdown(false);
        navigate("/profile");
      }

      // Open Master dropdown, close Admin
      if (key === "m") {
        setMasterDropdown(true);
        setAdminDropdown(false);
      }

      // Customers only if Master dropdown open
      if (key === "c" && masterDropdown) {
        navigate("/customers");
        setMasterDropdown(false);
      }

      // Open Admin dropdown, close Master (only admin)
      if (key === "a" && user?.role === "admin") {
        setAdminDropdown(true);
        setMasterDropdown(false);
      }

      // Users under Admin dropdown open (only admin)
      if (key === "u" && adminDropdown && user?.role === "admin") {
        navigate("/admin/users");
        setAdminDropdown(false);
      }

      // Logs under Admin dropdown open (only admin)
      if (key === "l" && adminDropdown && user?.role === "admin") {
        navigate("/admin/logs");
        setAdminDropdown(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    masterDropdown,
    adminDropdown,
    setMasterDropdown,
    setAdminDropdown,
    navigate,
    user,
  ]);
}
