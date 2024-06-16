import { UserProfile } from "@clerk/nextjs";
import React from "react";

type Props = {};

export default function UserProfilePage({}: Props) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <UserProfile path="/user-profile" />
    </div>
  );
}
