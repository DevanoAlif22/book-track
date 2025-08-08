export const formatLastUpdated = (lastUpdated: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - lastUpdated.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Baru saja diperbarui";
  if (diffInMinutes < 60) return `Diperbarui ${diffInMinutes} menit yang lalu`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Diperbarui ${diffInHours} jam yang lalu`;

  return lastUpdated.toLocaleDateString("id-ID");
};
