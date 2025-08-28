import { useState, useMemo } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export const AvatarCell = ({ imageSrc, size = 40 }) => {
  const [loading, setLoading] = useState(true);

  const avatarUrl = useMemo(() => {
    if (!imageSrc) return null;
    const isRemote = imageSrc.startsWith("http");
    return isRemote
      ? `${imageSrc}?rnd=${Math.floor(Math.random() * 1000000)}`
      : imageSrc;
  }, [imageSrc]);

  if (!avatarUrl) return null;

  return (
    <div
      className="flex justify-center items-center"
      style={{ width: size, height: size }}
    >
      {loading && (
        <Skeleton
          className="rounded-full"
          style={{ width: size, height: size }}
        />
      )}
      <Avatar
        className={loading ? "hidden" : ""}
        style={{ width: size, height: size }}
      >
        <img
          src={avatarUrl}
          alt="avatar"
          className="object-cover w-full h-full rounded-full"
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </Avatar>
    </div>
  );
};
