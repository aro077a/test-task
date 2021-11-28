import axios from "axios";
import { BASE_URL, PHOTOS } from "./constants";

const api = axios.create({
  baseURL: BASE_URL,
});

export const getImages = async () => await api.get(`${PHOTOS}`);

export const deleteImage = async (id: number) =>
  await api.delete(`${PHOTOS}/${id}`);
