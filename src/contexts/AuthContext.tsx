"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = useCallback(async (firebaseUser: FirebaseUser) => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data() as User);
      } else {
        // Create user doc if not exists
        const newUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "",
          role: "user",
        };
        await setDoc(userRef, { ...newUser, createdAt: serverTimestamp() });
        setUserData(newUser);
      }
    } catch {
      console.error("Error fetching user data");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserData(firebaseUser);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [fetchUserData]);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back");
      router.push("/");
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === "auth/invalid-credential") {
        toast.error("Invalid email or password");
      } else {
        toast.error("Sign in failed. Please try again.");
      }
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(newUser, { displayName: name });
      const userRef = doc(db, "users", newUser.uid);
      await setDoc(userRef, {
        uid: newUser.uid,
        email,
        name,
        role: "user",
        createdAt: serverTimestamp(),
      });
      toast.success("Account created successfully");
      router.push("/");
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err.code === "auth/email-already-in-use") {
        toast.error("An account with this email already exists");
      } else {
        toast.error("Sign up failed. Please try again.");
      }
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user: googleUser } = await signInWithPopup(auth, provider);
      const userRef = doc(db, "users", googleUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: googleUser.uid,
          email: googleUser.email,
          name: googleUser.displayName,
          role: "user",
          createdAt: serverTimestamp(),
        });
      }
      toast.success("Welcome");
      router.push("/");
    } catch {
      toast.error("Google sign in failed");
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserData(null);
      toast.success("Signed out");
      router.push("/");
    } catch {
      toast.error("Sign out failed");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
    } catch {
      toast.error("Failed to send reset email");
    }
  };

  const isAdmin = userData?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        isAdmin,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
