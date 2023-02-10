import { projectSchema } from "./schema.ts";

// Files are served locally
const res = await fetch("http://localhost:3000/PROJECTS.json");
const json = await res.json();
const projects: [string, Record<string, string>][] = Object.entries(json);

projects.forEach(async ([id, details]) => {
  const url = `http://localhost:3000${details.path}${id}.json`;
  const res = await fetch(url);
  const json = await res.json();

  const parsed = projectSchema.safeParse(json);

  if (!parsed.success) {
    console.log(url);
    console.log(parsed.error.issues);
  }
});
