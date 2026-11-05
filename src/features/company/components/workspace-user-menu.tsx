"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignOut } from "@phosphor-icons/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth/client";

function getInitials(name: string, email: string) {
  const source = name.trim() || email;
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function WorkspaceUserMenu({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    const { error } = await authClient.signOut();
    if (error) {
      setIsSigningOut(false);
      return;
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <AlertDialog>
      <div className="flex items-center gap-3 rounded-md p-2 text-left">
        <Avatar className="size-8">
          <AvatarFallback>{getInitials(name, email)}</AvatarFallback>
        </Avatar>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{name || email}</span>
          <span className="block truncate text-xs text-muted-foreground">{email}</span>
        </span>
        <AlertDialogTrigger
          aria-label="Sign out"
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Sign out"
        >
          <SignOut size={17} />
        </AlertDialogTrigger>
      </div>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of Mini ERP?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access your workspaces.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSigningOut}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isSigningOut} onClick={signOut}>
              <SignOut size={16} />
              {isSigningOut ? "Signing out…" : "Sign out"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
}
