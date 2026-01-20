import { getJSON, sendForm, delJSON } from "./api";

export type Work = {
  _id: string;
  title: string;
  content: string;
  photo: string;
  date: string;
  createdAt?: string;
};

/* ================= WORKS ================= */

export function fetchWorks() {
  return getJSON<Work[]>("/works");
}

export function fetchWork(id: string) {
  return getJSON<Work>(`/works/${id}`);
}

export function createWork(data: FormData) {
  return sendForm<Work>("/works", data, "POST");
}

export function updateWork(id: string, data: FormData) {
  return sendForm<Work>(`/works/${id}`, data, "PUT");
}

export function deleteWork(id: string) {
  return delJSON(`/works/${id}`);
}
