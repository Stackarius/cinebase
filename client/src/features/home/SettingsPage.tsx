import { useEffect, useState, type FormEvent } from "react";
import PageContainer from "../../components/layout/PageContainer";
import { getAuthErrorMessage } from "../auth/auth.api";
import { getProfile, updateProfile, type UserProfile } from "../users/users.api";

const SettingsPage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getProfile();
        if (!cancelled) {
          setProfile(result);
          setName(result.name);
          setEmail(result.email);
        }
      } catch (requestError) {
        console.error("Failed to load account settings:", requestError);
        if (!cancelled) setError(getAuthErrorMessage(requestError, "Your account details could not be loaded."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadProfile();
    return () => {
      cancelled = true;
    };
  }, [retry]);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updatedProfile = await updateProfile({ name: name.trim(), email: email.trim() });
      setProfile(updatedProfile);
      setName(updatedProfile.name);
      setEmail(updatedProfile.email);
      setSuccess("Your account details have been updated.");
    } catch (requestError) {
      console.error("Failed to update account settings:", requestError);
      setError(getAuthErrorMessage(requestError, "Your account details could not be saved."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer
      title="Settings"
      description="Manage the name and email address associated with your Cinebase account."
    >
      {loading ? (
        <p role="status" className="py-10 text-white/70">Loading account settings...</p>
      ) : error && !profile ? (
        <div role="alert" className="rounded-2xl border border-red-300/20 bg-red-300/5 p-6 text-red-100">
          <p>{error}</p>
          <button type="button" onClick={() => setRetry((count) => count + 1)} className="mt-4 rounded-lg bg-white/10 px-4 py-2 font-semibold hover:bg-white/15">
            Try again
          </button>
        </div>
      ) : profile ? (
        <form onSubmit={saveProfile} className="max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-7">
          <label htmlFor="settings-name" className="block text-sm font-semibold text-white/80">Name</label>
          <input
            id="settings-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            minLength={2}
            maxLength={50}
            className="mt-2 w-full rounded-xl border border-white/15 bg-gray-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
          />

          <label htmlFor="settings-email" className="mt-5 block text-sm font-semibold text-white/80">Email</label>
          <input
            id="settings-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-white/15 bg-gray-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
          />

          <p className="mt-5 text-xs text-white/45">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
          {error && <p role="alert" className="mt-4 text-sm text-red-200">{error}</p>}
          {success && <p role="status" className="mt-4 text-sm text-emerald-200">{success}</p>}
          <button
            type="submit"
            disabled={saving || (name.trim() === profile.name && email.trim() === profile.email)}
            className="mt-5 rounded-xl bg-cyan-300 px-5 py-3 font-bold text-gray-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      ) : null}
    </PageContainer>
  );
};

export default SettingsPage;
