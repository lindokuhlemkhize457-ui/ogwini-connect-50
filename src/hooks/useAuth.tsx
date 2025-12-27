import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type AppRole = "learner" | "teacher" | "grade_head" | "principal" | "admin";

interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  id_number: string | null;
  grade: string | null;
  class: string | null;
  avatar_url: string | null;
  address: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  parent_email: string | null;
}

interface Registration {
  id: string;
  status: string;
  role: AppRole;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: AppRole | null;
  registration: Registration | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    metadata: { first_name: string; last_name: string; role: AppRole; phone?: string }
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isApproved: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserData = async (userId: string) => {
    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileData) {
      setProfile(profileData as Profile);
    }

    // Fetch role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (roleData) {
      setRole(roleData.role as AppRole);
    }

    // Fetch registration status
    const { data: regData } = await supabase
      .from("registrations")
      .select("id, status, role")
      .eq("user_id", userId)
      .maybeSingle();

    if (regData) {
      setRegistration(regData as Registration);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Defer data fetching
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setRole(null);
          setRegistration(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    metadata: { first_name: string; last_name: string; role: AppRole; phone?: string }
  ) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata,
      },
    });

    if (error) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    toast({
      title: "Account Created!",
      description: "Your registration is pending approval. You'll be notified once approved.",
    });

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
    setRegistration(null);
  };

  const isApproved = registration?.status === "approved" && role !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        registration,
        loading,
        signUp,
        signIn,
        signOut,
        isApproved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper hook to redirect based on role
export function useRoleRedirect() {
  const { role, isApproved, loading, registration } = useAuth();
  const navigate = useNavigate();

  const redirectToDashboard = () => {
    if (!isApproved) {
      navigate("/portal");
      return;
    }

    switch (role) {
      case "learner":
        navigate("/dashboard/learner");
        break;
      case "teacher":
        navigate("/dashboard/teacher");
        break;
      case "grade_head":
        navigate("/dashboard/grade-head");
        break;
      case "principal":
        navigate("/dashboard/principal");
        break;
      case "admin":
        navigate("/dashboard/admin");
        break;
      default:
        navigate("/portal");
    }
  };

  return { redirectToDashboard, role, isApproved, loading, registration };
}
