import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";
import { keywords, projectSchema } from "./schema.ts";

Deno.test("ensure no duplicate keywords", () => {
  const keywordsSet = new Set(keywords);
  assertEquals(keywordsSet.size, keywords.length);
});

Deno.test("validate project template", () => {
  const templateFile = Deno.readTextFileSync(
    "../closing-the-gap/TEMPLATES/project.json"
  );
  const template = JSON.parse(templateFile);

  // Fill in required fields
  template.record_metadata.uuid = crypto.randomUUID();
  template.record_metadata.record_created_on = Date();
  template.project.type = "project";

  projectSchema.parse(template);
});

// Get list of project files
const projectsFile = Deno.readTextFileSync("../closing-the-gap/PROJECTS.json");
const projectsObj = JSON.parse(projectsFile);
const projects: [string, Record<string, string>][] =
  Object.entries(projectsObj);

// Test parsing each project file
for (const [id, details] of projects) {
  const path = `../closing-the-gap${details.path}${id}.json`;

  Deno.test(`validate ${details.path}`, () => {
    const projectFile = Deno.readTextFileSync(path);
    const projectObj = JSON.parse(projectFile);
    projectSchema.parse(projectObj);
  });
}
