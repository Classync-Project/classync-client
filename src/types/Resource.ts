export interface Resource {
  id: string;
  title: string;
  type: "pdf" | "video" | "link" | "document";
  course: string;
  uploadDate: string;
  size?: string;
}
