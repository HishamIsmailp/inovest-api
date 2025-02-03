export function generateAvatarUrl(name: string): string {
  const username = name.split(" ").join("+");
  return `https://avatar.iran.liara.run/username?username=${username}`;
}
