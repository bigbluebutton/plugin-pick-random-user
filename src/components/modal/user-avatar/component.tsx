import * as React from 'react';
import * as Styled from './styles';

const FALLBACK_AVATAR_COLORS = ['#4E7FF8', '#2BA084', '#E07A3A', '#7B61D9', '#D4733B'];

function getAvatarColorFallback(name: string): string {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_AVATAR_COLORS[hash % FALLBACK_AVATAR_COLORS.length];
}

interface AvatarUser {
  name: string;
  avatar: string;
  color: string;
  role: string;
}

interface UserAvatarProps {
  user: AvatarUser;
  size: 'small' | 'large';
}

export function UserAvatar({ user, size }: UserAvatarProps) {
  const color = user.color || getAvatarColorFallback(user.name);
  const initials = user.name.slice(0, 2);
  const isModerator = user.role === 'MODERATOR';

  if (user.avatar) {
    return (
      <Styled.AvatarImage
        src={user.avatar}
        alt={user.name}
        $size={size}
        $isModerator={isModerator}
        $color={color}
      />
    );
  }
  return (
    <Styled.AvatarInitials $size={size} $color={color} $isModerator={isModerator}>
      {initials}
    </Styled.AvatarInitials>
  );
}
