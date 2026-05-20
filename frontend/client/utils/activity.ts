export type ActivityType = "scanned" | "classified" | "downloaded" | "deleted";

export interface Activity {
  id: number;
  type: ActivityType;
  document: string;
  category?: string;
  timestamp: string;
}

// Get user-specific localStorage key
const getActivityKey = (): string => {
  try {
    const user = JSON.parse(localStorage.getItem("scanify_user") || "{}");
    return user.id ? `activities_${user.id}` : "activities_guest";
  } catch {
    return "activities_guest";
  }
};

export const logActivity = (type: ActivityType, documentName: string, category?: string) => {
  try {
    const key = getActivityKey();
    const existingActivities: Activity[] = JSON.parse(localStorage.getItem(key) || "[]");

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const newActivity: Activity = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      type,
      document: documentName,
      category,
      timestamp: formattedDate,
    };

    localStorage.setItem(key, JSON.stringify([newActivity, ...existingActivities]));
  } catch (error) {
    console.error("Failed to append activity logs:", error);
  }
};

export const getActivities = (): Activity[] => {
  try {
    const key = getActivityKey();
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

export const deleteActivity = (id: number): Activity[] => {
  const key = getActivityKey();
  const updated = getActivities().filter(a => a.id !== id);
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
};

export const clearAllActivities = (): void => {
  const key = getActivityKey();
  localStorage.setItem(key, JSON.stringify([]));
};