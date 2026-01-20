import { getJSON, sendForm, delJSON } from "./api";

export type Achievement = {
  _id: string;
  title: string;
  content?: string;
  link: string;
  photo: string;
  date: string;
  createdAt?: string;
};

/* ================= ACHIEVEMENTS ================= */

export function fetchAchievements() {
  return getJSON<Achievement[]>("/achievements");
}

export function fetchAchievementById(id: string) {
  return getJSON<Achievement>(`/achievements/${id}`);
}

export function createAchievement(data: FormData) {
  return sendForm<Achievement>("/achievements", data, "POST");
}

export function updateAchievement(id: string, data: FormData) {
  return sendForm<Achievement>(`/achievements/${id}`, data, "PUT");
}

export function deleteAchievement(id: string) {
  return delJSON(`/achievements/${id}`);
}
