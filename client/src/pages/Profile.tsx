import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";

import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const [profile, setProfile] = useState<{ name: string; role: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchProfile = async () => {
    setLoading(true);

    try {
      const response = await api.get("/auth/profile");
      if (response.status === 200) {
        setProfile(response.data.user);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogOut = async () => {
    try {
      await logout();
      setProfile(null);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-[calc(100vh-5rem)] max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center gap-4">
        <div className="size-28 rounded-full overflow-hidden">
          <img
            src="/profile.png"
            alt="Profile Picture"
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{profile?.name}</h2>
          <p className="capitalize">{profile?.role}</p>
        </div>
      </div>
      <div>
        <Button onClick={handleLogOut}>Log Out</Button>
      </div>
    </div>
  );
};

export default Profile;
